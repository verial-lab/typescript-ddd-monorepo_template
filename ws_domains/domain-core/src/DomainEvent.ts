import { randomUUID } from 'crypto';

// User-provided properties
export interface DomainEventCreateProps {
  eventType: string;
  aggregateId: string;
  version?: number;
  payload?: Record<string, unknown>;
}

// System-calculated properties
export interface DomainEventSystemProps {
  eventId: string;
  occurredOn: Date;
}

// Combined properties
export type DomainEventProps = DomainEventCreateProps & DomainEventSystemProps;

export interface IDomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly version: number;
  readonly payload?: Record<string, unknown>;
}

export interface IEventHandler<T extends IDomainEvent> {
  handle(event: T): Promise<void>;
}

export interface IEventBus {
  publish<T extends IDomainEvent>(event: T): Promise<void>;
  subscribe<T extends IDomainEvent>(eventType: string, handler: IEventHandler<T>): void;
}

export abstract class DomainEvent implements IDomainEvent {
  private readonly _props: DomainEventProps;

  constructor(createProps: DomainEventCreateProps, systemProps?: Partial<DomainEventSystemProps>) {
    this._props = {
      ...createProps,
      version: createProps.version || 1,
      eventId: systemProps?.eventId || randomUUID(),
      occurredOn: systemProps?.occurredOn || new Date(),
    };
  }

  get eventId(): string {
    return this._props.eventId;
  }

  get eventType(): string {
    return this._props.eventType;
  }

  get occurredOn(): Date {
    return this._props.occurredOn;
  }

  get aggregateId(): string {
    return this._props.aggregateId;
  }

  get version(): number {
    return this._props.version!;
  }

  get payload(): Record<string, unknown> | undefined {
    return this._props.payload;
  }
}
