'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Check, Pending } from '@/components/ui/Check';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import {
  authorities,
  matterFile,
  precedentTotals,
  researchQuestion,
  researchSources,
} from '@/demos/legal/fixtures';

/**
 * STEP 2 — PRECEDENT · Legal Research Agent
 *
 * The three sources are searched in turn, then the authorities land one at a
 * time. The distinguishing case is shown, flagged, rather than dropped — the
 * step's argument is that a research answer you can check beats one that
 * sounds sure.
 */
export function StepPrecedent() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const sourceTicks = researchSources.length;
  const resultTicks = authorities.length;
  const totalTicks = sourceTicks + resultTicks;
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    if (reduced) {
      setTicks(totalTicks);
      return;
    }
    setTicks(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTicks(i);
      if (i >= totalTicks) clearInterval(id);
    }, Math.round(timing.scanLogLineMs * 0.8));
    return () => clearInterval(id);
  }, [reduced, totalTicks]);

  const searched = Math.min(sourceTicks, ticks);
  const searching = searched < sourceTicks;
  const returned = Math.max(0, Math.min(resultTicks, ticks - sourceTicks));
  const complete = returned === resultTicks;

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* The question, and where it is being searched. */}
        <Card guide="research-question" glass glow delay={60}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Research question · {matterFile.number}
            </span>
            <Pill tone={complete ? 'success' : 'accent'} dot>
              {complete ? 'Answered' : searching ? 'Searching' : 'Returning'}
            </Pill>
          </div>
          <p className="font-display text-[19px] font-semibold leading-snug tracking-[-0.3px] text-foreground sm:text-[22px]">
            {researchQuestion}
          </p>
          <ol className="mt-4 grid gap-2 border-t border-border pt-4 sm:grid-cols-3">
            {researchSources.map((src, i) => {
              const done = i < searched;
              const active = !done && i === searched;
              return (
                <li
                  key={src.label}
                  className={`rounded-[12px] border px-3 py-2.5 transition-colors duration-500 ${
                    done ? 'border-success/25 bg-success/[0.05]' : 'border-border/60 bg-card/40'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className={`text-[12.5px] ${done ? 'text-foreground' : 'text-dim'}`}>
                      {src.label}
                    </span>
                    {done ? (
                      <span className="demo-pop block">
                        <Check size={3} />
                      </span>
                    ) : active ? (
                      <span className="demo-scan-bar block h-[2px] w-10 rounded-full bg-border" />
                    ) : (
                      <Pending />
                    )}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-eyebrow text-dim">
                    {src.scope}
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>

        {/* The authorities, as they return. */}
        <Card guide="authorities" delay={200}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Authorities · cited and checkable
            </span>
            <span className="font-mono text-[11px] tabular-nums text-accent">
              {returned}/{resultTicks} returned
            </span>
          </div>
          <ol className="space-y-2">
            {authorities.map((a, i) => {
              const on = i < returned;
              const flagged = Boolean(a.flag);
              return (
                <li
                  key={a.id}
                  data-guide={`authority-${a.id}`}
                  className={`rounded-[12px] border px-3.5 py-3 transition-all duration-500 ${
                    !on
                      ? 'border-border/40 bg-card/30 opacity-40'
                      : flagged
                        ? 'border-warning/40 bg-warning/[0.06]'
                        : 'border-border/70 bg-card/40'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
                    <span className="min-w-0 font-mono text-[11.5px] leading-snug text-foreground">
                      {a.cite}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <Pill tone="secondary">{a.source}</Pill>
                      {/* Space reserved from the start so the card's height
                          never changes under the guide's spotlight. */}
                      <span className={on ? 'demo-pop block' : 'invisible block'}>
                        <Pill tone="accent">Checkable ↗</Pill>
                      </span>
                    </span>
                  </div>
                  <p className={`mt-2 text-[13px] leading-relaxed ${on ? 'text-foreground/90' : 'text-dim'}`}>
                    {a.holding}
                  </p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                    <span className="font-mono text-[9.5px] uppercase tracking-eyebrow text-dim">
                      Relevance ·{' '}
                    </span>
                    {a.relevance}
                  </p>
                  {/* Always laid out, so the prerender carries it and the card
                      does not grow when it is revealed. */}
                  {a.flag && (
                    <p
                      className={`${on ? 'demo-rise' : 'invisible'} mt-2.5 border-t border-warning/25 pt-2 text-[12px] text-warning`}
                    >
                      {a.flag}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Card guide="precedent-totals" delay={300} glow={complete}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={(returned / resultTicks) * 100}
              run={loaded}
              size={82}
              tone="success"
              label={`${returned}/${resultTicks}`}
              sublabel="cited"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Result
              </span>
              <div className="mt-2">
                <Pill tone={complete ? 'success' : 'accent'} dot>
                  {precedentTotals.status}
                </Pill>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3.5">
            <Stat label="Cited" tone="text-success">
              <Counter to={precedentTotals.authorities} run={loaded} />
            </Stat>
            <Stat label="Distinguished" tone="text-warning">
              <Counter to={1} run={loaded} delayMs={100} />
            </Stat>
            <Stat label="Uncited" tone="text-foreground">
              <Counter to={0} run={loaded} delayMs={200} />
            </Stat>
          </div>
        </Card>

        <Card delay={380}>
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Checkable, not confident
          </span>
          <p className="text-[13px] leading-relaxed text-muted">
            Every summary links to the passage it came from. If a proposition
            cannot be traced to a source, Precedent does not return it — and
            the case that cuts the other way is shown, not buried.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  tone,
  children,
}: {
  label: string;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <span className={`block font-display text-[24px] font-semibold leading-none ${tone}`}>
        {children}
      </span>
      <span className="mt-1 block font-mono text-[9px] uppercase tracking-eyebrow text-dim">
        {label}
      </span>
    </div>
  );
}
