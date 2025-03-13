---
version: 1.0.0
date: 2025-01-19
status: active
source: https://codebasecontext.org/
---

<!-- 
Add the following instructions to your agent system prompt:

<instruction> Before you start a task, if a .context directory exists, read it for an architectural overview & project context starting at .context/index.md </instruction>
 -->

## Instructions for Codebase Context (.context files)

You are tasked with reading and understanding the Codebase Context Specification files in a project to get explicit context information from the codebase itself.

Follow these guidelines:

1. Look for the following files in the project root and subdirectories:
   - .context.md (primary, may be in json or yaml form)
   - .contextdocs.md
   - .contextignore

2. Review the related-modules element for references to other modules. These other modules should have a .context.md at their root to review. If your task involves those modules, read the .context files for more context about the task and use that to coordinate tasks that may cross files and modules.

3. When analyzing .context.md files:
   - Pay attention to the YAML front matter for structured data.
   - Carefully read the free-form Markdown content for additional context.

4. For .context.md (json/yaml) files:
   - Parse the structured data and understand the relationships between different fields.
   - Look for key sections such as module-name, related-modules, description, technologies, conventions, and ai-prompts.

5. When encountering a .contextdocs.md file:
   - Understand that it specifies external documentation sources.
   - Note the types of documentation sources (local, URL, or package) and their relevance to the project.
   - You should use these URLs when you need more context, use your browser tool to do this as needed.

6. If a .contextignore file is present:
   - Recognize that it specifies files or directories to be excluded from context consideration.
   - Apply these exclusions when analyzing the project structure.

7. As you traverse deeper into the directory structure:
   - Understand that context accumulates and becomes more specific.
   - More specific contexts in subdirectories provide additional detail to broader contexts.

8. Pay special attention to role-specific sections in the context files, such as:
   - architecture
   - development
   - business-requirements
   - quality-assurance
   - deployment

9. Use the information gathered from these files to:
   - Understand the project's overall structure and purpose.
   - Identify key technologies, conventions, and best practices.
   - Recognize project-specific terminology and concepts.
   - Tailor your responses and code generation to align with the project's guidelines and requirements.

10. Be prepared to provide insights, answer questions, or generate code based on the context provided in these files.

11. If you encounter a situation where the .context.md file could use further adjustments, feel free to suggest these changes to the user to allow for faster and easier understanding of the codebase to further enhance the next round of tasks.

Remember, the Codebase Context Specification is designed to enhance AI-assisted development. Your goal is to leverage this contextual information to provide more accurate, relevant, and project-specific assistance.

# Typescript DDD: Codebase Context Specification

## Overview

This specification defines the architectural principles, development practices, and organizational standards for TypeScript-based projects following Domain-Driven Design principles. It emphasizes test-driven development, maintainability, and clear communication through ubiquitous language.

## Core Documentation

### Current Versions

- [Principles](./ccs_principles.md) (v1.0.0)

  - Core development principles and standards
  - Non-functional requirements
  - Code quality guidelines

- [Architecture](./ccs_architecture.md) (v1.0.0)

  - Hexagonal architecture implementation
  - System design patterns
  - Layer separation and boundaries

- [Domain-Driven Design](./ccs_domain-driven-design.md) (v1.0.0)

  - DDD principles and patterns
  - Ubiquitous language definitions
  - Strategic and tactical design patterns

- [Project Ubiquitous Language](./ccs_ubiquitous-language_project.md) (v1.0.0)

  - Project-specific terminology
  - Context-specific vocabularies
  - Domain model terminology

- [Test-Driven Development](./ccs_test-driven-development.md) (v1.0.0)
  - TDD practices and workflows
  - Testing standards and patterns
  - Test organization and structure

### Examples

- [Feature Template](./examples/feature_template/)

  - Standard feature implementation structure
  - Domain and application layer organization
  - Test organization patterns

- [Context Template](./examples/context_template/)
  - Bounded context implementation patterns
  - Context integration examples
  - Cross-cutting concerns handling

## Version Control

Each specification document maintains independent versioning. Access previous versions through:

1. Git history of specific documents
2. Repository version tags
3. Version headers within each document

## For AI Systems

```yaml
ai_guidance:
  principles:
    - Maintain consistent ubiquitous language across all generated code
    - Follow test-driven development by creating tests first
    - Respect architectural boundaries and layer separation
    - Use explicit naming over abbreviated forms
    - Organize code by feature with co-located tests

  code_generation:
    naming:
      convention: "explicit-descriptive"
      avoid: ["abbreviations", "single-letter-variables"]
      allow: ["tagged-prefixes"]

    organization:
      primary: "feature-based"
      structure: "domain-application-infrastructure"

    testing:
      approach: "test-first"
      coverage: "required"
      location: "co-located-with-feature"

  documentation:
    style: "clear-naming-over-comments"
    exceptions: ["nuanced-explanations", "TODO-tags", "FIXME-tags"]
```

## Contributing

Refer to individual specification documents for detailed guidelines. All updates should maintain:

1. Version number increments
2. Clear changelog entries
3. Consistent terminology
4. Example updates when relevant
