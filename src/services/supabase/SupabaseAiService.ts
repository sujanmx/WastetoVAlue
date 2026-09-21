import { IAiService } from '../interfaces/IAiService';
import { supabase } from '../../lib/supabase/client';
import { VisionAnalysisResult, ValueAiResult, PipelineProgress } from '../../types/ai';
import { CircularValuePath } from '../../types/item';
import { AppError } from '../api/apiError';

interface FunctionErrorContext {
  context?: {
    json?: () => Promise<{ error?: { code?: string; message?: string } }>;
  };
}

export class SupabaseAiService implements IAiService {
  private lastValueResult: ValueAiResult | null = null;
  private lastVisionResult: VisionAnalysisResult | null = null;

  private async prepareImagePayload(imageFileOrUrl: File | string): Promise<{
    imageBase64: string;
    mimeType: string;
  }> {
    if (typeof imageFileOrUrl === 'string') {
      if (imageFileOrUrl.startsWith('data:')) {
        const match = imageFileOrUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (match && match[1] && match[2]) {
          return { mimeType: match[1], imageBase64: match[2] };
        }
      }

      // If it's a blob URL or remote URL:
      try {
        const resp = await fetch(imageFileOrUrl);
        const blob = await resp.blob();
        const mimeType = blob.type || 'image/jpeg';
        const arrayBuf = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuf);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i] ?? 0);
        }
        return { imageBase64: btoa(binary), mimeType };
      } catch {
        throw AppError.fromAiEdgeFunction({
          code: 'AI_INVALID_IMAGE',
          message: 'Failed to read image source.',
        });
      }
    } else {
      // File object
      const mimeType = imageFileOrUrl.type || 'image/jpeg';
      const arrayBuf = await imageFileOrUrl.arrayBuffer();
      const bytes = new Uint8Array(arrayBuf);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i] ?? 0);
      }
      return { imageBase64: btoa(binary), mimeType };
    }
  }

  /**
   * Retrieves a valid session access token. Proactively refreshes the token if expired
   * or close to expiry (e.g. after tab idle time), ensuring the Edge Function receives a fresh JWT.
   */
  private async getValidAccessToken(): Promise<string | undefined> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      let session = sessionData?.session;

      const isExpiredOrClose =
        session?.expires_at ? session.expires_at * 1000 < Date.now() + 60000 : false;

      if (!session || isExpiredOrClose) {
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (refreshData?.session) {
          session = refreshData.session;
        }
      }

      if (session?.access_token) {
        return session.access_token;
      }
    } catch {
      // Fall through to verify user via getUser
    }

    // Fallback authentication check
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      throw AppError.aiAuthRequired();
    }

    return undefined;
  }

  /**
   * Identifies whether an Edge Function error is transient (e.g. network disconnect,
   * idle socket reset, relay timeout, gateway cold-start) and eligible for a single retry.
   */
  private isTransientError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const err = error as {
      name?: string;
      message?: string;
      context?: { status?: number };
    };

    const name = err.name || '';
    const message = (err.message || '').toLowerCase();
    const status = err.context?.status;

    // FunctionsFetchError: failed fetch, CORS preflight dropped, or idle TCP reset
    if (
      name === 'FunctionsFetchError' ||
      message.includes('failed to send a request') ||
      message.includes('failed to fetch') ||
      message.includes('networkerror')
    ) {
      return true;
    }

    // FunctionsRelayError: relay communication failed
    if (name === 'FunctionsRelayError' || message.includes('relay')) {
      return true;
    }

    // Gateway / provider timeout or transient unavailability
    if (status === 502 || status === 503 || status === 504 || status === 401) {
      return true;
    }

    return false;
  }

  /**
   * Parses error context returned by Supabase FunctionsClient.
   */
  private async parseFunctionError(error: unknown): Promise<unknown> {
    if (!error || typeof error !== 'object') return error;

    const errorObj = error as unknown as FunctionErrorContext & {
      context?: { status?: number; json?: () => Promise<unknown> };
    };

    if (typeof errorObj.context?.json === 'function') {
      try {
        const body = (await errorObj.context.json()) as { error?: unknown };
        if (body?.error) {
          return body.error;
        }
        if (body) {
          return body;
        }
      } catch {
        // Fall through if json body parsing fails
      }
    }

    return error;
  }

  private async invokeAnalyzeItem(
    imageBase64: string,
    mimeType: string,
    accessToken?: string
  ) {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return supabase.functions.invoke('analyze-item', {
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      body: {
        imageBase64,
        mimeType,
      },
    });
  }

  async identifyItem(
    imageFileOrUrl: File | string,
    onProgress?: (progress: PipelineProgress) => void
  ): Promise<VisionAnalysisResult> {
    onProgress?.({
      stage: 'detecting_object',
      stageIndex: 1,
      totalStages: 5,
      label: 'Detecting object and geometry...',
    });

    // 1. Ensure user is authenticated and proactively refresh token after idle
    let accessToken = await this.getValidAccessToken();

    const { imageBase64, mimeType } = await this.prepareImagePayload(imageFileOrUrl);

    onProgress?.({
      stage: 'identifying_material',
      stageIndex: 2,
      totalStages: 5,
      label: 'Identifying material and composition...',
    });

    onProgress?.({
      stage: 'assessing_condition',
      stageIndex: 3,
      totalStages: 5,
      label: 'Assessing structural condition...',
    });

    // 2. Invoke authenticated Supabase Edge Function 'analyze-item'
    let invokeResult = await this.invokeAnalyzeItem(imageBase64, mimeType, accessToken);

    // 3. Transient failure recovery: maximum 1 automatic retry for transient network/socket/token errors
    if (invokeResult.error && this.isTransientError(invokeResult.error)) {
      try {
        // Proactively refresh session token in case it expired while idle
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (refreshData?.session?.access_token) {
          accessToken = refreshData.session.access_token;
        }
      } catch {
        // Refresh error is non-fatal for retry attempt
      }

      // Brief backoff (800ms) to allow socket/gateway reconnection
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Attempt single retry (strictly 1 retry, no infinite loop)
      invokeResult = await this.invokeAnalyzeItem(imageBase64, mimeType, accessToken);
    }

    if (invokeResult.error) {
      const parsedError = await this.parseFunctionError(invokeResult.error);
      throw AppError.fromAiEdgeFunction(parsedError);
    }

    const data = invokeResult.data;
    if (!data?.vision) {
      throw AppError.aiIdentificationFailed();
    }

    onProgress?.({
      stage: 'evaluating_value_paths',
      stageIndex: 4,
      totalStages: 5,
      label: 'Evaluating circular pathways...',
    });

    // Cache the value AI output so recommendValuePaths does not trigger a redundant roundtrip
    if (data.value) {
      this.lastValueResult = data.value;
      this.lastVisionResult = data.vision;
    }

    onProgress?.({
      stage: 'preparing_recommendation',
      stageIndex: 5,
      totalStages: 5,
      label: 'Preparing circular recommendations...',
    });

    return data.vision;
  }

  async recommendValuePaths(visionResult: VisionAnalysisResult): Promise<ValueAiResult> {
    // If we have a cached value result from the identifyItem pass, return it directly
    if (
      this.lastValueResult &&
      this.lastVisionResult?.detectedObject === visionResult.detectedObject
    ) {
      return this.lastValueResult;
    }

    // Heuristic fallback matching vision assessment
    const isReusable = visionResult.condition === 'Usable';
    const isRepairable = visionResult.condition === 'Repairable';
    const recommendedPath: CircularValuePath = isReusable ? 'reuse' : isRepairable ? 'reuse' : 'recycle';
    const isRecommended = (path: CircularValuePath): boolean => (path as string) === (recommendedPath as string);

    return {
      recommendedPath,
      summaryReasoning: `Based on ${visionResult.condition.toLowerCase()} condition and ${visionResult.material} composition, ${recommendedPath} retains the highest circular utility.`,
      paths: {
        reuse: {
          path: 'reuse',
          title: 'Reuse',
          tagline: 'Keep the item in active service',
          isRecommended: isRecommended('reuse'),
          reasoning: [
            `${visionResult.condition} structural condition allows continuous practical utility.`,
            `High local community demand for ${visionResult.category.toLowerCase()}.`,
          ],
          potentialDemand: 'High',
          estimatedEffort: 'Low',
          recoveryPotential: '100% item retention',
        },
        donate: {
          path: 'donate',
          title: 'Donate',
          tagline: 'Pass to non-profits and families in need',
          isRecommended: isRecommended('donate'),
          reasoning: [
            'Suitable for low-income home assistance and community programs.',
            'Drop-off or pickup coordination required.',
          ],
          potentialDemand: 'Moderate',
          estimatedEffort: 'Moderate',
          recoveryPotential: 'Immediate social utility',
        },
        resell: {
          path: 'resell',
          title: 'Resell',
          tagline: 'Recover direct economic value',
          isRecommended: isRecommended('resell'),
          reasoning: [
            'Secondary marketplace listing and buyer negotiation required.',
            'Moderate economic recovery potential.',
          ],
          potentialDemand: 'Moderate',
          estimatedEffort: 'High',
          recoveryPotential: 'Financial recovery',
        },
        recycle: {
          path: 'recycle',
          title: 'Recycle',
          tagline: 'Recover raw materials and fibers',
          isRecommended: isRecommended('recycle'),
          reasoning: [
            'Recovers base raw materials and diverts volume from landfill.',
            'Appropriate when structural reuse is not viable.',
          ],
          potentialDemand: 'High',
          estimatedEffort: 'Low',
          recoveryPotential: 'Raw material recovery',
        },
      },
    };
  }
}
