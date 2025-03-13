# Quickstart Guide

This guide provides step-by-step instructions for setting up and working with the monorepo.

## Table of Contents

- [Quickstart Guide](#quickstart-guide)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
  - [Development Workflow](#development-workflow)
  - [Testing](#testing)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Getting Help](#getting-help)
  - [Next Steps](#next-steps)
  - [Future Enhancements](#future-enhancements)

## Prerequisites

Ensure you have the following installed:

- Node.js (v18 or later)
- pnpm (v8 or later)
- Git

## Local Development Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd typescript-ddd-monorepo_template
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Set Up Environment**

   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Configure your environment variables
   nano .env
   ```

4. **Build Packages**

   ```bash
   pnpm build
   ```

## Development Workflow

1. **Start Development Mode**

   ```bash
   # Start all services in development mode
   pnpm dev
   ```

2. **Code Quality**

   ```bash
   # Format code
   pnpm format

   # Lint code
   pnpm lint

   # Format and lint with fixes
   pnpm precheck
   ```

3. **Full Check**

   ```bash
   # Run format, lint, build, and tests
   pnpm check

   # Run checks with automatic fixes
   pnpm check:fix
   ```

## Testing

```bash
# Run all tests (unit and e2e)
pnpm test

# Run only unit tests
pnpm test:unit

# Run only e2e tests
pnpm test:e2e
```

## Troubleshooting

### Common Issues

1. **Build Issues**

   ```bash
   # Clean all build artifacts and node_modules
   pnpm clean
   
   # Reinstall dependencies and rebuild
   pnpm install
   pnpm build
   ```

2. **Lint/Format Issues**

   ```bash
   # Fix formatting
   pnpm format
   
   # Fix linting issues
   pnpm lint:fix
   
   # Fix both
   pnpm precheck
   ```

### Getting Help

- Check the [FAQ](./guides/faq.md)
- Review [Common Issues](./guides/troubleshooting.md)
- Open an [Issue](https://github.com/your-repo/issues)

## Next Steps

- Read the [Architecture Overview](./technical/architecture.md)
- Explore [Development Guides](./development/index.md)
- Review [Best Practices](./guides/best-practices.md)

## Future Enhancements

The following features are planned but not yet implemented:

1. Database integration with migrations
2. Production deployment scripts
3. Docker containerization
4. CI/CD pipeline improvements
5. Example application workspace

Track the progress of these features in our [Strategic Roadmap](./roadmap/index.md).
