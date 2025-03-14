# ADR-003: Build System Configuration with tsup

## Status

Accepted

## Context

Our monorepo uses `tsup` as the build tool for TypeScript packages. tsup is a wrapper around esbuild and TypeScript that simplifies the build process. Combined with our bundler module resolution strategy (see [ADR-001](./ADR-001-typescript-module-resolution-strategy.md)), it provides a flexible and efficient build system.

The key aspects are:

1. Generating both CommonJS and ESM outputs
2. Proper type declaration file generation
3. Full compatibility with our code organization style
4. Support for both browser and Node.js packages

## Decision

We maintain a flexible tsup configuration that works well with our bundler module resolution. The base configuration is centralized in `ws_tooling/tsup.config.ts`:

```typescript
defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
})
```

This configuration provides:

- Flexible entry points (defaulting to src/index.ts)
- Both CommonJS and ESM outputs
- TypeScript declaration files (can be disabled if needed)
- Source maps for debugging
- Clean builds

The configuration works well with our code organization because:

1. Bundler module resolution allows proper code splitting
2. No need for explicit file extensions in imports
3. Full support for our style guide's index.ts pattern
4. Compatible with both monorepo-internal and external dependencies

For packages with special needs:

- Type declarations can be handled by tsc instead of tsup
- Entry points can be customized
- Output formats can be adjusted

### Type Checking Strategy

While tsup is used for building and generating declaration files, we intentionally separate type checking into its own concern. We use `tsc --noEmit` for type checking across all TypeScript packages for several reasons:

1. Separation of Concerns:
   - tsup (with esbuild) is optimized for fast builds and bundling
   - `tsc` is the authoritative tool for TypeScript type checking
   - Using `--noEmit` means we only use tsc for its comprehensive type checking capabilities, not its slower build process

2. Type Safety:
   - tsup's type checking capabilities are limited
   - `tsc` provides more thorough type analysis and catches potential type errors
   - This approach ensures we don't miss type errors that might slip through tsup's more basic checks

3. Development Workflow:
   - Build tasks (tsup) and type checking tasks (tsc) are separate in our Turborepo pipeline
   - This allows for faster development cycles while maintaining type safety
   - Developers can run type checks independently of builds when needed

## Consequences

### Positive

- Consistent build process across all packages
- Support for both CommonJS and ESM module formats
- Flexible type declaration generation
- Fast builds with esbuild
- Full support for code organization style guide
- Works well with bundler module resolution
- Adaptable to package-specific needs

### Negative

- May need package-specific tsup configuration
- Type declaration generation can be tricky in some cases
- Requires understanding of module resolution modes

### Neutral

- Need to choose between tsup and tsc for type declarations
- Different packages may need different build configurations
- Developers need to understand the relationship between TypeScript configuration and build output

## Related Decisions

- [ADR-001: TypeScript Module Resolution Strategy](./ADR-001-typescript-module-resolution-strategy.md)
- [ADR-002: Code Organization and Style Guide Implementation](./ADR-002-code-organization-and-style-guide.md)
- [ADR-013: TypeScript Module Resolution - Bundler Mode](./ADR-013-typescript-module-resolution-bundler.md)
