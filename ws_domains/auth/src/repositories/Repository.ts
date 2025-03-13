import type { Entity } from '../entities';

/**
 * Generic repository interface
 */
export interface Repository<T extends Entity<ID>, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<boolean>;
}
