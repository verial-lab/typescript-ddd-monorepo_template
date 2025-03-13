import { createTsupConfig } from '../../ws_tooling/tsup.config';

export default createTsupConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  noExternal: ['@monorepo/logger'],
});
