import type { BaseEventPayload, IDomainEvent, IEventHandler } from '@repo-domains/domain-core';
import { type Mock, vi } from 'vitest';

export class MockEventHandler<T extends BaseEventPayload> implements IEventHandler<T> {
  private readonly mockFn: Mock;
  private readonly shouldThrow?: Error;

  constructor(mockFn?: Mock, shouldThrow?: Error) {
    this.mockFn = mockFn ?? vi.fn();
    this.shouldThrow = shouldThrow;
  }

  public async handle(event: IDomainEvent<T>): Promise<void> {
    if (this.shouldThrow) {
      throw this.shouldThrow;
    }
    await this.mockFn(event);
  }

  public getMockFn(): Mock {
    return this.mockFn;
  }
}

export function createMockEventHandler<T extends BaseEventPayload>(
  mockFn?: Mock,
  shouldThrow?: Error
): MockEventHandler<T> {
  return new MockEventHandler<T>(mockFn, shouldThrow);
}

export function createMockEventHandlers<T extends BaseEventPayload>(
  count: number
): MockEventHandler<T>[] {
  return Array.from({ length: count }, () => createMockEventHandler<T>());
}
