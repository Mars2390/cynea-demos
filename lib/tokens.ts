/**
 * Single source of truth for design tokens, mirrored from the live Cynea
 * demo engine. The CSS custom properties in app/globals.css are the runtime
 * source; these constants exist for canvas drawing and inline styles, where
 * CSS variables are awkward to read.
 */

export const colors = {
  background: '#050505',
  foreground: '#f5f5f5',
  card: '#0e0e0e',
  cardHover: '#151515',
  border: '#1e1e1e',
  borderHi: '#2a2a2a',
  muted: '#8a8a8a',
  dim: '#777777',
  accent: '#00d4ff',
  accentHover: '#00b8e6',
  accentRgb: '0, 212, 255',
  success: '#10b981',
  error: '#ef4444',
} as const;

export const fonts = {
  display: 'var(--font-syne)',
  body: 'var(--font-dm-sans)',
  mono: 'var(--font-jetbrains-mono)',
} as const;

export const radii = {
  button: '14px',
  card: '18px',
  pill: '999px',
  chip: '8px',
} as const;

/** The easing curve used across the entire demo engine. */
export const easing = 'cubic-bezier(.2,.8,.2,1)';

/** Particle background tuning for ParticleBackground.tsx. */
export const particles = {
  count: 26,
  minRadius: 40,
  maxRadius: 140,
  maxSpeed: 0.055,
  blur: 26,
  /** Mostly cyan with a few warm accents, as on the live demo. */
  palette: [
    'rgba(0, 212, 255, 0.11)',
    'rgba(0, 212, 255, 0.075)',
    'rgba(0, 150, 200, 0.07)',
    'rgba(239, 68, 68, 0.055)',
  ],
} as const;

export const alpha = (hexRgb: string, a: number) => `rgba(${hexRgb}, ${a})`;
