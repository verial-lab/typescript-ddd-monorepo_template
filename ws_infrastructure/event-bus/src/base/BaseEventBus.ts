import type {
  BaseEventPayload,
  IDomainEvent,
  IEventBus,
  IEventHandler,
} from '@repo-domains/domain-core';
import { EventBusError } from './EventBusError';

export abstract class BaseEventBus<T extends BaseEventPayload = BaseEventPayload>
  implements IEventBus<T>
{
  protected readonly handlers: Map<T['eventType'], Set<IEventHandler<T>>> = new Map();

  public async subscribe(eventType: T['eventType'], handler: IEventHandler<T>): Promise<void> {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    const handlers = this.handlers.get(eventType)!;
    handlers.add(handler);
  }

  public async unsubscribe(eventType: T['eventType'], handler: IEventHandler<T>): Promise<void> {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  public abstract publish(event: IDomainEvent<T>): Promise<void>;

  protected async notifyHandlers(event: IDomainEvent<T>): Promise<void> {
    const handlers = this.handlers.get(event.eventType);
    if (!handlers || handlers.size === 0) {
      return;
    }

    const errors: Error[] = [];

    // Execute all handlers and collect errors
    for (const handler of handlers) {
      try {
        await handler.handle(event);
      } catch (error) {
        errors.push(error instanceof Error ? error : new Error(String(error)));
      }
    }

    // If any handlers failed, throw an error with all the collected errors
    if (errors.length > 0) {
      throw new EventBusError('One or more handlers failed', { cause: errors });
    }
  }
}
