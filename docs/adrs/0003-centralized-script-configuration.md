# 3. Centralized Script Configuration

Date: 2024-03-21

## Status

Accepted

## Context

Our monorepo contains multiple validation and utility scripts that enforce various rules and patterns across the codebase. Initially, these scripts had their configurations scattered throughout individual files, making it difficult to:

1. Maintain consistency across different scripts
2. Update rules and patterns in a single place
3. Share common configurations between different tools
4. Track and document configuration changes
5. Ensure all tools follow the same standards

## Decision

We will centralize script configurations in a standardized way:

1. Create a central configuration object in each script that follows a consistent pattern:
```typescript
const CONFIG = {
  // File patterns and rules
  filePatterns: {
    sourceFiles: string[],
    testFiles: string[],
    ignoreFiles: string[],
    // ... other patterns
  },

  // Validation rules
  rules: {
    ruleName: {
      pattern: RegExp | string,
      message: string,
      // ... other rule properties
    }
  },

  // Other configurations specific to the script
  scriptSpecific: {
    // ... script-specific settings
  }
};
```

2. Document each configuration section with clear comments explaining:
   - Purpose of each setting
   - Expected format and values
   - Impact on the script's behavior

3. Extract shared configurations into reusable modules when patterns are used across multiple scripts

## Consequences

### Positive

- Single source of truth for script configurations
- Easier maintenance and updates
- Better visibility of validation rules and patterns
- Simplified onboarding for new developers
- Consistent configuration structure across scripts
- Easier to track changes through version control

### Negative

- Initial effort required to refactor existing scripts
- Need to maintain backward compatibility during migration
- Potential need to coordinate changes across multiple scripts

### Neutral

- Scripts need to be updated to use the new configuration structure
- Documentation needs to be maintained for the configuration format

## Implementation Notes

1. Start with validation scripts as they have the most shared patterns
2. Create a template for new scripts to follow the centralized configuration pattern
3. Consider creating a shared library for common configuration patterns
4. Add validation for the configuration format itself

## Related

- [ADR-0001] Initial Monorepo Structure
- [ADR-0002] Domain-Driven Design Implementation 