import type { BaseEventPayload, IDomainEvent } from '@repo-domains/domain-core';

/**
 * Event handler function type
 */
export type EventHandler<T extends BaseEventPayload> = (event: IDomainEvent<T>) => Promise<void>;

/**
 * Event validator interface
 */
export interface IEventValidator<T extends BaseEventPayload> {
  validate(event: IDomainEvent<T>): Promise<void>;
}

/**
 * Event bus interface
 */
export interface IEventBus<EventType extends string = string> {
  /**
   * Connect to the event bus
   */
  connect(): Promise<void>;

  /**
   * Disconnect from the event bus
   */
  disconnect(): Promise<void>;

  /**
   * Subscribe to events of a specific type
   */
  subscribe<T extends BaseEventPayload>(
    eventType: EventType,
    handler: EventHandler<T>
  ): Promise<void>;

  /**
   * Unsubscribe from events of a specific type
   */
  unsubscribe(eventType: EventType): Promise<void>;

  /**
   * Publish an event to the event bus
   */
  publish<T extends BaseEventPayload>(event: IDomainEvent<T>): Promise<void>;
}
