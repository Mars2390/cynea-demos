'use client';

import { useEffect, useState } from 'react';
import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { flagged, markedSamples, markerTotals, submissions } from '@/demos/edtech/fixtures';
import { RollingNumber } from '../ui/RollingNumber';

const MARK_MS = 55;

/**
 * STEP 2 — MARKER · Feedback & Marking Agent
 *
 * Forty-seven responses are marked against the rubric one after another;
 * three of them are opened so the feedback is readable, each with the
 * rubric point it came from. One borderline answer is not decided — it is
 * flagged for the teacher, who keeps the final say. The turnaround rolls
 * from weeks to days.
 */
export function StepMarker() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = submissions.count + markedSamples.length + 1; // mark, open three, flag
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    if (reduced) {
      setTicks(total);
      return;
    }
    setTicks(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTicks(i);
      if (i >= total) clearInterval(id);
    }, MARK_MS);
    return () => clearInterval(id);
  }, [reduced, total]);

  const marked = Math.min(submissions.count, ticks);
  const opened = Math.max(0, Math.min(markedSamples.length, ticks - submissions.count));
  const done = ticks >= total;

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* The pile, marked. */}
        <Card guide="submissions" glass glow delay={60}>
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <ProgressRing
              percent={(marked / submissions.count) * 100}
              run={loaded}
              size={82}
              tone="success"
              label={String(marked)}
              sublabel={`of ${submissions.count}`}
              live
            />
            <div className="min-w-0 flex-1">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Submissions
              </span>
              <span className="mt-1 block font-display text-[20px] leading-tight text-foreground sm:text-[22px]">
                {submissions.title}
              </span>
              <div className="mt-2">
                <Pill tone={done ? 'success' : 'accent'} dot>
                  {marked < submissions.count ? 'Marking against the rubric' : done ? 'Marked' : 'Writing feedback'}
                </Pill>
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <CardRow label="Quiz" value={submissions.quiz} />
            <CardRow label="Received" value={submissions.received} mono />
            <CardRow label="Rubric" value={submissions.rubric} />
          </div>
        </Card>

        {/* Three of the forty-seven, opened. */}
        <Card guide="marked-samples" delay={180}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Marked responses · sample of {markedSamples.length}
            </span>
            <span className="font-mono text-[11px] tabular-nums text-accent">
              <Counter to={marked} run={loaded} /> with feedback
            </span>
          </div>
          <ol className={`space-y-2 ${done ? 'edtech-pulse' : ''}`}>
            {markedSamples.map((m, i) => {
              const on = i < opened;
              return (
                <li
                  key={m.learner}
                  className={`edtech-hover rounded-[12px] border px-3.5 py-3 transition-colors duration-500 ${
                    on ? 'border-border bg-card' : 'border-border/50 bg-card/40 opacity-45'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex min-w-0 items-baseline gap-2.5">
                      <span className="font-mono text-[10px] text-dim">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[13.5px] text-foreground">{m.learner}</span>
                    </span>
                    <span className="shrink-0 font-mono text-[12px] tabular-nums text-foreground">
                      <Counter to={on ? m.score : 0} run={loaded} />
                      <span className="text-dim">/{m.outOf}</span>
                    </span>
                  </div>
                  <p className={`mt-1.5 text-[12.5px] leading-relaxed text-muted transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`}>
                    {m.feedback}
                  </p>
                  <div className={`mt-2 transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`}>
                    <Pill tone="muted">{m.rubric}</Pill>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        {/* Not decided: flagged for the teacher. */}
        <Card guide="flagged" delay={260} glow={done}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                For teacher review
              </span>
              <span className="mt-1 block font-display text-[26px] leading-none text-foreground">
                <Counter to={done ? flagged.count : 0} run={loaded} /> <span className="text-[14px] text-muted">of {submissions.count}</span>
              </span>
            </div>
            <span className={done ? 'demo-pop' : 'invisible'}>
              <Pill tone="warn" dot>
                Borderline
              </Pill>
            </span>
          </div>
          <div className={`mt-4 rounded-[12px] border border-warning/30 bg-warning/[0.04] p-3.5 transition-opacity duration-500 ${done ? 'opacity-100' : 'opacity-0'}`}>
            <span className="block font-mono text-[9.5px] uppercase tracking-eyebrow text-warning">
              {flagged.shown.learner} · {flagged.shown.question}
            </span>
            <span className="mt-1 block text-[13px] leading-snug text-foreground">{flagged.shown.reason}</span>
            <span className="mt-1.5 block text-[12px] leading-relaxed text-muted">{flagged.shown.detail}</span>
          </div>
          {/* Final status always in the DOM, laid out from the start. */}
          <div className="mt-4 border-t border-border pt-3.5">
            <span className={done ? 'demo-pop block' : 'invisible block'}>
              <Pill tone="success" dot>
                {markerTotals.status}
              </Pill>
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <Button disabled={!done}>Review flagged</Button>
            <p className="text-[12px] leading-relaxed text-dim">Visual only in this demo. The teacher decides.</p>
          </div>
        </Card>

        {/* The point of it. */}
        <Card delay={340}>
          <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Turnaround · feedback to learners
          </span>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-[34px] leading-none tabular-nums text-foreground">
              <RollingNumber value={2} from={21} direction="down" run={done} />
            </span>
            <span className="text-[13px] text-muted">days, was {markerTotals.turnaround.before}</span>
          </div>
          <p className="mt-3 border-t border-border pt-3 text-[12px] leading-relaxed text-dim">
            First-pass marks and feedback the same week. The teacher reads the three borderline answers, not forty-seven.
          </p>
        </Card>
      </div>
    </div>
  );
}
