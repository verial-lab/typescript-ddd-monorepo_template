import type { Entity, EntityCreateProps } from '@repo-domains/domain-core';

/**
 * Generic repository interface with separate create and update methods
 */
export interface Repository<T extends Entity<EntityCreateProps>, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  updateById(id: ID, props: Partial<EntityCreateProps>): Promise<T>;
  delete(id: ID): Promise<boolean>;
}
