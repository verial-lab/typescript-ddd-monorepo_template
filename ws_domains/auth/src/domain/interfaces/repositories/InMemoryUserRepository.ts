import type { Logger } from '@repo-domains/domain-core';
import type { User } from '../../models/User';
import { InMemoryRepository } from './InMemoryRepository';
import type { Repository } from './Repository';
import { IUserRepository } from './UserRepository';

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
  constructor(private readonly logger: Logger) {
    super();
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();
    return this.items.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const normalizedUsername = username.toLowerCase().trim();
    return this.items.find((user) => user.username.toLowerCase() === normalizedUsername) || null;
  }

  async save(user: User): Promise<User> {
    this.logger.info(`Saving user ${user.id}`);
    return super.save(user);
  }
}
