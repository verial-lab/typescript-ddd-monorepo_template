#!/usr/bin/env node

import { DependencyGraphGenerator } from './index';

async function main() {
  try {
    const workspaceRoot = process.cwd();
    const generator = new DependencyGraphGenerator(workspaceRoot);
    const graph = await generator.generateGraph();

    // Create encoded URL for Mermaid Live Editor
    const mermaidDefinition = graph; // The graph already includes "graph TD;"
    const mermaidUrl = `https://mermaid.live/edit#pako:${Buffer.from(mermaidDefinition).toString('base64')}`;

    console.log('\nDependency Graph (Mermaid format):\n');
    console.log('```mermaid');
    console.log(graph);
    console.log('```\n');
    console.log('You can view this graph by:');
    console.log(
      '1. Copy-pasting it into a markdown file and viewing it in VS Code with Mermaid extension'
    );
    console.log('2. Using the Mermaid Live Editor: https://mermaid.live');
    console.log(`3. Click this direct link: ${mermaidUrl}\n`);
  } catch (error) {
    console.error('Error generating dependency graph:', error);
    process.exit(1);
  }
}

main();
