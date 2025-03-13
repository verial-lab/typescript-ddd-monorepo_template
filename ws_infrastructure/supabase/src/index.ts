/**
 * Supabase client exports
 * This file only exports from other files as per style guide
 */

// Export the Supabase client instance
export { supabase } from './SupabaseClient';

// Export types from supabase-js for convenience
export type { SupabaseClient } from '@supabase/supabase-js';

// Re-export commonly used types and utilities
export * from '@supabase/supabase-js';
