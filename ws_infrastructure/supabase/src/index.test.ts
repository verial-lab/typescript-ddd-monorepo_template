import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Supabase Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Save original env
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  it('should throw error in non-test environment when config missing', async () => {
    // Set non-test environment
    process.env.NODE_ENV = 'development';
    process.env.SUPABASE_URL = undefined;
    process.env.SUPABASE_KEY = undefined;

    await expect(import('./index')).rejects.toThrow('Missing Supabase configuration');
  });

  it('should use default test values when config missing in test environment', async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.SUPABASE_URL = undefined;
    process.env.SUPABASE_KEY = undefined;

    const { supabase } = await import('./index');
    expect(supabase).toBeDefined();
    expect(typeof supabase.from).toBe('function');
  });

  it('should use provided environment variables when available', async () => {
    // Set test values
    process.env.NODE_ENV = 'test';
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_KEY = 'test-key';

    const { supabase } = await import('./index');
    expect(supabase).toBeDefined();
    expect(typeof supabase.from).toBe('function');
  });
});
