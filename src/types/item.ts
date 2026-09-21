import { ITEM_CATEGORIES, ITEM_CONDITIONS, CIRCULAR_VALUE_PATHS } from '../config/constants';

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];
export type ItemCondition = (typeof ITEM_CONDITIONS)[number];
export type CircularValuePath = (typeof CIRCULAR_VALUE_PATHS)[number];

export type ItemTrackingStatus =
  | 'identified'
  | 'value_selected'
  | 'receiver_found'
  | 'handover_scheduled'
  | 'completed'
  | 'cancelled';

export interface WasteItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: ItemCategory;
  material: string;
  condition: ItemCondition;
  imageUrl: string;
  thumbnailUrl?: string;

  // AI assessment metadata
  isAiAssisted: boolean;
  aiConfidence: 'High' | 'Medium' | 'Low';
  aiReasoning?: string[];

  // Circular pathway
  recommendedValuePath: CircularValuePath;
  selectedValuePath?: CircularValuePath;

  // Receiver match & handover
  receiverId?: string;
  receiverName?: string;
  status: ItemTrackingStatus;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemPayload {
  title: string;
  category: ItemCategory;
  material: string;
  condition: ItemCondition;
  description?: string;
  imageUrl: string;
  selectedValuePath?: CircularValuePath;
  receiverId?: string;
}
