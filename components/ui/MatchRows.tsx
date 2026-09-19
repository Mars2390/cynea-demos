'use client';

import { useEffect, useState } from 'react';
import { Check } from './Check';
import { useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';

export interface MatchRow {
  bank: string;
  invoice: string;
  ledger: string;
  amount: number;
  date: string;
}

const gbp = (n: number) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });

/**
 * Three-column reconciliation: BANK FEED | INVOICES | LEDGER.
 *
 * Rows "snap" together one at a time — the three cells slide in from their
 * own column and a lime tick lands once all three agree. On a phone the row
 * stacks so each of the three sources stays legible.
 */
export function MatchRows({
  rows,
  run,
  guide,
}: {
  rows: readonly MatchRow[];
  run: boolean;
  guide?: string;
}) {
  const reduced = useReducedMotion();
  const [snapped, setSnapped] = useState(0);

  useEffect(() => {
    if (!run) {
      setSnapped(0);
      return;
    }
    if (reduced) {
      setSnapped(rows.length);
      return;
    }
    setSnapped(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setSnapped(i);
      if (i >= rows.length) clearInterval(id);
    }, timing.scanLogLineMs);
    return () => clearInterval(id);
  }, [run, reduced, rows.length]);

  return (
    <div data-guide={guide}>
      {/* Column headers */}
      <div className="mb-2 hidden grid-cols-[1fr_1fr_1fr_auto] gap-3 sm:grid">
        {['Bank feed', 'Invoices', 'Ledger'].map((h) => (
          <span
            key={h}
            className="font-mono text-[9px] uppercase tracking-eyebrow text-muted"
          >
            {h}
          </span>
        ))}
        <span className="w-4" />
      </div>

      <ol className="space-y-1.5">
        {rows.map((r, i) => {
          const on = i < snapped;
          return (
            <li
              key={r.invoice}
              className={`grid gap-2 rounded-[12px] border px-3 py-2.5 transition-colors duration-500 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center sm:gap-3 ${
                on
                  ? 'border-success/30 bg-success/[0.05]'
                  : 'border-border/60 bg-card/40'
              }`}
            >
              <Cell on={on} from="left" label="Bank">
                <span className="font-mono text-[11px] text-foreground">
                  {r.bank}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-muted">
                  {gbp(r.amount)}
                </span>
              </Cell>
              <Cell on={on} from="center" label="Invoice">
                <span className="font-mono text-[11px] text-foreground">
                  {r.invoice}
                </span>
                <span className="font-mono text-[11px] text-muted">
                  {r.date}
                </span>
              </Cell>
              <Cell on={on} from="right" label="Ledger">
                <span className="text-[12px] text-foreground">{r.ledger}</span>
              </Cell>
              <span className="hidden justify-end sm:flex">
                {on ? (
                  <span className="demo-pop block">
                    <Check />
                  </span>
                ) : (
                  <span className="h-4 w-4 rounded-full border border-border-hi" />
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Cell({
  on,
  from,
  label,
  children,
}: {
  on: boolean;
  from: 'left' | 'center' | 'right';
  label: string;
  children: React.ReactNode;
}) {
  const start =
    from === 'left'
      ? 'translate-x-[-10px]'
      : from === 'right'
        ? 'translate-x-[10px]'
        : 'translate-y-[6px]';
  return (
    <span
      className={`flex min-w-0 items-baseline justify-between gap-2 transition-all duration-500 ease-demo sm:flex-col sm:items-start sm:gap-0.5 ${
        on ? 'translate-x-0 translate-y-0 opacity-100' : `${start} opacity-40`
      }`}
    >
      <span className="font-mono text-[9px] uppercase tracking-eyebrow text-dim sm:hidden">
        {label}
      </span>
      <span className="flex min-w-0 flex-col items-end sm:items-start">
        {children}
      </span>
    </span>
  );
}
