'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks';

type Tone = 'accent' | 'success' | 'secondary';

const strokes: Record<Tone, string> = {
  accent: 'var(--accent)',
  success: 'var(--success)',
  secondary: 'var(--accent-secondary)',
};

/**
 * Circular progress ring that sweeps to `percent` on step entry.
 *
 * The sweep is a CSS transition on stroke-dashoffset (see .demo-ring), so it is
 * driven purely by a state flip rather than a keyframe — which lets the value
 * come from data. Under reduced motion the ring is drawn at its final value
 * with no transition.
 */
export function ProgressRing({
  percent,
  run,
  size = 84,
  stroke = 6,
  tone = 'accent',
  label,
  sublabel,
  delayMs = 0,
  live = false,
}: {
  percent: number;
  run: boolean;
  size?: number;
  stroke?: number;
  tone?: Tone;
  /** Large text in the middle — defaults to the percentage. */
  label?: string;
  sublabel?: string;
  delayMs?: number;
  /**
   * Set when `percent` is driven by live progress rather than a single sweep.
   *
   * The default 1.1s transition restarts on every value change, so a ring
   * tracking a checklist that ticks every 500ms never catches up and sits
   * visibly behind its own label. A shorter duration keeps it in step.
   */
  live?: boolean;
}) {
  const reduced = useReducedMotion();
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (!run) {
      setFilled(false);
      return;
    }
    if (reduced) {
      setFilled(true);
      return;
    }
    const t = setTimeout(() => setFilled(true), delayMs + 60);
    return () => clearTimeout(t);
  }, [run, reduced, delayMs]);

  const clamped = Math.max(0, Math.min(100, percent));
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  /**
   * `filled` exists only to create the opening sweep from empty for a ring
   * whose value is known up front. A live ring already starts at 0%, so the
   * latch adds nothing — and if its timer is ever cleared by a re-render the
   * ring stays empty forever while its own label reads 4/4. Live rings bypass
   * it and track `percent` directly.
   */
  const offset =
    live || filled ? circumference * (1 - clamped / 100) : circumference;

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ?? `${clamped}%`}${sublabel ? ` — ${sublabel}` : ''}`}
    >
      <svg
        className="demo-ring absolute inset-0 -rotate-90"
        width={size}
        height={size}
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border-hi)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokes[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          /* strokeDashoffset goes through `style`, not the SVG presentation
             attribute. Chrome will not reliably transition an attribute-driven
             value: the attribute updated correctly while the computed value
             stayed pinned, so the ring snapped instead of sweeping. */
          style={{
            strokeDashoffset: offset,
            /* A live ring gets no delay: the delay only exists to stagger the
               opening sweep, and it restarts on every value change — so a ring
               fed new values every 500ms never finishes a transition and sits
               at its start value until the updates stop. */
            transitionDelay: live ? '0ms' : `${delayMs}ms`,
            ...(live ? { transitionDuration: '380ms' } : null),
          }}
        />
      </svg>

      <span className="relative flex flex-col items-center justify-center leading-none">
        <span
          className="font-display text-[19px] font-semibold text-foreground"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {label ?? `${clamped}%`}
        </span>
        {sublabel && (
          <span className="mt-0.5 font-mono text-[8px] uppercase tracking-eyebrow text-dim">
            {sublabel}
          </span>
        )}
      </span>
    </div>
  );
}
