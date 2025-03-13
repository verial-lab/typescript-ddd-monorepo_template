# Architectural Decision Records (ADRs)

This directory contains Architectural Decision Records (ADRs) that document significant architectural decisions made in this project.

## Table of Contents

### Project Structure

- [ADR-004: Monorepo Structure and Workspace Organization](./004-monorepo-structure-and-workspace-organization.md)
- [ADR-005: Documentation Structure](./005-documentation-structure.md)
- [ADR-006: Documentation Table of Contents Structure](./006-documentation-table-of-contents.md)
- [ADR-007: Colocated .gitignore Files for Enhanced Modularity](./007-colocated-gitignore-files.md)

### Development Configuration

- [ADR-001: TypeScript Module Resolution Strategy](./001-typescript-module-resolution-strategy.md)
- [ADR-002: Code Organization and Style Guide Implementation](./002-code-organization-and-style-guide.md)
- [ADR-003: Build System Configuration with tsup](./003-build-system-configuration-with-tsup.md)
- [ADR-008: Version Control and Commit Strategy](./008-version-control-and-commit-strategy.md)

### Architecture Decisions

*No ADRs available yet*

### Implementation Decisions

*No ADRs available yet*

## Adding New ADRs

When adding a new ADR:

1. Follow the numbering convention: `NNN-title-with-hyphens.md`
2. Use the established ADR template (see existing ADRs for reference)
3. Update this index file to include the new ADR in the appropriate section
4. Adhere to the ADR Maintenance Guidelines:
   - ADRs are immutable once accepted
   - If a decision is revised, create a new ADR that supersedes the old one
   - Update the status of the old ADR to reference the new one
