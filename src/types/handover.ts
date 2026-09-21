import { CircularValuePath, ItemTrackingStatus } from './item';

export interface TimelineEvent {
  step: ItemTrackingStatus;
  label: string;
  description: string;
  timestamp?: string;
  isCurrent: boolean;
  isCompleted: boolean;
}

export interface HandoverRecord {
  id: string;
  itemId: string;
  itemTitle: string;
  itemCategory: string;
  itemImageUrl: string;
  valuePath: CircularValuePath;
  receiverId: string;
  receiverName: string;
  receiverAddress: string;
  status: ItemTrackingStatus;
  scheduledDate?: string;
  handoverNotes?: string;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmHandoverPayload {
  itemId: string;
  receiverId: string;
  valuePath: CircularValuePath;
  scheduledDate?: string;
  notes?: string;
}
