# ADR 007: Colocated .gitignore Files for Enhanced Modularity

## Status

Accepted

## Context

In a monorepo structure with multiple workspaces and specialized directories, managing ignored files through a single root `.gitignore` file can become:

- Hard to maintain
- Difficult to understand which ignores apply to which parts of the codebase
- Challenging when moving or extracting workspaces
- Less modular and more coupled

## Decision

We will adopt a pattern of colocating `.gitignore` files in directories where specific ignore patterns are needed, in addition to the root `.gitignore` file.

Examples include:

- Test output directories (e.g., `test-results/`)
- Build output directories
- Cache directories
- Workspace-specific temporary files

## Consequences

### Positive

- Better modularity: Each directory contains its own ignore rules
- Improved maintainability: Rules are closer to where they apply
- Enhanced portability: When moving workspaces, their ignore rules move with them
- Clear context: Developers can easily understand which files are ignored and why
- Easier workspace extraction: If a workspace needs to be moved to its own repo, its ignore rules are already properly scoped

### Negative

- More files to maintain across the codebase
- Need to ensure consistency between different `.gitignore` files
- Developers need to be aware of multiple ignore file locations

## Implementation Notes

- Use `.gitignore` files in specific directories for patterns that only apply to that directory
- Keep the root `.gitignore` for global patterns
- Include `.gitkeep` files in empty directories that need to be tracked
- Document the pattern in workspace templates and contribution guidelines
