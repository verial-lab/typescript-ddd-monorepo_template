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

### 1. Zero External Dependencies

Domain workspaces should have minimal dependencies, ideally only:

- TypeScript/JavaScript language features
- Core domain interfaces (`@repo-packages/domain-core`)
- Essential type definitions
- Test utilities (dev dependencies only)

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

All external interactions must be through:

- Well-defined interfaces
- Abstract base classes where necessary
- Port/adapter patterns
- Clear contracts

### 5. Testing Approach

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
   - Minimal dependencies section
   - Clear separation of dev dependencies
   - No framework-specific dependencies

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

- [ ] No framework imports
- [ ] No infrastructure dependencies
- [ ] Pure business logic only
- [ ] Interface-based external interactions
- [ ] Framework-independent tests
- [ ] Clear contract definitions
- [ ] Documented abstractions

## Related

- [ADR-001: TypeScript Module Resolution Strategy](./001-typescript-module-resolution-strategy.md)
- [ADR-002: Code Organization and Style Guide](./002-code-organization-and-style-guide.md)
