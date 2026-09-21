/**
 * Domain types for Impact metrics and telemetry.
 * Strictly adheres to data honesty guidelines: estimates are explicitly flagged.
 */

export interface ImpactMetrics {
  totalItemsGivenNextValue: number;
  reusedCount: number;
  donatedCount: number;
  resoldCount: number;
  recycledCount: number;
  estimatedMaterialWeightKg?: number;
  estimatedCo2SavedKg?: number;
  isEstimated: boolean;
  dataLabel: 'Verified' | 'Estimated' | 'Prototype calculation' | 'Demo data';
  updatedAt: string;
}

export interface ImpactActivityHistory {
  date: string;
  itemsProcessed: number;
  primaryPath: 'reuse' | 'donate' | 'resell' | 'recycle';
}
