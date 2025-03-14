import type { BaseEntityProps, Entity, EntityCreateProps, Logger } from '@repo-domains/domain-core';
import type { User, UserCreateProps } from '../entities';

/**
 * Generic repository interface
 */
export interface Repository<T extends Entity<BaseEntityProps<EntityCreateProps>>, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<boolean>;
}

/**
 * Generic in-memory repository implementation
 */
export class InMemoryRepository<T extends Entity<BaseEntityProps<EntityCreateProps>>, ID>
  implements Repository<T, ID>
{
  protected items: T[] = [];

  async findById(id: ID): Promise<T | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async findAll(): Promise<T[]> {
    return [...this.items];
  }

  async save(entity: T): Promise<T> {
    const index = this.items.findIndex((item) => item.id === entity.id);
    if (index >= 0) {
      this.items[index] = { ...entity, updatedAt: new Date() } as T;
      return this.items[index];
    }
    this.items.push(entity);
    return entity;
  }

  async delete(id: ID): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index >= 0) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}

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
    this.logger.info({ userId: user.id }, 'Saving user');
    return super.save(user);
  }
}

// Export repository interfaces and implementations
export * from './Repository';
export * from './InMemoryRepository';
export * from './UserRepository';
export * from './InMemoryUserRepository';
