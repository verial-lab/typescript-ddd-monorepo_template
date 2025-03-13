import { join, relative } from 'path';
import { readFile } from 'fs/promises';
import { glob } from 'glob';

interface PackageJson {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface DependencyNode {
  name: string;
  dependencies: string[];
  type: 'domain' | 'infrastructure' | 'application' | 'package' | 'tooling';
}

export class DependencyGraphGenerator {
  constructor(private readonly workspaceRoot: string) {}

  private getPackageType(name: string): DependencyNode['type'] {
    if (name.includes('domains')) return 'domain';
    if (name.includes('infrastructure')) return 'infrastructure';
    if (name.includes('apps')) return 'application';
    if (name.includes('packages')) return 'package';
    return 'tooling';
  }

  private async readPackageJson(path: string): Promise<PackageJson> {
    const content = await readFile(path, 'utf-8');
    return JSON.parse(content);
  }

  async generateGraph(): Promise<string> {
    // Find all package.json files in ws_* directories
    const packageFiles = await glob('ws_*/*/package.json', {
      cwd: this.workspaceRoot,
      absolute: true,
    });

    const nodes: DependencyNode[] = [];

    // Read each package.json and build dependency graph
    for (const file of packageFiles) {
      const pkg = await this.readPackageJson(file);
      const deps = new Set<string>();

      // Collect all dependencies
      for (const dep of Object.keys(pkg.dependencies || {})) {
        deps.add(dep);
      }
      for (const dep of Object.keys(pkg.devDependencies || {})) {
        deps.add(dep);
      }
      for (const dep of Object.keys(pkg.peerDependencies || {})) {
        deps.add(dep);
      }

      // Only include workspace dependencies
      const workspaceDeps = Array.from(deps).filter((dep) => dep.startsWith('@repo-'));

      nodes.push({
        name: pkg.name,
        dependencies: workspaceDeps,
        type: this.getPackageType(pkg.name),
      });
    }

    // Generate Mermaid graph
    const mermaid = ['graph TD;'];

    // Add nodes
    for (const { name } of nodes) {
      mermaid.push(`  ${this.sanitizeId(name)}["${name}"]`);
    }

    // Add edges
    for (const { name, dependencies } of nodes) {
      for (const dep of dependencies) {
        mermaid.push(`  ${this.sanitizeId(dep)} --> ${this.sanitizeId(name)}`);
      }
    }

    // Add styles
    for (const { name, type } of nodes) {
      mermaid.push(
        `  classDef ${type} fill:${this.getNodeColor(type)},stroke:#333,stroke-width:2px`
      );
      mermaid.push(`  class ${this.sanitizeId(name)} ${type}`);
    }

    return mermaid.join('\n');
  }

  private sanitizeId(name: string): string {
    return name.replace(/[^a-zA-Z0-9]/g, '_');
  }

  private getNodeColor(type: DependencyNode['type']): string {
    switch (type) {
      case 'domain':
        return '#f9f';
      case 'infrastructure':
        return '#bbf';
      case 'application':
        return '#bfb';
      case 'package':
        return '#fbb';
      case 'tooling':
        return '#fff';
    }
  }
}

// CLI interface
if (require.main === module) {
  const workspaceRoot = process.cwd();
  const generator = new DependencyGraphGenerator(workspaceRoot);

  generator
    .generateGraph()
    .then((graph) => console.log(graph))
    .catch((error) => {
      console.error('Error generating dependency graph:', error);
      process.exit(1);
    });
}
