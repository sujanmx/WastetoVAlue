import { IReceiverService } from '../interfaces/IReceiverService';
import { supabase } from '../../lib/supabase/client';
import { Receiver, ReceiverFilters, ReceiverType, VerificationStatus } from '../../types/receiver';
import { VisionAnalysisResult } from '../../types/ai';
import { CircularValuePath, ItemCategory, ItemCondition } from '../../types/item';
import { AppError } from '../api/apiError';
import type { Database } from '../../types/database';

type ReceiverRow = Database['public']['Tables']['receivers']['Row'];

function mapRowToReceiver(row: ReceiverRow): Receiver {
  return {
    id: row.id,
    name: row.name,
    type: row.type as ReceiverType,
    typeLabel: row.type_label,
    distanceKm: Number(row.distance_km),
    address: row.address,
    city: row.city,
    acceptedCategories: row.accepted_categories as ItemCategory[],
    acceptedConditions: row.accepted_conditions as ItemCondition[],
    supportedValuePaths: row.supported_value_paths as CircularValuePath[],
    openHours: row.open_hours,
    isOpenNow: row.is_open_now,
    description: row.description,
    verificationStatus: row.verification_status as VerificationStatus,
    contactEmail: row.contact_email || undefined,
    contactPhone: row.contact_phone || undefined,
    avatarUrl: row.avatar_url || undefined,
  };
}

export class SupabaseReceiverService implements IReceiverService {
  async matchReceivers(params: {
    item: Partial<VisionAnalysisResult>;
    valuePath: CircularValuePath;
    filters?: ReceiverFilters;
  }): Promise<Receiver[]> {
    let query = supabase
      .from('receivers')
      .select('*')
      .eq('is_active', true)
      .contains('supported_value_paths', [params.valuePath]);

    if (params.filters?.maxDistanceKm) {
      query = query.lte('distance_km', params.filters.maxDistanceKm);
    }

    const { data, error } = await query;
    if (error) {
      throw AppError.fromSupabase(error, 'Error matching nearby circular receivers.');
    }

    let results = (data || []).map(mapRowToReceiver);

    if (params.item.category) {
      results = results.filter(
        (r) =>
          r.acceptedCategories.includes(params.item.category as ItemCategory) ||
          r.acceptedCategories.includes('Other')
      );
    }

    if (params.filters?.query) {
      const q = params.filters.query.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.typeLabel.toLowerCase().includes(q)
      );
    }

    return results;
  }

  async getReceivers(filters?: ReceiverFilters): Promise<Receiver[]> {
    let query = supabase
      .from('receivers')
      .select('*')
      .eq('is_active', true)
      .order('distance_km', { ascending: true });

    if (filters?.maxDistanceKm) {
      query = query.lte('distance_km', filters.maxDistanceKm);
    }

    const { data, error } = await query;
    if (error) {
      throw AppError.fromSupabase(error, 'Error loading directory of receivers.');
    }

    let results = (data || []).map(mapRowToReceiver);

    if (filters?.valuePath) {
      results = results.filter((r) => r.supportedValuePaths.includes(filters.valuePath!));
    }

    if (filters?.category) {
      results = results.filter(
        (r) =>
          r.acceptedCategories.includes(filters.category!) ||
          r.acceptedCategories.includes('Other')
      );
    }

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.typeLabel.toLowerCase().includes(q)
      );
    }

    return results;
  }

  async getReceiverById(id: string): Promise<Receiver> {
    const { data, error } = await supabase
      .from('receivers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw AppError.notFound('Receiver');
    }

    return mapRowToReceiver(data);
  }
}
