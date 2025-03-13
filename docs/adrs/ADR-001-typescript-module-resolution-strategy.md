# ADR-001: TypeScript Configuration Strategy (v1.0)

## Status

Accepted

## Context

In our TypeScript monorepo, we need a comprehensive approach to TypeScript configuration that addresses module resolution, type safety, and build configuration.

### Module Resolution

We encountered issues with module resolution when trying to split code into multiple files within packages. The root cause was the use of `NodeNext` module resolution in the base TypeScript configuration, which requires explicit file extensions in imports.

The monorepo has the following structure:

- Base TypeScript configuration in `ws_tooling/tsconfig/node.json` using `"module": "NodeNext"` and `"moduleResolution": "NodeNext"`
- Individual packages extending this base configuration
- Build system using `tsup` to generate both CommonJS and ESM outputs

When following our style guide, which states that index.ts files should only be used for exports and logic should be in separate files, we encountered TypeScript errors related to module resolution.

### Type Safety

We identified several instances where the `any` type was being used in core domain packages, particularly in the `domain-core` package. The use of `any` type can lead to type safety issues, as it effectively opts out of TypeScript's type checking system. This can result in runtime errors that could have been caught at compile time, making the codebase less reliable and harder to maintain.

The specific instances were found in:

- `ws_packages/domain-core/src/Entity.ts` - Using `any` in interface property indexers
- `ws_packages/domain-core/src/ValueObject.ts` - Using `any` in interface property indexers

## Decision

### 1. Module Resolution Strategy

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

### 2. Type Safety Configuration

We have decided to:

1. Enable TypeScript's strict mode in packages by adding `"strict": true` to the `tsconfig.json` file's `compilerOptions`.

2. Replace all instances of `any` with more specific types, using `unknown` where appropriate:
   - In `Entity.ts`, replace `[key: string]: any` with `[key: string]: unknown`
   - In `ValueObject.ts`, replace `[index: string]: any` with `[index: string]: unknown`

3. Gradually extend this approach to all packages in the monorepo to ensure consistent type safety across the codebase.

### 3. Build Configuration

For build configuration, we will:

1. Use tsup for building packages with appropriate configuration
2. Generate declaration files either through tsup or directly with TypeScript compiler
3. Ensure proper build order using Turborepo's dependency graph

## Consequences

### Positive

- Build system works reliably
- Code organization is improved where possible
- Clear sections in index.ts files improve readability
- Improved type safety throughout the codebase
- Earlier detection of potential errors at compile time rather than runtime
- Better IDE support with more accurate autocompletion and type checking
- Clearer interfaces and contracts between components
- Reduced likelihood of runtime errors related to type mismatches

### Negative

- Unable to fully adhere to the style guide for all packages
- Inconsistent code organization across the monorepo
- Technical limitations prevent ideal code structure
- May require more explicit type declarations and type assertions
- Could increase development time for new features initially
- Might require refactoring of existing code to comply with stricter type checking

### Neutral

- Need to balance style guide adherence with technical limitations
- Need for developers to understand the reasons for inconsistencies
- Developers will need to be more deliberate about type definitions
- May lead to more verbose type declarations in some cases

## Implementation Guidelines

1. **For all packages**:
   - Update tsconfig.json with the required settings
   - Enable strict mode
   - Configure proper project references
   - Ensure declaration files are being generated correctly

2. **For new packages**:
   - Follow the consolidated TypeScript configuration strategy from the start
   - Use package-based imports with workspace protocol
   - Enable strict mode by default

3. **Versioning approach**:
   - This ADR will be versioned (starting with v1.0)
   - Future changes to TypeScript configuration will update this ADR with a new version number
   - The version history will be maintained in this document

## Related Decisions

- [ADR-002: Code Organization and Style Guide Implementation](./ADR-002-code-organization-and-style-guide.md)
- [ADR-003: Build System Configuration with tsup](./ADR-003-build-system-configuration-with-tsup.md)
- [ADR-013: Monorepo Package Imports Strategy](./ADR-013-monorepo-package-imports.md)

## Version History

- v1.0 (Current): Initial consolidated TypeScript configuration strategy
