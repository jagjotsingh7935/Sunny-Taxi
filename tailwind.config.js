import scrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        /* Light surfaces */
        paper: '#F8F9FB',
        'paper-alt': '#EFF1F5',
        line: '#E2E6EE',
        ink: '#0B0F19',
        'ink-soft': '#334155',
        'ink-muted': '#64748B',

        /* Dark surfaces */
        obsidian: '#080C15',
        charcoal: '#101726',
        platinum: '#EDEFF5',

        /* Sunny Warm Amber-Gold Accent */
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          deep: '#D97706',
          ink: '#B45309',
        },
        verified: '#059669',
      },
      fontFamily: {
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        accent: ['Cinzel', 'serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        /* Fluid scale - one set of sizes that works from 360px to 1600px */
        'fluid-xs': ['clamp(0.7rem, 0.68rem + 0.1vw, 0.75rem)', { lineHeight: '1.5' }],
        'fluid-sm': ['clamp(0.8125rem, 0.78rem + 0.15vw, 0.875rem)', { lineHeight: '1.6' }],
        'fluid-base': ['clamp(0.925rem, 0.89rem + 0.2vw, 1.0625rem)', { lineHeight: '1.7' }],
        'fluid-lg': ['clamp(1.05rem, 0.99rem + 0.3vw, 1.25rem)', { lineHeight: '1.55' }],
        'fluid-xl': ['clamp(1.2rem, 1.1rem + 0.5vw, 1.5rem)', { lineHeight: '1.4' }],
        'fluid-h3': ['clamp(1.35rem, 1.2rem + 0.7vw, 1.85rem)', { lineHeight: '1.25' }],
        'fluid-h2': ['clamp(1.75rem, 1.45rem + 1.4vw, 2.85rem)', { lineHeight: '1.15' }],
        'fluid-h1': ['clamp(2.25rem, 1.65rem + 2.8vw, 4.25rem)', { lineHeight: '1.06' }],
        'fluid-stat': ['clamp(2.1rem, 1.7rem + 1.9vw, 3.4rem)', { lineHeight: '1' }],
      },
      letterSpacing: {
        crown: '0.26em',
        luxury: '0.20em',
        label: '0.12em',
        tightest: '-0.035em',
        tighter: '-0.02em',
        tight: '-0.01em',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FDE047 0%, #F59E0B 45%, #D97706 100%)',
        'gold-ink': 'linear-gradient(120deg, #B45309 0%, #92400E 60%, #78350F 100%)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,15,25,0.04), 0 12px 32px -20px rgba(11,15,25,0.22)',
        lift: '0 2px 4px rgba(11,15,25,0.05), 0 24px 48px -24px rgba(11,15,25,0.30)',
        gold: '0 0 0 1px rgba(245,158,11,0.4), 0 16px 36px -18px rgba(217,119,6,0.45)',
        'dark-card': '0 24px 60px -30px rgba(0,0,0,0.85)',
      },
      maxWidth: {
        prose: '68ch',
      },
      /* Fine-grained opacity steps used by the glass and hairline treatments */
      opacity: {
        6: '0.06',
        8: '0.08',
        12: '0.12',
        14: '0.14',
        18: '0.18',
        88: '0.88',
        92: '0.92',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [scrollbar({ nocompatible: true })],
};
