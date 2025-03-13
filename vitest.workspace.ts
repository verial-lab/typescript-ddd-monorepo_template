import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  './ws_infrastructure/supabase/vitest.config.ts',
  './ws_apps/ui-example/vite.config.ts',
  './ws_domains/auth/vitest.config.ts',
  './ws_apps/api-express/vitest.config.ts',
  './ws_packages/logger/vitest.config.ts',
  './ws_packages/domain-core/vitest.config.ts',
  './ws_packages/ui/vitest.config.ts',
]);
