'use client';

import { useEffect, useState } from 'react';
import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import {
  assessorTotals,
  difficultyTarget,
  draft,
  objectives,
  rubric,
  school,
  unit,
  type Difficulty,
} from '@/demos/edtech/fixtures';

const LEVELS: Difficulty[] = ['easy', 'medium', 'hard'];
const levelTone: Record<Difficulty, string> = {
  easy: 'bg-success',
  medium: 'bg-accent',
  hard: 'bg-warning',
};

/**
 * STEP 1 — ASSESSOR · Assessment Generation Agent
 *
 * The teacher's unit and objectives sit on the right; the draft builds on
 * the left one question at a time, sorting itself against the objectives
 * and the difficulty target as it lands. The rubric follows, then the
 * alignment check. Nothing is sent — the draft waits for the teacher.
 */
export function StepAssessor({ onSkipToResult }: { onSkipToResult: () => void }) {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = draft.length + 2; // questions land, then the rubric, then the check
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
    }, Math.round(timing.scanLogLineMs * 0.62));
    return () => clearInterval(id);
  }, [reduced, total]);

  const landed = Math.min(draft.length, ticks);
  const rubricOn = ticks > draft.length;
  const done = ticks >= total;
  const spread = LEVELS.map((l) => draft.slice(0, landed).filter((q) => q.difficulty === l).length);

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
      {/* The draft, building. */}
      <Card guide="draft-build" glass glow delay={60}>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Draft · {unit.code} unit quiz
            </span>
            <span className="mt-1.5 block font-display text-[22px] leading-tight text-foreground sm:text-[24px]">
              8 multiple choice · 2 short answer · 1 rubric
            </span>
          </div>
          <Pill tone={done ? 'success' : 'accent'} dot>
            {done ? 'Drafted' : rubricOn ? 'Writing rubric' : 'Drafting'}
          </Pill>
        </div>

        {/* Questions, 40 ms apart. */}
        <ol className={`space-y-1.5 ${done ? 'edtech-pulse' : ''}`}>
          {draft.map((q, i) => {
            const on = i < landed;
            return (
              <li
                key={q.n}
                className={`${on ? 'demo-rise' : 'invisible'} edtech-hover flex items-start gap-3 rounded-[12px] border border-border bg-card/60 px-3 py-2 text-[12.5px]`}
                style={{ animationDelay: `${(i % 4) * 40}ms` }}
              >
                <span className="w-5 shrink-0 font-mono text-[10px] text-dim">{String(q.n).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1 text-foreground">{q.stem}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="hidden font-mono text-[9px] uppercase tracking-eyebrow text-dim sm:inline">
                    {q.kind === 'mcq' ? 'MCQ' : 'Short'} · {q.objective}
                  </span>
                  <span
                    aria-label={`${q.difficulty} difficulty`}
                    title={q.difficulty}
                    className={`h-2 w-2 rounded-full ${levelTone[q.difficulty]}`}
                  />
                </span>
              </li>
            );
          })}
        </ol>

        {/* Difficulty spread against the teacher's target. */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3.5">
          {LEVELS.map((l, i) => (
            <div key={l}>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[9px] uppercase tracking-eyebrow text-dim">{l}</span>
                <span className="font-mono text-[11px] tabular-nums text-foreground">
                  <Counter to={spread[i]} run={loaded} />
                  <span className="text-dim">/{difficultyTarget[l]}</span>
                </span>
              </div>
              <span className="mt-1.5 block h-[3px] overflow-hidden rounded-full bg-border">
                <span
                  className={`block h-full rounded-full transition-[width] duration-500 ease-demo ${levelTone[l]}`}
                  style={{ width: `${(spread[i] / difficultyTarget[l]) * 100}%` }}
                />
              </span>
            </div>
          ))}
        </div>

        {/* The rubric. Laid out from the start so the card does not grow
            under the spotlight. */}
        <div className={`mt-4 border-t border-border pt-3.5 transition-opacity duration-500 ${rubricOn ? 'opacity-100' : 'opacity-0'}`}>
          <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Rubric · short answer · 4 points
          </span>
          <ol className="mt-2 grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
            {rubric.map((r, i) => (
              <li
                key={r.point}
                className={`${rubricOn ? 'demo-rise' : ''} flex items-baseline gap-2 text-[12px]`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="shrink-0 font-mono text-[10px] text-accent">{r.point}</span>
                <span className="min-w-0">
                  <span className="block text-foreground">{r.label}</span>
                  <span className="block text-[11px] leading-snug text-dim">{r.descriptor}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-5">
        {/* The teacher's target. */}
        <Card guide="unit-card" delay={220}>
          <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Unit · set by {school.teacher}
          </span>
          <span className="mt-1.5 block font-display text-[20px] leading-tight text-foreground">
            {unit.title}
          </span>
          <div className="mt-3">
            <CardRow label="Framework" value={unit.framework} />
            <CardRow label="Lessons" value={String(unit.lessons)} mono />
            <CardRow label="Target" value={unit.target} />
          </div>
          <span className="mt-4 block border-t border-border pt-3.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Learning objectives · 3
          </span>
          <ol className="mt-2 space-y-2">
            {objectives.map((o, i) => (
              <li key={o.id} className="demo-rise flex gap-2.5 text-[12px] leading-snug" style={{ animationDelay: `${300 + i * 40}ms` }}>
                <span className="shrink-0 font-mono text-[10px] text-accent">{o.id}</span>
                <span className="text-muted">{o.text}</span>
              </li>
            ))}
          </ol>
          {/* Returning viewer? Straight to the payoff. */}
          <button
            type="button"
            onClick={onSkipToResult}
            className="demo-tap mt-4 inline-flex items-center gap-1.5 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-eyebrow text-accent transition-colors hover:text-accent-hover"
          >
            Skip to the result →
          </button>
        </Card>

        {/* The alignment check. */}
        <Card guide="alignment" delay={300} glow={done}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={(landed / draft.length) * 100}
              run={loaded}
              size={82}
              tone="success"
              label={String(landed)}
              sublabel="of 10"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Alignment check
              </span>
              <span className="mt-1 block text-[12.5px] leading-snug text-foreground">
                {done ? assessorTotals.alignment : 'Checking each question against the objectives…'}
              </span>
            </div>
          </div>
          {/* Final status always in the DOM, laid out from the start. */}
          <div className="mt-4 border-t border-border pt-3.5">
            <span className={done ? 'demo-pop block' : 'invisible block'}>
              <Pill tone="success" dot>
                {assessorTotals.status}
              </Pill>
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <Button disabled={!done}>Send for review</Button>
            <p className="text-[12px] leading-relaxed text-dim">Visual only in this demo. Nothing is sent.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
