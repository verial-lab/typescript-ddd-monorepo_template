import { randomUUID } from 'crypto';

// User-provided properties
export interface QueryCreateProps<T> {
  type: string;
  payload: T;
}

// System-calculated properties
export interface QuerySystemProps {
  timestamp: Date;
  queryId: string;
}

// Combined properties
export type QueryProps<T> = QueryCreateProps<T> & QuerySystemProps;

export interface IQuery<T, _R> {
  readonly type: string;
  readonly payload: T;
  readonly timestamp: Date;
  readonly queryId: string;
}

export interface IQueryHandler<T, R> {
  handle(query: IQuery<T, R>): Promise<R>;
}

export interface IQueryBus {
  dispatch<T, R>(query: IQuery<T, R>): Promise<R>;
  register<T, R>(type: string, handler: IQueryHandler<T, R>): void;
}

export abstract class Query<T, R> implements IQuery<T, R> {
  private readonly _props: QueryProps<T>;

  constructor(createProps: QueryCreateProps<T>, systemProps?: Partial<QuerySystemProps>) {
    this._props = {
      ...createProps,
      timestamp: systemProps?.timestamp || new Date(),
      queryId: systemProps?.queryId || randomUUID(),
    };
  }

  get type(): string {
    return this._props.type;
  }

  get payload(): T {
    return this._props.payload;
  }

  get timestamp(): Date {
    return this._props.timestamp;
  }

  get queryId(): string {
    return this._props.queryId;
  }
}
