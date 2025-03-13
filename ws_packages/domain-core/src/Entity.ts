import { v4 as uuidv4 } from 'uuid';

// Base interfaces for the Props Pattern
export interface EntityCreateProps {
  [key: string]: any;
}

export interface EntitySystemProps {
  [key: string]: any;
}

export type EntityProps<C extends EntityCreateProps, S extends EntitySystemProps> = C & S;

export interface IEntity<T> {
  id: string;
  equals(other: IEntity<T>): boolean;
}

export abstract class Entity<T> implements IEntity<T> {
  protected readonly _id: string;
  protected readonly _props: T;

  constructor(props: T, id?: string) {
    this._id = id || uuidv4();
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
