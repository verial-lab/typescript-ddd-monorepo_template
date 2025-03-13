import type { Entity, EntityCreateProps } from '@repo-domains/domain-core';

/**
 * Generic repository interface
 */
export interface Repository<T extends Entity<EntityCreateProps>, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<boolean>;
}
