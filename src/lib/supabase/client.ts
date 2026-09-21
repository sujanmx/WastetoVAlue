import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../../config/env';
import type { Database } from '../../types/database';

let supabaseClientInstance: SupabaseClient<Database> | null = null;

/**
 * Returns the singleton Supabase browser client configured with
 * VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseClientInstance) {
    return supabaseClientInstance;
  }

  if (!env.isSupabaseConfigured) {
    // When credentials are not set (e.g. mock development), creating a client
    // with dummy URL allows imports to resolve without crashing the bundle,
    // while real service calls are intercepted by the mock service layer.
    supabaseClientInstance = createClient<Database>(
      'https://placeholder-project.supabase.co',
      'placeholder-anon-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
    return supabaseClientInstance;
  }

  supabaseClientInstance = createClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );

  return supabaseClientInstance;
}

export const supabase = getSupabaseClient();
