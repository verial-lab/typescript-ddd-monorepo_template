# Development Gotchas

This document lists common issues and solutions encountered during development.

## TypeScript Configuration

### Module Resolution Strategy

**Issue**: Module resolution can be tricky with TypeScript, especially when dealing with ESM modules and file extensions.

**Solution**: We use a dual module resolution strategy (see [ADR-001](../adrs/ADR-001-typescript-module-resolution-strategy.md)):

1. Default to bundler mode:

   ```json
   // ws_tooling/tsconfig/base.json
   {
     "moduleResolution": "bundler",
     "module": "esnext"
   }
   ```

2. Use Node.js resolution when needed:

   ```json
   // ws_tooling/tsconfig/node.json
   {
     "extends": "./base.json",
     "moduleResolution": "NodeNext",
     "module": "NodeNext"
   }
   ```

Examples:

```typescript
// ✅ With bundler resolution (most packages)
import { Logger } from './Logger';
import { createApp } from './ExpressApp';
import type { LoggerOptions } from './Logger.types';

// ✅ With Node resolution (Node.js specific packages)
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
```

### Type Declaration Generation

**Issue**: Type declarations can fail to generate properly when using tsup.

**Solution**: We have two approaches:

1. Using tsup (default):

   ```typescript
   // tsup.config.ts
   export default defineConfig({
     dts: true,
     // other options...
   })
   ```

2. Disabling tsup's dts when needed:

   ```typescript
   // tsup.config.ts
   export default defineConfig({
     dts: false, // Let TypeScript handle declarations
     // other options...
   })
   ```

## Code Organization

### Index File Pattern

**Issue**: Keeping code organized while maintaining proper exports.

**Solution**: Follow our style guide ([ADR-002](../adrs/ADR-002-code-organization-and-style-guide.md)):

1. Use descriptive filenames:

   ```typescript
   // ✅ Good
   src/
    ├── Logger.ts         // Implementation
    ├── Logger.types.ts   // Types
    └── index.ts         // Only exports

   // ❌ Bad
   src/
    └── index.ts         // Contains implementation
   ```

2. Keep index.ts files clean:

   ```typescript
   // ✅ Good index.ts
   export * from './Logger';
   export * from './Logger.types';

   // ❌ Bad index.ts
   export class Logger {
     // Implementation here
   }
   ```

## Domain-Driven Design

### Interface Locations

**Issue**: When implementing domain interfaces in infrastructure packages, the interfaces should be defined in the domain layer, not the infrastructure layer.

**Solution**: Following the Domain Isolation Principle ([ADR-009](../adrs/ADR-009-domain-isolation-principle.md)):

1. Define interfaces in domain packages (e.g., domain-core)
2. Implement interfaces in infrastructure packages
3. Dependencies flow toward the domain, never outward

Example:

```typescript
// ✅ In domain-core/src/IdGenerator.ts
export interface IIdGenerator {
  generate(): string;
}

// ✅ In infrastructure/id-generator/src/UuidGenerator.ts
import { IIdGenerator } from '@repo-packages/domain-core';

export class UuidGenerator implements IIdGenerator {
  generate(): string {
    // Implementation
  }
}

// ❌ Bad: Interface in infrastructure layer
export interface IIdGenerator { // Don't define interfaces here
  generate(): string;
}
```

### Package Dependencies

**Issue**: Maintaining proper dependency flow in a DDD architecture.

**Solution**: Follow these rules:

1. Domain packages should not depend on infrastructure
2. Infrastructure implements domain interfaces
3. Use dependency injection when needed

Example:

```typescript
// ✅ Good dependency flow
import { IIdGenerator } from '@repo-packages/domain-core';
import { UuidGenerator } from '@repo-infrastructure/id-generator';

// Dependency injection
const idGenerator: IIdGenerator = new UuidGenerator();

// ❌ Bad: Domain depending on infrastructure
import { UuidGenerator } from '@repo-infrastructure/id-generator';
// Don't use infrastructure directly in domain code
