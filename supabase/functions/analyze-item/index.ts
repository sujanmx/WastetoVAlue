import { createClient } from 'npm:@supabase/supabase-js@2.116.0';
import { handleCors, getCorsHeaders } from '../_shared/cors.ts';
import { AnalyzeItemRequest, NormalizedAiResponse, EdgeFunctionErrorResponse } from '../_shared/types.ts';
import {
  ValidationError,
  validateImageInput,
  validateAndNormalizeGeminiOutput,
} from '../_shared/validators.ts';
import { callGeminiVision } from '../_shared/geminiClient.ts';

// In-memory sliding window for rapid-burst abuse mitigation
const userRequestLog = new Map<string, number[]>();
const BURST_LIMIT = 5;
const BURST_WINDOW_MS = 10000; // 10 seconds

function checkBurstRateLimit(userId: string): boolean {
  const now = Date.now();
  const timestamps = (userRequestLog.get(userId) || []).filter((t) => now - t < BURST_WINDOW_MS);
  if (timestamps.length >= BURST_LIMIT) {
    userRequestLog.set(userId, timestamps);
    return false;
  }
  timestamps.push(now);
  userRequestLog.set(userId, timestamps);
  return true;
}

function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: string,
  req?: Request
): Response {
  const body: EdgeFunctionErrorResponse = {
    error: { code, message, details },
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  // 1. CORS Preflight
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse('METHOD_NOT_ALLOWED', 'Only POST requests are supported.', 405, undefined, req);
  }

  const startTime = Date.now();

  try {
    // 2. Authenticate Caller
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AI_AUTH_REQUIRED', 'Missing or invalid Authorization header.', 401, undefined, req);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[analyze-item] Supabase credentials missing in Edge runtime.');
      return errorResponse('AI_PROVIDER_UNAVAILABLE', 'Server configuration error.', 503, undefined, req);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse(
        'AI_AUTH_REQUIRED',
        'Authentication session is invalid or expired. Please sign in again.',
        401,
        undefined,
        req
      );
    }

    // Rate Limiting Layer 1: Rapid-burst in-memory sliding window (max 5 requests per 10s per user)
    if (!checkBurstRateLimit(user.id)) {
      return errorResponse(
        'AI_RATE_LIMITED',
        'Too many rapid requests. Please wait a few seconds before submitting again.',
        429,
        undefined,
        req
      );
    }

    // Rate Limiting Layer 2: Database quota (max 15 analyses per minute per user)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from('ai_assessments')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', oneMinuteAgo);

    if (!countError && typeof count === 'number' && count >= 15) {
      return errorResponse(
        'AI_RATE_LIMITED',
        'Analysis rate limit reached (maximum 15 analyses per minute). Please wait a moment before trying again.',
        429,
        undefined,
        req
      );
    }

    // 3. Parse & Validate Request Body
    let body: AnalyzeItemRequest;
    try {
      body = await req.json();
    } catch {
      return errorResponse('AI_INVALID_IMAGE', 'Malformed JSON request body.', 400, undefined, req);
    }

    // 4. Verify Item Ownership (if itemId passed)
    if (body.itemId) {
      const { data: item, error: itemError } = await supabase
        .from('items')
        .select('id, user_id')
        .eq('id', body.itemId)
        .maybeSingle();

      if (itemError) {
        return errorResponse('DATABASE_ERROR', 'Failed to verify item record.', 500, undefined, req);
      }
      if (!item) {
        return errorResponse('NOT_FOUND', 'Specified item was not found.', 404, undefined, req);
      }
      if (item.user_id !== user.id) {
        return errorResponse('AI_FORBIDDEN', 'You do not have permission to analyze this item.', 403, undefined, req);
      }

      // Idempotency: check if assessment was created within last 2 minutes
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      const { data: recentAssessment } = await supabase
        .from('ai_assessments')
        .select('*')
        .eq('item_id', body.itemId)
        .gte('created_at', twoMinutesAgo)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (recentAssessment) {
        // Return existing assessment to prevent duplicate billing & execution
        const responseData: NormalizedAiResponse = {
          vision: {
            detectedObject: recentAssessment.detected_object,
            category: recentAssessment.category as unknown as ItemCategory,
            material: recentAssessment.material,
            condition: recentAssessment.condition as unknown as ItemCondition,
            confidence: recentAssessment.confidence as unknown as AiConfidence,
            confidenceScore: Number(recentAssessment.confidence_score) || 0.85,
            qualityIssues: recentAssessment.quality_issues || undefined,
            tags: recentAssessment.tags || [],
          },
          value: {
            recommendedPath:
              ((recentAssessment.paths_evaluation as Record<string, unknown>)?.recommended_path as CircularValuePath) ||
              'reuse',
            summaryReasoning: recentAssessment.summary_reasoning || '',
            paths: recentAssessment.paths_evaluation as unknown as ValueAiResult['paths'],
          },
          assessmentId: recentAssessment.id,
          executionTimeMs: Date.now() - startTime,
          modelUsed: 'cached-assessment',
        };

        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }
    }

    // 5. Validate Image Payload
    const { cleanBase64, validMimeType } = validateImageInput(body.imageBase64, body.mimeType);

    // 6. Invoke Gemini Multimodal Inference
    const { rawJson, modelUsed, durationMs } = await callGeminiVision(cleanBase64, validMimeType);

    // 7. Validate and Normalize Output against Domain Constraints
    const { vision, value } = validateAndNormalizeGeminiOutput(rawJson);

    // 8. Persist AI Assessment Audit Record
    let assessmentId: string | undefined;
    const { data: inserted, error: insertError } = await supabase
      .from('ai_assessments')
      .insert({
        user_id: user.id,
        item_id: body.itemId || null,
        detected_object: vision.detectedObject,
        category: vision.category,
        material: vision.material,
        condition: vision.condition,
        confidence: vision.confidence,
        confidence_score: vision.confidenceScore,
        quality_issues: vision.qualityIssues || [],
        tags: vision.tags,
        summary_reasoning: value.summaryReasoning,
        paths_evaluation: value.paths,
      })
      .select('id')
      .single();

    if (insertError) {
      console.warn('[analyze-item] Assessment audit record insert notice:', insertError.message);
    } else {
      assessmentId = inserted?.id;
    }

    // 9. Return Normalized Structured Response
    const responsePayload: NormalizedAiResponse = {
      vision,
      value,
      assessmentId,
      executionTimeMs: durationMs,
      modelUsed,
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      return errorResponse(err.code, err.message, err.status, undefined, req);
    }

    console.error('[analyze-item] Unhandled internal error:', err);
    return errorResponse(
      'AI_UNKNOWN_ERROR',
      'An unexpected error occurred during item analysis.',
      500,
      undefined,
      req
    );
  }
});
