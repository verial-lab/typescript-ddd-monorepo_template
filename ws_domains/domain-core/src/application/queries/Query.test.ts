import { describe, expect, it, vi } from 'vitest';
import type { CryptoService } from '../../domain/interfaces/services/CryptoService';
import { Query } from './Query';

// Define test payload type
interface TestPayload {
  id: string;
  name: string;
}

// Mock CryptoService
const mockCryptoService: CryptoService = {
  generateId: vi.fn().mockReturnValue('test-id'),
};

// Create a concrete implementation for testing
class TestQuery extends Query<TestPayload> {
  constructor(payload: TestPayload) {
    super(mockCryptoService, payload);
  }

  get queryType(): string {
    return 'TEST_QUERY';
  }
}

describe('Query', () => {
  it('should create a query with the correct properties', () => {
    const payload = { id: '123', name: 'Test Query' };
    const query = new TestQuery(payload);

    expect(query.type).toBe('TEST_QUERY');
    expect(query.payload).toEqual(payload);
    expect(query.timestamp).toBeInstanceOf(Date);
    expect(query.queryId).toBe('test-id');
    expect(mockCryptoService.generateId).toHaveBeenCalled();
  });

  it('should create a query with provided system properties', () => {
    const payload = { id: '123', name: 'Test Query' };
    const query = new TestQuery(payload);
    expect(query.payload).toEqual(payload);
    expect(query.type).toBe('TEST_QUERY');
    expect(query.timestamp).toBeInstanceOf(Date);
    expect(query.queryId).toBe('test-id');
    expect(mockCryptoService.generateId).toHaveBeenCalled();
  });
});
