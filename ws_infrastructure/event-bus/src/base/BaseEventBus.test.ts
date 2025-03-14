import type {
  BaseEventPayload,
  CreatedEventPayload,
  IDomainEvent,
} from '@repo-domains/domain-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createMockCreatedEvent,
  createMockEvent,
  createMockEventHandler,
} from '../__tests__/utils';
import { BaseEventBus } from './BaseEventBus';
import { EventBusError } from './EventBusError';

// Concrete implementation of BaseEventBus for testing
class TestEventBus<T extends BaseEventPayload = BaseEventPayload> extends BaseEventBus<T> {
  public async publish(event: IDomainEvent<T>): Promise<void> {
    await this.notifyHandlers(event);
  }
}

describe('BaseEventBus', () => {
  let eventBus: TestEventBus;

  beforeEach(() => {
    eventBus = new TestEventBus();
  });

  describe('subscribe', () => {
    it('should register a handler for an event type', async () => {
      const handler = createMockEventHandler();
      const event = createMockEvent();

      await eventBus.subscribe(event.eventType, handler);
      await eventBus.publish(event);

      expect(handler.getMockFn()).toHaveBeenCalledWith(event);
    });

    it('should register multiple handlers for the same event type', async () => {
      const handler1 = createMockEventHandler();
      const handler2 = createMockEventHandler();
      const event = createMockEvent();

      await eventBus.subscribe(event.eventType, handler1);
      await eventBus.subscribe(event.eventType, handler2);
      await eventBus.publish(event);

      expect(handler1.getMockFn()).toHaveBeenCalledWith(event);
      expect(handler2.getMockFn()).toHaveBeenCalledWith(event);
    });

    it('should maintain type safety with specific event types', async () => {
      interface UserCreatedEvent extends CreatedEventPayload {
        eventType: 'created';
        userId: string;
        email: string;
      }

      const eventBus = new TestEventBus<UserCreatedEvent>();
      const handler = createMockEventHandler<UserCreatedEvent>();
      const event = createMockCreatedEvent<{ userId: string; email: string }>({
        payload: {
          userId: '123',
          email: 'test@example.com',
          eventType: 'created',
          timestamp: new Date(),
        },
      });

      await eventBus.subscribe('created', handler);
      await eventBus.publish(event);

      expect(handler.getMockFn()).toHaveBeenCalledWith(event);
      const mockCalls = handler.getMockFn().mock.calls;
      expect(mockCalls.length).toBeGreaterThan(0);
      expect(mockCalls[0]?.[0].payload).toEqual({
        userId: '123',
        email: 'test@example.com',
        eventType: 'created',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('unsubscribe', () => {
    it('should remove a handler for an event type', async () => {
      const handler = createMockEventHandler();
      const event = createMockEvent();

      await eventBus.subscribe(event.eventType, handler);
      await eventBus.unsubscribe(event.eventType, handler);
      await eventBus.publish(event);

      expect(handler.getMockFn()).not.toHaveBeenCalled();
    });

    it('should not affect other handlers when unsubscribing', async () => {
      const handler1 = createMockEventHandler();
      const handler2 = createMockEventHandler();
      const event = createMockEvent();

      await eventBus.subscribe(event.eventType, handler1);
      await eventBus.subscribe(event.eventType, handler2);
      await eventBus.unsubscribe(event.eventType, handler1);
      await eventBus.publish(event);

      expect(handler1.getMockFn()).not.toHaveBeenCalled();
      expect(handler2.getMockFn()).toHaveBeenCalledWith(event);
    });

    it('should handle unsubscribing from non-existent event type', async () => {
      const handler = createMockEventHandler();
      await expect(eventBus.unsubscribe('non-existent', handler)).resolves.not.toThrow();
    });
  });

  describe('publish', () => {
    it('should notify all handlers of an event', async () => {
      const handlers = Array.from({ length: 3 }, () => createMockEventHandler());
      const event = createMockEvent();

      await Promise.all(handlers.map((handler) => eventBus.subscribe(event.eventType, handler)));
      await eventBus.publish(event);

      for (const handler of handlers) {
        expect(handler.getMockFn()).toHaveBeenCalledWith(event);
      }
    });

    it('should not notify handlers of different event types', async () => {
      const handler1 = createMockEventHandler();
      const handler2 = createMockEventHandler();
      const event1 = createMockEvent({ eventType: 'type1' });
      const _event2 = createMockEvent({ eventType: 'type2' });

      await eventBus.subscribe('type1', handler1);
      await eventBus.subscribe('type2', handler2);
      await eventBus.publish(event1);

      expect(handler1.getMockFn()).toHaveBeenCalledWith(event1);
      expect(handler2.getMockFn()).not.toHaveBeenCalled();
    });

    it('should handle errors from handlers', async () => {
      const error = new Error('Handler error');
      const handler1 = createMockEventHandler();
      const handler2 = createMockEventHandler(undefined, error);
      const handler3 = createMockEventHandler();
      const event = createMockEvent();

      await eventBus.subscribe(event.eventType, handler1);
      await eventBus.subscribe(event.eventType, handler2);
      await eventBus.subscribe(event.eventType, handler3);

      await expect(eventBus.publish(event)).rejects.toThrow(EventBusError);
      await expect(eventBus.publish(event)).rejects.toThrow('One or more handlers failed');

      expect(handler1.getMockFn()).toHaveBeenCalledWith(event);
      expect(handler2.getMockFn()).toHaveBeenCalledWith(event);
      expect(handler3.getMockFn()).toHaveBeenCalledWith(event);
    });

    it('should handle multiple handler errors', async () => {
      const error1 = new Error('Handler 1 error');
      const error2 = new Error('Handler 2 error');
      const handler1 = createMockEventHandler(undefined, error1);
      const handler2 = createMockEventHandler(undefined, error2);
      const event = createMockEvent();

      await eventBus.subscribe(event.eventType, handler1);
      await eventBus.subscribe(event.eventType, handler2);

      const error = await eventBus.publish(event).catch((e) => e);
      expect(error).toBeInstanceOf(EventBusError);
      expect(error.cause).toHaveLength(2);
      expect(error.cause).toContain(error1);
      expect(error.cause).toContain(error2);
    });
  });
});
