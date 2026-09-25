/**
 * CORS configuration for Supabase Edge Functions.
 * Validates request origin against trusted frontends while supporting
 * local development and Vercel preview/production deployments.
 */
export function getCorsHeaders(req?: Request): Record<string, string> {
  const origin = req?.headers.get('Origin');
  const defaultOrigin = 'https://vite-flame-gamma.vercel.app';

  let allowedOrigin = defaultOrigin;
  if (origin) {
    const isLocalhost =
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:');
    const isVercel =
      origin.endsWith('.vercel.app') ||
      origin === defaultOrigin;
    
    // Check if Deno runtime env has custom override
    const envGetter = typeof Deno !== 'undefined' ? (k: string) => Deno.env.get(k) : () => undefined;
    const customAllowed = envGetter('ALLOWED_ORIGIN');

    if (isLocalhost || isVercel || (customAllowed && origin === customAllowed)) {
      allowedOrigin = origin;
    }
  }

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: getCorsHeaders(req),
    });
  }
  return null;
}
