'use client';

import { Card, CardRow, CardSection } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { SourceTable } from '@/components/ui/SourceTable';
import { useLoaded } from '@/lib/hooks';
import {
  balanceSheet,
  boardPack,
  cashFlow,
  commentary,
  pnl,
} from '@/demos/finance/fixtures';

const k = (n: number) => `£${Math.abs(n)}k`;
/** P&L lines where coming in under budget is the favourable direction. */
const COST_LINES = new Set(['Cost of sales', 'Operating expenses']);
const signed = (n: number, unit: string) =>
  unit === '%'
    ? `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(1)}pp`
    : `${n > 0 ? '+' : n < 0 ? '−' : ''}£${Math.abs(n)}k`;

/**
 * STEP 6 — REPORTER · Financial Reporting Agent
 *
 * The closing step. The P&L, balance sheet and cash flow are drafted from the
 * same month the other five agents just processed; the commentary is plain
 * English under each line rather than a number in red.
 */
export function StepReporter() {
  const loaded = useLoaded(true);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card guide="management-accounts" glass glow delay={60}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Management accounts · {boardPack.period}
            </span>
            <Pill tone="secondary">£k</Pill>
          </div>

          <SourceTable
            columns={[
              { key: 'line', label: 'P&L' },
              { key: 'actual', label: 'Actual', numeric: true },
              { key: 'budget', label: 'Budget', numeric: true },
              { key: 'variance', label: 'Variance', numeric: true },
            ]}
            rows={pnl.map((r) => ({
              line: r.line,
              actual: r.unit === '%' ? `${r.actual.toFixed(1)}%` : k(r.actual),
              budget: r.unit === '%' ? `${r.budget.toFixed(1)}%` : k(r.budget),
              variance: (
                <span
                  className={
                    // Revenue, margin and EBITDA up is good; a cost line up is not.
                    (COST_LINES.has(r.line) ? r.variance <= 0 : r.variance >= 0)
                      ? 'text-success'
                      : 'text-warning'
                  }
                >
                  {signed(r.variance, r.unit)}
                </span>
              ),
            }))}
          />

          <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <CardSection title="Balance sheet">
              {balanceSheet.map((b) => (
                <CardRow key={b.line} label={b.line} value={k(b.value)} mono />
              ))}
            </CardSection>
            <CardSection title="Cash flow">
              {cashFlow.map((c) => (
                <CardRow
                  key={c.line}
                  label={c.line}
                  value={`${c.value < 0 ? '−' : '+'}${k(c.value)}`}
                  mono
                  accent={c.line === 'Net movement'}
                />
              ))}
            </CardSection>
          </div>
        </Card>

        <div className="flex flex-col gap-4 sm:gap-5">
          <Card guide="board-pack" delay={200} className="!p-0 overflow-hidden">
            {/* Cover page */}
            <div className="relative border-b border-border px-5 py-6">
              <span
                aria-hidden
                className="demo-seal pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-accent/25"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgb(var(--accent-secondary-ch) / 0.16), transparent 55%)',
                }}
              />
              <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-muted">
                Board pack
              </span>
              <span className="mt-2 block font-display text-[22px] font-semibold leading-tight tracking-[-0.5px] text-foreground">
                {/* Keep the version tag together when the title wraps. */}
                {boardPack.title.split(' · ').map((part, i) =>
                  i === 0 ? part : (
                    <span key={part} className="whitespace-nowrap">
                      {' '}· {part}
                    </span>
                  ),
                )}
              </span>
              <span className="mt-2 block font-mono text-[10px] uppercase tracking-eyebrow text-dim">
                Drafted {boardPack.draftedAt}
              </span>
            </div>
            <div className="px-5 py-4">
              <CardRow
                label="Pages"
                value={<Counter to={boardPack.pages} run={loaded} />}
                mono
              />
              <CardRow label="Review time" value={`~${boardPack.reviewMinutes} min`} />
              <div className="mt-3.5">
                <Pill tone="success" dot>
                  {boardPack.status}
                </Pill>
              </div>
              <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
                <Button>Export to PDF</Button>
                <p className="text-[12px] leading-relaxed text-dim">
                  Visual only in this demo. No file is produced.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card guide="commentary" delay={300}>
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
          Variance commentary · drafted
        </span>
        <ol className="space-y-2">
          {commentary.map((line, i) => (
            <li
              key={line}
              style={{ animationDelay: `${360 + i * 110}ms` }}
              className="demo-rise flex gap-3 rounded-[12px] border border-border/60 bg-card/40 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-foreground"
            >
              <span className="shrink-0 font-mono text-[11px] text-accent-secondary">
                {String(i + 1).padStart(2, '0')}
              </span>
              {line}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
