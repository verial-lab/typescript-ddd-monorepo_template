# ADR 016: Domain Structure and Dependency Management

## Status

Proposed

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

We will adopt a hybrid approach that:

1. **Maintains Bounded Context Structure**
   ```
   src/
   ├── api/              # Command and Query definitions
   │   ├── commands.ts   # Write operations
   │   └── queries.ts    # Read operations
   │
   ├── application/      # Use case implementations
   │   ├── commands/     # Command handlers
   │   └── queries/      # Query handlers
   │
   ├── domain/          # Pure domain logic
   │   ├── entities/    # Domain entities
   │   ├── events/      # Domain events
   │   ├── interfaces/  # Repository/Service interfaces
   │   └── models/      # Value objects, types
   │
   └── infrastructure/  # Interface implementations
       └── repositories/ # Repository implementations
   ```

2. **Enforces Strict Dependency Rules**
   - Domain layer can only depend on @repo-domains/domain-core
   - Application layer depends on domain layer
   - Infrastructure implements domain interfaces
   - No circular dependencies allowed
   - Dependencies flow toward domain layer

3. **Reorganizes Infrastructure Packages**
   - Move from ws_infrastructure/* to ws_packages/i_*
   - Example: ws_packages/i_supabase
   - Clear naming convention for infrastructure implementations
   - Centralized location for reusable infrastructure

4. **Implements Automated Validation**
   - Package.json dependency checks
   - Source code import validation
   - Layer boundary enforcement
   - Interface implementation verification

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
   // validate-domain-dependencies.js
   module.exports = {
     validateDependencies(pkg) {
       // Only allow domain-core dependency
       const deps = pkg.dependencies || {};
       if (Object.keys(deps).length !== 1 || !deps['@repo-domains/domain-core']) {
         throw new Error('Domain packages can only depend on domain-core');
       }
     },
     
     validateImports(sourceFile) {
       // Ensure imports follow layer rules
       // Check interface implementations
       // Verify dependency direction
     }
   };
   ```

2. **Package Naming**
   ```
   ws_packages/
   ├── i_supabase/        # Infrastructure: Supabase
   ├── i_event-bus/       # Infrastructure: Event bus
   ├── i_hash-service/    # Infrastructure: Hashing
   └── logger/            # General utility (no prefix)
   ```

3. **CI Integration**
   ```yaml
   # .github/workflows/validate.yml
   steps:
     - name: Validate Domain Dependencies
       run: pnpm run validate:domains
     
     - name: Validate Layer Boundaries
       run: pnpm run validate:layers
   ```

## Compliance

When working in domain packages:

1. **Package Dependencies**
   - [ ] Only @repo-domains/domain-core listed
   - [ ] No infrastructure dependencies
   - [ ] No application framework dependencies

2. **Code Organization**
   - [ ] Correct folder structure
   - [ ] Clear layer separation
   - [ ] Interface-first design

3. **Import Rules**
   - [ ] No imports from infrastructure
   - [ ] No circular dependencies
   - [ ] Clear dependency direction

4. **Testing**
   - [ ] Pure domain tests
   - [ ] No infrastructure in tests
   - [ ] Interface-based testing

## Related

- [ADR-009: Domain Isolation Principle](./ADR-009-domain-isolation-principle.md)
- [ADR-002: Code Organization and Style Guide](./ADR-002-code-organization-and-style-guide.md)
