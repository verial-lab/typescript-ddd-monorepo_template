import type { BaseEntityProps } from '../../models/BaseEntity';
import type { Entity, EntityCreateProps } from '../../models/Entity';

/**
 * Generic repository interface
 */
export interface Repository<T extends Entity<BaseEntityProps<EntityCreateProps>>> {
  items: T[];
  add(item: T): void;
  update(item: T): void;
  delete(item: T): void;
  findById(id: string): T | undefined;
  findAll(): T[];
  findByIndex(index: number): T | undefined;
  clear(): void;
}

/**
 * In-memory repository implementation
 */
export class InMemoryRepository<T extends Entity<BaseEntityProps<EntityCreateProps>>>
  implements Repository<T>
{
  public items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  update(item: T): void {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items[index] = item;
    }
  }

  delete(item: T): void {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  findAll(): T[] {
    return [...this.items];
  }

  findByIndex(index: number): T | undefined {
    return this.items[index];
  }

  clear(): void {
    this.items = [];
  }
}
