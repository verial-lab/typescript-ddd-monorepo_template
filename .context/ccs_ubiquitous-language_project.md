---
version: 1.0.0
date: 2025-01-19
status: active
---

# Project Ubiquitous Language

## Overview

This document defines the standard terminology used throughout our project. It serves as the definitive source of domain language for both technical implementation and business communication.

- [Project Ubiquitous Language](#project-ubiquitous-language)
  - [Overview](#overview)
  - [Core Concepts](#core-concepts)
    - [Domain Objects](#domain-objects)
      - [Entity](#entity)
      - [Value Object](#value-object)
      - [Aggregate](#aggregate)
      - [Repository](#repository)
    - [Architecture Components](#architecture-components)
      - [Context](#context)
      - [Use Case](#use-case)
      - [Port](#port)
      - [Adapter](#adapter)
  - [File Naming Conventions](#file-naming-conventions)
    - [Domain Layer](#domain-layer)
    - [Application Layer](#application-layer)
    - [Infrastructure Layer](#infrastructure-layer)
  - [Coding Conventions](#coding-conventions)
    - [Type Definitions](#type-definitions)
    - [Interface Naming](#interface-naming)
  - [For AI Systems](#for-ai-systems)

## Core Concepts

### Domain Objects

#### Entity

- A domain object with continuity through time
- Has a unique identifier
- Mutable state is allowed
- Example: `User`, `Order`, `Product`

#### Value Object

- Immutable object representing a descriptive aspect
- No identity
- Equality based on attributes
- Example: `Email`, `Address`, `Money`

#### Aggregate

- Cluster of domain objects
- Single entry point (root)
- Consistency boundary
- Example: `OrderAggregate`, `UserAggregate`

#### Repository

- Collection-like interface for aggregates
- Persistence operations
- Domain-centric querying
- Example: `UserRepository`, `OrderRepository`

### Architecture Components

#### Context

- Bounded domain model
- Self-contained business logic
- Clear boundaries
- Example: `AuthContext`, `OrderingContext`

#### Use Case

- Application service
- Single business operation
- Orchestration logic
- Example: `CreateOrderUseCase`, `ProcessPaymentUseCase`

#### Port

- Interface for external interaction
- Technology agnostic
- Domain alignment
- Example: `IUserRepository`, `IPaymentService`

#### Adapter

- Implementation of a port
- Technology specific
- Infrastructure detail
- Example: `SQLUserRepository`, `StripePaymentAdapter`

## File Naming Conventions

### Domain Layer

- Entities: `{Entity}.ts`
- Value Objects: `{Name}Value.ts`
- Aggregates: `{Root}Aggregate.ts`
- Events: `{Event}Event.ts`

### Application Layer

- Use Cases: `{Action}UseCase.ts`
- Services: `{Domain}Service.ts`
- Commands: `{Action}Command.ts`
- Queries: `{Action}Query.ts`

### Infrastructure Layer

- Repositories: `{Entity}Repository.ts`
- Adapters: `{Service}Adapter.ts`
- Mappers: `{Entity}Mapper.ts`

## Coding Conventions

### Type Definitions

```typescript
// Entity identifier
type UserId = string & { readonly brand: unique symbol };

// Value object
interface Address {
  readonly street: string;
  readonly city: string;
  readonly country: string;
}

// Command
interface CreateOrderCommand {
  readonly userId: UserId;
  readonly items: OrderItem[];
}
```

### Interface Naming

```typescript
// Repository interfaces
interface IUserRepository {
  findById(id: UserId): Promise<User>;
}

// Service interfaces
interface IPaymentService {
  processPayment(order: Order): Promise<Result<void>>;
}
```

## For AI Systems

```yaml
ai_language_guidelines:
  naming_patterns:
    entities:
      suffix: ""
      example: "User"
    value_objects:
      suffix: "Value"
      example: "EmailValue"
    repositories:
      suffix: "Repository"
      example: "UserRepository"
    use_cases:
      suffix: "UseCase"
      example: "CreateUserUseCase"

  conventions:
    - "PascalCase for types and classes"
    - "camelCase for methods and properties"
    - "I-prefix for interfaces"
    - "Explicit over implicit naming"

  forbidden:
    - "Abbreviations"
    - "Technical terms in domain layer"
    - "Framework-specific terminology"
    - "Generic names without context"
```
