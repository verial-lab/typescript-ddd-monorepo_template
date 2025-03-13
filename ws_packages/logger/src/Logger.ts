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
    error: (context: Record<string, unknown>, message: string) =>
      pinoLogger.error(context, message),
    info: (context: Record<string, unknown>, message: string) => pinoLogger.info(context, message),
    warn: (context: Record<string, unknown>, message: string) => pinoLogger.warn(context, message),
    debug: (context: Record<string, unknown>, message: string) =>
      pinoLogger.debug(context, message),
  };
}

/**
 * Default logger instance implementing domain-core Logger interface
 */
export const logger = createLogger();
