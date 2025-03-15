import { describe, expect, it } from 'vitest';
import { createLogger, logger } from './index';

describe('Logger', () => {
  it('should export a default logger instance', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('should create a logger with custom options', () => {
    const customLogger = createLogger({ level: 'debug', name: 'test' });
    expect(customLogger).toBeDefined();
    expect(typeof customLogger.info).toBe('function');
    expect(typeof customLogger.error).toBe('function');
    expect(typeof customLogger.warn).toBe('function');
    expect(typeof customLogger.debug).toBe('function');
  });

  it('should log messages with context', () => {
    const customLogger = createLogger({ level: 'debug', name: 'test' });
    const context = { foo: 'bar' };
    const message = 'test message';

    // Just verify that calling the logger methods doesn't throw
    expect(() => {
      customLogger.info(context, message);
      customLogger.error(context, message);
      customLogger.warn(context, message);
      customLogger.debug(context, message);
    }).not.toThrow();
  });
});
