/**
 * Waste2Value — Core Application Constants
 */

export const ROUTES = {
  // Public
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ONBOARDING: '/onboarding',

  // Core App (Protected)
  HOME: '/home',
  SCAN: '/scan',
  SCAN_REVIEW: '/scan/review',
  SCAN_ANALYZE: '/scan/analyze',
  SCAN_RESULT: '/scan/result',

  // Receivers & Match
  RECEIVERS: '/receivers',
  RECEIVER_DETAIL: '/receivers/:id',

  // Items & Handover
  ITEMS: '/items',
  ITEM_DETAIL: '/items/:id',
  ITEM_TRACK: '/items/:id/track',
  CREATE_LISTING: '/items/new',
  HANDOVER_CONFIRM: '/handover/confirm',
  HANDOVER_SUCCESS: '/handover/success',

  // Discovery & Impact
  DISCOVER: '/discover',
  IMPACT: '/impact',

  // Settings & Account
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HELP: '/help',
} as const;

export const ITEM_CATEGORIES = [
  'Furniture',
  'Electronics',
  'Clothing',
  'Plastic',
  'Paper',
  'Metal',
  'Glass',
  'Other',
] as const;

export const ITEM_CONDITIONS = [
  'Usable',
  'Repairable',
  'Recyclable',
  'Parts Only',
  'Unknown',
] as const;

export const CIRCULAR_VALUE_PATHS = [
  'reuse',
  'donate',
  'resell',
  'recycle',
] as const;

export const UPLOAD_LIMITS = {
  maxFileSizeMb: 10,
  maxFileSizeBytes: 10 * 1024 * 1024,
  acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
  acceptedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.heic'],
};

export const AUTH_STORAGE_KEY = 'w2v_auth_session';
export const SCAN_FLOW_STORAGE_KEY = 'w2v_scan_flow_draft';
