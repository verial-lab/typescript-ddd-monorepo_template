# ADR-001: TypeScript Configuration Strategy (v2.0)

## Status

Accepted

## Context

In our TypeScript monorepo, we need a comprehensive approach to TypeScript configuration that addresses module resolution, type safety, and build configuration.

### Module Resolution

We encountered issues with module resolution when trying to split code into multiple files within packages. Initially, we used `NodeNext` module resolution which required explicit file extensions in imports, making the code more verbose and error-prone.

The monorepo has the following structure:

- Base TypeScript configuration in `ws_tooling/tsconfig/base.json` using `"module": "esnext"` and `"moduleResolution": "bundler"`
- Node-specific configuration in `ws_tooling/tsconfig/node.json` for packages that require Node.js module resolution
- Individual packages extending either base.json or node.json as needed
- Build system using `tsup` to generate both CommonJS and ESM outputs

This structure allows us to follow our style guide, which states that index.ts files should only be used for exports and logic should be in separate files. The bundler module resolution mode enables this by removing the need for explicit file extensions in imports.

### Type Safety

We identified several instances where the `any` type was being used in core domain packages, particularly in the `domain-core` package. The use of `any` type can lead to type safety issues, as it effectively opts out of TypeScript's type checking system. This can result in runtime errors that could have been caught at compile time, making the codebase less reliable and harder to maintain.

The specific instances were found in:

- `ws_packages/domain-core/src/Entity.ts` - Using `any` in interface property indexers
- `ws_packages/domain-core/src/ValueObject.ts` - Using `any` in interface property indexers

## Decision

### 1. Module Resolution Strategy

After exploring several approaches including Node, NodeNext, and explicit file extensions, we found that the bundler module resolution mode best suits our needs:

1. Base configuration in tsconfig/base.json:

   ```json
   {
     "module": "esnext",
     "moduleResolution": "bundler",
     "target": "ES2020",
     "lib": ["dom", "dom.iterable", "esnext"]
   }
   ```

2. Node-specific configuration in tsconfig/node.json for packages that need it:

   ```json
   {
     "extends": "./base.json",
     "module": "NodeNext",
     "moduleResolution": "NodeNext"
   }
   ```

3. Package-level configuration:
   - Most packages extend base.json for bundler resolution
   - Node-specific packages extend node.json when needed

This approach allows us to:

1. Split code into multiple files without explicit extensions
2. Follow our style guide for index.ts files
3. Support both browser and Node.js packages

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

- Full adherence to style guide possible for all packages
- Consistent code organization across the monorepo
- No need for explicit file extensions in imports
- Better IDE support with simpler imports
- Improved development experience
- Works well with modern bundlers
- Supports both browser and Node.js packages

### Negative

- Diverges from Node.js's native ESM resolution
- May require additional bundler configuration in some cases
- Some packages need to choose between base.json and node.json

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

- v2.0 (Current): Bundler module resolution strategy
- v1.0: Initial consolidated TypeScript configuration strategy
