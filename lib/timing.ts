/**
 * Every demo timing constant lives here so the whole engine can be retuned
 * from one file. Values confirmed present in the live demo bundle.
 */

export const timing = {
  /**
   * Per-WORD stagger for the guide typewriter. The live engine splits on
   * whitespace and reveals word by word via the .demo-word keyframe — it is
   * not a character-by-character effect.
   */
  guideTypewriterMs: 45,

  /** Minimum time a guide cue stays on screen before advancing. */
  cueMinDwellMs: 2200,

  /** Delay before the "Why this matters" footer fades in. */
  footerRevealMs: 1200,

  /** Step transition duration. */
  stepEnterMs: 600,

  /** Autoplay dwell per step. */
  autoplayStepMs: 7000,

  /** Delay between scan/log lines appearing. */
  scanLogLineMs: 500,

  /** Spotlight travel duration — must match .demo-spot in globals.css. */
  spotTravelMs: 520,
} as const;

/** Word-stagger delay helper for the guide bubble. */
export const wordDelay = (index: number) =>
  `${index * timing.guideTypewriterMs}ms`;

/** Estimated time for a cue's text to finish revealing. */
export const typewriterDurationMs = (text: string) =>
  text.trim().split(/\s+/).length * timing.guideTypewriterMs + 260;

/** How long a cue should hold: never shorter than the minimum dwell. */
export const cueHoldMs = (text: string) =>
  Math.max(timing.cueMinDwellMs, typewriterDurationMs(text) + 600);
