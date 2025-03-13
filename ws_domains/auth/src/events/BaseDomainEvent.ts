import { logger } from '@repo-packages/logger';

/**
 * Base domain event interface
 */
export interface DomainEvent {
  eventName: string;
  occurredAt: Date;
  publish(): void;
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

  publish(): void {
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
