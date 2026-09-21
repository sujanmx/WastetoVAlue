/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_TAGLINE?: string;
  readonly VITE_APP_ENV?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_USE_MOCK_SERVICES?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
  readonly VITE_AI_VISION_ENDPOINT?: string;
  readonly VITE_AI_VALUE_ENDPOINT?: string;
  readonly VITE_AI_MATCHING_ENDPOINT?: string;
  readonly VITE_MAP_PROVIDER?: string;
  readonly VITE_MAP_DEFAULT_LAT?: string;
  readonly VITE_MAP_DEFAULT_LNG?: string;
  readonly VITE_ENABLE_DEMO_DATA_BADGES?: string;
  readonly VITE_ENABLE_CAMERA_SCAN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
