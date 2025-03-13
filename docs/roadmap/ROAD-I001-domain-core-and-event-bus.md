# Domain Core and Event Bus Implementation

**Status**: 🏗️ In Progress  
**Priority**: 🔥 Critical  
**Labels**: `infrastructure`, `cross-cutting`

## Overview

Implement core domain interfaces and event bus infrastructure to support cross-cutting concerns and event-driven architecture across the monorepo.

## Components

### 1. Domain Core Package (`@repo-packages/domain-core`)

**Status**: ✅ Completed

Create a new package to house base interfaces and abstractions for cross-cutting concerns:

- Base entity interfaces
- Value object patterns
- Domain event interfaces
- Repository interfaces
- Unit of work patterns
- Aggregate root patterns
- Command and query interfaces

### 2. Event Bus Infrastructure

**Status**: 📋 Planned

Implement event bus infrastructure using Kafka:

- Define event bus interfaces in domain-core
- Create Kafka implementation in ws_infrastructure
- Support both sync and async event handling
- Implement event serialization/deserialization
- Add event replay capabilities
- Implement dead letter queue handling

### 3. Template Generation

**Status**: 📋 Planned

Create Handlebars templates for generating:

- Domain entities
- Value objects
- Event handlers
- Commands and queries
- Repository implementations
- Integration event mappings

## Implementation Steps

1. **Domain Core Setup**
   - [x] Create package structure
   - [x] Port base interfaces from market kits template
   - [x] Add unit tests for base classes
   - [x] Document usage patterns

2. **Event Bus Interface Layer**
   - [x] Define core event interfaces
   - [x] Create event dispatcher abstraction
   - [x] Define event handler interfaces
   - [x] Add event metadata support
   - [x] Create event store interface

3. **Kafka Implementation**
   - [ ] Set up Kafka infrastructure package
   - [ ] Implement event bus interface
   - [ ] Add Kafka producer/consumer setup
   - [ ] Implement event serialization
   - [ ] Add error handling and retries
   - [ ] Create dead letter queue

4. **Template System**
   - [ ] Set up Handlebars integration
   - [ ] Create base templates
   - [ ] Add template generation scripts
   - [ ] Document template usage

## Dependencies

- Kafka infrastructure
- Handlebars templating system
- Market kits template reference

## Acceptance Criteria

- [x] Domain core package provides all necessary base interfaces
- [ ] Event bus supports both sync and async event handling
- [ ] Kafka implementation handles all event bus interfaces
- [ ] Template system can generate all common patterns
- [x] Full test coverage for all components
- [x] Documentation for usage patterns
- [ ] Example implementations provided

## Notes

- Consider using OpenTelemetry for event tracing
- May need to implement event versioning
- Consider adding event schema validation
- Look into Kafka Streams for complex event processing
