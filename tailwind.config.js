/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1600px',
    },
    extend: {
      colors: {
        canvas: '#F7F8F5',
        surface: '#FFFFFF',
        'primary-text': '#122019',
        'secondary-text': '#66736B',
        'brand-green': '#176B45',
        'deep-forest': '#0B3324',
        'soft-green': '#E8F2EC',
        border: '#DDE4DF',
        success: '#247A4A',
        warning: '#A66A00',
        error: '#B42318',
        // Subtle AI Model Accents (strictly accents, never dominating themes)
        ai: {
          vision: {
            DEFAULT: '#0D9488', // Teal
            soft: '#F0FDFA',
            border: '#99F6E4',
          },
          value: {
            DEFAULT: '#D97706', // Warm Amber
            soft: '#FFFBEB',
            border: '#FDE68A',
          },
          matching: {
            DEFAULT: '#4F46E5', // Indigo
            soft: '#EEF2FF',
            border: '#C7D2FE',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      borderRadius: {
        control: '6px',
        input: '8px',
        button: '8px',
        card: '12px',
        panel: '16px',
        sheet: '24px',
      },
      boxShadow: {
        resting: '0 0 0 1px #DDE4DF',
        raised: '0 2px 4px rgba(18, 32, 25, 0.03), 0 8px 16px rgba(18, 32, 25, 0.04)',
        floating: '0 16px 32px -4px rgba(18, 32, 25, 0.08), 0 4px 8px -2px rgba(18, 32, 25, 0.03)',
        focus: '0 0 0 3px rgba(23, 107, 69, 0.12)',
      },
      maxWidth: {
        content: '1440px',
      },
      width: {
        sidebar: '256px',
      },
    },
  },
  plugins: [],
};
