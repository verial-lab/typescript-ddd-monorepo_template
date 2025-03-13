# ADR-012: Document Naming Conventions

## Status

Accepted

## Context

Our repository contains different types of sequential documents, particularly:

- Architectural Decision Records (ADRs)
- Roadmap Items
- (Potentially other numbered documents in the future)

Currently, both ADRs and roadmap items use a similar numerical scheme (e.g., "001", "002"), which can lead to:

- Confusion when referencing document numbers
- Ambiguity in discussions and documentation
- Potential conflicts in document tracking
- Unclear distinction between document types

## Decision

We will adopt explicit prefixes for different types of numbered documents:

1. **ADRs**: Keep the existing "ADR-" prefix

   ```
   ADR-001: TypeScript Module Resolution Strategy
   ADR-002: Code Organization and Style Guide
   ```

2. **Roadmap Items**: Use "ROAD-" prefix

   ```
   ROAD-001: CI/CD Pipeline Improvements
   ROAD-002: Database Integration
   ```

3. **File Naming Pattern**:

   ```
   {type}-{number}-{kebab-case-title}.md
   
   Examples:
   adr-001-typescript-module-resolution.md
   road-001-ci-cd-pipeline-improvements.md
   ```

4. **Reference Pattern** (in documentation):

   ```markdown
   [ADR-001: Title](./adr-001-title.md)
   [ROAD-001: Title](./road-001-title.md)
   ```

## Implementation

1. **ADRs**: No change needed (keep current format)

   ```
   docs/adrs/adr-001-typescript-module-resolution.md
   ```

2. **Roadmap Items**: Rename existing and update format

   ```
   docs/roadmap/items/road-001-ci-cd-pipeline.md
   ```

3. **Directory Structure**:

   ```
   docs/
   ├── adrs/
   │   ├── index.md
   │   ├── adr-001-typescript-module-resolution.md
   │   └── ...
   └── roadmap/
       ├── index.md
       ├── items/
       │   ├── road-001-ci-cd-pipeline.md
       │   └── ...
       └── categories/
           └── index.md
   ```

## Consequences

### Positive

- Clear distinction between document types
- No ambiguity when referencing document numbers
- Easier to search and filter by document type
- Better organization in IDEs and file systems
- Clearer communication in issues and pull requests
- More intuitive prefix for roadmap items

### Negative

- Need to rename existing roadmap documents
- Slightly longer file names
- Need to update existing references

### Neutral

- Need to document the convention
- Need to enforce in code reviews
- May need to add linting rules

## Migration Plan

1. Create script to rename roadmap items:

   ```javascript
   // ws_tooling/scripts/maintenance/rename-roadmap-items.js
   #!/usr/bin/env node
   const fs = require('fs');
   const path = require('path');
   
   // Rename files and update references
   ```

2. Update all internal references:
   - Documentation links
   - Issue references
   - Pull request descriptions

3. Update templates:
   - ADR template
   - Roadmap item template
   - Contributing guidelines

## Related

- [ADR-005: Documentation Structure](./005-documentation-structure.md)
- [ADR-006: Documentation Table of Contents Structure](./006-documentation-table-of-contents.md)
