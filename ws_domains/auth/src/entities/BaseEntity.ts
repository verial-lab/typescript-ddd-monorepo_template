/**
 * Base entity interface
 */
export interface Entity<T> {
  id: T;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Base entity implementation
 */
export class BaseEntity<T> implements Entity<T> {
  id: T;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: T) {
    this.id = id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
