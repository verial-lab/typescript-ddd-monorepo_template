import {
  type BaseEventPayload,
  type CryptoService,
  DomainEvent,
  type DomainEventCreateProps,
  type IEventHandler,
} from '@repo-domains/domain-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryEventBus } from './InMemoryEventBus';

// Mock CryptoService for testing
const mockCryptoService: CryptoService = {
  generateId: () => `test-${Date.now()}`,
};

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

describe('InMemoryEventBus', () => {
  let eventBus: InMemoryEventBus<TestEventPayload>;

  beforeEach(() => {
    eventBus = new InMemoryEventBus<TestEventPayload>();
  });

  afterEach(async () => {
    await eventBus.disconnect();
  });

  describe('Connection Management', () => {
    it('should connect successfully', async () => {
      await eventBus.connect();
      expect(eventBus['isConnected']).toBe(true);
    });

    it('should disconnect successfully', async () => {
      await eventBus.connect();
      await eventBus.disconnect();
      expect(eventBus['isConnected']).toBe(false);
      expect(eventBus.getPublishedEvents()).toHaveLength(0);
    });
  });

  describe('Event Publishing', () => {
    it('should publish events successfully', async () => {
      const event = new TestEvent('test-123', 'test data');
      await eventBus.connect();
      await eventBus.publish(event);

      expect(eventBus.getPublishedEvents()).toHaveLength(1);
      expect(eventBus.isEventPublished(event.eventId)).toBe(true);
    });

    it('should throw error when publishing while disconnected', async () => {
      const event = new TestEvent('test-123', 'test data');
      await expect(eventBus.publish(event)).rejects.toThrow('Event bus is not connected');
    });

    it('should notify handlers when publishing events', async () => {
      const event = new TestEvent('test-123', 'test data');
      const handler: IEventHandler<TestEventPayload> = {
        handle: vi.fn(),
      };

      await eventBus.connect();
      await eventBus.subscribe('test.event', handler);
      await eventBus.publish(event);

      expect(handler.handle).toHaveBeenCalledWith(event);
    });
  });

  describe('Event Querying', () => {
    it('should get events by type', async () => {
      const event1 = new TestEvent('test-123', 'test data 1');
      const event2 = new TestEvent('test-456', 'test data 2');

      await eventBus.connect();
      await eventBus.publish(event1);
      await eventBus.publish(event2);

      const events = eventBus.getEventsByType('test.event');
      expect(events).toHaveLength(2);
      expect(events).toContainEqual(event1);
      expect(events).toContainEqual(event2);
    });

    it('should get events by aggregate ID', async () => {
      const event1 = new TestEvent('test-123', 'test data 1');
      const event2 = new TestEvent('test-456', 'test data 2');

      await eventBus.connect();
      await eventBus.publish(event1);
      await eventBus.publish(event2);

      const events = eventBus.getEventsByAggregateId('test-123');
      expect(events).toHaveLength(1);
      expect(events[0]).toEqual(event1);
    });

    it('should clear events', async () => {
      const event = new TestEvent('test-123', 'test data');

      await eventBus.connect();
      await eventBus.publish(event);
      expect(eventBus.getPublishedEvents()).toHaveLength(1);

      eventBus.clearEvents();
      expect(eventBus.getPublishedEvents()).toHaveLength(0);
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
      await expect(eventBus.unsubscribe('test.event', handler)).resolves.not.toThrow();
    });
  });
});
