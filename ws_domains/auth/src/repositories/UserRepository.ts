import type { User } from '../entities';
import type { Repository } from './Repository';

/**
 * User repository interface
 */
export interface UserRepository extends Repository<User, string> {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}
