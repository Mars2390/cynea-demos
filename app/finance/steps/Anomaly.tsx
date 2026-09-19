'use client';

import { useEffect, useState } from 'react';
import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import { anomaly, anomalyTotals, transactions } from '@/demos/finance/fixtures';

const gbp = (n: number) =>
  Math.abs(n).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });

/**
 * STEP 4 — ANOMALY · Anomaly Detection Agent
 *
 * The stream scrolls in one transaction at a time. The three flagged lines
 * are individually unremarkable — that is the point — so they are only tinted
 * once the pattern card has landed, not as they arrive.
 */
export function StepAnomaly() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const streamed = shown >= transactions.length;

  useEffect(() => {
    if (reduced) {
      setShown(transactions.length);
      return;
    }
    setShown(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= transactions.length) clearInterval(id);
    }, Math.round(timing.scanLogLineMs * 0.6));
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <Card guide="stream" glass delay={60}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Transaction stream · November
          </span>
          <span className="font-mono text-[11px] tabular-nums text-accent">
            <Counter to={anomalyTotals.watched} run={loaded} group /> watched
          </span>
        </div>

        {!streamed && (
          <div className="demo-scan-bar mb-3 h-[2px] w-full rounded-full bg-border" />
        )}

        <ol className="space-y-1">
          {transactions.slice(0, shown).map((t, i) => {
            const hot = streamed && t.flag;
            return (
              <li
                key={i}
                className={`demo-rise flex items-center justify-between gap-3 rounded-[10px] border px-3 py-2 transition-colors duration-700 ${
                  hot
                    ? 'border-warning/40 bg-warning/[0.07]'
                    : 'border-transparent'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px] text-foreground">{t.who}</span>
                  <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-dim">
                    {t.kind}
                  </span>
                </span>
                <span
                  className={`shrink-0 font-mono text-[12px] tabular-nums ${
                    t.amount > 0 ? 'text-success' : hot ? 'text-warning' : 'text-foreground'
                  }`}
                >
                  {t.amount > 0 ? '+' : '−'}
                  {gbp(t.amount)}
                </span>
              </li>
            );
          })}
        </ol>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Card guide="anomaly-card" glow delay={200} className="border-warning/40">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-warning">
              Raised
            </span>
            <Pill tone="warn" dot>
              {anomalyTotals.raised} pattern
            </Pill>
          </div>

          <p className="text-[15px] leading-snug text-foreground sm:text-[16px]">
            {anomaly.headline}
          </p>

          <div className="mt-4">
            <CardRow label="Counterparty" value={anomaly.supplier} />
            <CardRow
              label="Payments"
              value={<Counter to={anomaly.payments} run={loaded} />}
              mono
            />
            <CardRow
              label="Window"
              value={anomaly.window}
            />
            <CardRow label="Total" value={gbp(anomaly.total)} mono accent />
            <CardRow label="First seen" value={anomaly.firstSeen} />
          </div>

          <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
            <Button>Raise for review</Button>
            <p className="text-[12px] leading-relaxed text-dim">
              Visual only in this demo. Nothing is raised or sent.
            </p>
          </div>
        </Card>

        <Card guide="anomaly-context" delay={320}>
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Context
          </span>
          <p className="text-[14px] leading-relaxed text-foreground">{anomaly.context}</p>
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3.5">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              This month
            </span>
            <Pill tone="success" dot>
              {anomalyTotals.status}
            </Pill>
          </div>
        </Card>
      </div>
    </div>
  );
}
