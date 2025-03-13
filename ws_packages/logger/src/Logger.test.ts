import { describe, expect, it } from 'vitest';
import { createLogger, logger } from './index';

describe('Logger', () => {
  it('should export a default logger instance', () => {
    expect(logger).toBeDefined();
  });

  it('should create a logger with custom options', () => {
    const customLogger = createLogger({ level: 'debug', name: 'test' });
    expect(customLogger).toBeDefined();
    // @ts-ignore - accessing internal properties for testing
    expect(customLogger.level).toBe('debug');
  });
});
