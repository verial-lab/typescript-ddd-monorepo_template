import { describe, expect, it } from 'vitest';
import { BcryptHashService } from './BcryptHashService';

describe('BcryptHashService', () => {
  const hashService = new BcryptHashService();
  const plaintext = 'test-password';

  it('should have correct service properties', () => {
    expect(hashService.name).toBe('BcryptHashService');
    expect(hashService.description).toBe('Provides password hashing using bcrypt algorithm');
  });

  it('should hash a password', async () => {
    const hashedPassword = await hashService.hash(plaintext);
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(plaintext);
    expect(hashedPassword.startsWith('$2a$')).toBe(true); // bcrypt hash format
  });

  it('should verify a correct password', async () => {
    const hashedPassword = await hashService.hash(plaintext);
    const isValid = await hashService.compare(plaintext, hashedPassword);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const hashedPassword = await hashService.hash(plaintext);
    const isValid = await hashService.compare('wrong-password', hashedPassword);
    expect(isValid).toBe(false);
  });
});
