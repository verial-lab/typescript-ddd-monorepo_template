import type { PathLike } from 'fs';
import { type FileHandle, readFile } from 'fs/promises';
import { glob } from 'glob';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DependencyGraphGenerator } from './index';

// Mock external dependencies
vi.mock('glob');
vi.mock('fs/promises');

describe('DependencyGraphGenerator', () => {
  let generator: DependencyGraphGenerator;

  beforeEach(() => {
    generator = new DependencyGraphGenerator('/test/workspace');
    vi.resetAllMocks();
  });

  it('should generate a Mermaid graph from workspace dependencies', async () => {
    // Mock package.json files
    vi.mocked(glob).mockResolvedValue([
      '/test/workspace/ws_domains/auth/package.json',
      '/test/workspace/ws_infrastructure/hash-service/package.json',
    ]);

    // Mock package.json contents
    vi.mocked(readFile).mockImplementation(async (path: PathLike | FileHandle) => {
      const pathStr = path.toString();
      if (pathStr.includes('auth')) {
        return JSON.stringify({
          name: '@repo-domains/auth',
          dependencies: {
            '@repo-domains/domain-core': 'workspace:*',
            '@repo-infrastructure/hash-service': 'workspace:*',
          },
        });
      }
      return JSON.stringify({
        name: '@repo-infrastructure/hash-service',
        dependencies: {
          '@repo-domains/domain-core': 'workspace:*',
        },
      });
    });

    const graph = await generator.generateGraph();

    // Verify graph structure
    expect(graph).toContain('graph TD;');
    expect(graph).toContain('_repo_domains_auth');
    expect(graph).toContain('_repo_infrastructure_hash_service');
    expect(graph).toContain('_repo_domains_domain_core');
    expect(graph).toContain('classDef domain fill:#f9f'); // Domain style
    expect(graph).toContain('classDef infrastructure fill:#bbf'); // Infrastructure style
    expect(graph).toContain('class _repo_domains_auth domain');
    expect(graph).toContain('class _repo_infrastructure_hash_service infrastructure');
  });

  it('should handle empty workspace', async () => {
    vi.mocked(glob).mockResolvedValue([]);

    const graph = await generator.generateGraph();

    expect(graph).toBe('graph TD;');
  });

  it('should handle packages with no dependencies', async () => {
    vi.mocked(glob).mockResolvedValue(['/test/workspace/ws_domains/core/package.json']);
    vi.mocked(readFile).mockResolvedValue(
      JSON.stringify({
        name: '@repo-domains/core',
      })
    );

    const graph = await generator.generateGraph();

    expect(graph).toContain('_repo_domains_core');
    expect(graph).toContain('classDef domain fill:#f9f'); // Domain style
    expect(graph).toContain('class _repo_domains_core domain');
  });
});
