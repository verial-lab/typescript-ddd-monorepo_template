import { createClient } from '@supabase/supabase-js';

// Environment variables will be provided through the application's configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Only throw in non-test environments
if ((!supabaseUrl || !supabaseKey) && process.env.NODE_ENV !== 'test') {
  throw new Error(
    'Missing Supabase configuration. Please provide SUPABASE_URL and SUPABASE_KEY environment variables.'
  );
}

// In test mode, use dummy values if not provided
const url =
  process.env.NODE_ENV === 'test' ? supabaseUrl || 'http://localhost:54321' : supabaseUrl!;
const key = process.env.NODE_ENV === 'test' ? supabaseKey || 'dummy-key' : supabaseKey!;

export const supabase = createClient(url, key);

// Export types from supabase-js for convenience
export type { SupabaseClient } from '@supabase/supabase-js';

// Re-export commonly used types and utilities
export * from '@supabase/supabase-js';
