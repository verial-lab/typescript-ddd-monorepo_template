---
version: 1.0.0
date: 2025-01-19
status: active
---

# Domain-Driven Design Specification

## Overview

This document outlines our approach to Domain-Driven Design (DDD), following principles from Vaughn Vernon's "Implementing Domain-Driven Design" while adapting them for TypeScript implementations.

- [Domain-Driven Design Specification](#domain-driven-design-specification)
  - [Overview](#overview)
  - [Ubiquitous Language of DDD](#ubiquitous-language-of-ddd)
    - [Core Concepts](#core-concepts)
      - [Domain](#domain)
      - [Bounded Context](#bounded-context)
      - [Ubiquitous Language](#ubiquitous-language)
      - [Domain Model](#domain-model)
    - [Building Blocks](#building-blocks)
      - [Entity](#entity)
      - [Value Object](#value-object)
      - [Aggregate](#aggregate)
      - [Domain Event](#domain-event)
      - [Repository](#repository)
    - [Strategic Patterns](#strategic-patterns)
      - [Context Map](#context-map)
      - [Anti-corruption Layer](#anti-corruption-layer)
  - [Implementation in TypeScript](#implementation-in-typescript)
    - [Domain Objects](#domain-objects)
      - [Entity Example](#entity-example)
      - [Value Object Example](#value-object-example)
    - [Strategic Design Implementation](#strategic-design-implementation)
      - [Bounded Context Example](#bounded-context-example)
  - [Best Practices](#best-practices)
    - [Design Principles](#design-principles)
    - [Implementation Guidelines](#implementation-guidelines)
  - [For AI Systems](#for-ai-systems)

## Ubiquitous Language of DDD

Understanding DDD requires mastering its core terminology. This section defines the ubiquitous language of DDD itself, which we use to communicate and implement domain-driven design concepts.

### Core Concepts

#### Domain

- The sphere of knowledge and activity around which the application logic revolves
- The subject area to which the user applies the program
- Example: E-commerce, banking, logistics

#### Bounded Context

- A boundary within which a particular domain model applies
- A conceptual perimeter around a single sub-system
- Has its own ubiquitous language
- Example: Order Management Context, User Management Context

#### Ubiquitous Language

- The language structured around the domain model
- Used consistently in code, documentation, and speech
- Shared by developers and domain experts
- Evolves as understanding deepens

#### Domain Model

- A system of abstractions that describes aspects of a domain
- Selectively implemented in code
- The heart of the business software
- Implementation of business logic and rules

### Building Blocks

#### Entity

- An object primarily defined by its identity
- Continues through time and different states
- Example: A User that changes addresses but maintains identity

#### Value Object

- An object defined by its attributes
- Immutable and replaceable
- No conceptual identity
- Example: An Address, Money amount

#### Aggregate

- A cluster of associated objects treated as a unit
- Has a root entity and boundary
- Ensures consistency
- Example: Order (root) with OrderLines

#### Domain Event

- Something significant that happened in the domain
- Captured in past tense
- Named using ubiquitous language
- Example: OrderShipped, PaymentReceived

#### Repository

- Mechanism for encapsulating storage and retrieval
- Collection-like interface for aggregates
- Persistence-agnostic in domain layer
- Example: UserRepository, OrderRepository

### Strategic Patterns

#### Context Map

- The relationships between bounded contexts
- Integration patterns between contexts
- Example: Customer Support context upstream from Billing context

#### Anti-corruption Layer

- Translation layer between contexts
- Protects model integrity
- Example: Legacy system integration layer

## Implementation in TypeScript

### Domain Objects

#### Entity Example

```typescript
export class Order {
  private constructor(
    private readonly orderId: OrderId,
    private customerId: CustomerId,
    private items: OrderItem[],
    private status: OrderStatus,
  ) {}

  public static create(props: OrderProps): Result<Order> {
    // Validation and creation logic
  }

  public addItem(item: OrderItem): Result<void> {
    // Business logic
  }
}
```

#### Value Object Example

```typescript
export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: Currency,
  ) {}

  public static create(amount: number, currency: Currency): Result<Money> {
    // Validation logic
  }

  public add(other: Money): Result<Money> {
    if (this.currency !== other.currency) {
      return Result.fail("Cannot add different currencies");
    }
    return Result.ok(new Money(this.amount + other.amount, this.currency));
  }
}
```

### Strategic Design Implementation

#### Bounded Context Example

```typescript
// OrderingContext namespace/module
export namespace OrderingContext {
  export class Order {
    /* ... */
  }
  export class OrderLine {
    /* ... */
  }
  export interface IOrderRepository {
    /* ... */
  }
}

// ShippingContext namespace/module
export namespace ShippingContext {
  export class Shipment {
    /* ... */
  }
  export class DeliveryRoute {
    /* ... */
  }
}
```

## Best Practices

### Design Principles

1. Focus on business complexity, not technical complexity
2. Create models in collaboration with domain experts
3. Iterate and refine the model as understanding grows
4. Keep bounded contexts relatively small

### Implementation Guidelines

1. Use private constructors with factory methods
2. Protect invariants at aggregate boundaries
3. Use value objects for all domain concepts
4. Keep aggregates small

## For AI Systems

```yaml
ai_ddd_guidelines:
  ubiquitous_language:
    importance: "critical"
    application:
      - "Use in all code artifacts"
      - "Use in communications"
      - "Use in documentation"
    evolution:
      - "Refine based on domain expert input"
      - "Update codebase when language changes"

  modeling:
    principles:
      - "Start with behavior, not data"
      - "Model whole business processes"
      - "Make implicit concepts explicit"

  implementation:
    patterns:
      - "Private constructors"
      - "Factory methods"
      - "Value objects"
      - "Rich domain model"

  context_boundaries:
    - "Clear separation between contexts"
    - "Explicit context interfaces"
    - "Anti-corruption layers when needed"
```
