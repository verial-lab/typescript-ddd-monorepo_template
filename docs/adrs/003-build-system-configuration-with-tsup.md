# ADR-003: Build System Configuration with tsup

## Status

Accepted

## Context

Our monorepo uses `tsup` as the build tool for TypeScript packages. tsup is a wrapper around esbuild and TypeScript that simplifies the build process. However, we encountered issues with the default configuration when trying to follow our style guide for code organization.

The key challenges were:

1. Generating both CommonJS and ESM outputs
2. Proper type declaration file generation
3. Compatibility with our code organization style

## Decision

We decided to maintain the existing tsup configuration but adapt our code organization to work with it. The tsup configuration is centralized in `ws_tooling/tsup.config.ts` and includes:

```typescript
defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
})
```

This configuration:

- Uses `src/index.ts` as the entry point for all packages
- Generates both CommonJS and ESM outputs
- Generates TypeScript declaration files
- Includes source maps
- Cleans the output directory before building

We found that this configuration works well when:

1. All code is in the index.ts file (as in the logger package)
2. Code is split into multiple files but with careful imports (as in the Express app)

We attempted to modify the TypeScript configuration to better support our style guide, but encountered limitations that prevented full adherence (see ADR-001).

## Consequences

### Positive

- Consistent build process across all packages
- Support for both CommonJS and ESM module formats
- Proper TypeScript declaration file generation
- Fast builds with esbuild

### Negative

- Limited flexibility for code organization
- Some packages cannot fully adhere to the style guide
- Technical limitations in the build process

### Neutral

- Need to balance build system requirements with code organization preferences
- Developers need to understand the build system's expectations and limitations

## Related Decisions

- [ADR-001: TypeScript Module Resolution Strategy](./001-typescript-module-resolution-strategy.md)
- [ADR-002: Code Organization and Style Guide Implementation](./002-code-organization-and-style-guide.md)
