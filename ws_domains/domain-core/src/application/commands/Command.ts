import type { CryptoService } from '../../domain/interfaces/services';

// User-provided properties
export interface CommandCreateProps<T> {
  type: string;
  payload: T;
}

// System-generated properties
export interface CommandSystemProps {
  commandId: string;
  timestamp: Date;
}

// All command properties
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

export abstract class Command<T = unknown> {
  private readonly _props: CommandProps<T>;

  constructor(
    private readonly cryptoService: CryptoService,
    createProps: CommandCreateProps<T>,
    systemProps?: Partial<CommandSystemProps>
  ) {
    this._props = {
      ...createProps,
      timestamp: systemProps?.timestamp || new Date(),
      commandId: systemProps?.commandId || cryptoService.generateId(),
    };
  }

  get commandId(): string {
    return this._props.commandId;
  }

  get timestamp(): Date {
    return this._props.timestamp;
  }

  get type(): string {
    return this._props.type;
  }

  get payload(): T {
    return this._props.payload;
  }

  abstract get commandType(): string;
}
