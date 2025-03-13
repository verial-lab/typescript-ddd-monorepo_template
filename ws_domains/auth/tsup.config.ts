import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  sourcemap: true,
  clean: true,
  minify: false,
  target: 'es2020',
  tsconfig: 'tsconfig.json',
  bundle: true,
  splitting: false,
  treeshake: true,
  external: ['@repo-packages/logger'],
});
