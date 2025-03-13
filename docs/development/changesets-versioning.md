# Changesets and Versioning Guide

This guide explains how to manage package versions and releases in this monorepo using Changesets.

## Overview

This monorepo uses [Changesets](https://github.com/changesets/changesets) for version management and publishing. Changesets provides a way to:

- Track changes across multiple packages
- Automatically determine version bumps
- Generate changelogs
- Handle package publishing

## Configuration

The Changesets configuration is in `.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

Key settings:

- `access: "restricted"` - Packages are private by default
- `updateInternalDependencies: "patch"` - Automatically bump dependent packages
- `commit: false` - Don't automatically create git commits
- `fixed: []` - No packages are forced to share the same version
- `linked: []` - No packages are linked for version bumping

## Working with Changesets

### 1. Creating a Changeset

When you make changes that should be released, create a changeset:

```bash
pnpm changeset
```

This interactive command will:

1. Ask which packages have changed
2. Prompt for the type of change:
   - `major` (breaking changes)
   - `minor` (new features)
   - `patch` (bug fixes)
3. Request a description of the changes

Example workflow:

```bash
# Make your changes
git checkout -b feature/new-component

# Add your changes
git add .

# Create a changeset
pnpm changeset
# Select @repo-packages/ui
# Choose 'minor' for new feature
# Describe: "Added new Button component"

# Commit everything
git add .changeset/*.md
git commit -m "feat: add Button component"
```

### 2. Versioning Packages

When ready to release, update package versions:

```bash
pnpm version-packages
```

This command:

1. Reads all changesets
2. Updates package.json files
3. Creates/updates CHANGELOG.md files
4. Removes the changeset files

### 3. Publishing Packages

To publish the updated packages:

```bash
pnpm release
```

This command:

1. Builds all packages
2. Publishes packages to npm
3. Pushes git tags

## Best Practices

### When to Create Changesets

Create a changeset when you:

- Add new features
- Fix bugs
- Make breaking changes
- Update dependencies that affect functionality

Don't create changesets for:

- Documentation changes
- Internal refactoring that doesn't affect behavior
- Development tooling changes

### Writing Good Changeset Messages

Your changeset message should:

1. Clearly describe what changed
2. Explain why it changed
3. Note any migration steps if needed

Example:

```md
Added new Button component with customizable styles

- Supports primary and secondary variants
- Includes hover and active states
- Follows design system specifications

BREAKING CHANGE: Removed deprecated ButtonBase component
Migration: Replace ButtonBase with new Button component
```

### Managing Dependencies

- Use `workspace:*` for internal dependencies
- Update peer dependencies appropriately with major version bumps
- Consider the impact on dependent packages

### Private Packages

Packages marked as `private: true` in their package.json (like apps) won't be published, but should still:

- Be included in changesets when modified
- Have their versions bumped
- Include changelogs

## Troubleshooting

Common issues and solutions:

1. **Dependency Errors**

   ```bash
   # Refresh dependencies after version changes
   pnpm install
   ```

2. **Publishing Errors**

   ```bash
   # Ensure you're logged into npm
   npm login
   
   # Verify package access
   npm access ls-packages
   ```

3. **Version Conflicts**

   ```bash
   # Reset versions if needed
   pnpm version-packages --reset
   ```

## Further Reading

- [Changesets Documentation](https://github.com/changesets/changesets/tree/main/docs)
- [Semantic Versioning](https://semver.org/)
- [npm Publishing](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
