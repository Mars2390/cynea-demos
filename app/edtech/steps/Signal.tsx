'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Counter } from '@/components/ui/Counter';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import {
  cohort,
  drifters,
  interventions,
  signalTotals,
  termSeries,
  type DriftReason,
} from '@/demos/edtech/fixtures';
import { RollingNumber } from '../ui/RollingNumber';
import { TermChart } from '../ui/TermChart';

const reasonLabel: Record<DriftReason, string> = {
  engagement: 'Engagement',
  missed: 'Missed work',
  performance: 'Performance',
};

/**
 * STEP 4 — SIGNAL · Learner Progress Agent
 *
 * The term's engagement draws for the whole cohort and for the twelve who
 * are drifting away from it — readable week by week on hover. The twelve
 * land with the reason each was flagged, their engagement rolling down from
 * last month to this, and a suggested next step. An ambient counter keeps
 * reading: the watching never stops.
 */
export function StepSignal() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = drifters.length + 1 + interventions.length; // land, roll, suggest
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
    }, Math.round(timing.scanLogLineMs * 0.36));
    return () => clearInterval(id);
  }, [reduced, total]);

  const landed = Math.min(drifters.length, ticks);
  const rolled = ticks > drifters.length;
  const suggested = Math.max(0, Math.min(interventions.length, ticks - drifters.length - 1));
  const done = ticks >= total;
  const ambient = useAmbient(41260, rolled, reduced);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* The term, drawn. */}
      <Card guide="cohort" glass glow delay={60}>
        <div className="mb-3 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Cohort · engagement this term
            </span>
            <span className="mt-1.5 block font-display text-[22px] leading-tight text-foreground sm:text-[24px]">
              {cohort.title}
            </span>
          </div>
          {/* Ambient: the reading never stops while the cohort is on screen. */}
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <Pill tone={rolled ? 'warn' : 'accent'} dot>
              {rolled ? `${drifters.length} drifting` : 'Reading the term'}
            </Pill>
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-dim">
              <span className="tabular-nums text-muted">{ambient.toLocaleString('en-GB')}</span> signals read this term
            </span>
          </div>
        </div>
        <TermChart
          cohort={termSeries.cohort}
          drifting={termSeries.drifting}
          flagWeek={cohort.flagWeek}
          flagLabel={`Week ${cohort.flagWeek} · flags raised`}
          run={loaded}
        />
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-eyebrow text-dim">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-4 rounded-full bg-accent" /> Cohort · {cohort.learners}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-4 rounded-full bg-accent-secondary" /> Drifting · {drifters.length}
          </span>
          <span className="ml-auto">Hover for the week</span>
        </div>
      </Card>

      {/* grid-cols-1 = minmax(0, 1fr): without the 0 the table's min-width sizes
          the column and the page is cut off at phone widths. */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        {/* Who, and why. */}
        <Card guide="drift-list" delay={180} className="!p-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5 max-sm:pt-5">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Drifting · who, when, why
            </span>
            <span className="font-mono text-[11px] tabular-nums text-accent">
              {landed}/{drifters.length} flagged
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[12.5px]">
              <thead>
                <tr className="border-b border-border">
                  {['Learner', 'Why', 'Engagement', 'Suggested'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-2 font-mono text-[9px] font-normal uppercase tracking-eyebrow text-dim ${i === 2 ? 'w-[120px] text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={rolled ? 'edtech-pulse' : ''}>
                {drifters.map((d, i) => {
                  const on = i < landed;
                  return (
                    <tr
                      key={d.learner}
                      className={`${on ? '' : 'invisible'} border-b border-border/60 transition-colors last:border-0 hover:bg-card-hover`}
                    >
                      <td className="px-5 py-2 text-foreground">{d.learner}</td>
                      <td className="px-5 py-2">
                        <span className="flex flex-wrap items-center gap-2">
                          <Pill tone="warn" dot>
                            {reasonLabel[d.reason]}
                          </Pill>
                          <span className="hidden text-[11.5px] text-muted lg:inline">{d.detail}</span>
                        </span>
                      </td>
                      <td className="px-5 py-2 text-right font-mono tabular-nums text-foreground">
                        <RollingNumber value={d.to} from={d.from} direction="down" run={rolled} />
                        <span className="text-dim">%</span>
                        <span className="ml-1.5 text-[10px] text-dim">was {d.from}</span>
                      </td>
                      <td className="px-5 py-2 text-[12px] text-muted">{d.action}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col gap-4 sm:gap-5">
          {/* What to do about it. */}
          <Card guide="interventions" delay={260} glow={done}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Interventions suggested
              </span>
              <span className="font-mono text-[11px] tabular-nums text-accent">
                <Counter to={suggested} run={loaded} />/{interventions.length}
              </span>
            </div>
            <ol className={`space-y-2 ${done ? 'edtech-pulse' : ''}`}>
              {interventions.map((iv, i) => {
                const on = i < suggested;
                return (
                  <li
                    key={iv.action}
                    className={`edtech-hover rounded-[12px] border px-3.5 py-2.5 transition-colors duration-500 ${
                      on ? 'border-border bg-card' : 'border-border/50 bg-card/40 opacity-45'
                    }`}
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] text-foreground">{iv.action}</span>
                      <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-eyebrow text-dim">{iv.when}</span>
                    </span>
                    <span className="mt-0.5 block text-[11.5px] text-muted">{iv.who}</span>
                  </li>
                );
              })}
            </ol>
            {/* Final status always in the DOM, laid out from the start. */}
            <div className="mt-4 border-t border-border pt-3.5">
              <span className={done ? 'demo-pop block' : 'invisible block'}>
                <Pill tone="success" dot>
                  {signalTotals.status}
                </Pill>
              </span>
            </div>
          </Card>

          <Card delay={340}>
            <p className="text-[13px] leading-relaxed text-muted">
              <span className="text-foreground">{signalTotals.note}</span>
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-dim">
              No learner is contacted by Signal. The teacher chooses which suggestions to act on.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ======================================================================== */

/**
 * A number that keeps counting while the cohort is on screen: a few signals
 * a second, with jitter so it never reads as a metronome. Static under
 * reduced motion, and only starts once the list has settled so it never
 * competes with the reveal.
 */
function useAmbient(base: number, active: boolean, reduced: boolean) {
  const [n, setN] = useState(base);
  useEffect(() => {
    if (!active || reduced) return;
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      setN((v) => v + 1 + Math.floor(Math.random() * 3));
      id = setTimeout(tick, 550 + Math.random() * 700);
    };
    id = setTimeout(tick, 600);
    return () => clearTimeout(id);
  }, [active, reduced]);
  return n;
}
