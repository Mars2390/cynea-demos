/**
 * Every demo timing constant lives here so the whole engine can be retuned
 * from one file.
 */

export const timing = {
  /**
   * Per-WORD stagger for the guide typewriter. The engine splits on whitespace
   * and reveals word by word via the .demo-word keyframe — it is not a
   * character-by-character effect.
   */
  guideTypewriterMs: 45,

  /** Minimum time a guide cue stays on screen before advancing. */
  cueMinDwellMs: 2200,

  /** Delay before the "Why this matters" footer fades in. */
  footerRevealMs: 1200,

  /** Step transition duration. */
  stepEnterMs: 600,

  /** Autoplay dwell per step, measured from the end of the step's intro. */
  autoplayStepMs: 7000,

  /** Delay between scan/log lines appearing. */
  scanLogLineMs: 500,

  /** Spotlight travel duration — must match .demo-spot in globals.css. */
  spotTravelMs: 520,

  /* --- premium pass --- */

  /** How long the page-load bar runs before handing over to demo progress. */
  topbarLoadMs: 900,

  /** Skeleton hold before real content swaps in. Short: it must feel like
   *  loading, not waiting. */
  skeletonMs: 620,

  /** Animated counter sweep. */
  counterMs: 1150,

  /** Progress-ring fill — must match .demo-ring in globals.css. */
  ringFillMs: 1100,

  /**
   * Time from step mount until the step's own intro (skeletons, counters,
   * rings, log lines) is considered finished. Drives when the Next button
   * starts pulsing for attention.
   */
  introSettleMs: 2400,

  /** First paint budget: content must be on screen well inside this. */
  firstPaintMs: 1000,

  /* --- guided scrolling --- */

  /**
   * Scroll duration by distance, in bands rather than a linear rate.
   *
   * A linear ms-per-pixel rate with a ceiling gave every long journey the same
   * duration, so the further the page had to travel the faster it went — on a
   * phone the 1,200px+ hops inside the Diligence step ran at ~1,800 px/s,
   * nearly three screens a second. Banding keeps short corrections snappy and
   * gives long journeys the time they need to stay legible.
   */
  scrollBands: [
    { maxPx: 500, ms: 340 },
    { maxPx: 1000, ms: 620 },
    { maxPx: Number.POSITIVE_INFINITY, ms: 1000 },
  ],

  /** Breathing room kept between a spotlit target and the safe-area edges. */
  scrollPadPx: 16,

  /** Below this, a correction reads as a twitch rather than a move. */
  scrollMinDeltaPx: 24,

  /**
   * Where a target that fits the safe band comes to rest, as a fraction of the
   * leftover space above it. 0.42 puts it just above true centre — optical
   * centre — and keeps it clear of the guide bubble's corner.
   */
  scrollBiasFromTop: 0.42,

  /**
   * A step's layout keeps settling after its first cue fires (skeletons swap
   * for content, scan-log lines append), so the target is re-checked on this
   * interval and corrected if it has drifted out of the band.
   */
  scrollRecheckMs: 300,
  /** Hard bounds on the watcher so it always terminates. */
  scrollWatchMs: 6000,
  scrollMaxCorrections: 4,
} as const;

/** Scroll tween duration for a given distance, from the bands above. */
export const scrollDurationFor = (distancePx: number) =>
  timing.scrollBands.find((b) => distancePx <= b.maxPx)?.ms ??
  timing.scrollBands[timing.scrollBands.length - 1].ms;

/** Word-stagger delay helper for the guide bubble. */
export const wordDelay = (index: number) =>
  `${index * timing.guideTypewriterMs}ms`;

/** Estimated time for a cue's text to finish revealing. */
export const typewriterDurationMs = (text: string) =>
  text.trim().split(/\s+/).length * timing.guideTypewriterMs + 260;

/** How long a cue should hold: never shorter than the minimum dwell. */
export const cueHoldMs = (text: string) =>
  Math.max(timing.cueMinDwellMs, typewriterDurationMs(text) + 600);
