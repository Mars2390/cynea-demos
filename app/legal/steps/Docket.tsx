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
  docketTotals,
  executedContract,
  obligations,
  type ObligationKind,
} from '@/demos/legal/fixtures';

/**
 * STEP 5 — DOCKET · Deadline & Obligations Agent
 *
 * The executed contract on the left, read sentence by sentence; each date
 * phrase lights up as it is found and its obligation lands on the timeline
 * on the right, already owned and already in the calendar. The story ends
 * with nothing left for anyone to remember.
 */
export function StepDocket() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = obligations.length;
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
    }, Math.round(timing.scanLogLineMs * 0.95));
    return () => clearInterval(id);
  }, [reduced, total]);

  const extracted = Math.min(total, ticks);
  const done = extracted === total;

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* The contract, read for dates. */}
      <Card guide="contract-read" glass glow delay={60}>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Executed contract · court order
            </span>
            <span className="mt-1.5 block font-display text-[20px] font-semibold leading-tight tracking-[-0.4px] text-foreground sm:text-[22px]">
              {executedContract.title}
            </span>
            <span className="mt-1 block text-[12.5px] text-muted">{executedContract.parties}</span>
          </div>
          <Pill tone="secondary">{executedContract.version}</Pill>
        </div>

        <ol className="space-y-2 border-t border-border pt-4">
          {obligations.map((o, i) => {
            const on = i < extracted;
            const active = !on && i === extracted;
            const [before, after] = splitOnce(o.extract, o.highlight);
            return (
              <li
                key={o.id}
                className={`rounded-[12px] border px-3.5 py-3 transition-colors duration-500 ${
                  on
                    ? 'border-accent/25 bg-accent/[0.04]'
                    : active
                      ? 'border-border bg-card/40'
                      : 'border-border/50 bg-card/30'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-dim">
                    {o.source}
                  </span>
                  {on ? (
                    <span className="demo-pop block">
                      <Check size={3} />
                    </span>
                  ) : active ? (
                    <span className="demo-scan-bar block h-[2px] w-12 rounded-full bg-border" />
                  ) : (
                    <Pending />
                  )}
                </div>
                <p className={`mt-1.5 text-[13px] leading-relaxed ${on ? 'text-foreground/90' : 'text-dim'}`}>
                  {before}
                  {on ? <span className="demo-token">{o.highlight}</span> : o.highlight}
                  {after}
                </p>
              </li>
            );
          })}
        </ol>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-5">
        {/* The obligations, in date order. */}
        <Card guide="timeline" delay={200}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Obligations · date order
            </span>
            <span className="font-mono text-[11px] tabular-nums text-accent">
              {extracted}/{total} extracted
            </span>
          </div>
          <ol className="relative ml-2 border-l border-border/70 pl-5">
            {obligations.map((o, i) => {
              const on = i < extracted;
              return (
                <li
                  key={o.id}
                  data-guide={`obligation-${o.id}`}
                  className={`relative pb-4 last:pb-0 transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-35'}`}
                >
                  <span
                    aria-hidden
                    className={`absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background transition-colors duration-500 ${
                      on ? 'bg-accent' : 'bg-border-hi'
                    }`}
                  />
                  <span className="block font-mono text-[11px] tabular-nums text-accent">{o.date}</span>
                  <span className="mt-0.5 block text-[13.5px] text-foreground">{o.label}</span>
                  <span className="block text-[11.5px] text-muted">{o.when}</span>
                  <div className={`${on ? 'demo-rise' : 'hidden'} mt-2 flex flex-wrap items-center gap-1.5`}>
                    <KindPill kind={o.kind} />
                    <Pill tone="secondary">{o.owner}</Pill>
                    <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-eyebrow text-success">
                      <Check size={3} /> Calendar entry
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        {/* Nothing left to remember. */}
        <Card guide="docket-totals" delay={300} glow={done}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={(extracted / total) * 100}
              run={loaded}
              size={82}
              tone="success"
              label={`${extracted}/${total}`}
              sublabel="assigned"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Tracking
              </span>
              {/* Final status always in the DOM for the prerender. */}
              <div className="mt-2">
                <span className={done ? 'demo-pop block' : 'hidden'}>
                  <Pill tone="success" dot>
                    {docketTotals.status}
                  </Pill>
                </span>
                {!done && (
                  <Pill tone="accent" dot>
                    Extracting
                  </Pill>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3.5">
            <Stat label="Tracked" tone="text-success">
              <Counter to={done ? docketTotals.tracked : extracted} run={loaded} />
            </Stat>
            <Stat label="Unassigned" tone="text-foreground">
              <Counter to={docketTotals.unassigned} run={loaded} delayMs={100} />
            </Stat>
            <Stat label="Next due" tone="text-accent">
              <span className="text-[16px]">{obligations[0].date}</span>
            </Stat>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ======================================================================== */

/** Splits `text` around the first occurrence of `phrase`. */
function splitOnce(text: string, phrase: string): [string, string] {
  const i = text.indexOf(phrase);
  if (i === -1) return [text, ''];
  return [text.slice(0, i), text.slice(i + phrase.length)];
}

function KindPill({ kind }: { kind: ObligationKind }) {
  if (kind === 'court') return <Pill tone="accent">Court deadline</Pill>;
  if (kind === 'renewal') return <Pill tone="muted">Renewal</Pill>;
  return <Pill tone="muted">Obligation</Pill>;
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
