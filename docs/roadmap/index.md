# Roadmap

This document outlines the planned features, improvements, and initiatives for this project.

## Infrastructure

| Number | Title | Status | Priority | Labels |
|--------|--------|--------|----------|---------|
| ROAD-I001 | [Domain Core and Event Bus Implementation](./road-I001-domain-core-and-event-bus.md) | 📋 Planned | 🔥 Critical | infrastructure, cross-cutting |
| ROAD-I002 | [Reference Modules Integration and Enhancement](./road-I002-reference-modules-integration.md) | 📋 Planned | 🚀 High | domain-evolution, architecture, infrastructure |
| ROAD-I003 | [CI/CD Pipeline Implementation](./road-I003-ci-cd-pipeline.md) | 📋 Planned | 🔥 Critical | infrastructure, automation |

## Tooling

| Number | Title | Status | Priority | Labels |
|--------|--------|--------|----------|---------|
| ROAD-T001 | [Handlebars Template Generation System](./road-T001-handlebars-template-system.md) | 📋 Planned | 🚀 High | tooling, automation |
| ROAD-T002 | [Development Environment Automation](./road-T002-development-environment-automation.md) | 📋 Planned | 🔥 Critical | developer-experience, infrastructure, automation |

## Adding New Roadmap Items

When adding a new roadmap item:

1. Create a new file in the appropriate category using the naming convention:
   - Infrastructure: `road-I###-title-with-hyphens.md`
   - Tooling: `road-T###-title-with-hyphens.md`
   - Features: `road-F###-title-with-hyphens.md`
   - Documentation: `road-D###-title-with-hyphens.md`

2. Use the established roadmap item template:

   ```markdown
   # Title

   **Status**: 📋 Planned | 🚧 In Progress | ✅ Completed
   **Priority**: 🔥 Critical | 🚀 High | 📈 Medium | 📉 Low
   **Labels**: `category1`, `category2`

   ## Overview
   ...
   ```

3. Update this index file to include the new item in the appropriate section

4. Follow the roadmap item guidelines:
   - Keep items focused and well-scoped
   - Include clear acceptance criteria
   - Link to related items and dependencies
   - Update status as progress is made
