import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.js'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
