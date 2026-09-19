'use client';

import { useEffect, useState } from 'react';
import { timing } from '@/lib/timing';
import { Button } from './ui/Button';

/**
 * "Why this matters" footer plus the advance button. The footer fades in on a
 * delay so the stage reads first and the rationale lands second.
 */
export function StepFooter({
  why,
  next,
  onNext,
  stepId,
}: {
  why: string | null;
  next: string | null;
  onNext: () => void;
  /** Changing this replays the reveal. */
  stepId: string;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setShown(false);
    const t = setTimeout(() => setShown(true), timing.footerRevealMs);
    return () => clearTimeout(t);
  }, [stepId]);

  if (!why && !next) return null;

  return (
    <div
      className={`mt-8 flex flex-col gap-4 border-t border-border pt-5 transition-all duration-700 ease-demo sm:flex-row sm:items-center sm:justify-between ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      {why && (
        <div className="max-w-[560px]" data-guide="why">
          <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-eyebrow text-accent">
            Why this matters
          </span>
          <p className="text-[13px] leading-relaxed text-muted">{why}</p>
        </div>
      )}

      {next && (
        <div className="shrink-0">
          <Button onClick={onNext} autoFocus guide="next-button">
            {next}
          </Button>
        </div>
      )}
    </div>
  );
}
