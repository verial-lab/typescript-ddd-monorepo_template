import type { BaseEventPayload, IDomainEvent } from '@repo-domains/domain-core';
import { z } from 'zod';
import { EventBusError } from '../base/EventBusError';
import type { IEventValidator } from '../types';

export class ZodEventValidator implements IEventValidator<BaseEventPayload> {
  private readonly schemas: Map<string, z.ZodType> = new Map();

  constructor(private readonly schema: z.ZodType<IDomainEvent<BaseEventPayload>>) {}

  public registerSchema(eventType: string, schema: unknown): void {
    if (!(schema instanceof z.ZodType)) {
      throw new EventBusError('Schema must be a Zod schema');
    }
    this.schemas.set(eventType, schema);
  }

  /**
   * Validates an event against the Zod schema
   * @throws {z.ZodError} if validation fails
   */
  public async validate(event: IDomainEvent<BaseEventPayload>): Promise<void> {
    const schema = this.schemas.get(event.eventType);
    if (!schema) {
      // If no schema is registered, we don't validate
      return;
    }

    try {
      schema.parse(event.payload);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new EventBusError('Event validation failed', {
          cause: {
            eventType: event.eventType,
            errors: error.errors,
          },
        });
      }
      throw error;
    }
  }
}
