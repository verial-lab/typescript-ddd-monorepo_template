import type { IRepository } from '@repo-domains/domain-core';
import type { User } from '../../models/User';

/**
 * User repository interface
 */
export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}
