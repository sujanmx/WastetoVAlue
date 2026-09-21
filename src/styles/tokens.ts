/**
 * Waste2Value — Centralized Design System Tokens
 * Source of truth extracted directly from Waste2Value Design Specifications.
 */

export const DESIGN_TOKENS = {
  colors: {
    canvas: '#F7F8F5',
    surface: '#FFFFFF',
    primaryText: '#122019',
    secondaryText: '#66736B',
    brandGreen: '#176B45',
    deepForest: '#0B3324',
    softGreen: '#E8F2EC',
    border: '#DDE4DF',
    success: '#247A4A',
    warning: '#A66A00',
    error: '#B42318',

    // AI Pipeline Subtle Accents
    ai: {
      vision: '#0D9488', // Teal: "What is this?"
      visionSoft: '#F0FDFA',
      value: '#D97706', // Warm Amber: "What should happen to it?"
      valueSoft: '#FFFBEB',
      matching: '#4F46E5', // Indigo: "Who can take it?"
      matchingSoft: '#EEF2FF',
    },
  },

  typography: {
    fonts: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, Menlo, Monaco, monospace',
    },
    scale: {
      display: { size: '48px', lineHeight: '56px', weight: '600' },
      displayMobile: { size: '32px', lineHeight: '40px', weight: '600' },
      h1: { size: '32px', lineHeight: '40px', weight: '600' },
      h1Mobile: { size: '24px', lineHeight: '32px', weight: '600' },
      h2: { size: '24px', lineHeight: '32px', weight: '600' },
      h3: { size: '18px', lineHeight: '24px', weight: '600' },
      bodyLarge: { size: '16px', lineHeight: '24px', weight: '400' },
      body: { size: '14px', lineHeight: '20px', weight: '400' },
      small: { size: '12px', lineHeight: '16px', weight: '400' },
      label: { size: '13px', lineHeight: '16px', weight: '500' },
      microLabel: { size: '11px', lineHeight: '14px', weight: '600' },
    },
  },

  spacing: {
    unit: 8,
    scale: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '40px',
      '3xl': '48px',
      '4xl': '64px',
      '5xl': '80px',
      '6xl': '96px',
    },
  },

  radii: {
    control: '6px',
    input: '8px',
    button: '8px',
    card: '12px',
    panel: '16px',
    sheet: '24px',
    pill: '9999px',
  },

  elevation: {
    resting: '0 0 0 1px #DDE4DF',
    raised: '0 2px 4px rgba(18, 32, 25, 0.03), 0 8px 16px rgba(18, 32, 25, 0.04)',
    floating: '0 16px 32px -4px rgba(18, 32, 25, 0.08), 0 4px 8px -2px rgba(18, 32, 25, 0.03)',
  },

  breakpoints: {
    phoneSmall: 320,
    phoneStandard: 390,
    tablet: 768,
    desktop: 1024,
    desktopWide: 1440,
    desktopMax: 1920,
  },

  dimensions: {
    sidebarWidth: 256,
    maxContentWidth: 1440,
    touchTargetMin: 44,
    touchTargetPreferred: 48,
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
