# ADR-001: TypeScript Module Resolution Strategy

## Status

Accepted

## Context

In our TypeScript monorepo, we encountered issues with module resolution when trying to split code into multiple files within packages. The root cause was the use of `NodeNext` module resolution in the base TypeScript configuration, which requires explicit file extensions in imports.

The monorepo has the following structure:

- Base TypeScript configuration in `ws_tooling/tsconfig/node.json` using `"module": "NodeNext"` and `"moduleResolution": "NodeNext"`
- Individual packages extending this base configuration
- Build system using `tsup` to generate both CommonJS and ESM outputs

When following our style guide, which states that index.ts files should only be used for exports and logic should be in separate files, we encountered TypeScript errors related to module resolution.

## Decision

We attempted several approaches to resolve the module resolution issues:

1. Overriding the module resolution strategy in individual package tsconfig.json files to use the older `Node` resolution instead of `NodeNext`:

   ```json
   "moduleResolution": "Node"
   ```

2. Trying to use explicit file extensions in imports:

   ```typescript
   import { ... } from './Logger.js';
   ```

3. Setting the package type to "module" in package.json:

   ```json
   "type": "module"
   ```

4. Overriding both module and moduleResolution settings:

   ```json
   "module": "Node16",
   "moduleResolution": "Node16"
   ```

None of these approaches fully resolved the issues with the build system. After multiple attempts, we decided to:

1. Keep all code in index.ts files for packages where splitting caused build issues (e.g., logger)
2. Organize the code in index.ts with clear sections for types and implementation
3. Split code into multiple files where possible (e.g., Express app)

## Consequences

### Positive

- Build system works reliably
- Code organization is improved where possible
- Clear sections in index.ts files improve readability

### Negative

- Unable to fully adhere to the style guide for all packages
- Inconsistent code organization across the monorepo
- Technical limitations prevent ideal code structure

### Neutral

- Need to balance style guide adherence with technical limitations
- Need for developers to understand the reasons for inconsistencies

## Related Decisions

- [ADR-002: Code Organization and Style Guide Implementation](./002-code-organization-and-style-guide.md)
- [ADR-003: Build System Configuration with tsup](./003-build-system-configuration-with-tsup.md)
