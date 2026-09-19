'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Card, CardRow, CardSection } from '@/components/ui/Card';
import { Pill, toneForStatus } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Check } from '@/components/ui/Check';
import { Counter, CounterRatio } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Reveal, Skeleton, SkeletonRows } from '@/components/ui/Skeleton';
import { useLoaded } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import {
  collection,
  consignment,
  plots,
  riskChecks,
  scanLog,
  statement,
  suppliers,
} from '@/demos/diligence/fixtures';

/**
 * STEP 3 — DILIGENCE · EUDR Due Diligence Agent
 *
 * The standalone Diligence demo's four screens — consignment, collection,
 * assessment, statement — folded into one step of the suite. The panels are
 * unchanged; only the four separate titles and footers are gone, replaced by
 * the section markers below, which give a step four times taller than its
 * neighbours some internal landmarks.
 *
 * Fixtures are imported from demos/diligence/fixtures.ts rather than copied,
 * so the consignment data stays byte-identical to the original demo.
 */

const weightKg = Number(consignment.weight.replace(/[^\d]/g, ''));
const weightUnit = consignment.weight.replace(/[\d,]/g, '').trim();

export function StepDiligence() {
  const loaded = useLoaded(true);

  return (
    <div className="flex flex-col gap-9 sm:gap-11">
      <Section n={1} label="Consignment">
        <ConsignmentPanel loaded={loaded} />
      </Section>

      <Section n={2} label="Collect">
        <CollectPanel loaded={loaded} />
      </Section>

      <Section n={3} label="Assess">
        <AssessPanel loaded={loaded} />
      </Section>

      <Section n={4} label="Statement">
        <StatementPanel loaded={loaded} />
      </Section>
    </div>
  );
}

/** Internal landmark for a step that carries four panels. */
function Section({
  n,
  label,
  children,
}: {
  n: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3.5 flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
          {String(n).padStart(2, '0')}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
          {label}
        </span>
        <span aria-hidden className="h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  );
}

/* ---------------------------------------------------------------- 01 ---- */

function ConsignmentPanel({ loaded }: { loaded: boolean }) {
  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <Card guide="consignment-card" glass glow delay={60}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Consignment intake
          </span>
          <Pill tone="muted">{consignment.loggedAt}</Pill>
        </div>

        <Reveal run skeleton={<SkeletonRows rows={6} />}>
          <div data-guide="commodity-row">
            <CardRow label="Commodity" value={consignment.commodity} />
          </div>
          <CardRow label="HS code" value={consignment.hsCode} mono />
          <CardRow label="Origin" value={consignment.origin} />
          <CardRow label="Destination" value={consignment.destination} />
          <CardRow
            label="Net weight"
            value={
              <Counter
                to={weightKg}
                run={loaded}
                group
                suffix={` ${weightUnit}`}
              />
            }
            mono
          />
          <CardRow label="Importer" value={consignment.importer} />
        </Reveal>

        <div
          data-guide="eudr-status"
          className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-accent/35 bg-accent/[0.07] px-4 py-3"
        >
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            EUDR status
          </span>
          <Pill dot>{consignment.eudrStatus}</Pill>
        </div>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Card delay={180}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Scope test
            </span>
            <ProgressRing
              percent={100}
              run={loaded}
              size={62}
              stroke={5}
              label="3/3"
              sublabel="met"
              delayMs={120}
            />
          </div>
          <ScopeLine label="Annex I commodity" value="Coffee" />
          <ScopeLine label="Placed on EU market" value="Yes — Hamburg" />
          <ScopeLine label="Operator obligation" value="Applies" />
          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            Three conditions decide whether EUDR applies. All three are read
            from the consignment record — no manual classification step.
          </p>
        </Card>

        <Card delay={280}>
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Next action
          </span>
          <p className="text-[14px] leading-relaxed text-foreground">
            Collect plot-level geolocation from all upstream suppliers.
          </p>
        </Card>
      </div>
    </div>
  );
}

function ScopeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/70 py-2.5 last:border-0">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-right text-[13px] text-foreground">{value}</span>
        <Check />
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- 02 ---- */

function CollectPanel({ loaded }: { loaded: boolean }) {
  const [lines, setLines] = useState(0);
  const done = lines >= scanLog.length;

  useEffect(() => {
    setLines(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setLines(i);
      if (i >= scanLog.length) clearInterval(id);
    }, timing.scanLogLineMs);
    return () => clearInterval(id);
  }, []);

  const gpsPct = Math.round(
    (collection.gpsReceived / collection.gpsTotal) * 100,
  );

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          <Stat guide="plots-stat" label="Plots submitted" delay={40}>
            <Counter to={collection.plotsSubmitted} run={loaded} />
          </Stat>
          <Stat guide="gps-stat" label="GPS received" accent delay={110}>
            <CounterRatio
              to={collection.gpsReceived}
              total={collection.gpsTotal}
              run={loaded}
            />
          </Stat>
          <Stat guide="hectares-stat" label="Total area" delay={180}>
            <Counter
              to={collection.totalHectares}
              run={loaded}
              decimals={1}
              suffix=" ha"
            />
          </Stat>
        </div>

        <Card guide="plot-map" glass delay={240}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Plot geolocation · {collection.plotsSubmitted} plots
            </span>
            <Pill tone="secondary" dot>
              {consignment.origin}
            </Pill>
          </div>

          <div className="demo-grid relative h-[230px] overflow-hidden rounded-[14px] border border-border bg-background/70 sm:h-[268px]">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              <path
                d="M8 22 L30 10 L58 14 L82 24 L92 46 L80 74 L52 88 L22 80 L6 56 Z"
                strokeWidth="0.5"
                style={{
                  fill: 'rgb(var(--success-ch) / 0.05)',
                  stroke: 'rgb(var(--success-ch) / 0.3)',
                }}
              />
              <path
                d="M14 34 Q38 46 50 40 T88 52"
                fill="none"
                strokeWidth="0.7"
                style={{ stroke: 'rgb(var(--accent-secondary-ch) / 0.28)' }}
              />
            </svg>

            {plots.map((plot, i) => (
              <span
                key={plot.id}
                className="demo-pop absolute"
                style={{
                  left: `${plot.x}%`,
                  top: `${plot.y}%`,
                  animationDelay: `${320 + i * 55}ms`,
                }}
                title={`${plot.id} · ${plot.hectares} ha`}
              >
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span
                    className="demo-ping absolute h-2.5 w-2.5 rounded-full bg-success/55"
                    style={{ animationDelay: `${i * 170}ms` }}
                  />
                  <span className="h-1.5 w-1.5 rounded-full bg-success shadow-glow-success" />
                </span>
              </span>
            ))}

            <span className="absolute bottom-2.5 right-3 font-mono text-[9px] uppercase tracking-eyebrow text-dim">
              Nyeri County, Kenya
            </span>
          </div>

          <p className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-dim">
            Showing {plots.length} of {collection.plotsSubmitted} pins for
            legibility
          </p>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Card delay={100}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Collection log
          </span>
          {!done && (
            <div className="demo-scan-bar mb-3 h-[2px] w-full rounded-full bg-border" />
          )}
          <ol className="space-y-2">
            {scanLog.slice(0, lines).map((line, i) => (
              <li
                key={line}
                className="demo-rise flex gap-2 font-mono text-[11px] leading-relaxed text-muted"
              >
                <span className="shrink-0 text-accent">›</span>
                <span
                  className={i === scanLog.length - 1 ? 'text-foreground' : ''}
                >
                  {line}
                </span>
              </li>
            ))}
          </ol>
        </Card>

        <Card delay={170}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={gpsPct}
              run={loaded}
              size={78}
              tone="success"
              sublabel="geodata"
              delayMs={200}
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Geolocation completeness
              </span>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                Every plot returned a valid GPS polygon. Anything short of 100%
                blocks the statement.
              </p>
            </div>
          </div>
        </Card>

        <Card delay={240}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Supplier groups
          </span>
          {suppliers.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between gap-3 border-b border-border/70 py-2.5 last:border-0"
            >
              <span className="min-w-0 text-[13px] text-foreground">
                {s.name}
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="font-mono text-[11px] text-muted">
                  {s.plots} plots
                </span>
                <Check />
              </span>
            </div>
          ))}
        </Card>

        <Card guide="deforestation-check" delay={310} glow>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Deforestation check
          </span>
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5">
              <Check />
            </span>
            <p className="text-[14px] leading-relaxed text-foreground">
              {collection.deforestationCheck}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3.5">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Risk classification
            </span>
            <Pill tone="secondary" dot>
              {collection.riskClassification}
            </Pill>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 03 ---- */

function AssessPanel({ loaded }: { loaded: boolean }) {
  const passed = riskChecks.filter((c) => c.status !== 'fail').length;

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
      <Card guide="risk-checklist" glass glow delay={60}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Five-point risk assessment
          </span>
          <Pill tone="success" dot>
            <Counter to={passed} run={loaded} />
            &nbsp;of {riskChecks.length} cleared
          </Pill>
        </div>

        <ol className="space-y-1">
          {riskChecks.map((check, i) => (
            <li
              key={check.label}
              data-guide={`check-${i + 1}`}
              style={{ animationDelay: `${140 + i * 130}ms` }}
              className="demo-rise flex items-start gap-3 rounded-[12px] border border-transparent px-2.5 py-3 transition-colors duration-300 hover:border-border hover:bg-card-hover sm:gap-3.5 sm:px-3"
            >
              <span className="mt-0.5 shrink-0 font-mono text-[11px] text-dim">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="demo-pop mt-0.5 shrink-0"
                style={{ animationDelay: `${400 + i * 130}ms` }}
              >
                <Check />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] text-foreground">
                  {check.label}
                </span>
                <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">
                  {check.detail}
                </span>
              </span>
              <span className="shrink-0">
                <Pill tone={toneForStatus(check.status)}>{check.result}</Pill>
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Card guide="risk-summary" delay={200}>
          <span className="mb-4 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Assessment outcome
          </span>

          <div className="flex items-center gap-4">
            <ProgressRing
              percent={100}
              run={loaded}
              size={86}
              tone="success"
              label={`${passed}/${riskChecks.length}`}
              sublabel="cleared"
              delayMs={160}
            />
            <div className="min-w-0">
              <span className="block font-display text-[32px] font-semibold leading-none tracking-display text-success">
                Low
              </span>
              <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-eyebrow text-dim">
                overall risk
              </span>
            </div>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            Negligible risk permits the operator to proceed with the due
            diligence statement.
          </p>

          <div className="mt-4 border-t border-border pt-3.5">
            <CardRow
              label="Checks run"
              value={<Counter to={riskChecks.length} run={loaded} />}
              mono
            />
            <CardRow
              label="Checks passed"
              value={<Counter to={passed} run={loaded} delayMs={120} />}
              mono
              accent
            />
            <CardRow label="Blocking issues" value="0" mono />
          </div>
        </Card>

        <Card delay={300}>
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Audit trail
          </span>
          <p className="text-[13px] leading-relaxed text-muted">
            Each check records its inputs, source and timestamp, so the result
            can be reconstructed months later.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 04 ---- */

function StatementPanel({ loaded }: { loaded: boolean }) {
  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <Card
        guide="statement-card"
        glass
        glow
        delay={60}
        className="!p-0 overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3.5 sm:px-5">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Due diligence statement · preview
          </span>
          <Pill tone="success" dot guide="traces-pill">
            {statement.status}
          </Pill>
        </div>

        <div className="relative px-4 py-5 sm:px-5">
          <span
            aria-hidden
            className="demo-seal pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-accent/25"
            style={{
              background:
                'conic-gradient(from 0deg, rgb(var(--accent-ch) / 0.14), transparent 55%)',
            }}
          />

          <Reveal run skeleton={<StatementSkeleton />}>
            <div data-guide="statement-reference" className="mb-5">
              <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-muted">
                Reference number
              </span>
              <span className="mt-1 block break-all font-mono text-[17px] text-accent sm:text-[19px]">
                {statement.reference}
              </span>
            </div>

            <CardSection title="Operator">
              <CardRow label="Submitted by" value={statement.submittedBy} />
              <CardRow label="EORI number" value={statement.eoriNumber} mono />
            </CardSection>

            <CardSection title="Consignment">
              <CardRow label="Commodity" value={statement.commodity} />
              <CardRow label="HS code" value={statement.hsCode} mono />
              <CardRow label="Origin" value={statement.origin} />
              <CardRow label="Destination" value={statement.destination} />
              <CardRow label="Net weight" value={statement.weight} mono />
            </CardSection>

            <CardSection title="Evidence">
              <CardRow
                label="Plots covered"
                value={<Counter to={statement.plotCount} run={loaded} />}
                mono
              />
              <CardRow
                label="Total area"
                value={
                  <Counter
                    to={statement.totalHectares}
                    run={loaded}
                    decimals={1}
                    suffix=" ha"
                  />
                }
                mono
              />
              <CardRow label="Risk level" value={statement.riskLevel} accent />
            </CardSection>

            <CardSection title="Verification">
              <p className="text-[13px] leading-relaxed text-muted">
                {statement.verification}
              </p>
            </CardSection>

            <p className="mt-5 border-t border-border pt-3.5 font-mono text-[9px] uppercase tracking-eyebrow text-dim">
              Generated {statement.generatedAt}
            </p>
          </Reveal>
        </div>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Card guide="statement-actions" delay={180}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Submit
          </span>
          <div className="flex flex-col gap-2.5">
            <Button>Submit to TRACES</Button>
            <Button variant="ghost">Download PDF</Button>
          </div>
          <p className="mt-3.5 text-[12px] leading-relaxed text-dim">
            Both buttons are visual only in this demo. Nothing is submitted and
            no file is produced.
          </p>
        </Card>

        <Card delay={260}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            What happens next
          </span>
          <ol className="space-y-2.5">
            {[
              'Statement lodged in the EU TRACES system.',
              'Reference number returned to the operator.',
              'Evidence pack retained for five years.',
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
      </div>
    </div>
  );
}

function StatementSkeleton() {
  return (
    <span aria-hidden className="block">
      <span className="mb-5 block">
        <Skeleton w="38%" h={8} className="mb-2" />
        <Skeleton w="62%" h={20} />
      </span>
      <SkeletonRows rows={8} />
    </span>
  );
}

/* ---------------------------------------------------------------- utils -- */

function Stat({
  label,
  children,
  accent = false,
  delay = 0,
  guide,
}: {
  label: string;
  children: ReactNode;
  accent?: boolean;
  delay?: number;
  guide?: string;
}) {
  return (
    <div
      data-guide={guide}
      style={{ animationDelay: `${delay}ms` }}
      className="demo-rise demo-sheen demo-panel rounded-card border border-border bg-card px-4 py-3.5"
    >
      <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-muted">
        {label}
      </span>
      <span
        className={`mt-1.5 block font-display text-[23px] font-semibold tracking-[-0.6px] sm:text-[26px] ${
          accent ? 'text-accent' : 'text-foreground'
        }`}
      >
        {children}
      </span>
    </div>
  );
}
