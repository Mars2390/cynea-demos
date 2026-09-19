'use client';

import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Check } from '@/components/ui/Check';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SourceTable } from '@/components/ui/SourceTable';
import { useLoaded } from '@/lib/hooks';
import {
  emissionLines,
  emissionTotals,
  quarter,
} from '@/demos/compliance/fixtures';

/**
 * STEP 4 — CARBON · CBAM Reporting Agent
 *
 * The provenance column is the point of the step, so it is a column in the
 * table rather than a footnote — every figure names where it came from.
 */
export function StepCarbon() {
  const loaded = useLoaded(true);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Card guide="quarter-card" glass glow delay={60}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Reporting period
            </span>
            <Pill tone="success" dot>
              {quarter.status}
            </Pill>
          </div>

          <span className="block font-display text-[38px] font-semibold leading-none tracking-display text-foreground">
            {quarter.label}
          </span>
          <p className="mt-2 text-[13px] text-muted">{quarter.period}</p>

          <div className="mt-4">
            <CardRow label="Declarant" value={quarter.declarant} />
            <CardRow label="EORI number" value={quarter.eori} mono />
            <CardRow label="Reference" value={quarter.reference} mono accent />
            <CardRow label="Submission due" value={quarter.due} />
          </div>
        </Card>

        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {/* Unit lives in the label: a lone "t" set in the display face
                reads ambiguously against a decimal figure. */}
            <Stat label="Goods imported · tonnes" delay={60}>
              <Counter
                to={emissionTotals.tonnes}
                run={loaded}
                decimals={1}
                group
              />
            </Stat>
            <Stat label="Embedded emissions · tCO₂e" accent delay={130}>
              <Counter
                to={emissionTotals.emissions}
                run={loaded}
                decimals={1}
                group
              />
            </Stat>
            <Stat label="Suppliers reporting" delay={200}>
              <Counter to={emissionTotals.suppliersReporting} run={loaded} />
            </Stat>
          </div>

          <Card guide="carbon-provenance" delay={260}>
            <div className="flex items-center gap-4">
              <ProgressRing
                percent={100}
                run={loaded}
                size={78}
                tone="success"
                label={`${emissionTotals.tracedToSource}/${emissionTotals.lines}`}
                sublabel="traced"
                delayMs={180}
              />
              <div className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                  Figures traced to source
                </span>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  Every line carries its origin — a verified supplier
                  declaration, audited installation data, or an Annex III
                  default where the installation has not yet reported.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card guide="emissions-table" glass delay={200}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Embedded emissions · per supplier, per product, per tonne
          </span>
          <Pill tone="secondary">tCO₂e</Pill>
        </div>

        <SourceTable
          columns={[
            { key: 'supplier', label: 'Supplier' },
            { key: 'product', label: 'Product' },
            { key: 'cnCode', label: 'CN code', secondary: true },
            { key: 'tonnes', label: 'Tonnes', numeric: true },
            { key: 'direct', label: 'Direct', numeric: true, secondary: true },
            {
              key: 'indirect',
              label: 'Indirect',
              numeric: true,
              secondary: true,
            },
            { key: 'total', label: 'Per tonne', numeric: true },
            { key: 'emissions', label: 'Total tCO₂e', numeric: true },
            { key: 'source', label: 'Source', source: true },
          ]}
          rows={emissionLines.map((l) => ({
            supplier: l.supplier,
            product: l.product,
            cnCode: l.cnCode,
            tonnes: l.tonnes.toLocaleString('en-GB', {
              minimumFractionDigits: 1,
            }),
            direct: l.direct.toFixed(2),
            indirect: l.indirect.toFixed(2),
            total: l.total.toFixed(2),
            emissions: l.emissions.toLocaleString('en-GB', {
              minimumFractionDigits: 1,
            }),
            source: l.source,
          }))}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5">
          <span className="flex items-center gap-2.5">
            <Check />
            <span className="text-[13px] text-muted">
              Totals reconcile against customs declarations for the period.
            </span>
          </span>
          <span className="font-mono text-[14px] tabular-nums text-accent">
            {emissionTotals.emissions.toLocaleString('en-GB', {
              minimumFractionDigits: 1,
            })}{' '}
            tCO₂e
          </span>
        </div>
      </Card>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card delay={320}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Methodology
          </span>
          <ol className="space-y-2.5">
            {[
              'Supplier declarations collected and validated against CN codes.',
              'Direct and indirect emissions mapped to the CBAM calculation method.',
              'Annex III defaults applied only where an installation has not reported.',
            ].map((line, i) => (
              <li
                key={line}
                className="flex gap-2.5 text-[13px] leading-relaxed text-muted"
              >
                <span className="shrink-0 font-mono text-[11px] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {line}
              </li>
            ))}
          </ol>
        </Card>

        <Card delay={380}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Submit
          </span>
          <Button>Submit to CBAM registry</Button>
          <p className="mt-3.5 text-[12px] leading-relaxed text-dim">
            Visual only in this demo. Nothing is submitted to any registry.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  children,
  accent = false,
  delay = 0,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
  delay?: number;
}) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="demo-rise demo-sheen demo-panel rounded-card border border-border bg-card px-4 py-3.5"
    >
      <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-muted">
        {label}
      </span>
      <span
        className={`mt-1.5 block font-display text-[21px] font-semibold tracking-[-0.6px] sm:text-[24px] ${
          accent ? 'text-accent' : 'text-foreground'
        }`}
      >
        {children}
      </span>
    </div>
  );
}
