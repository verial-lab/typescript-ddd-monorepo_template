# Monorepo Structure Guide

This guide explains the organization and architecture of this TypeScript DDD monorepo template.

## Overview

The monorepo is organized into distinct workspaces, each serving a specific purpose in the overall architecture:

```
monorepo-root/
├── ws_apps/          # Frontend & backend applications
├── ws_packages/      # Shared libraries & utilities
├── ws_domains/       # Domain-driven modules
├── ws_tooling/       # Centralized dev tooling & configs
└── ws_templates/     # Prebuilt scaffolding templates
```

## Workspace Types

### 1. Applications (ws_apps/)

Applications are end-user facing products, either frontend or backend:

```
ws_apps/
├── api-express/      # Example Express.js API
├── example/          # Example React application
└── web/             # Example Next.js application
```

Key characteristics:

- Marked as `private: true` in package.json
- Not published to npm
- Can depend on domain modules and shared packages
- Use specific configurations for their framework (Vite, Next.js, etc.)

### 2. Shared Packages (ws_packages/)

Reusable libraries and utilities used across the monorepo:

```
ws_packages/
├── logger/          # Shared logging functionality
└── ui/              # Shared React components
```

Key characteristics:

- Published to npm (unless marked private)
- Framework-agnostic where possible
- Focused on specific functionality
- Minimal dependencies
- Well-documented APIs

### 3. Domain Modules (ws_domains/)

Domain-driven design (DDD) modules that encapsulate business logic:

```
ws_domains/
├── auth/           # Authentication & authorization
└── billing/        # Billing & payment processing
```

Each domain follows DDD principles:

```
auth/
├── src/
│   ├── entities/        # Domain entities
│   ├── value-objects/   # Value objects
│   ├── events/          # Domain events
│   ├── repositories/    # Data access
│   └── services/        # Domain services
├── package.json
└── tsconfig.json
```

Key characteristics:

- Business logic isolation
- Framework-agnostic
- Clear bounded contexts
- Domain-driven architecture
- Event-driven communication

### 4. Development Tooling (ws_tooling/)

Centralized tooling and configurations:

```
ws_tooling/
├── biome/          # Biome (formatting/linting) config
├── tsconfig/       # Base TypeScript configs
├── tsup/           # Build configuration
├── typescript/     # TypeScript presets
└── vitest/         # Testing configuration
```

Key characteristics:

- Shared configurations
- Build tools
- Test setups
- Linting rules
- TypeScript configurations

### 5. Templates (ws_templates/)

Scaffolding templates for new workspace items:

```
ws_templates/
├── app/            # New application template
├── domain/         # New domain module template
└── package/        # New shared package template
```

## Configuration Files

### Workspace Configuration (pnpm-workspace.yaml)

```yaml
packages:
  - "ws_*/*"
  - "ws_tooling/*"
```

This configuration:

- Defines workspace package locations
- Enables workspace package resolution
- Supports nested workspaces

### Build Pipeline (turbo.json)

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

Features:

- Task dependencies
- Build caching
- Output tracking
- Development mode settings

## Dependencies

### Internal Dependencies

Workspace packages use the `workspace:*` protocol:

```json
{
  "dependencies": {
    "@repo-packages/logger": "workspace:*",
    "@repo-domains/auth": "workspace:*"
  }
}
```

This ensures:

- Local package resolution
- Consistent versioning
- Development synchronization

### External Dependencies

External dependencies are managed at both root and package levels:

- Root dependencies: Dev tools and global utilities
- Package dependencies: Framework and runtime dependencies

## Best Practices

### 1. Package Organization

- Keep packages focused and single-purpose
- Use clear, descriptive package names
- Maintain consistent internal structure
- Document public APIs

### 2. Dependencies

- Minimize external dependencies
- Use workspace dependencies when possible
- Keep dependency graphs shallow
- Regular dependency audits

### 3. Code Sharing

- Share through dedicated packages
- Avoid direct imports between apps
- Use explicit dependencies
- Document shared code

### 4. Version Control

- Atomic commits
- Feature branches
- Conventional commits
- Clear change documentation

## Adding New Workspaces

1. Choose appropriate template from ws_templates/
2. Copy template to correct workspace directory
3. Update package.json:
   - Name (following workspace conventions)
   - Dependencies
   - Scripts
4. Add to version control
5. Install dependencies
6. Update documentation

## Common Tasks

### Creating a New Package

```bash
# Copy template
cp -r ws_templates/package ws_packages/new-package

# Update package details
cd ws_packages/new-package
# Edit package.json, README.md, etc.

# Install dependencies
pnpm install
```

### Creating a New Domain Module

```bash
# Copy template
cp -r ws_templates/domain ws_domains/new-domain

# Update module details
cd ws_domains/new-domain
# Edit package.json, README.md, etc.

# Install dependencies
pnpm install
```

## Further Reading

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Handbook](https://turbo.build/repo/docs)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
