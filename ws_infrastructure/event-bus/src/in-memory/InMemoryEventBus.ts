import type { IDomainEvent } from '@repo-domains/domain-core';
import { BaseEventBus } from '../base/BaseEventBus';

export class InMemoryEventBus extends BaseEventBus {
  public async publish<T extends IDomainEvent>(event: T): Promise<void> {
    await this.notifyHandlers(event);
  }
}
