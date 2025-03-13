# ADR-013: TypeScript Module Resolution Strategy - Bundler Mode

## Status

Accepted

## Context

When building TypeScript packages in our monorepo, we encountered issues with module resolution, particularly around:

1. ESM vs CommonJS module formats
2. File extensions in imports
3. Type declarations generation
4. Consistent module resolution across packages

The default Node.js module resolution (NodeNext/Node16) requires explicit file extensions in imports when using ESM, which can be cumbersome and error-prone. We found inspiration in the maker kit template's approach of using bundler mode for module resolution.

## Decision

We decided to:

1. Use `moduleResolution: "bundler"` in our base TypeScript configuration
2. Remove the requirement for explicit file extensions in imports
3. Standardize module resolution across all packages

This configuration is set in `ws_tooling/tsconfig/base.json` and inherited by all packages.

## Consequences

### Positive

- Simpler imports without file extensions
- Consistent module resolution across all packages
- Better compatibility with modern bundlers
- Reduced friction in development

### Negative

- Diverges from Node.js's native ESM resolution
- May require additional bundler configuration in some cases

### Neutral

- Packages need to extend from base.json instead of node.json to get bundler resolution

## Related Decisions

- [ADR-001: TypeScript Module Resolution Strategy](./ADR-001-typescript-module-resolution-strategy.md)
- [ADR-003: Build System Configuration with tsup](./ADR-003-build-system-configuration-with-tsup.md)
