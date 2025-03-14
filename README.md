# TypeScript DDD Monorepo Template

A comprehensive monorepo template optimized for TypeScript, Domain-Driven Design (DDD), and modern development workflows.

## Features

- 📦 **pnpm** for efficient package management
- 🔄 **Turborepo** for build orchestration and caching
- 🧹 **Biome** for linting and formatting (replacing ESLint & Prettier)
- 📘 **TypeScript** for type safety
- 📦 **tsup** for efficient bundling
- 🤝 **Conventional Commits** for clear communication and versioning
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
│   ├── development/  # Development workflows
│   ├── technical/    # Technical documentation
│   ├── guides/       # Step-by-step guides
│   ├── adrs/         # Architectural Decision Records
│   └── roadmap/      # Strategic roadmap & evolution
└── ... other config files
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

## Documentation

Our documentation is organized into a comprehensive, hierarchical structure designed for clarity and ease of use:

### Core Documentation

- [📚 **Documentation Home**](./docs/index.md) - Start here for a complete overview
- [🛠️ **Development Guide**](./docs/development/index.md) - Development workflows and practices
- [🏗️ **Technical Reference**](./docs/technical/index.md) - Architecture and implementation details
- [📖 **User Guides**](./docs/guides/index.md) - Step-by-step guides for common tasks

### Architecture & Evolution

- [📋 **Architectural Decisions**](./docs/adrs/index.md) - Key architectural decisions and their rationale
  - [ADR-009: Domain Isolation Principle](./docs/adrs/009-domain-isolation-principle.md) - Core DDD principles
  - [ADR-008: Version Control Strategy](./docs/adrs/008-version-control-and-commit-strategy.md) - Commit and version management
  - [ADR-005: Documentation Structure](./docs/adrs/005-documentation-structure.md) - Documentation organization
  - [View all ADRs](./docs/adrs/index.md)

- [🗺️ **Strategic Roadmap**](./docs/roadmap/README.md) - Technical evolution and future directions
  - [Domain Core & Event Bus](./docs/roadmap/infrastructure/001-domain-core-and-event-bus.md) - Core domain infrastructure
  - [Reference Module Integration](./docs/roadmap/infrastructure/002-reference-modules-integration.md) - Pattern library development
  - [Template System](./docs/roadmap/tooling/001-handlebars-template-system.md) - Code generation and scaffolding

### Key Principles

- **Domain Isolation**: Domain modules (`ws_domains/*`) maintain zero external dependencies, ensuring pure business logic that stands the test of time
- **Clear Boundaries**: Strong separation between domain, application, and infrastructure layers
- **Developer Experience**: Comprehensive tooling and automation for efficient development
- **Quality First**: Extensive testing infrastructure and quality assurance tools
- **Evolution Ready**: Strategic roadmap for continuous improvement and adaptation

## Contributing

Please read our [Contributing Guide](./docs/development/contributing.md) for details on our development process, coding standards, and pull request process.

## License

MIT
