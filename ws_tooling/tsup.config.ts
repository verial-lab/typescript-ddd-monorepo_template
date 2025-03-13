import { type Options as TsupOptions, defineConfig } from 'tsup';

/**
 * Default tsup configuration for library packages
 */
export function createTsupConfig(options: TsupOptions = {}): TsupOptions {
  return {
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    minify: false,
    sourcemap: true,
    target: 'es2020',
    ...options,
  };
}

export default createTsupConfig;
