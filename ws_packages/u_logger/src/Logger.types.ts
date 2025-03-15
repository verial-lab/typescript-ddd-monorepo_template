export interface LoggerOptions {
  /**
   * Log level (default: 'info')
   */
  level?: 'debug' | 'info' | 'warn' | 'error';

  /**
   * Logger name (default: 'app')
   */
  name?: string;
}
