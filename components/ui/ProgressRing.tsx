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
  const offset = filled
    ? circumference * (1 - clamped / 100)
    : circumference;

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
          strokeDashoffset={offset}
          style={{ transitionDelay: `${delayMs}ms` }}
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
