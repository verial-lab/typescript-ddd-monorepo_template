import type { IDomainEvent } from '../events/DomainEvent';

export interface IEventSchemaValidator {
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
