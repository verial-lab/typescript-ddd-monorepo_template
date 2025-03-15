import type { Logger } from '@repo-domains/domain-core';
// @ts-ignore - pino will be installed as a dependency
import pino from 'pino';
import type { LoggerOptions } from './Logger.types';

/**
 * Creates a logger instance with the given options
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  const { level = 'info', name = 'app' } = options;

  const pinoLogger = pino({
    level,
    name,
    timestamp: pino.stdTimeFunctions.isoTime,
  });

  return {
    error: (message: string, context?: Record<string, unknown>) =>
      pinoLogger.error(context ?? {}, message),
    info: (message: string, context?: Record<string, unknown>) =>
      pinoLogger.info(context ?? {}, message),
    warn: (message: string, context?: Record<string, unknown>) =>
      pinoLogger.warn(context ?? {}, message),
    debug: (message: string, context?: Record<string, unknown>) =>
      pinoLogger.debug(context ?? {}, message),
  };
}

/**
 * Default logger instance implementing domain-core Logger interface
 */
export const logger = createLogger();
