# Domain Core Package

This package provides core domain interfaces and abstractions for implementing Domain-Driven Design (DDD) patterns across the monorepo.

## Features

- Base entity interfaces and implementations
- Value object patterns
- Domain event infrastructure
- Repository interfaces
- Unit of work patterns
- Aggregate root patterns
- Command and query interfaces

## Usage

### Entity Pattern

```typescript
import { Entity, EntityCreateProps, EntitySystemProps, EntityProps } from '@repo-packages/domain-core';

// Define user-provided properties
interface UserCreateProps extends EntityCreateProps {
  name: string;
  email: string;
}

// Define system-calculated properties
interface UserSystemProps extends EntitySystemProps {
  createdAt: Date;
  updatedAt: Date;
}

// Combined properties
type UserProps = EntityProps<UserCreateProps, UserSystemProps>;

class User extends Entity<UserProps> {
  constructor(createProps: UserCreateProps, id?: string) {
    const now = new Date();
    
    // Combine user props with system props
    const props: UserProps = {
      ...createProps,
      createdAt: now,
      updatedAt: now,
    };
    
    super(props, id);
  }
  
  get name(): string {
    return this.props.name;
  }
  
  get email(): string {
    return this.props.email;
  }
  
  // Update with only user-modifiable properties
  update(props: Partial<UserCreateProps>): void {
    // Create new props object with updated values
    const updatedProps = {
      ...this.props,
      ...props,
      updatedAt: new Date(), // Always update the timestamp
    };
    
    // Replace the props (in a real implementation, you'd need to handle immutability)
    Object.assign(this._props, updatedProps);
  }
}
```

### Domain Events

```typescript
import { DomainEvent, DomainEventCreateProps } from '@repo-packages/domain-core';

interface UserCreatedEventProps extends DomainEventCreateProps {
  payload: {
    userId: string;
    name: string;
    email: string;
  };
}

class UserCreatedEvent extends DomainEvent {
  constructor(props: UserCreatedEventProps) {
    super({
      ...props,
      eventType: 'user.created',
    });
  }
  
  get userId(): string {
    return this.payload?.userId as string;
  }
  
  get name(): string {
    return this.payload?.name as string;
  }
  
  get email(): string {
    return this.payload?.email as string;
  }
}
```

## Architecture

This package follows the Entity Props Pattern as described in ADR-003, which separates:

1. **CreateProps**: Properties required when creating an entity (user-provided)
2. **SystemProps**: Properties calculated by the system (timestamps, etc.)
3. **EntityProps**: The combination of both (used internally by the entity)

## Installation

```bash
pnpm add @repo-packages/domain-core
```
