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

/**
 * User created event
 */
export class UserCreatedEvent extends BaseDomainEvent {
  userId: string;

  constructor(userId: string) {
    super('user.created');
    this.userId = userId;
  }
}

/**
 * User authenticated event
 */
export class UserAuthenticatedEvent extends BaseDomainEvent {
  userId: string;

  constructor(userId: string) {
    super('user.authenticated');
    this.userId = userId;
  }
}

// Export from separate files
export * from './BaseDomainEvent';
export * from './UserCreatedEvent';
export * from './UserAuthenticatedEvent';
