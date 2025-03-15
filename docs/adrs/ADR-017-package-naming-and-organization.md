# ADR-017: Package Naming and Organization

- [ADR-017: Package Naming and Organization](#adr-017-package-naming-and-organization)
  - [Status](#status)
  - [Context](#context)
  - [Decision](#decision)
    - [Migration Plan](#migration-plan)
    - [Package Structure](#package-structure)
    - [Naming Rules](#naming-rules)
  - [Consequences](#consequences)
    - [Positive](#positive)
    - [Negative](#negative)
    - [Neutral](#neutral)
  - [Implementation](#implementation)
  - [Related](#related)

## Status

Accepted

## Context

As our monorepo grows, we need clear conventions for package naming and organization. We have different types of packages:

- Infrastructure implementations
- UI components
- Utility packages
- Domain packages
- Other contextual packages

Currently, infrastructure packages live in `ws_infrastructure/`, but this separation:

- Makes it harder to identify package purposes
- Doesn't scale well for other contexts
- Creates unnecessary directory nesting
- Complicates package management

## Decision

We will adopt a context-based prefix system for all packages in `ws_packages/`:

1. **Infrastructure Packages**: `i_[name]`

   ```
   ws_packages/
   ├── i_event-bus/
   ├── i_hash-service/
   ├── i_id-generator/
   └── i_supabase/
   ```

2. **UI Packages**: `ui_[name]`

   ```
   ws_packages/
   └── ui_components/
   ```

3. **Utility Packages**: `u_[name]`

   ```
   ws_packages/
   └── u_logger/
   ```

4. **Other Contexts**: `[context]_[name]`

   ```
   ws_packages/
   └── [context]_[name]/
   ```

### Migration Plan

1. Move infrastructure packages:

   ```
   ws_infrastructure/event-bus     → ws_packages/i_event-bus
   ws_infrastructure/hash-service  → ws_packages/i_hash-service
   ws_infrastructure/id-generator  → ws_packages/i_id-generator
   ws_infrastructure/supabase     → ws_packages/i_supabase
   ```

2. Rename existing packages:

   ```
   ws_packages/ui    → ws_packages/ui_components
   ws_packages/logger → ws_packages/u_logger
   ```

### Package Structure

Each package should maintain a consistent structure:

```
[prefix]_[name]/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts (if needed)
├── README.md
└── src/
    ├── index.ts
    └── [implementation files]
```

### Naming Rules

1. **Prefix Selection**:
   - `i_` for infrastructure implementations
   - `ui_` for UI/component libraries
   - `u_` for utility packages
   - `[context]_` for other contextual packages

2. **Package Names**:
   - Use kebab-case after the prefix
   - Be descriptive but concise
   - Include purpose in name

3. **Examples**:

   ```
   i_event-bus        # Infrastructure: Event bus implementation
   i_supabase         # Infrastructure: Supabase integration
   ui_components      # UI: Shared components
   u_logger           # Utility: Logging functionality
   ```

## Consequences

### Positive

1. **Better Organization**
   - Clear package purpose from name
   - Consistent naming scheme
   - Easier to find packages
   - Simpler directory structure

2. **Improved Maintainability**
   - Clear ownership and responsibility
   - Easier dependency management
   - Better scalability
   - Simplified package creation

3. **Developer Experience**
   - Intuitive package discovery
   - Clear naming conventions
   - Consistent structure
   - Better IDE support

### Negative

1. **Migration Effort**
   - Need to move existing packages
   - Update import paths
   - Update documentation
   - Coordinate with team

2. **Learning Curve**
   - New naming conventions
   - Different organization
   - Updated tooling

### Neutral

- Package names are longer
- More initial setup time
- Need to choose appropriate prefixes

## Implementation

1. **Update workspace configuration**:

   ```yaml
   # pnpm-workspace.yaml
   packages:
     - 'ws_apps/*'
     - 'ws_domains/*'
     - 'ws_packages/*'
     - 'ws_tooling/*'
   ```

2. **Migration script**:

   ```javascript
   // scripts/migrate-packages.js
   const moves = [
     ['ws_infrastructure/event-bus', 'ws_packages/i_event-bus'],
     ['ws_infrastructure/hash-service', 'ws_packages/i_hash-service'],
     ['ws_packages/ui', 'ws_packages/ui_components'],
     ['ws_packages/logger', 'ws_packages/u_logger'],
   ];
   ```

3. **Documentation updates**:
   - Update READMEs
   - Update import examples
   - Update CI/CD configs

4. **Validation rules**:
   - Package name format
   - Directory structure
   - Required files

## Related

- [ADR-009: Domain Isolation Principle](./ADR-009-domain-isolation-principle.md)
- [ADR-016: Domain Structure and Dependency Management](./ADR-016-domain-structure-and-dependency-management.md)
