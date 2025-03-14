# ADR-015: Use Generics Over Unknown Types

## Status

Accepted

## Context

During the implementation of our event bus system (March 12-13, 2025), we faced a decision about how to handle flexible data types that could vary based on the specific use case. The initial implementation used `unknown` types for event payloads, which quickly revealed limitations as we built out the Kafka event bus and its test utilities.

Two main approaches were considered:

1. Using `unknown` or `Record<string, unknown>` types
2. Using generics with constraints

The initial implementation used `unknown` types in several places, particularly in event payloads and data structures that needed to be flexible. This approach, while providing flexibility, led to several issues that became apparent during development:

- Type safety was compromised as developers had to use type assertions
- IDE support was limited due to lack of type information
- Runtime type checking was necessary, increasing the chance of errors
- Documentation was less clear about expected types
- Code reusability was limited
- Test utilities became cumbersome to write and maintain
- Mock event factories required excessive type assertions

## Decision

We will use generics with appropriate constraints instead of `unknown` types wherever possible. This decision was validated during the implementation of our Kafka event bus, where the use of generics significantly improved type safety and developer experience.

Specifically:

1. Event payloads will use generic types extending a base interface:
   ```typescript
   interface BaseEventPayload {
     eventType: BaseEventType | string;
     timestamp: Date;
   }
   
   interface IDomainEvent<T extends BaseEventPayload> {
     // ...
     payload: T;
   }
   ```

2. Event handlers and validators will be generic:
   ```typescript
   interface IEventHandler<T extends BaseEventPayload> {
     handle(event: IDomainEvent<T>): Promise<void>;
   }
   ```

3. Event bus implementations will accept generic type parameters:
   ```typescript
   class KafkaEventBus<T extends BaseEventPayload> extends BaseEventBus<T> {
     // ...
   }
   ```

4. Test utilities leverage generics for type-safe mocking:
   ```typescript
   export function createMockEvent<T extends BaseEventPayload>(
     options: MockEventOptions<T> = {}
   ): IDomainEvent<T> {
     // Type-safe mock event creation
   }
   ```

## Consequences

### Positive

1. **Better Type Safety**
   - Compile-time type checking
   - Fewer runtime type assertions needed
   - Reduced chance of type-related bugs
   - Kafka message serialization/deserialization is type-safe

2. **Improved Developer Experience**
   - Better IDE support with autocompletion
   - Clearer type information in documentation
   - Easier refactoring
   - Test utilities provide better type inference

3. **Code Reusability**
   - Generic components can be reused with different types
   - Type constraints ensure proper usage
   - Less code duplication
   - Mock factories work with any valid event type

4. **Self-Documenting Code**
   - Type parameters make the expected types clear
   - Constraints document requirements
   - Easier to understand component relationships
   - Event type hierarchies are explicit

### Negative

1. **Learning Curve**
   - Developers need to understand TypeScript generics
   - More complex type definitions
   - May take longer to understand the codebase initially

2. **Slightly More Verbose Code**
   - Generic type parameters add syntax
   - Constraints need to be defined
   - More type definitions needed

3. **Potential Compilation Overhead**
   - More complex type checking
   - Slightly longer build times

## Examples

### Before (with unknown):
```typescript
interface DomainEvent {
  payload: unknown;
}

class EventHandler {
  handle(event: DomainEvent) {
    const payload = event.payload as Record<string, unknown>;
    // Type assertions needed
  }
}
```

### After (with generics):
```typescript
interface DomainEvent<T extends BaseEventPayload> {
  payload: T;
}

class EventHandler<T extends BaseEventPayload> {
  handle(event: DomainEvent<T>) {
    const payload = event.payload;
    // Type-safe access to payload
  }
}
```

### Real Implementation Example:
```typescript
// Define a specific event type
interface UserCreatedEvent extends CreatedEventPayload {
  eventType: 'created';
  userId: string;
  email: string;
}

// Type-safe event handler
class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  async handle(event: IDomainEvent<UserCreatedEvent>): Promise<void> {
    // TypeScript knows event.payload has userId and email
    const { userId, email } = event.payload;
    // ...
  }
}

// Type-safe event bus usage
const eventBus = new KafkaEventBus<UserCreatedEvent>();
const handler = new UserCreatedHandler();
await eventBus.subscribe('created', handler);
```

## References

- [TypeScript Generics Documentation](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Domain-Driven Design Best Practices](https://martinfowler.com/tags/domain%20driven%20design.html)
- [Type Safety in Event-Driven Systems](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-driven) 