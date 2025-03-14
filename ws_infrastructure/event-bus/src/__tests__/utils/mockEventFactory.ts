import type {
  BaseEventPayload,
  CreatedEventPayload,
  DeletedEventPayload,
  IDomainEvent,
  UpdatedEventPayload,
} from '@repo-domains/domain-core';

export interface MockEventOptions<T extends BaseEventPayload> {
  eventId?: string;
  eventType?: T['eventType'];
  occurredOn?: Date;
  aggregateId?: string;
  version?: number;
  payload?: T;
}

export function createMockEvent<T extends BaseEventPayload>(
  options: MockEventOptions<T> = {}
): IDomainEvent<T> {
  const now = new Date();
  return {
    eventId: options.eventId ?? 'test-event-id',
    eventType: options.eventType ?? 'test-event-type',
    occurredOn: options.occurredOn ?? now,
    aggregateId: options.aggregateId ?? 'test-aggregate-id',
    version: options.version ?? 1,
    payload:
      options.payload ??
      ({
        eventType: 'test-event-type',
        timestamp: now,
      } as T),
  };
}

export function createMockEvents<T extends BaseEventPayload>(
  count: number,
  baseOptions: MockEventOptions<T> = {}
): IDomainEvent<T>[] {
  return Array.from({ length: count }, (_, index) =>
    createMockEvent<T>({
      ...baseOptions,
      eventId: `test-event-id-${index}`,
      aggregateId: `test-aggregate-id-${index}`,
    })
  );
}

export function createMockCreatedEvent<T extends Record<string, unknown>>(
  options: Omit<MockEventOptions<CreatedEventPayload>, 'eventType' | 'payload'> & {
    payload?: T;
  } = {}
): IDomainEvent<CreatedEventPayload> {
  const now = new Date();
  return createMockEvent<CreatedEventPayload>({
    ...options,
    eventType: 'created',
    payload: {
      eventType: 'created',
      timestamp: now,
      ...options.payload,
    },
  });
}

export function createMockUpdatedEvent<T extends Record<string, unknown>>(
  options: Omit<MockEventOptions<UpdatedEventPayload>, 'eventType' | 'payload'> & {
    changes?: T;
  } = {}
): IDomainEvent<UpdatedEventPayload> {
  const now = new Date();
  return createMockEvent<UpdatedEventPayload>({
    ...options,
    eventType: 'updated',
    payload: {
      eventType: 'updated',
      timestamp: now,
      changes: options.changes ?? {},
    },
  });
}

export function createMockDeletedEvent(
  options: Omit<MockEventOptions<DeletedEventPayload>, 'eventType' | 'payload'> & {
    reason?: string;
  } = {}
): IDomainEvent<DeletedEventPayload> {
  const now = new Date();
  return createMockEvent<DeletedEventPayload>({
    ...options,
    eventType: 'deleted',
    payload: {
      eventType: 'deleted',
      timestamp: now,
      reason: options.reason,
    },
  });
}
