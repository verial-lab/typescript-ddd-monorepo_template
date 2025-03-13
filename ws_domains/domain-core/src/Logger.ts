/**
 * Core logging interface that all domains can use
 * Concrete implementation will be provided by infrastructure
 */
export interface Logger {
  error(context: Record<string, unknown>, message: string): void;
  info(context: Record<string, unknown>, message: string): void;
  warn(context: Record<string, unknown>, message: string): void;
  debug(context: Record<string, unknown>, message: string): void;
}
