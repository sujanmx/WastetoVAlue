import { ItemCategory, ItemCondition, CircularValuePath } from './item';

export type AiConfidence = 'High' | 'Medium' | 'Low';

export interface VisionAnalysisResult {
  detectedObject: string;
  category: ItemCategory;
  material: string;
  condition: ItemCondition;
  confidence: AiConfidence;
  confidenceScore: number; // 0.0 to 1.0 (internal telemetry only, not shown as fake 100%)
  qualityIssues?: string[]; // e.g. "Low lighting", "Object partially cut off"
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

export interface ReceiverMatchResult {
  receiverId: string;
  matchScore: number;
  matchReasons: string[];
  distanceKm: number;
}

export type PipelineStage =
  | 'detecting_object'
  | 'identifying_material'
  | 'assessing_condition'
  | 'evaluating_value_paths'
  | 'matching_receivers'
  | 'completed';

export interface PipelineProgress {
  stage: PipelineStage;
  stageIndex: number;
  totalStages: number;
  label: string;
}
