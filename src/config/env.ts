/**
 * Waste2Value — Validated Environment Configuration
 * Strictly validates environment variables.
 * Production must fail clearly if required infrastructure is missing.
 */

export interface AppEnvConfig {
  appName: string;
  appTagline: string;
  appEnv: 'development' | 'production' | 'test';
  supabaseUrl: string;
  supabasePublishableKey: string;
  isSupabaseConfigured: boolean;
  useMockServices: boolean;
  apiTimeoutMs: number;
  aiEndpoints: {
    vision: string;
    value: string;
    matching: string;
  };
  map: {
    provider: string;
    defaultLat: number;
    defaultLng: number;
  };
  features: {
    enableDemoDataBadges: boolean;
    enableCameraScan: boolean;
  };
}

export function validateEnv(rawEnv: Record<string, string | undefined>): AppEnvConfig {
  const appEnv = (rawEnv.VITE_APP_ENV as AppEnvConfig['appEnv']) || 'development';
  const supabaseUrl = rawEnv.VITE_SUPABASE_URL?.trim() || '';
  const supabasePublishableKey = rawEnv.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || '';
  const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

  // In production, when not explicitly forced into mock mode, Supabase credentials are strictly required
  const explicitlyUseMock = rawEnv.VITE_USE_MOCK_SERVICES === 'true';

  if (appEnv === 'production' && !explicitlyUseMock) {
    const missing: string[] = [];
    if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
    if (!supabasePublishableKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');

    if (missing.length > 0) {
      throw new Error(
        `[Waste2Value Configuration Error] Missing required production environment variables: ${missing.join(
          ', '
        )}. Application cannot start in production without valid Supabase configuration.`
      );
    }
  }

  // Determine active mock mode:
  // - If explicitly set to true -> true
  // - If Supabase credentials are not configured in dev/test -> fallback to mock mode with warning
  // - If Supabase credentials ARE configured and VITE_USE_MOCK_SERVICES is 'false' -> false (use real Supabase)
  let useMockServices = explicitlyUseMock;
  if (!explicitlyUseMock && !isSupabaseConfigured) {
    if (appEnv !== 'production') {
      console.warn(
        '[Waste2Value Config] Supabase credentials (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY) are not set. Operating in mock service mode.'
      );
    }
    useMockServices = true;
  } else if (rawEnv.VITE_USE_MOCK_SERVICES === 'false' && isSupabaseConfigured) {
    useMockServices = false;
  }

  return {
    appName: rawEnv.VITE_APP_NAME || 'Waste2Value',
    appTagline: rawEnv.VITE_APP_TAGLINE || "Don't Throw It Away. Find Its Next Value.",
    appEnv,
    supabaseUrl,
    supabasePublishableKey,
    isSupabaseConfigured,
    useMockServices,
    apiTimeoutMs: Number(rawEnv.VITE_API_TIMEOUT_MS) || 15000,
    aiEndpoints: {
      vision: rawEnv.VITE_AI_VISION_ENDPOINT || '/functions/v1/vision-identify',
      value: rawEnv.VITE_AI_VALUE_ENDPOINT || '/functions/v1/value-recommend',
      matching: rawEnv.VITE_AI_MATCHING_ENDPOINT || '/functions/v1/match-receivers',
    },
    map: {
      provider: rawEnv.VITE_MAP_PROVIDER || 'open-street-map',
      defaultLat: Number(rawEnv.VITE_MAP_DEFAULT_LAT) || 40.7128,
      defaultLng: Number(rawEnv.VITE_MAP_DEFAULT_LNG) || -74.0060,
    },
    features: {
      enableDemoDataBadges: rawEnv.VITE_ENABLE_DEMO_DATA_BADGES !== 'false',
      enableCameraScan: rawEnv.VITE_ENABLE_CAMERA_SCAN !== 'false',
    },
  };
}

// Export singleton validated configuration for application runtime
export const env = validateEnv(import.meta.env as unknown as Record<string, string | undefined>);
