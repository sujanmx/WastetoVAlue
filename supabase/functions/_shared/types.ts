/**
 * Type definitions for Waste2Value AI Edge Functions
 */

export type ItemCategory =
  | 'Furniture'
  | 'Electronics'
  | 'Clothing'
  | 'Plastic'
  | 'Paper'
  | 'Metal'
  | 'Glass'
  | 'Other';

export type ItemCondition =
  | 'Usable'
  | 'Repairable'
  | 'Recyclable'
  | 'Parts Only'
  | 'Unknown';

export type CircularValuePath = 'reuse' | 'donate' | 'resell' | 'recycle';

export type AiConfidence = 'High' | 'Medium' | 'Low';

export interface AnalyzeItemRequest {
  imageBase64?: string;
  imageUrl?: string;
  mimeType?: string;
  itemId?: string;
  idempotencyKey?: string;
}

export interface ValuePathEvaluationItem {
  title: string;
  tagline: string;
  is_recommended: boolean;
  reasoning: string[];
  potential_demand: 'High' | 'Moderate' | 'Low';
  estimated_effort: 'Low' | 'Moderate' | 'High';
  recovery_potential: string;
}

export interface GeminiStructuredOutput {
  detected_object: string;
  category: string;
  material: string;
  condition: string;
  confidence: string;
  confidence_score: number;
  quality_issues?: string[];
  tags: string[];
  summary_reasoning: string;
  recommended_value_path: string;
  paths_evaluation: {
    reuse: ValuePathEvaluationItem;
    donate: ValuePathEvaluationItem;
    resell: ValuePathEvaluationItem;
    recycle: ValuePathEvaluationItem;
  };
}

export interface VisionAnalysisResult {
  detectedObject: string;
  category: ItemCategory;
  material: string;
  condition: ItemCondition;
  confidence: AiConfidence;
  confidenceScore: number;
  qualityIssues?: string[];
  tags: string[];
}

export interface ValuePathOption {
  path: CircularValuePath;
  title: string;
  tagline: string;
  isRecommended: boolean;
  reasoning: string[];
  potentialDemand: 'High' | 'Moderate' | 'Low';
  estimatedEffort: 'Low' | 'Moderate' | 'High';
  recoveryPotential: string;
}

export interface ValueAiResult {
  recommendedPath: CircularValuePath;
  summaryReasoning: string;
  paths: Record<CircularValuePath, ValuePathOption>;
}

export interface NormalizedAiResponse {
  vision: VisionAnalysisResult;
  value: ValueAiResult;
  assessmentId?: string;
  executionTimeMs: number;
  modelUsed: string;
}

export interface EdgeFunctionErrorResponse {
  error: {
    code: string;
    message: string;
    details?: string;
  };
}
