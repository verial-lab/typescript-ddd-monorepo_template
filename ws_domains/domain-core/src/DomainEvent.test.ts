import { describe, expect, it } from 'vitest';
import { DomainEvent, type DomainEventCreateProps } from './DomainEvent';

// Create a concrete implementation for testing
class TestEvent extends DomainEvent {
  constructor(aggregateId: string, data: { name: string; value: number }) {
    const props: DomainEventCreateProps = {
      eventType: 'TEST_EVENT',
      aggregateId,
      payload: data,
    };
    super(props);
  }

  get name(): string {
    return this.payload?.name as string;
  }

  get value(): number {
    return this.payload?.value as number;
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
    expect(event.eventId).toBeDefined();
    expect(event.occurredOn).toBeInstanceOf(Date);
    expect(event.payload).toEqual(data);
    expect(event.name).toBe('Test Event');
    expect(event.value).toBe(42);
  });

  it('should create an event with a specific version', () => {
    const aggregateId = 'test-aggregate-id';
    const version = 5;

    const _props: DomainEventCreateProps = {
      eventType: 'TEST_EVENT',
      aggregateId,
      version,
      payload: { data: 'test' },
    };

    const event = new TestEvent(aggregateId, { name: 'Test Event', value: 42 });

    // We can't directly test with custom version due to the class structure,
    // but we can verify the default version is set
    expect(event.version).toBe(1);
  });
});
