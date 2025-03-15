import type { BaseEventPayload, IDomainEvent } from '@repo-domains/domain-core';
import type { z } from 'zod';

export interface EventValidationError {
  eventId: string;
  eventType: string;
  errors: z.ZodError;
}

export class ZodEventValidator<T extends BaseEventPayload> {
  private readonly schemas: Map<T['eventType'], z.ZodSchema> = new Map();

  registerSchema(eventType: T['eventType'], schema: z.ZodSchema): void {
    this.schemas.set(eventType, schema);
  }

  unregisterSchema(eventType: T['eventType']): void {
    this.schemas.delete(eventType);
  }

  validate(event: IDomainEvent<T>): EventValidationError | null {
    const schema = this.schemas.get(event.eventType);
    if (!schema) {
      return null; // No schema registered for this event type
    }

    const result = schema.safeParse(event.payload);
    if (!result.success) {
      return {
        eventId: event.eventId,
        eventType: event.eventType,
        errors: result.error,
      };
    }

    return null;
  }

  validateOrThrow(event: IDomainEvent<T>): void {
    const error = this.validate(event);
    if (error) {
      throw new Error(
        `Event validation failed for ${error.eventType} (${error.eventId}): ${error.errors.message}`
      );
    }
  }

  hasSchema(eventType: T['eventType']): boolean {
    return this.schemas.has(eventType);
  }

  getSchema(eventType: T['eventType']): z.ZodSchema | undefined {
    return this.schemas.get(eventType);
  }

  clearSchemas(): void {
    this.schemas.clear();
  }
}
