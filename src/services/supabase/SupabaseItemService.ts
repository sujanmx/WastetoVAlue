import { IItemService } from '../interfaces/IItemService';
import { supabase } from '../../lib/supabase/client';
import { WasteItem, CreateItemPayload, ItemCategory, ItemCondition, CircularValuePath, ItemTrackingStatus } from '../../types/item';
import { AppError } from '../api/apiError';
import type { Database } from '../../types/database';

type ItemRow = Database['public']['Tables']['items']['Row'];

function mapRowToItem(row: ItemRow): WasteItem {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description || undefined,
    category: row.category as ItemCategory,
    material: row.material,
    condition: row.condition as ItemCondition,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url || undefined,
    isAiAssisted: row.is_ai_assisted,
    aiConfidence: (row.ai_confidence as 'High' | 'Medium' | 'Low') || 'High',
    recommendedValuePath: row.recommended_value_path as CircularValuePath,
    selectedValuePath: (row.selected_value_path as CircularValuePath) || undefined,
    receiverId: row.receiver_id || undefined,
    status: row.status as ItemTrackingStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SupabaseItemService implements IItemService {
  async getItems(params?: { status?: string; category?: string }): Promise<WasteItem[]> {
    let query = supabase
      .from('items')
      .select('*, receivers(name)')
      .order('created_at', { ascending: false });

    if (params?.status && params.status !== 'all') {
      query = query.eq('status', params.status as ItemRow['status']);
    }
    if (params?.category) {
      query = query.eq('category', params.category);
    }

    const { data, error } = await query;
    if (error) {
      throw AppError.fromSupabase(error, 'Failed to retrieve your items.');
    }

    return (data || []).map((row) => {
      const receiverData = row.receivers as { name: string } | null;
      return {
        ...mapRowToItem(row as ItemRow),
        receiverName: receiverData?.name || undefined,
      };
    });
  }

  async getItemById(id: string): Promise<WasteItem> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw AppError.fromSupabase(error, 'Requested item could not be found.');
    }

    return mapRowToItem(data);
  }

  async createItem(payload: CreateItemPayload): Promise<WasteItem> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw AppError.unauthorized('You must be signed in to create an item listing.');
    }

    const { data, error } = await supabase
      .from('items')
      .insert({
        user_id: userData.user.id,
        title: payload.title,
        description: payload.description || null,
        category: payload.category,
        material: payload.material,
        condition: payload.condition,
        image_url: payload.imageUrl,
        recommended_value_path: payload.selectedValuePath || 'reuse',
        selected_value_path: payload.selectedValuePath || null,
        receiver_id: payload.receiverId || null,
        status: payload.receiverId ? 'receiver_found' : 'identified',
      })
      .select()
      .single();

    if (error || !data) {
      throw AppError.fromSupabase(error, 'Failed to create item listing.');
    }

    return mapRowToItem(data);
  }

  async updateItem(id: string, updates: Partial<WasteItem>): Promise<WasteItem> {
    const dbUpdates: Partial<ItemRow> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.material !== undefined) dbUpdates.material = updates.material;
    if (updates.condition !== undefined) dbUpdates.condition = updates.condition;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.selectedValuePath !== undefined) dbUpdates.selected_value_path = updates.selectedValuePath;
    if (updates.receiverId !== undefined) dbUpdates.receiver_id = updates.receiverId;

    const { data, error } = await supabase
      .from('items')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw AppError.fromSupabase(error, 'Failed to update item details.');
    }

    return mapRowToItem(data);
  }

  async deleteItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) {
      throw AppError.fromSupabase(error, 'Failed to delete item.');
    }
  }

  async getRecentItems(limit = 3): Promise<WasteItem[]> {
    const { data, error } = await supabase
      .from('items')
      .select('*, receivers(name)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw AppError.fromSupabase(error, 'Failed to load recent activity.');
    }

    return (data || []).map((row) => {
      const receiverData = row.receivers as { name: string } | null;
      return {
        ...mapRowToItem(row as ItemRow),
        receiverName: receiverData?.name || undefined,
      };
    });
  }
}
