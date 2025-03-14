import type { BaseEventPayload, IDomainEvent, IEventValidator } from '@repo-domains/domain-core';
import { type Consumer, type EachMessagePayload, Kafka, type Producer } from 'kafkajs';
import { BaseEventBus } from '../base/BaseEventBus';
import { EventBusError } from '../base/EventBusError';
import type { EventHandler, IEventBus } from '../types';
import type { KafkaEventBusConfig } from './KafkaEventBusConfig';
import { EventSerializer } from './serialization/EventSerializer';

/**
 * Kafka implementation of the event bus
 */
export class KafkaEventBus<EventType extends string = string> implements IEventBus<EventType> {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private consumer: Consumer | null = null;
  private handlers: Map<string, EventHandler<BaseEventPayload>> = new Map();
  private connected = false;
  private readonly config: KafkaEventBusConfig;
  private readonly serializer: EventSerializer;
  private readonly validator?: IEventValidator<BaseEventPayload>;

  constructor(config: KafkaEventBusConfig, validator?: IEventValidator<BaseEventPayload>) {
    this.config = config;
    this.kafka = new Kafka(config.kafka);
    this.serializer = new EventSerializer();
    this.validator = validator;
  }

  /**
   * Connect to Kafka
   */
  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    try {
      // Initialize producer
      this.producer = this.kafka.producer();
      await this.producer.connect();

      // Initialize consumer
      this.consumer = this.kafka.consumer({ groupId: this.config.groupId });
      await this.consumer.connect();

      // Subscribe to the topic
      await this.consumer.subscribe({ topic: this.config.topic });

      // Start consuming messages
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) {
            return;
          }

          try {
            const event = JSON.parse(message.value.toString()) as IDomainEvent<BaseEventPayload>;
            const handler = this.handlers.get(event.eventType);

            if (handler) {
              await handler(event);
            }
          } catch (error) {
            // Handle error (e.g., send to DLQ)
            console.error('Error processing message:', error);
          }
        },
      });

      this.connected = true;
    } catch (error) {
      throw new EventBusError('Failed to connect to Kafka', { cause: error });
    }
  }

  /**
   * Disconnect from Kafka
   */
  async disconnect(): Promise<void> {
    try {
      if (this.producer) {
        await this.producer.disconnect();
        this.producer = null;
      }

      if (this.consumer) {
        await this.consumer.disconnect();
        this.consumer = null;
      }

      this.connected = false;
    } catch (error) {
      throw new EventBusError('Failed to disconnect from Kafka', { cause: error });
    }
  }

  /**
   * Subscribe to events of a specific type
   */
  async subscribe<T extends BaseEventPayload>(
    eventType: EventType,
    handler: EventHandler<T>
  ): Promise<void> {
    this.handlers.set(eventType as string, handler as unknown as EventHandler<BaseEventPayload>);
  }

  /**
   * Unsubscribe from events of a specific type
   */
  async unsubscribe(eventType: EventType): Promise<void> {
    this.handlers.delete(eventType as string);
  }

  /**
   * Publish an event to Kafka
   */
  async publish<T extends BaseEventPayload>(event: IDomainEvent<T>): Promise<void> {
    if (!this.producer || !this.connected) {
      throw new EventBusError('Not connected to Kafka');
    }

    try {
      await this.producer.send({
        topic: this.config.topic,
        messages: [
          {
            key: event.aggregateId,
            value: JSON.stringify(event),
          },
        ],
      });
    } catch (error) {
      throw new EventBusError('Failed to publish event', { cause: error });
    }
  }

  private async sendToDeadLetterQueue(payload: EachMessagePayload): Promise<void> {
    if (!this.config.deadLetterQueue) {
      return;
    }

    const { message, topic, partition } = payload;
    await this.producer?.send({
      topic: this.config.deadLetterQueue.topic,
      messages: [
        {
          key: message.key,
          value: message.value,
          headers: {
            ...message.headers,
            originalTopic: topic,
            originalPartition: String(partition),
            error: 'Failed to process message',
          },
        },
      ],
    });
  }
}
