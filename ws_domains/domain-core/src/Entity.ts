import type { IIdGenerator } from './IdGenerator';

// Base interfaces for the Props Pattern
export type EntityCreateProps = Record<string, unknown>;

export type EntitySystemProps = Record<string, unknown>;

export type EntityProps<C extends EntityCreateProps, S extends EntitySystemProps> = C & S;

export interface IEntity<T> {
  id: string;
  equals(other: IEntity<T>): boolean;
}

export abstract class Entity<T> implements IEntity<T> {
  protected readonly _id: string;
  protected readonly _props: T;
  private static _idGenerator: IIdGenerator;

  public static setIdGenerator(generator: IIdGenerator): void {
    Entity._idGenerator = generator;
  }

  constructor(props: T, id?: string) {
    if (!id && !Entity._idGenerator) {
      throw new Error('IdGenerator not set. Call Entity.setIdGenerator() with an implementation.');
    }
    this._id = id || Entity._idGenerator.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get props(): T {
    return this._props;
  }

  public equals(other: IEntity<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (!(other instanceof Entity)) {
      return false;
    }

    return this._id === other.id;
  }
}
