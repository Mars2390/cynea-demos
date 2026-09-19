/**
 * Single source of truth for design tokens — the "Tribunal" palette.
 *
 * Ink-indigo ground with signal gold as the brand accent. Gold reads as a seal
 * / audit sign-off and indigo carries EU-institutional authority; because
 * neither is green, emerald stays reserved exclusively for "Pass" states so
 * the five-point assessment reads as status rather than decoration.
 *
 * The CSS custom properties in app/globals.css are the runtime source. These
 * constants exist for canvas drawing and inline styles, where reading a CSS
 * variable is awkward. Never hardcode a colour outside these two files.
 *
 * Measured contrast vs --background (WCAG 2.1):
 *   foreground 18.05:1 AAA · accent 10.10:1 AAA · success 9.66:1 AAA
 *   warning 7.30:1 AAA · accent-secondary 6.52:1 AA · muted 6.31:1 AA
 *   dim 5.03:1 AA · error 5.11:1 AA · #0A0A0A on accent 10.00:1 AA
 */

export const colors = {
  background: '#07080E',
  card: '#0E1018',
  cardHover: '#151826',
  border: '#1C1F2D',
  borderHi: '#2A2E40',
  foreground: '#F2F3F8',
  muted: '#8B90A4',
  dim: '#7A7F93',
  accent: '#D8B45C',
  accentHover: '#E6C674',
  accentSecondary: '#6D8CFF',
  success: '#3FCB8E',
  warning: '#E8814A',
  error: '#E5484D',
  /** Near-black used for text on filled accent surfaces. */
  onAccent: '#0A0A0A',
} as const;

/**
 * Space-separated channel triplets, matching the `--*-ch` custom properties.
 * Compose with alpha() rather than interpolating by hand.
 */
export const ch = {
  background: '7 8 14',
  card: '14 16 24',
  border: '28 31 45',
  foreground: '242 243 248',
  muted: '139 144 164',
  accent: '216 180 92',
  accentSecondary: '109 140 255',
  success: '63 203 142',
  warning: '232 129 74',
} as const;

/** `alpha(ch.accent, 0.3)` → "rgb(216 180 92 / 0.3)". Valid in CSS and canvas. */
export const alpha = (channels: string, a: number) =>
  `rgb(${channels} / ${a})`;

export const fonts = {
  display: 'var(--font-syne)',
  body: 'var(--font-dm-sans)',
  mono: 'var(--font-jetbrains-mono)',
} as const;

export const radii = {
  button: '14px',
  card: '18px',
  panel: '22px',
  pill: '999px',
  chip: '8px',
} as const;

/** The easing curve used across the entire demo engine. */
export const easing = 'cubic-bezier(.2,.8,.2,1)';

/**
 * Ambient mesh hue per step: the gradient shifts as the narrative moves from
 * intake (indigo) through field evidence (emerald) to the signed statement
 * (gold). Values are channel triplets assigned to --mesh-a / --mesh-b.
 */
export const meshByStep: Record<string, { a: string; b: string }> = {
  /* Compliance suite: indigo for watching and screening, emerald once the
     evidence is in the field, gold as the year closes into reports and audit. */
  sentinel: { a: ch.accentSecondary, b: ch.accent },
  screen: { a: ch.accentSecondary, b: ch.success },
  diligence: { a: ch.success, b: ch.accentSecondary },
  carbon: { a: ch.success, b: ch.accent },
  ledger: { a: ch.accentSecondary, b: ch.accent },
  registrar: { a: ch.accent, b: ch.accentSecondary },

  /* Diligence, standalone. */
  consignment: { a: ch.accentSecondary, b: ch.accent },
  collect: { a: ch.success, b: ch.accentSecondary },
  assess: { a: ch.accentSecondary, b: ch.accent },
  statement: { a: ch.accent, b: ch.success },
  ready: { a: ch.accent, b: ch.accentSecondary },
};

/** Particle background tuning for ParticleBackground.tsx. */
export const particles = {
  count: 22,
  minRadius: 60,
  maxRadius: 180,
  maxSpeed: 0.045,
  blur: 30,
  /** Gold-led, with indigo and a touch of emerald. */
  palette: [
    alpha(ch.accent, 0.085),
    alpha(ch.accent, 0.055),
    alpha(ch.accentSecondary, 0.075),
    alpha(ch.success, 0.045),
  ],
} as const;
