import type { Logger } from '@repo-domains/domain-core';

/**
 * Base domain event interface
 */
export interface DomainEvent {
  eventName: string;
  occurredAt: Date;
  publish(logger: Logger): void;
}

/**
 * Base domain event implementation
 */
export abstract class BaseDomainEvent implements DomainEvent {
  eventName: string;
  occurredAt: Date;

  constructor(eventName: string) {
    this.eventName = eventName;
    this.occurredAt = new Date();
  }

  publish(logger: Logger): void {
    // In a real application, this would publish to an event bus/message broker
    logger.info(
      {
        event: this.eventName,
        occurredAt: this.occurredAt,
        details: this,
      },
      `Domain event published: ${this.eventName}`
    );
  }
}
