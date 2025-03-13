# ADR 008: Version Control and Commit Strategy

## Status

Accepted

## Context

Initially, the project used Changesets for version management and release notes generation. While Changesets provides a robust way to manage versions in a monorepo, it has some limitations:

- Requires manual entry of change descriptions
- Complex workflow for automated environments
- Additional cognitive load for developers to maintain .changeset files
- Challenging to integrate with AI-assisted workflows

## Decision

We will:

1. Remove Changesets in favor of a simpler, more automated approach
2. Enforce clear commit messages using commitlint with conventional commits
3. Manage versioning manually but systematically using semantic versioning

### Commit Message Convention

We will strictly follow the Conventional Commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:

- feat: New feature (minor version)
- fix: Bug fix (patch version)
- docs: Documentation only changes
- style: Changes that don't affect the meaning of the code
- refactor: Code change that neither fixes a bug nor adds a feature
- perf: Code change that improves performance
- test: Adding missing tests or correcting existing tests
- build: Changes that affect the build system or external dependencies
- ci: Changes to our CI configuration files and scripts
- chore: Other changes that don't modify src or test files

Scopes:

- Workspace names (e.g., ui, api, auth)
- Core systems (e.g., build, test, deps)
- Specific features when relevant

### Version Management

- Versions will follow semantic versioning (MAJOR.MINOR.PATCH)
- Version bumps will be determined by analyzing commit messages since the last release
- Major version changes require explicit decision and documentation
- Minor version increments on new features (feat)
- Patch version increments on bug fixes (fix)

## Consequences

### Positive

- Clearer, more structured commit history
- Easier automation and CI/CD integration
- Better support for AI-assisted workflows
- Reduced complexity in version management
- More straightforward for developers to follow
- Commit messages directly indicate version impact

### Negative

- Less granular control over version bumps
- Requires stricter commit message discipline
- May need manual intervention for complex version scenarios
- Less detailed per-change documentation compared to Changesets

## Implementation Notes

1. Use commitlint to enforce commit message format
2. Configure husky for pre-commit hooks
3. Document version bump process in CI/CD
4. Maintain a CHANGELOG.md manually or through automated commit parsing
5. Consider implementing automated CHANGELOG generation based on commit messages
