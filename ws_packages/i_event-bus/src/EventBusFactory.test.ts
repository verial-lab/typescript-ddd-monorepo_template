import type { BaseEventPayload } from '@repo-domains/domain-core';
import { describe, expect, it } from 'vitest';
import { createInMemoryEventBus, createKafkaEventBus } from './EventBusFactory';
import { InMemoryEventBus } from './in-memory/InMemoryEventBus';
import { KafkaEventBus } from './kafka/KafkaEventBus';

// Simple test payload type
interface TestEventPayload extends BaseEventPayload {
  eventType: 'test.event';
}

describe('EventBusFactory', () => {
  describe('createKafkaEventBus', () => {
    it('should create a KafkaEventBus instance', () => {
      const config = {
        clientId: 'test-client',
        brokers: ['localhost:9092'],
        groupId: 'test-group',
      };

      const eventBus = createKafkaEventBus<TestEventPayload>(config);
      expect(eventBus).toBeInstanceOf(KafkaEventBus);
    });
  });

  describe('createInMemoryEventBus', () => {
    it('should create an InMemoryEventBus instance', () => {
      const eventBus = createInMemoryEventBus<TestEventPayload>();
      expect(eventBus).toBeInstanceOf(InMemoryEventBus);
    });
  });
});
