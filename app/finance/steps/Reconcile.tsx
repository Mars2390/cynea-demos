'use client';

import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { MatchRows } from '@/components/ui/MatchRows';
import { useLoaded } from '@/lib/hooks';
import {
  exceptions,
  matchedRows,
  reconcileTotals,
} from '@/demos/finance/fixtures';

/**
 * STEP 2 — RECONCILE · Bookkeeping Agent
 * Bank, invoice and ledger snap together row by row; three that will not are
 * listed with a diagnosis and a next action each.
 */
export function StepReconcile() {
  const loaded = useLoaded(true);
  const pct = Math.round(
    (reconcileTotals.matched /
      (reconcileTotals.matched + reconcileTotals.exceptions)) *
      100,
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <Card guide="match-columns" glass glow delay={60}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Matching · bank feed | invoices | ledger
          </span>
          <Pill tone="secondary">November 2026</Pill>
        </div>
        <MatchRows rows={matchedRows} run={loaded} />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-dim">
          Showing {matchedRows.length} of {reconcileTotals.matched} matched this month
        </p>
      </Card>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Card guide="reconcile-totals" delay={200}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={pct}
              run={loaded}
              size={86}
              tone="success"
              label={`${pct}%`}
              sublabel="matched"
              delayMs={160}
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Close status
              </span>
              <span className="mt-1 block font-display text-[28px] font-semibold leading-none tracking-[-0.6px] text-foreground">
                <Counter to={reconcileTotals.matched} run={loaded} /> matched
              </span>
              <div className="mt-2.5">
                <Pill tone="success" dot>
                  {reconcileTotals.status}
                </Pill>
              </div>
            </div>
          </div>
        </Card>

        <Card guide="exceptions" delay={280} glow>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Exceptions
            </span>
            <Pill tone="warn" dot>
              <Counter to={reconcileTotals.exceptions} run={loaded} />
              &nbsp;need a decision
            </Pill>
          </div>
          <ol className="space-y-1">
            {exceptions.map((e, i) => (
              <li
                key={e.kind}
                style={{ animationDelay: `${360 + i * 130}ms` }}
                className="demo-rise rounded-[12px] border border-warning/25 bg-warning/[0.05] px-3 py-2.5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-[13.5px] text-foreground">{e.kind}</span>
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
                    → {e.action}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">
                  {e.detail}
                </p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
