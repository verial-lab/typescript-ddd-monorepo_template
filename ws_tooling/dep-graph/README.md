# Dependency Graph Generator

A tool to visualize dependencies between packages in your monorepo using Mermaid graphs.

## Features

- Automatically detects workspace packages in `ws_*` directories
- Generates a Mermaid graph showing package dependencies
- Color codes packages by type:
  - 🟦 Blue: Infrastructure packages (`@repo-infrastructure/*`)
  - 🟪 Magenta: Domain packages (`@repo-domains/*`)
  - 🔴 Red: Shared packages (`@repo-packages/*`)
  - 🟩 Green: Applications (`@repo-apps/*`)
  - ⬜ White: Tooling packages (`@repo-tooling/*`)

## Usage

Run from the root of your monorepo:

```bash
pnpm graph
```

This will:
1. Generate a Mermaid graph of your workspace dependencies
2. Output the graph in Mermaid format
3. Provide a direct link to view the graph in Mermaid Live Editor

## Viewing the Graph

You can view the generated graph in several ways:

1. **VS Code**: Copy the Mermaid code into a markdown file and view it using a Mermaid extension
2. **Mermaid Live Editor**: Use the provided direct link or visit https://mermaid.live
3. **Direct Link**: Click the generated link in the output for a pre-loaded graph

## Graph Structure

The graph shows:
- Each package as a node with its full name
- Dependencies between packages as arrows
- Color-coded nodes based on package type
- All workspace dependencies (dependencies starting with `@repo-`)

## Development

The tool is built using TypeScript and uses:
- `glob` for finding package.json files
- `fs/promises` for reading file contents
- Mermaid syntax for graph generation

To run tests:
```bash
pnpm test
``` 