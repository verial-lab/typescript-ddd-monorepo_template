import type {
  BaseEventPayload,
  CreatedEventPayload,
  IDomainEvent,
} from '@repo-domains/domain-core';
import { vi } from 'vitest';
import type { EventHandler } from '../../types';

/**
 * Create a mock event handler for testing
 */
export function createMockEventHandler<T extends BaseEventPayload>(
  customHandler?: (event: IDomainEvent<T>) => void,
  errorToThrow?: Error
): {
  handle: EventHandler<T>;
  getMockFn: () => ReturnType<typeof vi.fn>;
} {
  const mockFn = vi.fn();
  const handle: EventHandler<T> = async (event) => {
    mockFn(event);
    if (customHandler) {
      customHandler(event);
    }
    if (errorToThrow) {
      throw errorToThrow;
    }
  };
  return {
    handle,
    getMockFn: () => mockFn,
  };
}

/**
 * Create a mock event for testing
 */
export function createMockEvent<T extends BaseEventPayload>(
  overrides: Partial<IDomainEvent<T>> = {}
): IDomainEvent<T> {
  return {
    eventId: 'test-event-id',
    eventType: 'test-event',
    occurredOn: new Date(),
    aggregateId: 'test-aggregate-id',
    version: 1,
    payload: {
      eventType: 'test-event',
      timestamp: new Date(),
    } as T,
    ...overrides,
  };
}

/**
 * Create a mock created event for testing
 */
export function createMockCreatedEvent<T extends Record<string, unknown>>(
  overrides: Partial<IDomainEvent<CreatedEventPayload & T>> = {}
): IDomainEvent<CreatedEventPayload & T> {
  const now = new Date();

  // Create the base event
  const event = createMockEvent({
    eventType: 'created',
    payload: {
      eventType: 'created',
      timestamp: now,
      ...(overrides.payload || {}),
    },
    ...overrides,
  }) as IDomainEvent<CreatedEventPayload & T>;

  return event;
}

/**
 * Assertion helpers for testing events
 */
export * from './assertionHelpers';
