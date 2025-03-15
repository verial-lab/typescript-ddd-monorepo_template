# ADR 016: Domain Structure and Dependency Management

- [ADR 016: Domain Structure and Dependency Management](#adr-016-domain-structure-and-dependency-management)
  - [Status](#status)
  - [Scope](#scope)
  - [Context](#context)
  - [Decision](#decision)
  - [Consequences](#consequences)
    - [Positive](#positive)
    - [Negative](#negative)
  - [Implementation](#implementation)
  - [Compliance](#compliance)
  - [Related](#related)

## Status

Accepted

## Scope

> **Important**: This ADR specifically applies to packages within the `ws_domains/` workspace directory of this monorepo. This structure and these rules are mandatory for all domain packages in this workspace, ensuring consistent architecture across our domain implementations.

While the principles described here could be applied more broadly, the specific structure, tooling, and validation described in this document are designed for and enforced within our domain workspace packages.

## Context

In our DDD implementation, we face two competing architectural goals:

1. **Bounded Context Cohesion**: DDD best practices recommend keeping related code together within a bounded context, including domain logic, application services, and infrastructure implementations.

2. **Domain Layer Isolation**: Clean Architecture principles suggest isolating domain logic from infrastructure concerns and maintaining zero dependencies except for core domain interfaces.

Additionally, we need to:

- Maintain clear architectural boundaries
- Enforce dependency rules
- Keep code organized and maintainable
- Support long-term evolution of the system

## Decision

We will adopt a hexagonal architecture with clear layer separation:

1. **Domain Layer Structure**

   ```
   domain/
   ├── events/         # Domain events
   │   └── ProfileCreatedEvent.ts, etc.
   ├── interfaces/     # All domain contracts
   │   ├── repositories/ # Repository interfaces
   │   └── services/    # Domain service interfaces
   └── models/        # Domain models and value objects
   ```

   - **Dependencies**: ONLY @repo-domains/domain-core
   - **Responsibility**: Pure business logic and contracts
   - **Rules**: No infrastructure imports, no framework dependencies

2. **Application Layer Structure**

   ```
   application/
   ├── commands/      # Write operations (use cases)
   │   └── CreateProfile.ts, etc.
   └── queries/       # Read operations (use cases)
       └── GetProfile.ts, etc.
   ```

   - **Dependencies**: domain layer + domain-core
   - **Responsibility**: Orchestrating use cases
   - **Rules**: No direct infrastructure dependencies

3. **Infrastructure Layer Structure**

   ```
   infrastructure/
   ├── repositories/  # Repository implementations
   └── services/     # Service implementations
   ```

   - **Dependencies**: Can use external packages
   - **Responsibility**: Implement domain interfaces
   - **Rules**: Must implement domain contracts

4. **Dependency Flow**

   ```
   Infrastructure → Application → Domain
                                  ↑
                            domain-core
   ```

5. **Infrastructure Package Naming**

   - Move infrastructure packages from `ws_infrastructure/` to `ws_packages/i_*`
   - Example: `ws_packages/i_supabase`
   - Clear naming convention for infrastructure implementations
   - Centralized location for reusable infrastructure

## Consequences

### Positive

1. **Clear Structure**
   - Standard folder organization
   - Intuitive code location
   - Easy to navigate
   - Familiar to DDD practitioners

2. **Protected Domain Logic**
   - Zero external dependencies
   - Interface-driven design
   - Clear boundaries
   - Easy to test

3. **Developer Experience**
   - Clear conventions
   - Strong tooling support
   - Automated validation
   - Good documentation

4. **Long-term Maintainability**
   - Swappable implementations
   - Clear upgrade paths
   - Reduced technical debt
   - Better refactoring support

### Negative

1. **Initial Setup Complexity**
   - More boilerplate
   - Additional tooling needed
   - Learning curve for new developers

2. **Strict Rules**
   - May feel restrictive
   - Requires discipline
   - More code review attention

3. **Migration Effort**
   - Need to move infrastructure packages
   - Update import paths
   - Modify existing code

## Implementation

1. **Validation Script**

   ```javascript
   // validate-domain-structure.js
   module.exports = {
     validateStructure(domainPath) {
       // Check required directories exist
       const requiredDirs = [
         'domain/events',
         'domain/interfaces',
         'domain/models',
         'application/commands',
         'application/queries',
         'infrastructure'
       ];
       
       // Validate domain dependencies
       const domainDeps = pkg.dependencies || {};
       if (Object.keys(domainDeps).length !== 1 || !domainDeps['@repo-domains/domain-core']) {
         throw new Error('Domain packages can only depend on domain-core');
       }
       
       // Validate import rules
       // - Domain can only import from domain-core
       // - Application can only import from domain
       // - Infrastructure must implement domain interfaces
     }
   };
   ```

2. **CI Integration**

   ```yaml
   # .github/workflows/validate.yml
   steps:
     - name: Validate Domain Structure
       run: pnpm run validate:domain-structure
     
     - name: Validate Dependencies
       run: pnpm run validate:dependencies
   ```

## Compliance

When working in domain packages:

1. **Package Dependencies**
   - [ ] Only @repo-domains/domain-core listed in domain layer
   - [ ] No infrastructure dependencies in domain/application
   - [ ] No application framework dependencies in domain

2. **Code Organization**
   - [ ] Correct folder structure
   - [ ] Clear layer separation
   - [ ] Interface-first design

3. **Import Rules**
   - [ ] Domain only imports from domain-core
   - [ ] Application only imports from domain
   - [ ] Infrastructure implements domain interfaces
   - [ ] No circular dependencies

4. **Testing**
   - [ ] Pure domain tests
   - [ ] No infrastructure in domain tests
   - [ ] Interface-based testing

## Related

- [ADR-009: Domain Isolation Principle](./ADR-009-domain-isolation-principle.md)
- [ADR-002: Code Organization and Style Guide](./ADR-002-code-organization-and-style-guide.md)
