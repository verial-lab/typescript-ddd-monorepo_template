/**
 * Core logging interface that all domains can use
 * Concrete implementation will be provided by infrastructure
 */
import type { LoggerService } from '../../domain/interfaces';

export class Logger implements LoggerService {
  info(message: string, context?: Record<string, unknown>): void {
    console.info(message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    console.error(message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(message, context);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    console.debug(message, context);
  }
}
