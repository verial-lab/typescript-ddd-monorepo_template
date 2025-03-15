import type { BaseEventPayload, IDomainEvent } from '@repo-domains/domain-core';
import { BaseEventBus } from '../base/BaseEventBus';

export class InMemoryEventBus<T extends BaseEventPayload> extends BaseEventBus<T> {
  private events: IDomainEvent<T>[] = [];

  async connect(): Promise<void> {
    this.isConnected = true;
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.events = [];
    this.handlers.clear();
  }

  async publish(event: IDomainEvent<T>): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Event bus is not connected');
    }

    this.events.push(event);
    await this.notifyHandlers(event);
  }

  // Additional methods for testing
  getPublishedEvents(): IDomainEvent<T>[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }

  isEventPublished(eventId: string): boolean {
    return this.events.some((event) => event.eventId === eventId);
  }

  getEventsByType(eventType: T['eventType']): IDomainEvent<T>[] {
    return this.events.filter((event) => event.eventType === eventType);
  }

  getEventsByAggregateId(aggregateId: string): IDomainEvent<T>[] {
    return this.events.filter((event) => event.aggregateId === aggregateId);
  }
}
