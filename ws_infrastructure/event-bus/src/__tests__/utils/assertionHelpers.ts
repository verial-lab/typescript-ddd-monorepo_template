import type { BaseEventPayload, IDomainEvent } from '@repo-domains/domain-core';
import { type Mock, expect } from 'vitest';
import type { EventHandler } from '../../types';

export interface MockEventHandler {
  getMockFn: () => Mock;
}

export function assertEventEqual<T extends BaseEventPayload>(
  actual: IDomainEvent<T>,
  expected: IDomainEvent<T>
): void {
  expect(actual.eventId).toBe(expected.eventId);
  expect(actual.eventType).toBe(expected.eventType);
  expect(actual.occurredOn).toEqual(expected.occurredOn);
  expect(actual.aggregateId).toBe(expected.aggregateId);
  expect(actual.version).toBe(expected.version);
  expect(actual.payload).toEqual(expected.payload);
}

export function assertEventsEqual<T extends BaseEventPayload>(
  actual: IDomainEvent<T>[],
  expected: IDomainEvent<T>[]
): void {
  expect(actual.length).toBe(expected.length);
  for (let i = 0; i < actual.length; i++) {
    const actualEvent = actual[i];
    const expectedEvent = expected[i];
    if (!expectedEvent) {
      throw new Error(`Expected event at index ${i} is undefined`);
    }
    if (!actualEvent) {
      throw new Error(`Actual event at index ${i} is undefined`);
    }
    assertEventEqual(actualEvent, expectedEvent);
  }
}

export function assertEventHandlerCalled<T extends BaseEventPayload>(
  mockHandler: { getMockFn: () => Mock },
  expectedEvent: IDomainEvent<T>,
  times = 1
): void {
  const mockFn = mockHandler.getMockFn();
  expect(mockFn).toHaveBeenCalledTimes(times);
  expect(mockFn).toHaveBeenCalledWith(expectedEvent);
}

export function assertEventHandlersCalledWithEvent<T extends BaseEventPayload>(
  mockHandlers: Array<{ getMockFn: () => Mock }>,
  expectedEvent: IDomainEvent<T>,
  times = 1
): void {
  for (const handler of mockHandlers) {
    assertEventHandlerCalled(handler, expectedEvent, times);
  }
}

export function assertEventHandlersCalled(
  mockHandlers: MockEventHandler[],
  expectedEvent: IDomainEvent<BaseEventPayload>,
  times = 1
): void {
  for (const handler of mockHandlers) {
    assertEventHandlerCalled(handler, expectedEvent, times);
  }
}
