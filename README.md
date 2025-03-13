# TypeScript DDD Monorepo Template

A comprehensive monorepo template optimized for TypeScript, Domain-Driven Design (DDD), and modern development workflows.

## Features

- 📦 **pnpm** for efficient package management
- 🔄 **Turborepo** for build orchestration and caching
- 🧹 **Biome** for linting and formatting (replacing ESLint & Prettier)
- 📘 **TypeScript** for type safety
- 📦 **tsup** for efficient bundling
- 🏷️ **Changesets** for versioning and changelogs
- 🐳 **Docker** support for containerization
- 🎭 **Playwright** for end-to-end testing
- 🧪 **Vitest** for unit and integration testing
- 👮 **Husky** and **Commitlint** for Git hooks and conventional commits

## Monorepo Structure

```
monorepo-root/
├── ws_apps/          # Frontend & backend applications
│   ├── web/          # Example Next.js app
│   ├── api/          # Example Node.js backend
│   └── ...          
├── ws_packages/      # Shared libraries & utilities
│   ├── logger/       # Example logging library
│   ├── ui/           # Example component library
│   └── ...          
├── ws_domains/       # Domain-driven modules (DDD structure)
│   ├── auth/         # Example authentication module
│   ├── billing/      # Example billing module
│   └── ...
├── ws_infrastructure/# Infrastructure implementations
│   ├── supabase/     # Supabase integration
│   └── ...
├── ws_tooling/       # Centralized dev tooling & configs
│   ├── tsconfig/     # TypeScript configurations
│   ├── tsup/         # Build tool configurations
│   └── ...
├── ws_templates/     # Prebuilt scaffolding templates
├── docs/             # Documentation
│   ├── index.md      # Main table of contents
│   ├── development/  # Development workflows, tools, and practices
│   ├── technical/    # Technical documentation
│   ├── guides/       # Step-by-step guides
│   └── adrs/         # Architectural Decision Records
├── .github/          # GitHub workflows and templates
├── .husky/           # Git hooks for code quality
├── .changeset/       # Changesets for versioning
├── .vscode/          # VS Code configurations
├── .cursor/          # Cursor IDE configurations and rules
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/typescript-ddd-monorepo-template.git
cd typescript-ddd-monorepo-template

# Install dependencies
pnpm install
```

### Development

```bash
# Start development mode
pnpm dev

# Build all packages and applications
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

### Versioning and Publishing

This template uses Changesets for versioning and publishing:

```bash
# Create a new changeset
pnpm changeset

# Version packages based on changesets
pnpm version-packages

# Publish packages
pnpm release
```

## Documentation

Comprehensive documentation is available in the [docs](./docs/index.md) directory. The documentation is organized into a hierarchical table of contents structure:

- [**Development Documentation**](./docs/development/index.md) - Development workflows, tools, and practices
- [**Technical Documentation**](./docs/technical/index.md) - Architecture and implementation details
- [**Guides**](./docs/guides/index.md) - Step-by-step guides for common tasks
- [**Architectural Decision Records**](./docs/adrs/index.md) - Documentation of significant architectural decisions

This documentation structure is designed to be easily navigable and to support future implementation of a documentation UI. For more information, see [ADR-005: Documentation Structure](./docs/adrs/005-documentation-structure.md) and [ADR-006: Documentation Table of Contents Structure](./docs/adrs/006-documentation-table-of-contents.md).

## License

MIT
