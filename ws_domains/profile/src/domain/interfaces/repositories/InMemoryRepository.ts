import type { Entity, EntityCreateProps } from '@repo-domains/domain-core';
import type { Repository } from './Repository';

/**
 * Generic in-memory repository implementation with separate create and update methods
 */
export class InMemoryRepository<T extends Entity<EntityCreateProps>, ID>
  implements Repository<T, ID>
{
  protected items: T[] = [];

  async findById(id: ID): Promise<T | null> {
    return this.items.find((item) => item.id === String(id)) || null;
  }

  async findAll(): Promise<T[]> {
    return [...this.items];
  }

  async create(entity: T): Promise<T> {
    const exists = await this.findById(entity.id as ID);
    if (exists) {
      throw new Error(`Entity with id ${entity.id} already exists`);
    }
    this.items.push(entity);
    return entity;
  }

  async update(entity: T): Promise<T> {
    const index = this.items.findIndex((item) => item.id === String(entity.id));
    if (index === -1) {
      throw new Error(`Entity with id ${entity.id} not found`);
    }
    const updatedEntity = new (
      entity.constructor as new (
        props: EntityCreateProps,
        id: string
      ) => T
    )({ ...entity.props, updatedAt: new Date() }, entity.id);
    this.items[index] = updatedEntity;
    return updatedEntity;
  }

  async updateById(id: ID, props: Partial<EntityCreateProps>): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    const updatedEntity = new (
      entity.constructor as new (
        props: EntityCreateProps,
        id: string
      ) => T
    )({ ...entity.props, ...props, updatedAt: new Date() }, entity.id);
    return this.update(updatedEntity);
  }

  async delete(id: ID): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === String(id));
    if (index >= 0) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}
