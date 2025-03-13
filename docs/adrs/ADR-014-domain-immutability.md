# ADR-014: Domain Immutability

## Status

Accepted

## Context

In our domain-driven design (DDD) implementation, we need to ensure data consistency and prevent unintended side effects when working with domain entities. The current implementation has shown potential issues with mutable entities, particularly when:

1. Multiple parts of the code reference the same entity instance
2. Entities are updated in multiple places
3. State changes are not tracked or controlled effectively
4. Concurrent modifications could lead to race conditions

## Decision

We will enforce immutability in our domain layer by:

1. Making all domain entities immutable after creation
2. Implementing state changes through methods that return new instances
3. Ensuring all properties are readonly
4. Using the Entity base class to enforce immutability patterns
5. Implementing repository patterns that respect immutability

### Implementation Details

1. Entity Properties:
   ```typescript
   class Entity<T extends EntityProps> {
     readonly id: string;
     protected readonly _props: T;
   }
   ```

2. State Changes:
   ```typescript
   class User extends Entity<UserProps> {
     deactivate(): User {
       return new User({ ...this._props, isActive: false }, this.id);
     }
   }
   ```

3. Repository Updates:
   ```typescript
   class Repository<T extends Entity> {
     async save(entity: T): Promise<T> {
       // Create new instance with updated timestamp
       const updatedEntity = new (entity.constructor as new (...args: any[]) => T)(
         { ...entity.props, updatedAt: new Date() },
         entity.id
       );
       // Save the new instance
       return updatedEntity;
     }
   }
   ```

## Consequences

### Positive

1. Better data consistency as entities cannot be modified after creation
2. Clear audit trail of state changes through new instances
3. Easier to reason about entity state at any point in time
4. Reduced bugs from unintended mutations
5. Better support for concurrent operations
6. Simpler testing as state changes are explicit

### Negative

1. Slightly more verbose code when updating entities
2. Small memory overhead from creating new instances
3. Need to be careful about reference management
4. Learning curve for developers used to mutable patterns

## Related

- ADR-009: Domain Isolation Principle
- Domain-Driven Design principles
- Functional programming concepts

## Notes

- This pattern aligns with functional programming principles
- Consider implementing value objects for complex property types
- Use TypeScript's readonly modifiers consistently
- Document patterns for handling collections of immutable entities 