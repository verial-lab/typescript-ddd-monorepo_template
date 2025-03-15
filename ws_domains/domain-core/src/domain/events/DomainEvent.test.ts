import { describe, expect, it, vi } from 'vitest';
import type { CryptoService } from '../interfaces/services/CryptoService';
import { type BaseEventPayload, DomainEvent, type DomainEventCreateProps } from './DomainEvent';

interface TestEventPayload extends BaseEventPayload {
  name: string;
  value: number;
}

// Mock CryptoService
const mockCryptoService: CryptoService = {
  generateId: vi.fn().mockReturnValue('test-id'),
};

// Create a concrete implementation for testing
class TestEvent extends DomainEvent<TestEventPayload> {
  constructor(aggregateId: string, data: { name: string; value: number }) {
    const props: DomainEventCreateProps<TestEventPayload> = {
      eventId: mockCryptoService.generateId(),
      eventType: 'TEST_EVENT',
      occurredOn: new Date(),
      aggregateId,
      version: 1,
      payload: {
        eventType: 'TEST_EVENT',
        timestamp: new Date(),
        ...data,
      },
    };
    super(mockCryptoService, props);
  }

  get name(): string {
    return this.payload.name;
  }

  get value(): number {
    return this.payload.value;
  }
}

describe('DomainEvent', () => {
  it('should create an event with the correct properties', () => {
    const aggregateId = 'aggregate-123';
    const data = { name: 'Test Event', value: 42 };
    const event = new TestEvent(aggregateId, data);

    expect(event.eventType).toBe('TEST_EVENT');
    expect(event.aggregateId).toBe(aggregateId);
    expect(event.version).toBe(1);
    expect(event.eventId).toBe('test-id');
    expect(event.occurredOn).toBeInstanceOf(Date);
    expect(event.payload.name).toBe('Test Event');
    expect(event.payload.value).toBe(42);
    expect(event.name).toBe('Test Event');
    expect(event.value).toBe(42);
    expect(mockCryptoService.generateId).toHaveBeenCalled();
  });

  it('should create an event with a specific version', () => {
    const aggregateId = 'test-aggregate-id';
    const data = { name: 'Test Event', value: 42 };

    const event = new TestEvent(aggregateId, data);
    expect(event.version).toBe(1);
    expect(event.eventId).toBe('test-id');
    expect(mockCryptoService.generateId).toHaveBeenCalled();
  });
});
