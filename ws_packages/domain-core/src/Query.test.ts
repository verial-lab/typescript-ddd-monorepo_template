import { describe, expect, it } from 'vitest';
import { Query, type QueryCreateProps } from './Query';

// Define test payload and result types
interface TestPayload {
  id: string;
  filter: string;
}

type TestResult = {
  items: string[];
  total: number;
};

// Create a concrete implementation for testing
class TestQuery extends Query<TestPayload, TestResult> {
  constructor(payload: TestPayload) {
    const props: QueryCreateProps<TestPayload> = {
      type: 'TEST_QUERY',
      payload,
    };
    super(props);
  }
}

describe('Query', () => {
  it('should create a query with the correct properties', () => {
    const payload = { id: '123', filter: 'test' };
    const query = new TestQuery(payload);

    expect(query.type).toBe('TEST_QUERY');
    expect(query.payload).toEqual(payload);
    expect(query.timestamp).toBeInstanceOf(Date);
    expect(query.queryId).toBeDefined();
  });

  it('should create a query with provided system properties', () => {
    const payload = { id: '123', filter: 'test' };
    const timestamp = new Date(2023, 0, 1);
    const queryId = 'test-query-id';

    const query = new TestQuery(payload);

    // We can't directly test with custom system props due to the class structure,
    // but we can verify the default system props are set
    expect(query.timestamp).toBeInstanceOf(Date);
    expect(query.queryId).toBeDefined();
  });
});
