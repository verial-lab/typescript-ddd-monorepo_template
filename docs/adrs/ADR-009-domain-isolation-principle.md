# ADR 009: Domain Isolation Principle

## Status

Accepted

## Context

In a DDD-based architecture, the domain layer represents the core business logic and rules of the system. This layer should be:

- Stable and long-lasting
- Independent of technical implementations
- Free from framework constraints
- Easy to test and reason about
- Protected from external changes

However, there's often a tendency to:

- Mix infrastructure concerns with domain logic
- Depend on external frameworks for convenience
- Couple domain logic to specific technical implementations
- Allow technical requirements to influence domain modeling

This leads to:

- Reduced domain model lifespan
- Harder to change technical implementations
- More complex testing
- Blurred boundaries between domain and infrastructure
- Technical debt in core business logic

## Decision

We will enforce strict isolation of domain workspaces (`ws_domains/*`) with the following principles:

### 1. Strict Dependency Management

Domain workspaces must strive for zero external dependencies in their package.json:

- TypeScript/JavaScript language features only
- Core domain interfaces (`@repo-domains/domain-core`)
- Essential type definitions
- Test utilities (dev dependencies only)

This principle applies to domain-core itself, which resides in ws_domains/ to enforce the same dependency constraints. As the foundational domain package that defines core interfaces and patterns, it must remain pure and dependency-free. Any required infrastructure functionality (like UUID generation or validation) should be moved to dedicated infrastructure packages.

When external functionality is required:

1. Define the interface within the domain
2. Create a separate infrastructure package
3. Implement the interface in that package
4. Use dependency injection to connect implementations

Example:

- IdGenerator interface defined in domain-core
- Implemented by ws_infrastructure/id-generator package
- No direct dependency on UUID or similar libraries in domain code

### 2. Pure Business Logic Focus

Domain workspaces should contain only:

- Entities and value objects
- Domain events
- Domain services
- Business rules and invariants
- Domain interfaces
- Aggregate roots
- Domain exceptions

### 3. Framework Independence

Domain code must be:

- Framework agnostic
- Platform independent
- Runtime environment neutral
- Storage technology independent
- Transport layer independent

### 4. Interface-Based Boundaries

Domain packages own and define interfaces that other packages implement:

- Well-defined interfaces for all external functionality
- Abstract base classes where necessary
- Port/adapter patterns with domain owning the ports
- Clear contracts that infrastructure adapters must fulfill
- Dependency inversion principle: infrastructure depends on domain interfaces

Example:

```typescript
// Domain defines interface
interface UserRepository {
  findById(id: string): Promise<User>;
  save(user: User): Promise<void>;
}

// Infrastructure implements interface
class SupabaseUserRepository implements UserRepository {
  // Implementation details here
}
```

### 5. Interface Definition Responsibility

Domain workspaces are responsible for defining all interfaces that external packages implement:

- Interfaces represent required external capabilities
- Infrastructure and other packages implement these interfaces
- Dependencies flow toward the domain, never outward
- Domain remains pure and implementation-agnostic

Example from our codebase:

```typescript
// Domain defines the interface (in domain-core)
export interface IdGenerator {
  generate(): string;
}

// Infrastructure implements it (in ws_infrastructure/id-generator)
export class UuidGenerator implements IdGenerator {
  generate(): string {
    return uuid();
  }
}
```

This approach ensures:

- Domain dictates its requirements
- Easy to swap implementations
- Clear separation of concerns
- True domain isolation

### 6. Testing Approach

Domain tests should be:

- Pure unit tests
- Framework independent
- Fast and deterministic
- Focused on business rules
- Free from infrastructure concerns

## Consequences

### Positive

- Domain logic remains stable over time
- Easy to change technical implementations
- Clear separation of concerns
- Simplified testing of business rules
- Reduced technical debt in core logic
- Better alignment with DDD principles
- Easier to understand business rules
- Future-proof against technical changes

### Negative

- More interfaces and abstractions needed
- Additional boilerplate code
- More initial setup time
- Stricter code review requirements
- Need for clear documentation
- Learning curve for new developers

## Implementation Notes

1. Package.json Requirements:
   - Zero dependencies whenever possible
   - Interface-based approach for required functionality
   - Clear separation of dev dependencies
   - No framework-specific dependencies

Example package.json files:

For a typical domain workspace:

```json
{
  "dependencies": {
    "@repo-domains/domain-core": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

For the domain-core package itself:

```json
{
  "name": "@repo-domains/domain-core",
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

2. Code Organization:
   - Clear folder structure
   - Separate test utilities
   - Interface-heavy design
   - Abstract base classes where needed

3. Review Process:
   - Check for framework dependencies
   - Verify business logic isolation
   - Ensure interface-based design
   - Validate test independence

4. Documentation:
   - Clear dependency guidelines
   - Interface documentation
   - Testing patterns
   - Implementation examples

## Compliance Checklist

When working in domain workspaces:

- [ ] Package.json contains zero/minimal dependencies
- [ ] No framework imports
- [ ] No infrastructure dependencies
- [ ] Pure business logic only
- [ ] Domain owns and defines interfaces
- [ ] Required external functionality is interface-based
- [ ] Infrastructure implements domain interfaces
- [ ] Framework-independent tests
- [ ] Clear contract definitions
- [ ] Documented abstractions

## Related

- [ADR-001: TypeScript Module Resolution Strategy](./001-typescript-module-resolution-strategy.md)
- [ADR-002: Code Organization and Style Guide](./002-code-organization-and-style-guide.md)
