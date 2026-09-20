'use client';

import { useEffect, useState } from 'react';
import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import {
  client,
  clusters,
  keywordTotals,
  sampleQueries,
  type Intent,
} from '@/demos/seo/fixtures';

const intentTone: Record<Intent, string> = {
  transactional: 'text-success',
  commercial: 'text-accent',
  informational: 'text-muted',
  navigational: 'text-dim',
};

/**
 * STEP 1 — KEYWORD · Keyword Research Agent
 *
 * Queries land in the map one at a time and sort themselves into four intent
 * columns; once the sample has landed, each cluster reveals its numbers and
 * the three that lead to a purchase are marked high priority. An ambient
 * counter in the panel's corner keeps ticking — the map is never finished.
 */
export function StepKeyword({ onSkipToResult }: { onSkipToResult: () => void }) {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = sampleQueries.length;
  const [ticks, setTicks] = useState(0); // 0..total = queries landed; total+1 = clusters revealed

  useEffect(() => {
    if (reduced) {
      setTicks(total + 1);
      return;
    }
    setTicks(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTicks(i);
      if (i >= total + 1) clearInterval(id);
    }, Math.round(timing.scanLogLineMs * 0.62));
    return () => clearInterval(id);
  }, [reduced, total]);

  const landed = Math.min(total, ticks);
  const revealed = ticks > total;
  const mapped = revealed ? keywordTotals.queries : Math.round((landed / total) * keywordTotals.queries);
  const ambient = useAmbient(18402, revealed, reduced);

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
      {/* The query map. */}
      <Card guide="query-map" glass glow delay={60}>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Query map · {client.name}
            </span>
            <span className="mt-1.5 block font-display text-[22px] leading-tight text-foreground sm:text-[24px]">
              {client.market}
            </span>
            <span className="mt-1 block text-[12.5px] text-muted">{client.brief}</span>
          </div>
          {/* Ambient: the session keeps scanning while the map is on screen. */}
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <Pill tone={revealed ? 'success' : 'accent'} dot>
              {revealed ? 'Mapped' : 'Mapping'}
            </Pill>
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-dim">
              <span className="tabular-nums text-muted">{ambient.toLocaleString('en-GB')}</span> queries scanned this session
            </span>
          </div>
        </div>

        <div data-guide="clusters" className="grid gap-2.5 sm:grid-cols-2">
          {clusters.map((c, ci) => {
            const mine = sampleQueries.filter((q) => q.intent === c.id);
            const shown = mine.filter((q) => sampleQueries.indexOf(q) < landed);
            return (
              <div
                key={c.id}
                className={`seo-hover flex min-h-[200px] flex-col rounded-[14px] border p-3.5 transition-colors duration-500 ${
                  revealed && c.high
                    ? 'border-accent/30 bg-accent/[0.04]'
                    : 'border-border bg-card/60'
                }`}
                style={{ animationDelay: `${120 + ci * 40}ms` }}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className={`font-mono text-[9.5px] uppercase tracking-eyebrow ${intentTone[c.id]}`}>
                    {c.label}
                  </span>
                  <span className={`${revealed && c.high ? 'demo-pop block' : 'invisible'}`}>
                    <Pill tone="accent">Priority</Pill>
                  </span>
                </div>

                {/* Queries sorting into this cluster, 40 ms apart. */}
                <ol className="min-h-[76px] space-y-1">
                  {mine.map((q) => {
                    const on = sampleQueries.indexOf(q) < landed;
                    return (
                      <li
                        key={q.q}
                        className={`${on ? 'demo-rise' : 'invisible'} flex items-baseline justify-between gap-2 text-[12px]`}
                        style={{ animationDelay: `${(shown.indexOf(q) > -1 ? shown.indexOf(q) : 0) * 40}ms` }}
                      >
                        <span className="truncate text-foreground">{q.q}</span>
                        <span className="shrink-0 font-mono text-[10px] tabular-nums text-dim">
                          {q.vol.toLocaleString('en-GB')}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                {/* Cluster numbers, once the map has settled. */}
                <div className={`mt-auto border-t border-border pt-2.5 transition-opacity duration-500 ${revealed ? 'opacity-100' : 'opacity-35'}`}>
                  <div className="grid grid-cols-3 gap-2">
                    <Stat label="Queries">
                      <Counter to={revealed ? c.queries : 0} run={loaded} group />
                    </Stat>
                    <Stat label="Diff.">
                      <Counter to={revealed ? c.difficulty : 0} run={loaded} />
                    </Stat>
                    <Stat label="Value">
                      <Counter to={revealed ? c.value : 0} run={loaded} />
                    </Stat>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-eyebrow text-dim">Priority</span>
                    <span className="flex items-center gap-2">
                      <span className="h-[3px] w-16 overflow-hidden rounded-full bg-border">
                        <span
                          className="block h-full rounded-full bg-accent transition-[width] duration-700 ease-demo"
                          style={{ width: revealed ? `${c.priority}%` : '0%' }}
                        />
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-foreground">
                        <Counter to={revealed ? c.priority : 0} run={loaded} />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Card guide="keyword-totals" delay={220} glow={revealed}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={(mapped / keywordTotals.queries) * 100}
              run={loaded}
              size={82}
              tone="success"
              label={String(revealed ? keywordTotals.targets : Math.round((landed / total) * keywordTotals.targets))}
              sublabel="targets"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                This month's plan
              </span>
              {/* Final status always in the DOM for the prerender. */}
              <div className="mt-2">
                <span className={revealed ? 'demo-pop block' : 'hidden'}>
                  <Pill tone="success" dot>
                    {keywordTotals.status}
                  </Pill>
                </span>
                {!revealed && (
                  <Pill tone="accent" dot>
                    Clustering by intent
                  </Pill>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3.5">
            <Stat label="Queries" big>
              <Counter to={mapped} run={loaded} group />
            </Stat>
            <Stat label="Clusters" big>
              <Counter to={keywordTotals.clusters} run={loaded} delayMs={100} />
            </Stat>
            <Stat label="Priority" big>
              <Counter to={revealed ? keywordTotals.targets : 0} run={loaded} delayMs={200} />
            </Stat>
          </div>
        </Card>

        <Card delay={300}>
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Client
          </span>
          <span className="block font-display text-[20px] leading-tight text-foreground">{client.name}</span>
          <div className="mt-3">
            <CardRow label="Sector" value={client.sector} />
            <CardRow label="Site" value={client.site} mono />
            <CardRow label="Market" value={client.market} />
          </div>
          {/* Returning viewer? Straight to the payoff. */}
          <button
            type="button"
            onClick={onSkipToResult}
            className="demo-tap mt-4 inline-flex items-center gap-1.5 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-eyebrow text-accent transition-colors hover:text-accent-hover"
          >
            Skip to the result →
          </button>
        </Card>
      </div>
    </div>
  );
}

/* ======================================================================== */

/**
 * A number that keeps counting while the map is on screen: a few queries a
 * second, with jitter so it never reads as a metronome. Static under reduced
 * motion, and only starts once the map has settled so it never competes with
 * the reveal.
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

function Stat({ label, big = false, children }: { label: string; big?: boolean; children: React.ReactNode }) {
  return (
    <div className={big ? 'text-center' : ''}>
      <span className={`block font-mono tabular-nums text-foreground ${big ? 'font-display text-[24px]' : 'text-[12px]'}`}>
        {children}
      </span>
      <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-eyebrow text-dim">{label}</span>
    </div>
  );
}
