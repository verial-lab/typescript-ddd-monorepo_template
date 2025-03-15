import {
  type BaseEventPayload,
  type CryptoService,
  DomainEvent,
  type DomainEventCreateProps,
} from '@repo-domains/domain-core';
import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ZodEventValidator } from './ZodEventValidator';

// Mock CryptoService for testing
const mockCryptoService: CryptoService = {
  generateId: () => `test-${Date.now()}`,
};

// Test event types
interface TestEventPayload extends BaseEventPayload {
  eventType: 'test.event';
  data: string;
  timestamp: Date;
}

class TestEvent extends DomainEvent<TestEventPayload> {
  constructor(aggregateId: string, data: string) {
    const props: DomainEventCreateProps<TestEventPayload> = {
      eventId: mockCryptoService.generateId(),
      eventType: 'test.event' as const,
      aggregateId,
      version: 1,
      occurredOn: new Date(),
      payload: {
        eventType: 'test.event',
        data,
        timestamp: new Date(),
      },
    };
    super(mockCryptoService, props);
  }

  get eventType(): 'test.event' {
    return this.payload.eventType;
  }
}

describe('ZodEventValidator', () => {
  let validator: ZodEventValidator<TestEventPayload>;

  beforeEach(() => {
    validator = new ZodEventValidator<TestEventPayload>();
  });

  describe('Schema Registration', () => {
    it('should register a schema', () => {
      const schema = z.object({
        eventType: z.literal('test.event'),
        data: z.string(),
        timestamp: z.date(),
      });

      validator.registerSchema('test.event', schema);
      expect(validator.hasSchema('test.event')).toBe(true);
      expect(validator.getSchema('test.event')).toBe(schema);
    });

    it('should unregister a schema', () => {
      const schema = z.object({
        eventType: z.literal('test.event'),
        data: z.string(),
        timestamp: z.date(),
      });

      validator.registerSchema('test.event', schema);
      validator.unregisterSchema('test.event');
      expect(validator.hasSchema('test.event')).toBe(false);
    });

    it('should clear all schemas', () => {
      const schema = z.object({
        eventType: z.literal('test.event'),
        data: z.string(),
        timestamp: z.date(),
      });

      validator.registerSchema('test.event', schema);
      validator.clearSchemas();
      expect(validator.hasSchema('test.event')).toBe(false);
    });
  });

  describe('Event Validation', () => {
    it('should validate a valid event', () => {
      const schema = z.object({
        eventType: z.literal('test.event'),
        data: z.string(),
        timestamp: z.date(),
      });

      validator.registerSchema('test.event', schema);
      const event = new TestEvent('test-123', 'test data');
      const error = validator.validate(event);
      expect(error).toBeNull();
    });

    it('should return an error for an invalid event', () => {
      const schema = z.object({
        eventType: z.literal('test.event'),
        data: z.string().min(10), // Requires at least 10 characters
        timestamp: z.date(),
      });

      validator.registerSchema('test.event', schema);
      const event = new TestEvent('test-123', 'short'); // Less than 10 characters
      const error = validator.validate(event);
      expect(error).not.toBeNull();
      expect(error?.eventId).toBe(event.eventId);
      expect(error?.eventType).toBe('test.event');
      expect(error?.errors).toBeDefined();
    });

    it('should return null for an event with no registered schema', () => {
      const event = new TestEvent('test-123', 'test data');
      const error = validator.validate(event);
      expect(error).toBeNull();
    });

    it('should throw for an invalid event when using validateOrThrow', () => {
      const schema = z.object({
        eventType: z.literal('test.event'),
        data: z.string().min(10),
        timestamp: z.date(),
      });

      validator.registerSchema('test.event', schema);
      const event = new TestEvent('test-123', 'short');
      expect(() => validator.validateOrThrow(event)).toThrow();
    });

    it('should not throw for a valid event when using validateOrThrow', () => {
      const schema = z.object({
        eventType: z.literal('test.event'),
        data: z.string(),
        timestamp: z.date(),
      });

      validator.registerSchema('test.event', schema);
      const event = new TestEvent('test-123', 'test data');
      expect(() => validator.validateOrThrow(event)).not.toThrow();
    });
  });
});
