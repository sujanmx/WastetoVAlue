import { IHandoverService } from '../interfaces/IHandoverService';
import { supabase } from '../../lib/supabase/client';
import { HandoverRecord, ConfirmHandoverPayload, TimelineEvent } from '../../types/handover';
import { CircularValuePath, ItemTrackingStatus } from '../../types/item';
import { AppError } from '../api/apiError';
import type { Database, Json } from '../../types/database';

interface HandoverJoinedRow {
  id: string;
  item_id: string;
  user_id: string;
  receiver_id: string;
  value_path: string;
  status: string;
  scheduled_date: string | null;
  notes: string | null;
  timeline: Json;
  created_at: string;
  updated_at: string;
  receivers: { name: string; address: string } | null;
  items: { title: string; category: string; image_url: string } | null;
}

function createDefaultTimeline(valuePath: CircularValuePath, receiverName: string): TimelineEvent[] {
  const now = new Date().toISOString();
  return [
    {
      step: 'identified',
      label: 'Identified',
      description: 'Vision AI identified item and material properties',
      isCurrent: false,
      isCompleted: true,
      timestamp: now,
    },
    {
      step: 'value_selected',
      label: 'Value Path Selected',
      description: `Path set to ${valuePath.toUpperCase()}`,
      isCurrent: false,
      isCompleted: true,
      timestamp: now,
    },
    {
      step: 'receiver_found',
      label: 'Receiver Selected',
      description: `Matched with ${receiverName}`,
      isCurrent: true,
      isCompleted: true,
      timestamp: now,
    },
    {
      step: 'handover_scheduled',
      label: 'Handover Scheduled',
      description: 'Coordinate drop-off or pickup with receiver hub',
      isCurrent: false,
      isCompleted: false,
    },
    {
      step: 'completed',
      label: 'Completed',
      description: 'Item transitioned to next circular lifecycle',
      isCurrent: false,
      isCompleted: false,
    },
  ];
}

export class SupabaseHandoverService implements IHandoverService {
  async confirmHandover(payload: ConfirmHandoverPayload): Promise<HandoverRecord> {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      throw AppError.unauthorized('You must be signed in to confirm a handover.');
    }

    // Fetch receiver info for name and address
    const { data: receiver } = await supabase
      .from('receivers')
      .select('name, address')
      .eq('id', payload.receiverId)
      .maybeSingle();

    const receiverName = receiver?.name || 'Community Partner';
    const receiverAddress = receiver?.address || 'Community Partner Hub';

    const timeline = createDefaultTimeline(payload.valuePath, receiverName);

    const { data, error } = await supabase
      .from('handover_records')
      .insert({
        item_id: payload.itemId,
        user_id: authData.user.id,
        receiver_id: payload.receiverId,
        value_path: payload.valuePath,
        status: 'receiver_found',
        scheduled_date: payload.scheduledDate || null,
        notes: payload.notes || null,
        timeline: timeline as unknown as Database['public']['Tables']['handover_records']['Insert']['timeline'],
      })
      .select()
      .single();

    if (error || !data) {
      throw AppError.fromSupabase(error, 'Failed to confirm handover arrangement.');
    }

    // Update item status
    await supabase
      .from('items')
      .update({
        receiver_id: payload.receiverId,
        status: 'receiver_found',
        selected_value_path: payload.valuePath,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payload.itemId);

    return {
      id: data.id,
      itemId: data.item_id,
      itemTitle: 'Item',
      itemCategory: 'General',
      itemImageUrl: '',
      valuePath: data.value_path as CircularValuePath,
      receiverId: data.receiver_id,
      receiverName,
      receiverAddress,
      status: data.status as ItemTrackingStatus,
      scheduledDate: data.scheduled_date || undefined,
      handoverNotes: data.notes || undefined,
      timeline,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getHandoverById(id: string): Promise<HandoverRecord> {
    const { data, error } = (await supabase
      .from('handover_records')
      .select('*, receivers(name, address), items(title, category, image_url)')
      .eq('id', id)
      .single()) as unknown as { data: HandoverJoinedRow | null; error: unknown };

    if (error || !data) {
      throw AppError.notFound('Handover record');
    }

    const rec = data.receivers;
    const itm = data.items;

    return {
      id: data.id,
      itemId: data.item_id,
      itemTitle: itm?.title || 'Tracked Item',
      itemCategory: itm?.category || 'General',
      itemImageUrl: itm?.image_url || '',
      valuePath: data.value_path as CircularValuePath,
      receiverId: data.receiver_id,
      receiverName: rec?.name || 'Community Hub',
      receiverAddress: rec?.address || 'Local Hub',
      status: data.status as ItemTrackingStatus,
      scheduledDate: data.scheduled_date || undefined,
      handoverNotes: data.notes || undefined,
      timeline: (data.timeline as unknown as TimelineEvent[]) || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getHandoverByItemId(itemId: string): Promise<HandoverRecord | null> {
    const { data, error } = (await supabase
      .from('handover_records')
      .select('*, receivers(name, address), items(title, category, image_url)')
      .eq('item_id', itemId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()) as unknown as { data: HandoverJoinedRow | null; error: unknown };

    if (error || !data) {
      return null;
    }

    const rec = data.receivers;
    const itm = data.items;

    return {
      id: data.id,
      itemId: data.item_id,
      itemTitle: itm?.title || 'Tracked Item',
      itemCategory: itm?.category || 'General',
      itemImageUrl: itm?.image_url || '',
      valuePath: data.value_path as CircularValuePath,
      receiverId: data.receiver_id,
      receiverName: rec?.name || 'Community Hub',
      receiverAddress: rec?.address || 'Local Hub',
      status: data.status as ItemTrackingStatus,
      scheduledDate: data.scheduled_date || undefined,
      handoverNotes: data.notes || undefined,
      timeline: (data.timeline as unknown as TimelineEvent[]) || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async cancelHandover(id: string): Promise<void> {
    const { error } = await supabase
      .from('handover_records')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw AppError.fromSupabase(error, 'Failed to cancel handover record.');
    }
  }
}
