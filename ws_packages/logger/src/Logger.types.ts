import type { createLogger } from './Logger';

/**
 * Logger configuration options
 */
export interface LoggerOptions {
  level?: string;
  name?: string;
}

/**
 * Logger instance type
 */
export type Logger = ReturnType<typeof createLogger>;
