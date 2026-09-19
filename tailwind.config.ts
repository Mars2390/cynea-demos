import type { Config } from 'tailwindcss';

/**
 * Colours resolve to the channel triplets declared in app/globals.css, wrapped
 * with `<alpha-value>` so opacity modifiers compose correctly.
 *
 * This matters: declaring a colour as a hex-valued `var(--accent)` makes
 * Tailwind silently DROP every `bg-accent/10`-style utility at build time, and
 * the element renders with no colour at all. Keep the
 * `rgb(var(--x-ch) / <alpha-value>)` form.
 *
 * See lib/tokens.ts for the palette rationale and measured contrast ratios.
 */
const withAlpha = (token: string) => `rgb(var(${token}) / <alpha-value>)`;

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
        background: withAlpha('--background-ch'),
        foreground: withAlpha('--foreground-ch'),
        card: withAlpha('--card-ch'),
        'card-hover': withAlpha('--card-hover-ch'),
        border: withAlpha('--border-ch'),
        'border-hi': withAlpha('--border-hi-ch'),
        muted: withAlpha('--muted-ch'),
        dim: withAlpha('--dim-ch'),
        accent: withAlpha('--accent-ch'),
        'accent-hover': withAlpha('--accent-hover-ch'),
        'accent-secondary': withAlpha('--accent-secondary-ch'),
        success: withAlpha('--success-ch'),
        warning: withAlpha('--warning-ch'),
        error: withAlpha('--error-ch'),
        'on-accent': withAlpha('--on-accent-ch'),
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        btn: '14px',
        card: '18px',
        panel: '22px',
      },
      boxShadow: {
        'glow-accent': '0 0 24px rgb(var(--accent-ch) / 0.3)',
        'glow-accent-lg': '0 0 40px rgb(var(--accent-ch) / 0.42)',
        'glow-success': '0 0 24px rgb(var(--success-ch) / 0.3)',
        spot: '0 0 0 1px rgb(var(--accent-ch) / 0.5), 0 0 34px rgb(var(--accent-ch) / 0.26)',
        panel: '0 18px 50px -24px rgb(0 0 0 / 0.9)',
      },
      letterSpacing: {
        eyebrow: '0.18em',
        display: '-1.5px',
      },
      fontSize: {
        display: ['60px', { lineHeight: '1.02', letterSpacing: '-1.5px' }],
      },
      transitionTimingFunction: {
        demo: 'cubic-bezier(.2,.8,.2,1)',
      },
      screens: {
        xs: '420px',
      },
    },
  },
  plugins: [],
};

export default config;
