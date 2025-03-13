// @ts-ignore - pino will be installed as a dependency
import pino from 'pino';
import type { LoggerOptions } from './Logger.types';

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
