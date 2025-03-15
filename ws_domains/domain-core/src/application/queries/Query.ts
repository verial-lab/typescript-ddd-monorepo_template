import type { CryptoService } from '../../domain/interfaces/services';

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

export abstract class Query<T = unknown> {
  private readonly _queryId: string;
  private readonly _timestamp: Date;
  private readonly _payload: T;

  constructor(
    private readonly cryptoService: CryptoService,
    payload: T,
    systemProps?: { queryId?: string; timestamp?: Date }
  ) {
    this._queryId = systemProps?.queryId || cryptoService.generateId();
    this._timestamp = systemProps?.timestamp || new Date();
    this._payload = payload;
  }

  abstract get queryType(): string;

  get type(): string {
    return this.queryType;
  }

  get queryId(): string {
    return this._queryId;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  get payload(): T {
    return this._payload;
  }
}
