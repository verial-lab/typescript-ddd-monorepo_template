import type { IDomainEvent } from './DomainEvent';

export interface IEventValidator {
  /**
   * Validates an event's payload against its schema
   * @throws {Error} if validation fails
   */
  validate(event: IDomainEvent): void;

  /**
   * Registers a schema for an event type
   */
  registerSchema(eventType: string, schema: unknown): void;
}
