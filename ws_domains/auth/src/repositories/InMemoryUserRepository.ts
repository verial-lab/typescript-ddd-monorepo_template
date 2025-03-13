import { logger } from '@repo-packages/logger';
import type { User } from '../entities';
import { InMemoryRepository, type Repository } from './InMemoryRepository';

/**
 * User repository interface
 */
export interface UserRepository extends Repository<User, string> {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}

/**
 * In-memory user repository implementation
 */
export class InMemoryUserRepository
  extends InMemoryRepository<User, string>
  implements UserRepository
{
  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();
    return this.items.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const normalizedUsername = username.toLowerCase().trim();
    return this.items.find((user) => user.username.toLowerCase() === normalizedUsername) || null;
  }

  async save(user: User): Promise<User> {
    logger.info({ userId: user.id }, 'Saving user');
    return super.save(user);
  }
}
