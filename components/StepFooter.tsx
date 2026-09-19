'use client';

import { useEffect, useState } from 'react';
import { timing } from '@/lib/timing';
import { Button } from './ui/Button';

/**
 * "Why this matters" footer plus the advance button. The footer fades in on a
 * delay so the stage reads first and the rationale lands second.
 *
 * The Next button starts pulsing once the step's intro has settled — that is
 * the hybrid flow's handover signal: the step has finished showing itself, and
 * now it is the viewer's turn.
 */
export function StepFooter({
  why,
  next,
  onNext,
  stepId,
  attention,
  guideOn,
}: {
  why: string | null;
  next: string | null;
  onNext: () => void;
  /** Changing this replays the reveal. */
  stepId: string;
  /** Intro has settled — ask for the click. */
  attention: boolean;
  /** Reserve space so the bubble cannot sit on top of the copy. */
  guideOn: boolean;
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
      className={`demo-scrim mt-8 flex flex-col gap-5 border-t border-border pt-5 transition-all duration-700 ease-demo sm:flex-row sm:items-center sm:justify-between ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      {why && (
        <div
          className={`max-w-[560px] ${guideOn ? 'demo-clear-bubble' : ''}`}
          data-guide="why"
        >
          <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-eyebrow text-accent">
            Why this matters
          </span>
          <p className="text-[13px] leading-relaxed text-muted">{why}</p>
        </div>
      )}

      {next && (
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden font-mono text-[9px] uppercase tracking-eyebrow text-dim sm:block">
            or press →
          </span>
          <Button onClick={onNext} guide="next-button" pulse={attention}>
            {next}
          </Button>
        </div>
      )}
    </div>
  );
}
