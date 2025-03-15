export interface ValueObjectProps {
  [index: string]: unknown;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  protected readonly _props: T;

  constructor(props: T) {
    this._props = Object.freeze(props);
  }

  get props(): T {
    return this._props;
  }

  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (!(other instanceof ValueObject)) {
      return false;
    }

    return JSON.stringify(this._props) === JSON.stringify(other.props);
  }
}
