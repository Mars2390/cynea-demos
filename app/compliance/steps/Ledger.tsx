'use client';

import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Check } from '@/components/ui/Check';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SourceTable } from '@/components/ui/SourceTable';
import { useLoaded } from '@/lib/hooks';
import {
  esgCategories,
  esgMetrics,
  esgTotals,
} from '@/demos/compliance/fixtures';

/**
 * STEP 5 — LEDGER · ESG Data Agent
 *
 * The mapping columns are the substance: a metric nobody can place in GRI,
 * SASB or TCFD is not disclosure, it is a number. An em dash marks a metric
 * that genuinely has no home in a given framework, rather than hiding it.
 */
export function StepLedger() {
  const loaded = useLoaded(true);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Card guide="ledger-card" glass glow delay={60}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Annual disclosure
            </span>
            <Pill tone="success" dot>
              {esgTotals.status}
            </Pill>
          </div>

          <span className="block font-display text-[38px] font-semibold leading-none tracking-display text-foreground">
            {esgTotals.year}
          </span>

          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            <Counter to={esgTotals.gathered} run={loaded} /> metrics gathered ·{' '}
            <Counter to={esgTotals.mapped} run={loaded} delayMs={120} /> mapped
            · <Counter to={esgTotals.missing} run={loaded} delayMs={240} />{' '}
            missing
          </p>

          <div className="mt-5 space-y-2.5">
            {esgCategories.map((c, i) => (
              <div
                key={c.key}
                style={{ animationDelay: `${160 + i * 110}ms` }}
                className="demo-rise flex items-center justify-between gap-3 rounded-[12px] border border-border bg-card/60 px-3.5 py-3"
              >
                <span className="text-[13.5px] text-foreground">{c.label}</span>
                <span className="flex items-center gap-2.5">
                  <span className="font-mono text-[15px] tabular-nums text-accent">
                    <Counter to={c.count} run={loaded} delayMs={160 + i * 110} />
                  </span>
                  <Check size={3} />
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-border pt-1.5">
            <CardRow label="Report ref" value={esgTotals.reference} mono accent />
          </div>

          <p className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-dim">
            Compiled {esgTotals.compiledAt}
          </p>
        </Card>

        <Card delay={180}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={100}
              run={loaded}
              size={86}
              tone="success"
              label={`${esgTotals.mapped}/${esgTotals.gathered}`}
              sublabel="mapped"
              delayMs={160}
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Framework coverage
              </span>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                Every gathered metric lands in at least one of GRI, SASB or
                TCFD. Nothing is carried as an estimate, and nothing is left
                unplaced.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill tone="secondary">GRI</Pill>
                <Pill tone="secondary">SASB</Pill>
                <Pill tone="secondary">TCFD</Pill>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card guide="mapping-table" glass delay={240}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Metric mapping · GRI | SASB | TCFD
          </span>
          <Pill tone="muted">
            {esgMetrics.length} of {esgTotals.gathered} shown
          </Pill>
        </div>

        <SourceTable
          columns={[
            { key: 'metric', label: 'Metric' },
            { key: 'category', label: 'Category', secondary: true },
            { key: 'value', label: 'Value', numeric: true },
            { key: 'gri', label: 'GRI' },
            { key: 'sasb', label: 'SASB', secondary: true },
            { key: 'tcfd', label: 'TCFD' },
            { key: 'source', label: 'Source', source: true },
          ]}
          rows={esgMetrics.map((m) => ({
            metric: m.metric,
            category: m.category,
            value: m.value,
            gri: m.gri,
            sasb: m.sasb,
            tcfd: m.tcfd,
            source: m.source,
          }))}
          caption="An em dash means the metric has no corresponding disclosure in that framework — not that it is missing."
        />
      </Card>
    </div>
  );
}
