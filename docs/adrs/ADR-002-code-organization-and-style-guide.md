# ADR-002: Code Organization and Style Guide Implementation

## Status

Accepted

## Context

Our monorepo has a style guide with specific rules for code organization, including:

1. No default exports
2. Class name and class files names should be PascalCase
3. index.ts files should only be used to export from other files. Files which contain logic, like classes, should have a descriptive name. (i.e. PascalClass = PascalClass.ts)

However, we found that several packages in the repository were not following these guidelines, with logic directly in index.ts files rather than in separate, descriptively named files.

## Decision

We decided to reorganize the code in our packages to follow the style guide where possible:

1. For the Express app:
   - Created `ExpressApp.ts` for the application logic
   - Created `ExpressServer.ts` for the server startup logic
   - Updated `index.ts` to only export from these files

2. For the logger package:
   - We initially attempted to create a separate `Logger.ts` file for the implementation
   - However, due to TypeScript module resolution issues (see ADR-001), we had to keep all code in `index.ts`
   - We organized the code in `index.ts` with clear sections for types and implementation

The Express app reorganization was successful, but the logger package reorganization encountered technical limitations that prevented full adherence to the style guide.

## Consequences

### Positive

- Improved code organization in the Express app
- Better separation of concerns where possible
- Improved code readability and maintainability

### Negative

- Inconsistent adherence to the style guide across packages
- Some packages still have logic in index.ts files

### Neutral

- Need to balance style guide adherence with technical limitations
- Need for developers to understand the reasons for inconsistencies

## Related Decisions

- [ADR-001: TypeScript Module Resolution Strategy](./001-typescript-module-resolution-strategy.md)
- [ADR-003: Build System Configuration with tsup](./003-build-system-configuration-with-tsup.md)
