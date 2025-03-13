import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: false,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  minify: false,
  sourcemap: true,
  target: 'es2020',
});
