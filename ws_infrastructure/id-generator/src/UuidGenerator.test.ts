import { describe, expect, it } from 'vitest';
import { UuidGenerator } from './UuidGenerator';

describe('UuidGenerator', () => {
  const idGenerator = new UuidGenerator();

  it('should generate a UUID', () => {
    const id = idGenerator.generate();
    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('should generate unique IDs', () => {
    const id1 = idGenerator.generate();
    const id2 = idGenerator.generate();
    expect(id1).not.toBe(id2);
  });

  it('should generate valid UUID v4 format', () => {
    const id = idGenerator.generate();
    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where x is any hex digit and y is 8, 9, A, or B
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(id).toMatch(uuidV4Regex);
  });
});
