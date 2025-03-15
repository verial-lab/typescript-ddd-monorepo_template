import type { BaseEventPayload, IEventBus } from '@repo-domains/domain-core';
import { InMemoryEventBus } from './in-memory/InMemoryEventBus';
import { type KafkaConfig, KafkaEventBus } from './kafka/KafkaEventBus';

export function createKafkaEventBus<T extends BaseEventPayload>(config: KafkaConfig): IEventBus<T> {
  return new KafkaEventBus<T>(config);
}

export function createInMemoryEventBus<T extends BaseEventPayload>(): IEventBus<T> {
  return new InMemoryEventBus<T>();
}
