import { describe, it, expect } from 'vitest';
import { validateEnv } from '../config/env';

describe('Environment Validation Architecture', () => {
  it('allows development mode with safe mock fallbacks when Supabase keys are unset', () => {
    const config = validateEnv({
      VITE_APP_ENV: 'development',
      VITE_USE_MOCK_SERVICES: 'true',
    });

    expect(config.appEnv).toBe('development');
    expect(config.useMockServices).toBe(true);
    expect(config.isSupabaseConfigured).toBe(false);
  });

  it('strictly throws an error in production if Supabase keys are missing and mock mode is not forced', () => {
    expect(() =>
      validateEnv({
        VITE_APP_ENV: 'production',
        VITE_USE_MOCK_SERVICES: 'false',
        VITE_SUPABASE_URL: '',
        VITE_SUPABASE_PUBLISHABLE_KEY: '',
      })
    ).toThrowError(/Missing required production environment variables/);
  });

  it('correctly parses and validates valid production configuration', () => {
    const config = validateEnv({
      VITE_APP_ENV: 'production',
      VITE_USE_MOCK_SERVICES: 'false',
      VITE_SUPABASE_URL: 'https://test-prod.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-publishable-key',
    });

    expect(config.appEnv).toBe('production');
    expect(config.useMockServices).toBe(false);
    expect(config.isSupabaseConfigured).toBe(true);
    expect(config.supabaseUrl).toBe('https://test-prod.supabase.co');
    expect(config.supabasePublishableKey).toBe('test-publishable-key');
  });
});
