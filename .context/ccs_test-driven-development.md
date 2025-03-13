---
version: 1.0.0
date: 2025-01-19
status: active
---

# Test-Driven Development Specification

## Overview

This document defines our Test-Driven Development (TDD) practices and patterns. It emphasizes writing tests before implementation and using tests to drive design decisions.

- [Test-Driven Development Specification](#test-driven-development-specification)
  - [Overview](#overview)
  - [Core Principles](#core-principles)
    - [Red-Green-Refactor Cycle](#red-green-refactor-cycle)
    - [Test First Approach](#test-first-approach)
  - [Test Organization](#test-organization)
    - [Directory Structure](#directory-structure)
    - [Naming Conventions](#naming-conventions)
  - [Testing Patterns](#testing-patterns)
    - [Domain Layer Testing](#domain-layer-testing)
    - [Use Case Testing](#use-case-testing)
  - [Testing Standards](#testing-standards)
    - [Test Structure](#test-structure)
    - [Mock Objects](#mock-objects)
  - [Best Practices](#best-practices)
    - [Test Quality](#test-quality)
    - [Test Coverage](#test-coverage)
  - [For AI Systems](#for-ai-systems)

## Core Principles

### Red-Green-Refactor Cycle

1. Write a failing test (Red)
2. Write minimal code to pass (Green)
3. Improve code quality (Refactor)

### Test First Approach

- Tests drive design decisions
- Tests document requirements
- Tests verify behavior
- Tests prevent regressions

## Test Organization

### Directory Structure

```bash
src/
├── domain/
│   └── user/
│       ├── User.ts
│       └── __tests__/
│           ├── User.test.ts
│           └── UserEmail.test.ts
└── application/
    └── use-cases/
        ├── CreateUser.ts
        └── __tests__/
            └── CreateUser.test.ts
```

### Naming Conventions

- Test files: `{Unit}.test.ts`
- Test suites: Describe the unit
- Test cases: Describe the behavior

## Testing Patterns

### Domain Layer Testing

```typescript
describe("User", () => {
  describe("creation", () => {
    it("should create valid user", () => {
      // Arrange
      const props = {
        name: "John Doe",
        email: "john@example.com",
      };

      // Act
      const result = User.create(props);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().name).toBe(props.name);
    });

    it("should fail with invalid email", () => {
      // Arrange
      const props = {
        name: "John Doe",
        email: "invalid-email",
      };

      // Act
      const result = User.create(props);

      // Assert
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("invalid email");
    });
  });
});
```

### Use Case Testing

```typescript
describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase;
  let userRepository: MockUserRepository;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    useCase = new CreateUserUseCase(userRepository);
  });

  it("should create user successfully", async () => {
    // Arrange
    const command = {
      name: "John Doe",
      email: "john@example.com",
    };

    // Act
    const result = await useCase.execute(command);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(userRepository.users.length).toBe(1);
  });
});
```

## Testing Standards

### Test Structure

1. Setup (Arrange)

   - Prepare test data
   - Initialize system under test
   - Configure mocks

2. Execution (Act)

   - Call the method under test
   - Capture results

3. Verification (Assert)
   - Check results
   - Verify state changes
   - Confirm expectations

### Mock Objects

```typescript
class MockUserRepository implements IUserRepository {
  public users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findById(id: UserId): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }
}
```

## Best Practices

### Test Quality

1. One assertion concept per test
2. Clear test names
3. Minimal test setup
4. No test interdependence

### Test Coverage

1. All public methods
2. All edge cases
3. Error conditions
4. Business rules

## For AI Systems

```yaml
ai_testing_guidelines:
  structure:
    - "Follow AAA pattern (Arrange-Act-Assert)"
    - "One concept per test"
    - "Clear test descriptions"
    - "Minimal test setup"

  patterns:
    - "Mock external dependencies"
    - "Test edge cases"
    - "Verify error conditions"
    - "Check business rules"

  naming:
    files: "{Unit}.test.ts"
    suites: "describe unit or feature"
    cases: "describe specific behavior"

  coverage:
    required: true
    minimum: 80
    focus:
      - "Public interfaces"
      - "Business rules"
      - "Error conditions"
      - "Edge cases"
```
