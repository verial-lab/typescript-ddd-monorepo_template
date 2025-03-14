interface ErrorOptions {
  cause?: unknown;
}

/**
 * Error class for event bus related errors
 */
export class EventBusError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'EventBusError';
  }
}
