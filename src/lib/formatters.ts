/**
 * Waste2Value — Data Formatting Utilities
 */

/**
 * Format distance in kilometers or meters
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }
  return `${km.toFixed(1)} km away`;
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format date in a calm, readable manner
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Format circular value path into user-facing label
 */
export function formatValuePath(path: 'reuse' | 'donate' | 'resell' | 'recycle'): string {
  switch (path) {
    case 'reuse':
      return 'Reuse';
    case 'donate':
      return 'Donate';
    case 'resell':
      return 'Resell';
    case 'recycle':
      return 'Recycle';
  }
}
