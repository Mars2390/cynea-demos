'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import { rankHistory, ranks, serpTotals } from '@/demos/seo/fixtures';
import { RollingNumber } from '../ui/RollingNumber';
import { RankChart } from '../ui/RankChart';

/**
 * STEP 5 — SERP · Rank Tracking Agent
 *
 * The table lands row by row at last week's positions; then, one clean
 * motion per row, the positions roll to today's — up for a gain, down for a
 * loss. Each movement is connected to the change that caused it, and the top
 * keyword's thirty days draw against the closest competitor, readable day by
 * day on hover.
 */
export function StepSerp() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = ranks.length + 1; // rows land, then the roll
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

  const landed = Math.min(ranks.length, ticks);
  const rolled = ticks >= total;
  const moved = ranks.filter((r) => r.d7 !== r.position);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* grid-cols-1 = minmax(0, 1fr): without the 0 the table's min-width sizes
          the column and the page is cut off at phone widths. */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        {/* The table. */}
        <Card guide="rank-table" glass glow delay={60} className="!p-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5 max-sm:pt-5">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Priority keywords · {rankHistory.to}
            </span>
            <span className="font-mono text-[11px] tabular-nums text-accent">{landed}/{ranks.length} tracked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[12.5px]">
              <thead>
                <tr className="border-b border-border">
                  {['Keyword', 'Position', '7d', '30d', 'Top competitor'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-2 font-mono text-[9px] font-normal uppercase tracking-eyebrow text-dim ${i === 0 || i === 4 ? 'text-left' : 'text-right'} ${i > 0 && i < 4 ? 'w-[92px]' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={rolled ? 'seo-pulse' : ''}>
                {ranks.map((r, i) => {
                  const on = i < landed;
                  const delta7 = r.d7 - r.position; // positive = gained
                  const delta30 = r.d30 - r.position;
                  const dir = delta7 > 0 ? 'up' : delta7 < 0 ? 'down' : null;
                  return (
                    <tr
                      key={r.keyword}
                      className={`seo-hover border-b border-border/60 last:border-0 transition-colors ${on ? 'demo-rise' : 'invisible'} ${
                        rolled && dir === 'up' ? 'bg-success/[0.04]' : rolled && dir === 'down' ? 'bg-error/[0.04]' : ''
                      }`}
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <td className="px-5 py-2.5 text-foreground">{r.keyword}</td>
                      <td className="px-5 py-2.5 text-right font-mono text-[14px] tabular-nums text-foreground">
                        #
                        <RollingNumber value={r.position} from={r.d7} direction={dir ?? 'up'} run={rolled} />
                      </td>
                      <td className="px-5 py-2.5 text-right font-mono tabular-nums">
                        <Delta value={rolled ? delta7 : 0} />
                      </td>
                      <td className="px-5 py-2.5 text-right font-mono tabular-nums">
                        <Delta value={rolled ? delta30 : 0} />
                      </td>
                      <td className="px-5 py-2.5 text-muted">
                        {r.competitor}
                        {r.competitorPos > 0 && <span className="ml-1.5 font-mono text-[10px] tabular-nums text-dim">#{r.competitorPos}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col gap-4 sm:gap-5">
          <Card guide="serp-totals" delay={200} glow={rolled}>
            <div className="flex items-center gap-4">
              <ProgressRing
                percent={(landed / ranks.length) * 100}
                run={loaded}
                size={82}
                tone="success"
                label={`${landed}/${ranks.length}`}
                sublabel="tracked"
                live
              />
              <div className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                  This week
                </span>
                <div className="mt-2">
                  <span className={rolled ? 'demo-pop block' : 'hidden'}>
                    <Pill tone="success" dot>
                      {serpTotals.status}
                    </Pill>
                  </span>
                  {!rolled && (
                    <Pill tone="accent" dot>
                      Comparing to 7 days ago
                    </Pill>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3.5">
              <Stat label="Gains" tone="text-success">
                <Counter to={rolled ? serpTotals.gains : 0} run={loaded} />
              </Stat>
              <Stat label="Losses" tone="text-error">
                <Counter to={rolled ? serpTotals.losses : 0} run={loaded} delayMs={100} />
              </Stat>
              <Stat label="Stable" tone="text-foreground">
                <Counter to={rolled ? serpTotals.stable : 0} run={loaded} delayMs={200} />
              </Stat>
            </div>
          </Card>

          {/* Movement, connected to cause. */}
          <Card guide="rank-movements" delay={280}>
            <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Movements · connected to cause
            </span>
            <ol className="space-y-2">
              {moved.map((r, i) => {
                const delta = r.d7 - r.position;
                const gain = delta > 0;
                return (
                  <li
                    key={r.keyword}
                    className={`${rolled ? 'demo-rise' : 'invisible'} seo-hover rounded-[12px] border px-3 py-2.5 ${
                      gain ? 'border-success/30 bg-success/[0.04]' : 'border-error/30 bg-error/[0.04]'
                    }`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-[13px] text-foreground">{r.keyword}</span>
                      <span className={`shrink-0 font-mono text-[12px] tabular-nums ${gain ? 'text-success' : 'text-error'}`}>
                        {gain ? '▲' : '▼'} {gain ? '+' : ''}
                        {delta} (now #{r.position})
                      </span>
                    </div>
                    <span className="mt-1 block text-[11.5px] leading-snug text-muted">
                      <span className="font-mono text-[9px] uppercase tracking-eyebrow text-dim">connected to · </span>
                      {r.cause}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>
      </div>

      {/* Thirty days for the top keyword. */}
      <Card delay={340}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Rank history · “{rankHistory.keyword}” · {rankHistory.from} – {rankHistory.to}
          </span>
          <span className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-eyebrow text-dim">
            <span className="flex items-center gap-1.5"><span className="h-[2px] w-5 rounded-full bg-accent" /> You</span>
            <span className="flex items-center gap-1.5"><span className="h-[2px] w-5 rounded-full bg-accent-secondary" /> {rankHistory.competitor}</span>
          </span>
        </div>
        <RankChart
          you={rankHistory.you}
          them={rankHistory.them}
          from={rankHistory.from}
          to={rankHistory.to}
          fixDay={rankHistory.fixDay}
          fixLabel="OnPage fix · 03 Nov"
          competitor={rankHistory.competitor}
          run={loaded}
          guide="rank-chart"
        />
        <p className="mt-2 text-[12px] text-dim">Hover the chart to read any day.</p>
      </Card>
    </div>
  );
}

/* ======================================================================== */

function Delta({ value }: { value: number }) {
  if (value === 0) return <span className="text-dim">—</span>;
  const gain = value > 0;
  return (
    <span className={gain ? 'text-success' : 'text-error'}>
      {gain ? '▲' : '▼'} {gain ? '+' : ''}
      {value}
    </span>
  );
}

function Stat({ label, tone, children }: { label: string; tone: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <span className={`block font-display text-[24px] tabular-nums leading-none ${tone}`}>{children}</span>
      <span className="mt-1 block font-mono text-[9px] uppercase tracking-eyebrow text-dim">{label}</span>
    </div>
  );
}
