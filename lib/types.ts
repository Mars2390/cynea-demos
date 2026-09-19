/**
 * Shared types for the demo engine. Every future agent demo reuses these,
 * so keep them agent-agnostic.
 */

/** A single step in a guided demo. Shape mirrors the live demo engine. */
export interface Step {
  /** 1-based position, shown in the stepper. */
  number: number;
  /** URL slug used in ?step=… — must be unique within a demo. */
  id: string;
  /** Short label for the stepper segment, e.g. "Collect". */
  name: string;
  /**
   * The agent behind this step, e.g. "Regulatory Watch Agent". Only suites
   * that chain several agents set it; a single-agent demo leaves it out and
   * nothing is rendered.
   */
  role?: string;
  /** Headline shown at the top of the stage. */
  title: string;
  /** "Why this matters" footer copy. Null hides the footer. */
  why: string | null;
  /** Label for the advance button. Null means this is a terminal step. */
  next: string | null;
}

/**
 * A guide cue. Fires either on a timer (`at`, ms after the step mounts) or on
 * an event (`on`, e.g. "step:collect"). `after` adds an extra delay on top.
 */
export interface GuideCue {
  /** Fire this many ms after the step mounts. */
  at?: number;
  /** Fire when this event is emitted. */
  on?: string;
  /** Additional delay applied after `at`/`on` resolves. */
  after?: number;
  /** Bubble copy, revealed word by word. */
  text: string;
  /** data-guide value of the element to spotlight. Omit for no spotlight. */
  target?: string;
  /** Optional small cyan chip rendered beside the target. */
  annotation?: string;
}

/** Which step a cue belongs to, once cues are grouped per step. */
export type GuideScript = Record<string, GuideCue[]>;

/** Status used by fixture rows and checklist items. */
export type CheckStatus = 'pass' | 'low' | 'pending' | 'fail';

/** One row in the step-3 risk assessment checklist. */
export interface RiskCheck {
  label: string;
  status: CheckStatus;
  /** Display text for the result, e.g. "Pass" or "Low". */
  result: string;
  detail: string;
}

/** A single plot in the step-2 collection panel. */
export interface Plot {
  id: string;
  supplier: string;
  hectares: number;
  /** Percent coordinates for the static map panel. */
  x: number;
  y: number;
  gps: boolean;
}

/** Metadata for a demo listed on the hub page. */
export interface DemoCard {
  slug: string;
  name: string;
  role: string;
  blurb: string;
  live: boolean;
}
