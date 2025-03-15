# Logger Package

A shared logger package for the monorepo built on top of [Pino](https://getpino.io/), providing fast and structured logging capabilities.

## Features

- Built on Pino, one of the fastest JSON loggers for Node.js
- Structured JSON logging for better parsing and analysis
- Configurable log levels (trace, debug, info, warn, error, fatal)
- Automatic timestamp generation using ISO format
- TypeScript support with type definitions
- Simple and intuitive API

## Installation

This package is part of the monorepo and can be installed using pnpm:

```bash
pnpm add @repo-packages/logger
```

## Basic Usage

### Default Logger

Import and use the default logger instance:

```typescript
import { logger } from '@repo-packages/logger';

logger.info('Hello world');
logger.error({ err: new Error('Oops!') }, 'Something went wrong');
```

### Custom Logger

Create a custom logger with specific options:

```typescript
import { createLogger } from '@repo-packages/logger';

const logger = createLogger({
  level: 'debug',
  name: 'my-service'
});

logger.debug('Debug message');
logger.info({ data: { foo: 'bar' } }, 'Info with data');
```

## API Reference

### `createLogger(options?: LoggerOptions)`

Creates a new logger instance with the specified options.

#### Options

```typescript
interface LoggerOptions {
  level?: string;    // Log level (default: 'info')
  name?: string;     // Logger name (default: 'app')
}
```

#### Log Levels

Available log levels in order of priority (highest to lowest):

- `fatal`
- `error`
- `warn`
- `info`
- `debug`
- `trace`

### Logger Methods

Each log level has a corresponding method:

```typescript
logger.fatal(msg: string): void
logger.fatal(obj: object, msg?: string): void

logger.error(msg: string): void
logger.error(obj: object, msg?: string): void

logger.warn(msg: string): void
logger.warn(obj: object, msg?: string): void

logger.info(msg: string): void
logger.info(obj: object, msg?: string): void

logger.debug(msg: string): void
logger.debug(obj: object, msg?: string): void

logger.trace(msg: string): void
logger.trace(obj: object, msg?: string): void
```

## Real-World Examples

### HTTP Request Logging

```typescript
import { logger } from '@repo-packages/logger';

app.use((req, _res, next) => {
  logger.info(
    {
      method: req.method,
      url: req.url,
      query: req.query,
      body: req.body,
    },
    'Incoming request'
  );
  next();
});
```

### Error Handling

```typescript
import { logger } from '@repo-packages/logger';

app.use((err: Error, _req, res, _next) => {
  logger.error({ err }, 'Error occurred');
  res.status(500).json({ error: 'Internal server error' });
});
```

### Server Startup

```typescript
import { logger } from '@repo-packages/logger';

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info({ port }, 'Server is running');
});
```

## Pino Features

This logger package leverages Pino's powerful features:

- **High Performance**: One of the fastest loggers available for Node.js
- **Low Overhead**: Minimal performance impact on your application
- **JSON Output**: Logs are output in JSON format for easy parsing and analysis
- **Standardized Timestamps**: Uses standard ISO timestamp format
- **Object Interpolation**: Efficiently logs nested objects and errors
- **Child Loggers**: Create child loggers with inherited settings

## Best Practices

1. **Use Structured Logging**

   ```typescript
   // Good
   logger.info({ userId: '123', action: 'login' }, 'User logged in');
   
   // Avoid
   logger.info('User 123 logged in');
   ```

2. **Include Context**

   ```typescript
   logger.error(
     { 
       err,
       userId,
       requestId,
       additionalContext
     },
     'Operation failed'
   );
   ```

3. **Choose Appropriate Log Levels**
   - `fatal`: Application is about to crash
   - `error`: Error that needs immediate attention
   - `warn`: Warning conditions
   - `info`: Normal but significant events
   - `debug`: Detailed information for debugging
   - `trace`: Very detailed debugging information

4. **Log Sensitive Data**
   - Never log passwords, tokens, or sensitive personal information
   - Mask or exclude sensitive data when logging objects

5. **Test Output**
   - Configure your logger to ignore or suppress test output (e.g., Playwright reports, test results)
   - For testing environments, consider setting a higher log level (e.g., 'warn' or 'error') to reduce noise
   - Use separate log configurations for test and production environments

## Contributing

When contributing to this package:

1. Add tests for any new functionality
2. Ensure all tests pass using `pnpm test`
3. Follow the existing code style
4. Update this README for any public API changes
