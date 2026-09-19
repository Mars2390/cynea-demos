import type { ReactNode } from 'react';
import type { CheckStatus } from '@/lib/types';

type Tone = 'accent' | 'success' | 'muted' | 'warn' | 'secondary';

const tones: Record<Tone, string> = {
  accent: 'border-accent/40 bg-accent/10 text-accent',
  success: 'border-success/40 bg-success/10 text-success',
  secondary:
    'border-accent-secondary/40 bg-accent-secondary/10 text-accent-secondary',
  muted: 'border-border-hi bg-card-hover text-muted',
  warn: 'border-warning/40 bg-warning/10 text-warning',
};

const dots: Record<Tone, string> = {
  accent: 'bg-accent',
  success: 'bg-success',
  secondary: 'bg-accent-secondary',
  muted: 'bg-muted',
  warn: 'bg-warning',
};

export function Pill({
  children,
  tone = 'accent',
  dot = false,
  className = '',
  guide,
}: {
  children: ReactNode;
  tone?: Tone;
  /** Adds a pulsing status dot. */
  dot?: boolean;
  className?: string;
  guide?: string;
}) {
  return (
    <span
      data-guide={guide}
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-eyebrow ${tones[tone]} ${className}`}
    >
      {dot && (
        <span
          aria-hidden
          className={`demo-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full ${dots[tone]}`}
        />
      )}
      {children}
    </span>
  );
}

/**
 * Maps a check status to a pill tone. Green is reserved for Pass so the
 * assessment reads as status rather than brand colour; a Low country-risk
 * benchmark is informational, so it takes the indigo secondary instead.
 */
export const toneForStatus = (status: CheckStatus): Tone =>
  status === 'pass'
    ? 'success'
    : status === 'low'
      ? 'secondary'
      : status === 'fail'
        ? 'warn'
        : 'muted';
