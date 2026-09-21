import { ItemCategory, ItemCondition, CircularValuePath } from './item';

export type ReceiverType = 'ngo' | 'reuse_center' | 'recycler' | 'buyer' | 'community';
export type VerificationStatus = 'verified' | 'unverified' | 'demo';

export interface Receiver {
  id: string;
  name: string;
  type: ReceiverType;
  typeLabel: string;
  distanceKm: number;
  address: string;
  city: string;
  acceptedCategories: ItemCategory[];
  acceptedConditions: ItemCondition[];
  supportedValuePaths: CircularValuePath[];
  openHours: string;
  isOpenNow: boolean;
  description: string;
  verificationStatus: VerificationStatus;
  contactEmail?: string;
  contactPhone?: string;
  avatarUrl?: string;
}

export interface ReceiverFilters {
  query?: string;
  maxDistanceKm?: number;
  types?: ReceiverType[];
  valuePath?: CircularValuePath;
  category?: ItemCategory;
  openNowOnly?: boolean;
}
