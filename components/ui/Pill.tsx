import type { ReactNode } from 'react';
import type { CheckStatus } from '@/lib/types';

type Tone = 'accent' | 'success' | 'muted' | 'warn';

const tones: Record<Tone, string> = {
  accent: 'border-accent/40 bg-accent/10 text-accent',
  success: 'border-success/40 bg-success/10 text-success',
  muted: 'border-border-hi bg-card-hover text-muted',
  warn: 'border-error/40 bg-error/10 text-error',
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
      className={`inline-flex items-center gap-2 rounded-pill border px-2.5 py-1 font-mono text-[10px] uppercase tracking-eyebrow ${tones[tone]} ${className}`}
    >
      {dot && (
        <span
          aria-hidden
          className={`demo-pulse-dot h-1.5 w-1.5 rounded-full ${
            tone === 'success' ? 'bg-success' : 'bg-accent'
          }`}
        />
      )}
      {children}
    </span>
  );
}

/** Maps a check status to the matching pill tone. */
export const toneForStatus = (status: CheckStatus): Tone =>
  status === 'pass'
    ? 'success'
    : status === 'low'
      ? 'accent'
      : status === 'fail'
        ? 'warn'
        : 'muted';
