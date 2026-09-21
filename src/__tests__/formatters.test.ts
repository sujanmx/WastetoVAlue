import { describe, it, expect } from 'vitest';
import { formatDistance, formatValuePath, capitalize } from '../lib/formatters';

describe('Data Formatting Primitives', () => {
  it('formats distances sub-kilometer in meters', () => {
    expect(formatDistance(0.4)).toBe('400 m away');
    expect(formatDistance(0.05)).toBe('50 m away');
  });

  it('formats distances greater than 1 km in decimal kilometers', () => {
    expect(formatDistance(2.4)).toBe('2.4 km away');
    expect(formatDistance(10.0)).toBe('10.0 km away');
  });

  it('formats circular value paths correctly', () => {
    expect(formatValuePath('reuse')).toBe('Reuse');
    expect(formatValuePath('donate')).toBe('Donate');
    expect(formatValuePath('resell')).toBe('Resell');
    expect(formatValuePath('recycle')).toBe('Recycle');
  });

  it('capitalizes strings cleanly', () => {
    expect(capitalize('furniture')).toBe('Furniture');
    expect(capitalize('')).toBe('');
  });
});
