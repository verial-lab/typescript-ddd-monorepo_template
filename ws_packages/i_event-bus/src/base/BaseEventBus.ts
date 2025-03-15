import type {
  BaseEventPayload,
  IDomainEvent,
  IEventBus,
  IEventHandler,
} from '@repo-domains/domain-core';

export abstract class BaseEventBus<T extends BaseEventPayload> implements IEventBus<T> {
  protected isConnected = false;
  protected readonly handlers: Map<string, Set<IEventHandler<T>>> = new Map();

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract publish(event: IDomainEvent<T>): Promise<void>;

  async subscribe(eventType: T['eventType'], handler: IEventHandler<T>): Promise<void> {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }

  async unsubscribe(eventType: T['eventType'], handler: IEventHandler<T>): Promise<void> {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    }
  }

  protected getHandlers(eventType: string): Set<IEventHandler<T>> | undefined {
    return this.handlers.get(eventType);
  }

  protected async notifyHandlers(event: IDomainEvent<T>): Promise<void> {
    const handlers = this.getHandlers(event.eventType);
    if (handlers) {
      await Promise.all(Array.from(handlers).map((handler) => handler.handle(event)));
    }
  }
}
