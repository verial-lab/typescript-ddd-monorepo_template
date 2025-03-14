# Ubiquitous Language - Domain Core

This document captures the ubiquitous language used in the domain core. These are foundational concepts used across all domains.

## Table of Contents

- [Ubiquitous Language - Domain Core](#ubiquitous-language---domain-core)
  - [Table of Contents](#table-of-contents)
  - [Terms](#terms)
    - [Entity](#entity)
    - [Value Object](#value-object)
    - [Aggregate Root](#aggregate-root)
  - [Event Names](#event-names)
    - [Domain Event](#domain-event)
  - [Commands](#commands)
    - [Command](#command)
  - [Queries](#queries)
    - [Query](#query)
  - [Interfaces](#interfaces)
    - [Event Validator](#event-validator)
    - [Event Bus](#event-bus)
  - [Notes](#notes)

## Terms

### Entity

- **Definition**: An object that has a distinct identity that runs through time and different states
- **Context**: Used as a base class for domain objects that need identity and lifecycle
- **Examples**: User, Order, Product
- **Related Terms**: Aggregate Root, Value Object
- **Code References**: `Entity.ts`, `BaseEntity.ts`

### Value Object

- **Definition**: An immutable object that describes some characteristic or attribute but carries no concept of identity
- **Context**: Used for objects that are defined by their attributes rather than identity
- **Examples**: Address, Money, DateRange
- **Related Terms**: Entity
- **Code References**: `ValueObject.ts`

### Aggregate Root

- **Definition**: The main entity in a cluster of domain objects that guarantees the consistency of changes being made within the aggregate
- **Context**: Used as the main entry point for modifying a group of related objects
- **Examples**: Order (containing OrderLines), User (containing Preferences)
- **Related Terms**: Entity, Domain Event
- **Code References**: `AggregateRoot.ts`

## Event Names

### Domain Event

- **Definition**: Something that happened in the domain that domain experts care about
- **Context**: Used to notify other parts of the system about changes in the domain
- **Data**: eventId, eventType, occurredOn, aggregateId, version, payload
- **Consumers**: Event handlers in other domains/bounded contexts
- **Code References**: `DomainEvent.ts`

## Commands

### Command

- **Definition**: A request for the system to perform an action that changes state
- **Context**: Used to encapsulate and validate state changes
- **Parameters**: Depends on the specific command
- **Outcome**: State change or validation error
- **Code References**: `Command.ts`

## Queries

### Query

- **Definition**: A request for information that doesn't change state
- **Context**: Used to retrieve data from the system
- **Parameters**: Search/filter criteria specific to the query
- **Returns**: Requested data or null
- **Code References**: `Query.ts`

## Interfaces

### Event Validator

- **Definition**: A contract for validating domain events
- **Context**: Used to ensure events contain valid data before processing
- **Validation Rules**: Defined per event type
- **Usage**: Event bus validation, command validation
- **Code References**: `EventValidator.ts`

### Event Bus

- **Definition**: A mechanism for publishing and subscribing to domain events
- **Context**: Used for event-driven communication between domains
- **Behavior**: Publishes events, notifies subscribers
- **Usage**: Cross-domain communication
- **Code References**: `IEventBus` in `DomainEvent.ts`

## Notes

- These terms form the foundation of our domain-driven design implementation
- All domains should use these terms consistently
- Implementation details may vary but concepts remain constant
- New core concepts should be added here as they emerge 