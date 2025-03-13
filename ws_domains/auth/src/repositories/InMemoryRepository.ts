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

/**
 * Generic in-memory repository implementation
 */
export class InMemoryRepository<T extends Entity<ID>, ID> implements Repository<T, ID> {
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
