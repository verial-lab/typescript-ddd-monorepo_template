# Template: UBIQUITOUS_LANGUAGE-{domain-name}.md

This template should be copied to each domain's directory and renamed to include the domain name.
For example: `UBIQUITOUS_LANGUAGE-domain-core.md` or `UBIQUITOUS_LANGUAGE-user-management.md`

# Ubiquitous Language - {Domain Name}

This document captures the ubiquitous language used in this domain. It serves as a living glossary that evolves with our understanding of the domain.

## Table of Contents

- [Ubiquitous Language - {Domain Name}](#ubiquitous-language---domain-name)
  - [Table of Contents](#table-of-contents)
  - [Terms](#terms)
    - [[Term Name]](#term-name)
  - [Event Names](#event-names)
    - [[Event Name]](#event-name)
  - [Commands](#commands)
    - [[Command Name]](#command-name)
  - [Queries](#queries)
    - [[Query Name]](#query-name)
  - [Aggregates](#aggregates)
    - [[Aggregate Name]](#aggregate-name)
  - [Value Objects](#value-objects)
    - [[Value Object Name]](#value-object-name)
  - [Notes](#notes)

## Terms

### [Term Name]

- **Definition**: Clear, concise definition of the term
- **Context**: When/where this term is used
- **Examples**: Concrete examples of usage
- **Related Terms**: Links to related terms
- **Code References**: How this maps to code (entities, value objects, etc.)

## Event Names

### [Event Name]

- **Description**: What this event represents
- **Trigger**: What causes this event
- **Data**: Key data points carried by this event
- **Consumers**: Who listens for this event
- **Business Impact**: Business significance of this event

## Commands

### [Command Name]

- **Purpose**: What this command does
- **Preconditions**: Required state/conditions
- **Parameters**: What data it needs
- **Outcome**: Expected results
- **Side Effects**: Any additional effects

## Queries

### [Query Name]

- **Purpose**: What information this query retrieves
- **Parameters**: Search/filter criteria
- **Returns**: Expected return data
- **Use Cases**: When/why this query is used

## Aggregates

### [Aggregate Name]

- **Definition**: What this aggregate represents
- **Invariants**: Business rules it enforces
- **Lifecycle**: Key state transitions
- **Commands**: Commands it handles
- **Events**: Events it produces

## Value Objects

### [Value Object Name]

- **Definition**: What this value object represents
- **Validation Rules**: Constraints on valid values
- **Behavior**: Any specific behavior/operations
- **Usage**: Where/how it's used

## Notes

- Terms should be added/updated as they emerge in refinements
- Each term should be discussed and agreed upon by the team
- Code should reflect these terms exactly as defined here
- Deprecated terms should be marked and eventually removed 