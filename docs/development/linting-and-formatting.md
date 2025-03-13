# Linting and Formatting Guide

This project uses [Biome](https://biomejs.dev/) for linting and formatting. Biome is a fast, modern linter and formatter for JavaScript and TypeScript.

## Available Commands

### Linting

- **`pnpm lint`**: Check for linting issues without fixing them

  ```bash
  pnpm lint
  ```

- **`pnpm lint:fix`**: Check for linting issues and fix them

  ```bash
  pnpm lint:fix
  ```

### Formatting

- **`pnpm format:check`**: Check for formatting issues without fixing them

  ```bash
  pnpm format:check
  ```

- **`pnpm format`**: Fix formatting issues

  ```bash
  pnpm format
  ```

### Combined Commands

- **`pnpm check`**: Run all checks (format, lint, build, test) without fixing issues

  ```bash
  pnpm check
  ```

- **`pnpm check:fix`**: Fix all issues and run checks (format, lint, build, test)

  ```bash
  pnpm check:fix
  ```

## Understanding the Difference Between Lint and Format

While both linting and formatting deal with code style, they serve different purposes:

### Linting (`biome check`)

- Focuses on code quality and potential bugs
- Checks for issues like unused variables, unreachable code, etc.
- Can also check for some formatting issues

### Formatting (`biome format`)

- Focuses purely on code style
- Handles indentation, spacing, line breaks, etc.
- Does not check for code quality issues

## Configuration

Biome is configured in the `biome.json` file at the root of the project. This configuration applies to all packages in the monorepo.

## Pre-commit Hooks

This project uses Husky to run linting and formatting checks before commits. This ensures that all code committed to the repository meets the project's standards.

## CI/CD Integration

The `check` command is used in CI/CD pipelines to verify that code meets the project's standards without modifying it.
