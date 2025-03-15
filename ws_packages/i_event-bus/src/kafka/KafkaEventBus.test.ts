import {
  type BaseEventPayload,
  type CryptoService,
  DomainEvent,
  type DomainEventCreateProps,
  type IEventHandler,
} from '@repo-domains/domain-core';
import type { ConsumerRunConfig } from 'kafkajs';
import type { Consumer, Kafka, Producer } from 'kafkajs';
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type KafkaConfig, KafkaEventBus } from './KafkaEventBus';

// Mock CryptoService for testing
const mockCryptoService: CryptoService = {
  generateId: () => `test-${Date.now()}`,
};

// Mock KafkaJS
vi.mock('kafkajs', () => {
  const mockProducer = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    send: vi.fn(),
  };

  const mockConsumer = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    subscribe: vi.fn(),
    run: vi.fn<[ConsumerRunConfig], Promise<void>>(),
    stop: vi.fn(),
  };

  return {
    Kafka: vi.fn().mockImplementation(() => ({
      producer: () => mockProducer,
      consumer: () => mockConsumer,
    })),
  };
});

// Test event types
interface TestEventPayload extends BaseEventPayload {
  eventType: 'test.event';
  data: string;
  timestamp: Date;
}

class TestEvent extends DomainEvent<TestEventPayload> {
  constructor(aggregateId: string, data: string) {
    const props: DomainEventCreateProps<TestEventPayload> = {
      eventId: mockCryptoService.generateId(),
      eventType: 'test.event' as const,
      aggregateId,
      version: 1,
      occurredOn: new Date(),
      payload: {
        eventType: 'test.event',
        data,
        timestamp: new Date(),
      },
    };
    super(mockCryptoService, props);
  }

  get eventType(): 'test.event' {
    return this.payload.eventType;
  }
}

describe('KafkaEventBus', () => {
  let eventBus: KafkaEventBus<TestEventPayload>;
  const config: KafkaConfig = {
    clientId: 'test-client',
    brokers: ['localhost:9092'],
    groupId: 'test-group',
  };

  beforeEach(() => {
    eventBus = new KafkaEventBus<TestEventPayload>(config);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await eventBus.disconnect();
  });

  describe('Configuration', () => {
    it('should create an instance with valid config', () => {
      expect(eventBus).toBeInstanceOf(KafkaEventBus);
    });

    it('should throw error for invalid config', () => {
      expect(() => new KafkaEventBus({} as KafkaConfig)).toThrow();
    });

    it('should throw error for missing broker', () => {
      expect(() => new KafkaEventBus({ clientId: 'test', groupId: 'test', brokers: [] })).toThrow();
    });
  });

  describe('Connection Management', () => {
    it('should connect successfully', async () => {
      await eventBus.connect();
      expect(eventBus['isConnected']).toBe(true);
      expect(eventBus['producer'].connect).toHaveBeenCalled();
      expect(eventBus['consumer'].connect).toHaveBeenCalled();
    });

    it('should not reconnect if already connected', async () => {
      await eventBus.connect();
      await eventBus.connect();
      expect(eventBus['producer'].connect).toHaveBeenCalledTimes(1);
    });

    it('should disconnect successfully', async () => {
      await eventBus.connect();
      await eventBus.disconnect();
      expect(eventBus['isConnected']).toBe(false);
      expect(eventBus['producer'].disconnect).toHaveBeenCalled();
      expect(eventBus['consumer'].disconnect).toHaveBeenCalled();
    });

    it('should not disconnect if already disconnected', async () => {
      await eventBus.disconnect();
      expect(eventBus['producer'].disconnect).not.toHaveBeenCalled();
    });
  });

  describe('Event Publishing', () => {
    it('should publish events successfully', async () => {
      const event = new TestEvent('test-123', 'test data');
      await eventBus.connect();
      await eventBus.publish(event);

      expect(eventBus['producer'].send).toHaveBeenCalledWith({
        topic: event.eventType,
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
    });

    it('should throw error when publishing while disconnected', async () => {
      const event = new TestEvent('test-123', 'test data');
      await expect(eventBus.publish(event)).rejects.toThrow('Event bus is not connected');
    });

    it('should handle publish errors', async () => {
      const event = new TestEvent('test-123', 'test data');
      await eventBus.connect();

      const error = new Error('Kafka publish error');
      vi.spyOn(eventBus['producer'], 'send').mockRejectedValueOnce(error);

      await expect(eventBus.publish(event)).rejects.toThrow('Kafka publish error');
    });
  });

  describe('Event Subscription', () => {
    it('should handle subscriptions', async () => {
      const handler: IEventHandler<TestEventPayload> = {
        handle: vi.fn(),
      };

      await eventBus.connect();
      await eventBus.subscribe('test.event', handler);

      const handlers = eventBus['handlers'].get('test.event');
      expect(handlers).toBeDefined();
      expect(handlers?.has(handler)).toBe(true);
    });

    it('should handle multiple subscriptions to same event', async () => {
      const handler1: IEventHandler<TestEventPayload> = { handle: vi.fn() };
      const handler2: IEventHandler<TestEventPayload> = { handle: vi.fn() };

      await eventBus.connect();
      await eventBus.subscribe('test.event', handler1);
      await eventBus.subscribe('test.event', handler2);

      const handlers = eventBus['handlers'].get('test.event');
      expect(handlers?.size).toBe(2);
    });

    it('should handle message processing', async () => {
      const handler: IEventHandler<TestEventPayload> = {
        handle: vi.fn(),
      };

      await eventBus.connect();
      await eventBus.subscribe('test.event', handler);

      // Simulate message received
      const mockPayload = {
        topic: 'test.event',
        message: {
          value: Buffer.from(JSON.stringify(new TestEvent('test-123', 'test data'))),
        },
      };

      // Get the message handler from the consumer.run call
      const messageHandler = (eventBus['consumer'].run as Mock).mock.calls[0][0].eachMessage;
      await messageHandler(mockPayload);

      expect(handler.handle).toHaveBeenCalled();
    });

    it('should handle invalid message data', async () => {
      const handler: IEventHandler<TestEventPayload> = {
        handle: vi.fn(),
      };

      await eventBus.connect();
      await eventBus.subscribe('test.event', handler);

      // Simulate invalid message
      const mockPayload = {
        topic: 'test.event',
        message: {
          value: Buffer.from('invalid json'),
        },
      };

      // Get the message handler from the consumer.run call
      const messageHandler = (eventBus['consumer'].run as Mock).mock.calls[0][0].eachMessage;

      // Should not throw
      await expect(messageHandler(mockPayload)).resolves.not.toThrow();
      expect(handler.handle).not.toHaveBeenCalled();
    });
  });

  describe('Event Unsubscription', () => {
    it('should handle unsubscriptions', async () => {
      const handler: IEventHandler<TestEventPayload> = {
        handle: vi.fn(),
      };

      await eventBus.connect();
      await eventBus.subscribe('test.event', handler);
      await eventBus.unsubscribe('test.event', handler);

      const handlers = eventBus['handlers'].get('test.event');
      expect(handlers).toBeUndefined();
    });

    it('should handle unsubscription of non-existent handler', async () => {
      const handler: IEventHandler<TestEventPayload> = {
        handle: vi.fn(),
      };

      await eventBus.connect();
      // Should not throw
      await expect(eventBus.unsubscribe('test.event', handler)).resolves.not.toThrow();
    });

    it('should handle unsubscription when no handlers exist', async () => {
      const handler: IEventHandler<TestEventPayload> = {
        handle: vi.fn(),
      };

      await eventBus.connect();
      // Should not throw
      await expect(eventBus.unsubscribe('test.event' as const, handler)).resolves.not.toThrow();
    });

    it('should update consumer subscriptions after last handler unsubscribed', async () => {
      const handler: IEventHandler<TestEventPayload> = {
        handle: vi.fn(),
      };

      await eventBus.connect();
      await eventBus.subscribe('test.event', handler);
      await eventBus.unsubscribe('test.event', handler);

      expect(eventBus['consumer'].stop).toHaveBeenCalled();
      expect(eventBus['consumer'].subscribe).toHaveBeenCalledWith({
        topics: [],
        fromBeginning: true,
      });
    });
  });
});
