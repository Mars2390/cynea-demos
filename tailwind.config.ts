import type { Config } from 'tailwindcss';

/**
 * Design tokens mirror the live Cynea demo engine (leads.cynea.ai/demo).
 * Colours are wired to the CSS custom properties declared in app/globals.css
 * so that :root remains the single runtime source of truth.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './demos/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-hover': 'var(--card-hover)',
        border: 'var(--border)',
        'border-hi': 'var(--border-hi)',
        muted: 'var(--muted)',
        dim: 'var(--dim)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        success: 'var(--success)',
        error: 'var(--error)',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        btn: '14px',
        card: '18px',
      },
      boxShadow: {
        'glow-accent': '0 0 24px rgba(var(--accent-rgb), 0.35)',
        'glow-accent-lg': '0 0 40px rgba(var(--accent-rgb), 0.45)',
        spot: '0 0 0 1px rgba(var(--accent-rgb), 0.5), 0 0 32px rgba(var(--accent-rgb), 0.28)',
      },
      letterSpacing: {
        eyebrow: '0.18em',
        display: '-1.5px',
      },
      fontSize: {
        display: ['60px', { lineHeight: '1.02', letterSpacing: '-1.5px' }],
      },
      transitionTimingFunction: {
        // The easing used throughout the live demo engine.
        demo: 'cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [],
};

export default config;
