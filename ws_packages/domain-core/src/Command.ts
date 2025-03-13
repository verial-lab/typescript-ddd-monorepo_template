import { randomUUID } from 'crypto';

// User-provided properties
export interface CommandCreateProps<T> {
  type: string;
  payload: T;
}

// System-calculated properties
export interface CommandSystemProps {
  timestamp: Date;
  commandId: string;
}

// Combined properties
export type CommandProps<T> = CommandCreateProps<T> & CommandSystemProps;

export interface ICommand<T> {
  readonly type: string;
  readonly payload: T;
  readonly timestamp: Date;
  readonly commandId: string;
}

export interface ICommandHandler<T> {
  handle(command: ICommand<T>): Promise<void>;
}

export interface ICommandBus {
  dispatch<T>(command: ICommand<T>): Promise<void>;
  register<T>(type: string, handler: ICommandHandler<T>): void;
}

export abstract class Command<T> implements ICommand<T> {
  private readonly _props: CommandProps<T>;

  constructor(createProps: CommandCreateProps<T>, systemProps?: Partial<CommandSystemProps>) {
    this._props = {
      ...createProps,
      timestamp: systemProps?.timestamp || new Date(),
      commandId: systemProps?.commandId || randomUUID(),
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

  get commandId(): string {
    return this._props.commandId;
  }
}
