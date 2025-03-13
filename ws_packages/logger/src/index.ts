/**
 * Logger package exports
 * This file only exports from other files as per style guide
 */
// @ts-ignore - pino will be installed as a dependency
import pino from 'pino';

// Types
export interface LoggerOptions {
  level?: string;
  name?: string;
}

export type Logger = ReturnType<typeof createLogger>;

// Implementation
/**
 * Creates a logger instance with the given options
 */
export function createLogger(options: LoggerOptions = {}) {
  const { level = 'info', name = 'app' } = options;

  return pino({
    level,
    name,
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

/**
 * Default logger instance
 */
export const logger = createLogger();
