import type { Entity, EntityCreateProps } from '@repo-domains/domain-core';
import type { Repository } from './Repository';

/**
 * Generic in-memory repository implementation
 */
export class InMemoryRepository<T extends Entity<EntityCreateProps>, ID>
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
      const updatedEntity = new (
        entity.constructor as new (
          props: EntityCreateProps,
          id: string
        ) => T
      )({ ...entity.props, updatedAt: new Date() }, entity.id);
      this.items[index] = updatedEntity;
      return updatedEntity;
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
