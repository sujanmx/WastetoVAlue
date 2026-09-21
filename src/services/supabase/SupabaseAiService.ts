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

    // Ensure user is authenticated before initiating server inference
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      throw AppError.aiAuthRequired();
    }

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

    // Invoke authenticated Supabase Edge Function 'analyze-item'
    const { data, error } = await supabase.functions.invoke('analyze-item', {
      body: {
        imageBase64,
        mimeType,
      },
    });

    if (error) {
      let parsedError: unknown = error;
      try {
        const errorObj = error as unknown as FunctionErrorContext;
        if (errorObj.context?.json) {
          const body = await errorObj.context.json();
          parsedError = body?.error || body;
        }
      } catch {
        // Ignored
      }
      throw AppError.fromAiEdgeFunction(parsedError);
    }

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
