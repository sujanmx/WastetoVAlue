import { VisionAnalysisResult, ValueAiResult, PipelineProgress } from '../../types/ai';

export interface IAiService {
  /**
   * Model 1: Vision AI — "What is this?"
   * Identifies item, material, category, condition, and confidence.
   */
  identifyItem(
    imageFileOrUrl: File | string,
    onProgress?: (progress: PipelineProgress) => void
  ): Promise<VisionAnalysisResult>;

  /**
   * Model 2: Value AI — "What should happen to it?"
   * Recommends the optimal circular value path (Reuse, Donate, Resell, Recycle) with reasoning.
   */
  recommendValuePaths(visionResult: VisionAnalysisResult): Promise<ValueAiResult>;
}
