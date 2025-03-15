import type {
  BaseEventPayload,
  IDomainEvent,
  IEventBus,
  IEventHandler,
} from '@repo-domains/domain-core';
import { type Consumer, type EachMessagePayload, Kafka, type Producer } from 'kafkajs';
import { z } from 'zod';

const kafkaConfigSchema = z.object({
  clientId: z.string(),
  brokers: z.array(z.string()).min(1, 'At least one broker is required'),
  groupId: z.string(),
});

export type KafkaConfig = z.infer<typeof kafkaConfigSchema>;

export class KafkaEventBus<T extends BaseEventPayload> implements IEventBus<T> {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumer: Consumer;
  private readonly handlers: Map<string, Set<IEventHandler<T>>> = new Map();
  private isConnected = false;

  constructor(config: KafkaConfig) {
    const validatedConfig = kafkaConfigSchema.parse(config);

    this.kafka = new Kafka({
      clientId: validatedConfig.clientId,
      brokers: validatedConfig.brokers,
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: validatedConfig.groupId });
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    await this.producer.connect();
    await this.consumer.connect();

    // Subscribe to all topics (we'll filter by event type in the message handler)
    await this.consumer.subscribe({ topic: /.*/, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, message } = payload;
        if (!message.value) return;

        try {
          const event = JSON.parse(message.value.toString()) as IDomainEvent<T>;
          const handlers = this.handlers.get(topic);

          if (handlers) {
            await Promise.all(Array.from(handlers).map((handler) => handler.handle(event)));
          }
        } catch (error) {
          console.error(`Error processing message from topic ${topic}:`, error);
          // In a production environment, you might want to:
          // 1. Log to a proper logging service
          // 2. Send to a dead letter queue
          // 3. Implement retry logic
        }
      },
    });

    this.isConnected = true;
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    await this.consumer.disconnect();
    await this.producer.disconnect();
    this.isConnected = false;
  }

  async publish(event: IDomainEvent<T>): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Event bus is not connected');
    }

    const topic = event.eventType;
    await this.producer.send({
      topic,
      messages: [
        {
          key: event.aggregateId,
          value: JSON.stringify(event),
          headers: {
            eventId: event.eventId,
            version: String(event.version),
            timestamp: event.occurredOn.toISOString(),
          },
        },
      ],
    });
  }

  async subscribe(eventType: T['eventType'], handler: IEventHandler<T>): Promise<void> {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    this.handlers.get(eventType)!.add(handler);

    // Ensure we're subscribed to this topic
    if (this.isConnected) {
      await this.consumer.subscribe({ topic: eventType, fromBeginning: true });
    }
  }

  async unsubscribe(eventType: T['eventType'], handler: IEventHandler<T>): Promise<void> {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);

      // If no handlers left for this event type, we can unsubscribe from the topic
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
        if (this.isConnected) {
          // Note: KafkaJS doesn't have a direct unsubscribe method
          // We'll need to stop and restart the consumer to update subscriptions
          await this.consumer.stop();
          await this.consumer.subscribe({
            topics: Array.from(this.handlers.keys()),
            fromBeginning: true,
          });
          await this.consumer.run({
            eachMessage: async (payload: EachMessagePayload) => {
              const { topic, message } = payload;
              if (!message.value) return;

              try {
                const event = JSON.parse(message.value.toString()) as IDomainEvent<T>;
                const handlers = this.handlers.get(topic);

                if (handlers) {
                  await Promise.all(Array.from(handlers).map((handler) => handler.handle(event)));
                }
              } catch (error) {
                console.error(`Error processing message from topic ${topic}:`, error);
              }
            },
          });
        }
      }
    }
  }
}
