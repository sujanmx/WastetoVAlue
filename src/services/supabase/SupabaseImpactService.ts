import { IImpactService } from '../interfaces/IImpactService';
import { supabase } from '../../lib/supabase/client';
import { ImpactMetrics, ImpactActivityHistory } from '../../types/impact';
import { AppError } from '../api/apiError';

export class SupabaseImpactService implements IImpactService {
  async getPersonalImpact(): Promise<ImpactMetrics> {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      // Fallback for unauthenticated preview
      return {
        totalItemsGivenNextValue: 0,
        reusedCount: 0,
        donatedCount: 0,
        resoldCount: 0,
        recycledCount: 0,
        estimatedMaterialWeightKg: 0,
        estimatedCo2SavedKg: 0,
        isEstimated: true,
        dataLabel: 'Estimated',
        updatedAt: new Date().toISOString(),
      };
    }

    const { data, error } = await supabase
      .from('impact_records')
      .select('*')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (error) {
      throw AppError.fromSupabase(error, 'Error retrieving impact telemetry.');
    }

    if (!data) {
      return {
        totalItemsGivenNextValue: 0,
        reusedCount: 0,
        donatedCount: 0,
        resoldCount: 0,
        recycledCount: 0,
        estimatedMaterialWeightKg: 0,
        estimatedCo2SavedKg: 0,
        isEstimated: true,
        dataLabel: 'Estimated',
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      totalItemsGivenNextValue: data.total_diverted,
      reusedCount: data.reused_count,
      donatedCount: data.donated_count,
      resoldCount: data.resold_count,
      recycledCount: data.recycled_count,
      estimatedMaterialWeightKg: Number(data.estimated_weight_kg),
      estimatedCo2SavedKg: Number(data.estimated_co2_kg),
      isEstimated: data.is_estimated,
      dataLabel: data.data_label as ImpactMetrics['dataLabel'],
      updatedAt: data.updated_at,
    };
  }

  async getImpactHistory(): Promise<ImpactActivityHistory[]> {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      return [];
    }

    const { data, error } = await supabase
      .from('items')
      .select('created_at, recommended_value_path')
      .eq('user_id', authData.user.id)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    const monthlyMap = new Map<string, { itemsProcessed: number; paths: Record<string, number> }>();
    for (const item of data) {
      const month = item.created_at ? item.created_at.slice(0, 7) : new Date().toISOString().slice(0, 7);
      const existing = monthlyMap.get(month) || { itemsProcessed: 0, paths: {} };
      existing.itemsProcessed += 1;
      const path = item.recommended_value_path || 'reuse';
      existing.paths[path] = (existing.paths[path] || 0) + 1;
      monthlyMap.set(month, existing);
    }

    return Array.from(monthlyMap.entries()).map(([date, val]) => {
      let primaryPath: ImpactActivityHistory['primaryPath'] = 'reuse';
      let maxCount = 0;
      for (const [p, count] of Object.entries(val.paths)) {
        if (count > maxCount) {
          maxCount = count;
          primaryPath = p as ImpactActivityHistory['primaryPath'];
        }
      }
      return {
        date,
        itemsProcessed: val.itemsProcessed,
        primaryPath,
      };
    });
  }
}
