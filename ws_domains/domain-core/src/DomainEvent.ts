import { randomUUID } from 'crypto';

// Base event types
export type BaseEventType = 'created' | 'updated' | 'deleted';

// Base event payload that all events must include
export interface BaseEventPayload {
  eventType: BaseEventType | string;
  timestamp: Date;
}

// Base event payload for created events
export interface CreatedEventPayload extends BaseEventPayload {
  eventType: 'created';
}

// Base event payload for updated events
export interface UpdatedEventPayload extends BaseEventPayload {
  eventType: 'updated';
  changes: Record<string, unknown>;
}

// Base event payload for deleted events
export interface DeletedEventPayload extends BaseEventPayload {
  eventType: 'deleted';
  reason?: string;
}

// User-provided properties with generic payload
export interface DomainEventCreateProps<T extends BaseEventPayload> {
  eventId: string;
  eventType: T['eventType'];
  occurredOn: Date;
  aggregateId: string;
  version: number;
  payload: T;
}

// System-calculated properties
export interface DomainEventSystemProps {
  eventId: string;
  occurredOn: Date;
}

// Combined properties
export type DomainEventProps<T extends BaseEventPayload> = DomainEventCreateProps<T> &
  DomainEventSystemProps;

export interface IDomainEvent<T extends BaseEventPayload = BaseEventPayload> {
  eventId: string;
  eventType: T['eventType'];
  occurredOn: Date;
  aggregateId: string;
  version: number;
  payload: T;
}

export interface IEventValidator<T extends BaseEventPayload = BaseEventPayload> {
  validate(event: IDomainEvent<T>): Promise<void>;
}

export interface IEventHandler<T extends BaseEventPayload = BaseEventPayload> {
  handle(event: IDomainEvent<T>): Promise<void>;
}

export interface IEventBus<T extends BaseEventPayload = BaseEventPayload> {
  publish(event: IDomainEvent<T>): Promise<void>;
  subscribe(eventType: T['eventType'], handler: IEventHandler<T>): Promise<void>;
  unsubscribe(eventType: T['eventType'], handler: IEventHandler<T>): Promise<void>;
}

export abstract class DomainEvent<T extends BaseEventPayload> implements IDomainEvent<T> {
  private readonly _props: DomainEventProps<T>;

  constructor(
    createProps: DomainEventCreateProps<T>,
    systemProps?: Partial<DomainEventSystemProps>
  ) {
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

  get eventType(): BaseEventType | string {
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

  get payload(): T {
    return this._props.payload;
  }
}
