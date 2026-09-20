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

/**
 * "Tape" — the Finance suite's fork. Applied by [data-suite='finance'] in
 * globals.css; these mirrors exist for canvas and per-step mesh hues only.
 */
export const tape = {
  background: '#05080F',
  accent: '#22D3EE',
  accentSecondary: '#A78BFA',
  success: '#4ADE80',
  warning: '#FBBF24',
  ch: {
    accent: '34 211 238',
    accentSecondary: '167 139 250',
    success: '74 222 128',
    warning: '251 191 36',
  },
} as const;

/**
 * "Bar" — the Legal suite's fork. Applied by [data-suite='legal'] in
 * globals.css. Claret is the deepest oxblood that clears AA as text on the
 * card surface (stricter than the ground); true oxblood lives in the mesh,
 * where it carries no text.
 *
 * Measured on card #14100F / ground #0A0708: foreground 16.4 / 17.7 · muted
 * 7.2 / 7.6 · dim 5.2 / 5.6 · claret 4.6 / 4.9 · hover 5.4 / 5.7 · ivory
 * 15.3 / 16.5 · lime 10.7 / 11.5 · amber 11.2 / 12.0 · vermilion 6.2 / 6.5
 * · ink on claret 4.9. Vermilion sits ΔE 35 from claret, 60 from amber.
 */
export const bar = {
  background: '#0A0708',
  accent: '#DA4862',
  accentSecondary: '#F2E8D5',
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#FF5C3A',
  ch: {
    accent: '218 72 98',
    accentSecondary: '242 232 213',
    success: '74 222 128',
    warning: '251 191 36',
    /* Mesh-only hues: oxblood, warm amber, deep rose. */
    oxblood: '176 50 74',
    amber: '224 160 60',
    rose: '142 42 90',
  },
} as const;

/**
 * "Paper" — the SEO suite's fork, and the first light palette. Applied by
 * [data-suite='seo'] in globals.css. The semantic trio sits two shades deeper
 * than the usual 600s because one token paints text, ticks and pills, and on
 * white the 600s are fills, not text colours.
 *
 * Measured on ground #F7F8FA / card #FFFFFF / worst glass panel (238 239 253):
 * foreground 17.8 / 18.9 / 16.6 · muted 7.2 / 7.7 / 6.7 · dim 5.5 / 5.9 / 5.1
 * · indigo 5.9 / 6.3 / 5.5 · hover 7.4 / 7.9 / 6.9 · secondary 5.1 / 5.4 / 4.8
 * · green-800 6.7 / 7.1 / 6.3 · amber-800 6.7 / 7.1 / 6.2 · red-700 6.1 / 6.5
 * / 5.7 · white on indigo 6.3.
 */
export const paper = {
  background: '#F7F8FA',
  accent: '#4F46E5',
  accentSecondary: '#5F6B7A',
  success: '#166534',
  warning: '#92400E',
  error: '#B91C1C',
  ch: {
    accent: '79 70 229',
    accentSecondary: '95 107 122',
    success: '22 101 52',
    warning: '146 64 14',
    /* Mesh-only pastels: indigo-300, pink-300, teal-200. */
    indigo: '165 180 252',
    rose: '249 168 212',
    teal: '153 246 228',
  },
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

  /* Finance suite (Tape): cyan through the ledger work, violet where the
     agent is looking ahead or watching, lime once the pack is signed off. */
  capture: { a: tape.ch.accent, b: tape.ch.accentSecondary },
  reconcile: { a: tape.ch.accent, b: tape.ch.success },
  examine: { a: tape.ch.accentSecondary, b: tape.ch.accent },
  anomaly: { a: tape.ch.accentSecondary, b: tape.ch.warning },
  forecast: { a: tape.ch.accent, b: tape.ch.accentSecondary },
  reporter: { a: tape.ch.success, b: tape.ch.accent },
  'finance-ready': { a: tape.ch.accent, b: tape.ch.accentSecondary },

  /* Legal suite (Bar): rose and amber at intake, oxblood as the matter
     deepens into research and the contract, back to rose for disclosure,
     amber and oxblood once the obligations are on the calendar. */
  intake: { a: bar.ch.rose, b: bar.ch.amber },
  precedent: { a: bar.ch.oxblood, b: bar.ch.rose },
  counsel: { a: bar.ch.oxblood, b: bar.ch.amber },
  redact: { a: bar.ch.rose, b: bar.ch.oxblood },
  docket: { a: bar.ch.amber, b: bar.ch.oxblood },
  'legal-ready': { a: bar.ch.oxblood, b: bar.ch.rose },

  /* SEO suite (Paper): pastel indigo and rose while the plan is made, teal
     once the site is being checked, indigo again for the result. */
  keyword: { a: paper.ch.indigo, b: paper.ch.rose },
  brief: { a: paper.ch.rose, b: paper.ch.indigo },
  onpage: { a: paper.ch.indigo, b: paper.ch.teal },
  crawler: { a: paper.ch.teal, b: paper.ch.indigo },
  serp: { a: paper.ch.indigo, b: paper.ch.rose },
  'seo-ready': { a: paper.ch.rose, b: paper.ch.teal },

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
