# Architectural Decision Records (ADRs)

This directory contains Architectural Decision Records (ADRs) that document significant architectural decisions made in this project.

## Table of Contents

### Project Structure

- [ADR-004: Monorepo Structure and Workspace Organization](./ADR-004-monorepo-structure-and-workspace-organization.md)
- [ADR-005: Documentation Structure](./ADR-005-documentation-structure.md)
- [ADR-006: Documentation Table of Contents Structure](./ADR-006-documentation-table-of-contents.md)
- [ADR-007: Colocated .gitignore Files for Enhanced Modularity](./ADR-007-colocated-gitignore-files.md)
- [ADR-012: Document Naming Conventions](./ADR-012-document-naming-conventions.md)

### Development Configuration

- [ADR-001: TypeScript Configuration Strategy](./ADR-001-typescript-module-resolution-strategy.md)
- [ADR-002: Code Organization and Style Guide Implementation](./ADR-002-code-organization-and-style-guide.md)
- [ADR-003: Build System Configuration with tsup](./ADR-003-build-system-configuration-with-tsup.md)
- [ADR-008: Version Control and Commit Strategy](./ADR-008-version-control-and-commit-strategy.md)
- [ADR-011: JavaScript Helper Scripts for Cross-Platform Support](./ADR-011-javascript-helper-scripts.md)
- [ADR-013: Monorepo Package Imports Strategy](./ADR-013-monorepo-package-imports.md)

### Architecture Decisions

- [ADR-009: Domain Isolation Principle](./ADR-009-domain-isolation-principle.md)

### Implementation Decisions

*No ADRs available yet*

## Adding New ADRs

When adding a new ADR:

1. Follow the numbering convention: `ADR-###-title-with-hyphens.md`
2. Use the established ADR template:

   ```markdown
   # Title

   ## Status

   Proposed | Accepted | Superseded by [ADR-XXX]

   ## Context

   [Describe the context and problem statement...]

   ## Decision

   [Describe the decision that was made...]

   ## Consequences

   [Describe the resulting context...]
   ```

3. Update this index file to include the new ADR in the appropriate section
4. Adhere to the ADR Maintenance Guidelines:
   - ADRs are immutable once accepted
   - If a decision is revised, create a new ADR that supersedes the old one
   - Update the status of the old ADR to reference the new one
