# Development Workflow Guide

This guide explains the development workflow in this TypeScript DDD monorepo, including local development, testing, and CI/CD processes.

## Local Development

### Initial Setup

1. Install dependencies:

```bash
pnpm install
```

2. Build all packages:

```bash
pnpm build
```

### Development Mode

Start development servers for all workspaces:

```bash
pnpm dev
```

This command:

- Watches for file changes
- Rebuilds affected packages
- Hot reloads applications
- Maintains type checking

For specific workspaces:

```bash
# Start only the example app
pnpm --filter @repo-apps/example dev

# Start a specific package in watch mode
pnpm --filter @repo-packages/ui dev
```

### Code Style

The project uses Biome for formatting and linting:

```bash
# Check code style
pnpm lint

# Fix code style issues
pnpm lint:fix

# Format code
pnpm format
```

Biome is configured in `biome.json` with project-specific rules.

## Testing

The project uses Vitest for unit/integration tests and Playwright for E2E testing.

### Unit and Integration Tests

Run all tests:

```bash
pnpm test
```

Run tests for specific workspace:

```bash
pnpm --filter @repo-packages/logger test
```

Watch mode:

```bash
pnpm --filter @repo-packages/logger test:watch
```

Coverage report:

```bash
pnpm --filter @repo-packages/logger test:coverage
```

### End-to-End Tests

E2E tests use Playwright and are located in `ws_apps/*/tests/e2e/`.

Run E2E tests:

```bash
# Run all E2E tests
pnpm --filter @repo-apps/example test:e2e

# Run with UI mode
pnpm --filter @repo-apps/example test:e2e:ui
```

## Build Process

The build pipeline is managed by Turborepo, configured in `turbo.json`.

### Building Packages

Build all packages:

```bash
pnpm build
```

Build specific package:

```bash
pnpm --filter @repo-packages/ui build
```

The build process:

1. Checks dependencies (`^build`)
2. Runs TypeScript compilation
3. Bundles with tsup
4. Generates type definitions
5. Outputs to `dist/` directory

### Build Cache

Turborepo maintains a build cache for faster rebuilds:

- Cache location: `.turbo/`
- Cached outputs: `dist/`, `.next/`, `build/`
- Cache inputs: `src/`, `package.json`, `tsconfig.json`

Clear cache if needed:

```bash
pnpm clean
```

## Git Workflow

### Commit Guidelines

The project uses conventional commits with commitlint:

```bash
# ✅ Good commits
git commit -m "feat: add user authentication"
git commit -m "fix: resolve memory leak in logger"
git commit -m "docs: update API documentation"

# ❌ Bad commits
git commit -m "updated stuff"
git commit -m "WIP"
```

Commit types:

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation
- `chore`: Maintenance
- `refactor`: Code changes
- `test`: Test updates
- `style`: Code style updates
- `perf`: Performance improvements
- `ci`: CI configuration
- `build`: Build system
- `revert`: Revert changes

### Branch Strategy

1. Feature branches:

```bash
git checkout -b feature/user-authentication
```

2. Bug fix branches:

```bash
git checkout -b fix/memory-leak
```

3. Documentation branches:

```bash
git checkout -b docs/api-guide
```

### Pre-commit Hooks

Husky runs pre-commit checks:

- Linting
- Type checking
- Unit tests
- Commit message format

## CI/CD Pipeline

### Continuous Integration

The CI pipeline runs on every pull request:

1. Install dependencies

```bash
pnpm install --frozen-lockfile
```

2. Build all packages

```bash
pnpm build
```

3. Run tests

```bash
pnpm test
pnpm test:e2e
```

4. Check code style

```bash
pnpm lint
```

### Continuous Deployment

Deployment process:

1. Version packages

```bash
pnpm version-packages
```

2. Build packages

```bash
pnpm build
```

3. Publish packages

```bash
pnpm release
```

## Debugging

### VS Code Configuration

Launch configurations are provided for:

- Node.js applications
- React applications
- Unit tests
- E2E tests

Example `.vscode/launch.json`:

```json
{
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "cwd": "${workspaceFolder}/ws_apps/api-express",
      "program": "src/index.ts",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"]
    }
  ]
}
```

### Common Issues

1. **Module Resolution**
   - Check tsconfig.json paths
   - Verify package.json dependencies
   - Ensure packages are built

2. **Build Errors**
   - Clear turbo cache
   - Rebuild dependencies
   - Check TypeScript errors

3. **Test Failures**
   - Check test environment
   - Verify test dependencies
   - Review test isolation

## Performance Optimization

### Development Performance

1. Use filtered commands:

```bash
pnpm --filter @repo-packages/ui dev
```

2. Leverage Turborepo cache:

```bash
# Cache task outputs
pnpm turbo run build --cache-dir=".turbo"
```

3. Optimize TypeScript:
   - Use project references
   - Enable incremental builds
   - Configure include/exclude

### Production Builds

Optimize builds:

```bash
# Production build with optimizations
pnpm build --production

# Analyze bundle
pnpm build --analyze
```

## Further Reading

- [pnpm CLI](https://pnpm.io/cli/run)
- [Turborepo Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Vitest Documentation](https://vitest.dev/guide/)
- [Playwright Guides](https://playwright.dev/docs/intro)
- [TypeScript Performance](https://github.com/microsoft/TypeScript/wiki/Performance)
