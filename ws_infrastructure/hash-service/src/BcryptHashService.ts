import type { HashService } from '@repo-domains/auth';
import { compare, hash } from 'bcryptjs';

const SALT_ROUNDS = 10;

export class BcryptHashService implements HashService {
  readonly name = 'BcryptHashService';
  readonly description = 'Provides password hashing using bcrypt algorithm';

  async hash(plaintext: string): Promise<string> {
    return hash(plaintext, SALT_ROUNDS);
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    return compare(plaintext, hash);
  }
}
