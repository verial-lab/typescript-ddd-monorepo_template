---
version: 1.0.0
date: 2025-01-19
status: active
---

# Architecture Specification

## Overview

This document defines the architectural patterns and structure for our TypeScript-based applications. It focuses on implementing domain-driven design through context patterns and hexagonal architecture principles.

- [Architecture Specification](#architecture-specification)
  - [Overview](#overview)
  - [Core Architecture](#core-architecture)
    - [Domain Context Pattern](#domain-context-pattern)
      - [Context Structure](#context-structure)
      - [Context Implementation Pattern](#context-implementation-pattern)
    - [Directory Structure](#directory-structure)
  - [Implementation Guidelines](#implementation-guidelines)
    - [Domain Layer](#domain-layer)
      - [Types Definition](#types-definition)
      - [Interface Definition](#interface-definition)
    - [Infrastructure Layer](#infrastructure-layer)
      - [Repository Implementation](#repository-implementation)
    - [Application Layer](#application-layer)
      - [Usage Example](#usage-example)
  - [Domain Patterns](#domain-patterns)
    - [Context Pattern](#context-pattern)
    - [Repository Pattern](#repository-pattern)
  - [Cross-Cutting Concerns](#cross-cutting-concerns)
    - [Dependency Injection](#dependency-injection)
    - [Error Handling](#error-handling)
  - [Testing Strategy](#testing-strategy)
    - [Domain Testing](#domain-testing)
  - [For AI Systems](#for-ai-systems)

## Core Architecture

### Domain Context Pattern

The domain context pattern is the primary organizational unit of our architecture. Each bounded context is implemented as a self-contained module with its own domain logic, interfaces, and types.

#### Context Structure

```bash
domain/blog/
├── BlogContext.ts              # Main context class
├── types.ts                    # Domain types
└── interfaces/
    └── IBlogRepository.ts      # Repository interface
```

#### Context Implementation Pattern

```typescript
export class BlogContext {
  private _author: Author;
  private _repository: IBlogRepository;

  private constructor(author: Author, repository: IBlogRepository) {
    this._author = author;
    this._repository = repository;
  }

  // Static factory method
  static async create(
    params: CreateBlogParams,
    repository: IBlogRepository,
  ): Promise<BlogContext> {
    const author: Author = {
      id: generateId(),
      name: params.name,
      email: params.email,
    };
    return new BlogContext(author, repository);
  }

  // Public behaviors
  public async someBusinessLogic(): Promise<Result> {
    // Implementation
  }

  // Private helper functions
  private helperMethod(): void {
    // Implementation
  }
}
```

### Directory Structure

```bash
src/
├── domain/
│   └── blog/                   # Domain context
│       ├── BlogContext.ts      # Context implementation
│       ├── types.ts           # Domain types
│       └── interfaces/        # Domain interfaces
├── infrastructure/
│   └── repositories/          # Repository implementations
└── application/
    └── use-cases/            # Use case implementations
```

## Implementation Guidelines

### Domain Layer

#### Types Definition

```typescript
// domain/blog/types.ts
export type Author = {
  id: string;
  name: string;
  email: string;
};

export type CreateBlogParams = {
  name: string;
  email: string;
};
```

#### Interface Definition

```typescript
// domain/blog/interfaces/IBlogRepository.ts
export interface IBlogRepository {
  savePost(post: BlogPost): Promise<void>;
  findPostById(id: string): Promise<BlogPost | null>;
  findPostsByAuthor(authorId: string): Promise<BlogPost[]>;
}
```

### Infrastructure Layer

#### Repository Implementation

```typescript
// infrastructure/repositories/BlogRepository.ts
export class BlogRepository implements IBlogRepository {
  private posts: BlogPost[] = [];

  async savePost(post: BlogPost): Promise<void> {
    const existingIndex = this.posts.findIndex((p) => p.id === post.id);
    if (existingIndex >= 0) {
      this.posts[existingIndex] = post;
    } else {
      this.posts.push(post);
    }
  }

  async findPostById(id: string): Promise<BlogPost | null> {
    return this.posts.find((post) => post.id === id) || null;
  }
}
```

### Application Layer

#### Usage Example

```typescript
async function example() {
  // Initialize repository
  const repository = new BlogRepository();

  // Create domain context
  const blog = await BlogContext.create(
    {
      name: "John Doe",
      email: "john@example.com",
    },
    repository,
  );

  // Execute business logic
  const result = await blog.someBusinessLogic();
}
```

## Domain Patterns

### Context Pattern

- Self-contained domain logic
- Private constructor with static factory method
- Dependency injection through constructor
- Clear public behaviors
- Encapsulated private helpers

### Repository Pattern

- Interface defined in domain layer
- Implementation in infrastructure layer
- Asynchronous operations
- Type-safe operations

## Cross-Cutting Concerns

### Dependency Injection

- Constructor-based injection
- Repository interfaces
- Service interfaces when needed

### Error Handling

- Domain-specific errors
- Result type for operations
- Async/await pattern

## Testing Strategy

### Domain Testing

```typescript
describe("BlogContext", () => {
  let repository: IBlogRepository;
  let blog: BlogContext;

  beforeEach(async () => {
    repository = new BlogRepository();
    blog = await BlogContext.create(
      {
        name: "Test User",
        email: "test@example.com",
      },
      repository,
    );
  });

  it("should create blog post", async () => {
    // Test implementation
  });
});
```

## For AI Systems

```yaml
ai_architecture_guidelines:
  context_pattern:
    structure:
      - "Private constructor"
      - "Static factory method"
      - "Interface-based dependencies"
      - "Clear public behaviors"

  patterns:
    - "Domain context per bounded context"
    - "Repository interface in domain"
    - "Repository implementation in infrastructure"

  naming:
    contexts: "PascalCase + Context"
    interfaces: "I + PascalCase"
    repositories: "EntityName + Repository"

  file_organization:
    domain:
      - "Types in types.ts"
      - "Interfaces in interfaces/"
      - "Context in root"
```
