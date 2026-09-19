'use client';

import { useEffect, useState } from 'react';
import { Card, CardRow } from '@/components/ui/Card';
import { Pill, toneForStatus } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
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

/* ========================================================================
   STEP 1 — CONSIGNMENT
   ======================================================================== */

export function StepConsignment() {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <Card guide="consignment-card" glow delay={80}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Consignment intake
          </span>
          <Pill tone="muted">{consignment.loggedAt}</Pill>
        </div>

        <div data-guide="commodity-row">
          <CardRow label="Commodity" value={consignment.commodity} />
        </div>
        <CardRow label="HS code" value={consignment.hsCode} mono />
        <CardRow label="Origin" value={consignment.origin} />
        <CardRow label="Destination" value={consignment.destination} />
        <CardRow label="Net weight" value={consignment.weight} mono />
        <CardRow label="Importer" value={consignment.importer} />

        <div
          data-guide="eudr-status"
          className="mt-4 flex items-center justify-between gap-3 rounded-[14px] border border-accent/35 bg-accent/[0.07] px-4 py-3"
        >
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            EUDR status
          </span>
          <Pill dot>{consignment.eudrStatus}</Pill>
        </div>
      </Card>

      <div className="flex flex-col gap-5">
        <Card delay={200}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Scope test
          </span>
          <ScopeLine label="Annex I commodity" value="Coffee" pass />
          <ScopeLine label="Placed on EU market" value="Yes — Hamburg" pass />
          <ScopeLine label="Operator obligation" value="Applies" pass />
          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            Three conditions decide whether EUDR applies. All three are read
            from the consignment record — no manual classification step.
          </p>
        </Card>

        <Card delay={320}>
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

function ScopeLine({
  label,
  value,
  pass,
}: {
  label: string;
  value: string;
  pass: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/70 py-2.5 last:border-0">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-[13px] text-foreground">{value}</span>
        {pass && <Check />}
      </span>
    </div>
  );
}

/* ========================================================================
   STEP 2 — COLLECT
   ======================================================================== */

export function StepCollect() {
  const [lines, setLines] = useState(0);
  const done = lines >= scanLog.length;

  // Reveal the scan log one line at a time.
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

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            guide="plots-stat"
            label="Plots submitted"
            value={String(collection.plotsSubmitted)}
            delay={60}
          />
          <Stat
            guide="gps-stat"
            label="GPS received"
            value={`${collection.gpsReceived}/${collection.gpsTotal}`}
            accent
            delay={140}
          />
          <Stat
            guide="hectares-stat"
            label="Total area"
            value={`${collection.totalHectares} ha`}
            delay={220}
          />
        </div>

        {/* Static map panel with plot pins. */}
        <Card guide="plot-map" delay={300}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Plot geolocation · {collection.plotsSubmitted} plots
            </span>
            <Pill tone="accent" dot>
              {consignment.origin}
            </Pill>
          </div>

          <div className="demo-grid relative h-[268px] overflow-hidden rounded-[14px] border border-border bg-[#080d11]">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              {/* Stylised county outline + river. */}
              <path
                d="M8 22 L30 10 L58 14 L82 24 L92 46 L80 74 L52 88 L22 80 L6 56 Z"
                fill="rgba(0,212,255,0.045)"
                stroke="rgba(0,212,255,0.3)"
                strokeWidth="0.5"
              />
              <path
                d="M14 34 Q38 46 50 40 T88 52"
                fill="none"
                stroke="rgba(0,212,255,0.16)"
                strokeWidth="0.7"
              />
            </svg>

            {plots.map((plot, i) => (
              <span
                key={plot.id}
                className="demo-pop absolute"
                style={{
                  left: `${plot.x}%`,
                  top: `${plot.y}%`,
                  animationDelay: `${360 + i * 55}ms`,
                }}
                title={`${plot.id} · ${plot.hectares} ha`}
              >
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="demo-orb-ring absolute h-2.5 w-2.5 rounded-full bg-accent/50" />
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-glow-accent" />
                </span>
              </span>
            ))}

            <span className="absolute bottom-2.5 right-3 font-mono text-[9px] uppercase tracking-eyebrow text-dim">
              Nyeri County, Kenya
            </span>
          </div>

          <p className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-dim">
            Showing {plots.length} of {collection.plotsSubmitted} pins for legibility
          </p>
        </Card>
      </div>

      <div className="flex flex-col gap-5">
        {/* Collection log */}
        <Card delay={120}>
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
                <span className="text-accent">›</span>
                <span className={i === scanLog.length - 1 ? 'text-foreground' : ''}>
                  {line}
                </span>
              </li>
            ))}
          </ol>
        </Card>

        {/* Suppliers */}
        <Card delay={220}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Supplier groups
          </span>
          {suppliers.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between gap-4 border-b border-border/70 py-2.5 last:border-0"
            >
              <span className="text-[13px] text-foreground">{s.name}</span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-muted">
                  {s.plots} plots
                </span>
                <Check />
              </span>
            </div>
          ))}
        </Card>

        {/* Deforestation + risk */}
        <Card guide="deforestation-check" delay={320} glow>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Deforestation check
          </span>
          <div className="flex items-start gap-2.5">
            <Check />
            <p className="text-[14px] leading-relaxed text-foreground">
              {collection.deforestationCheck}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3.5">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Risk classification
            </span>
            <Pill tone="accent" dot>
              {collection.riskClassification}
            </Pill>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
  delay = 0,
  guide,
}: {
  label: string;
  value: string;
  accent?: boolean;
  delay?: number;
  guide?: string;
}) {
  return (
    <div
      data-guide={guide}
      style={{ animationDelay: `${delay}ms` }}
      className="demo-rise rounded-card border border-border bg-card px-4 py-3.5"
    >
      <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-muted">
        {label}
      </span>
      <span
        className={`mt-1.5 block font-display text-[26px] font-semibold tracking-[-0.6px] ${
          accent ? 'text-accent' : 'text-foreground'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* ========================================================================
   STEP 3 — ASSESS
   ======================================================================== */

export function StepAssess() {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
      <Card guide="risk-checklist" glow delay={80}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Five-point risk assessment
          </span>
          <Pill tone="success" dot>
            5 of 5 cleared
          </Pill>
        </div>

        <ol className="space-y-1">
          {riskChecks.map((check, i) => (
            <li
              key={check.label}
              data-guide={`check-${i + 1}`}
              style={{ animationDelay: `${160 + i * 130}ms` }}
              className="demo-rise flex items-start gap-3.5 rounded-[12px] border border-transparent px-3 py-3 transition-colors duration-300 hover:border-border hover:bg-card-hover"
            >
              <span className="mt-0.5 font-mono text-[11px] text-dim">
                {String(i + 1).padStart(2, '0')}
              </span>

              <span
                className="demo-pop mt-0.5 shrink-0"
                style={{ animationDelay: `${420 + i * 130}ms` }}
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

              <Pill tone={toneForStatus(check.status)}>{check.result}</Pill>
            </li>
          ))}
        </ol>
      </Card>

      <div className="flex flex-col gap-5">
        <Card guide="risk-summary" delay={240}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Assessment outcome
          </span>
          <span className="block font-display text-[40px] font-semibold leading-none tracking-display text-success">
            Low
          </span>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            Overall risk classification for this consignment. Negligible risk
            permits the operator to proceed with the due diligence statement.
          </p>
          <div className="mt-4 border-t border-border pt-3.5">
            <CardRow label="Checks run" value="5" mono />
            <CardRow label="Checks passed" value="5" mono accent />
            <CardRow label="Blocking issues" value="0" mono />
          </div>
        </Card>

        <Card delay={340}>
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

/* ========================================================================
   STEP 4 — STATEMENT
   ======================================================================== */

export function StepStatement() {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      {/* Statement preview, styled as a document. */}
      <Card guide="statement-card" glow delay={80} className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-[#0a0a0a] px-5 py-3.5">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Due diligence statement · preview
          </span>
          <Pill tone="success" dot guide="traces-pill">
            {statement.status}
          </Pill>
        </div>

        <div className="px-5 py-5">
          <div data-guide="statement-reference" className="mb-5">
            <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-muted">
              Reference number
            </span>
            <span className="mt-1 block font-mono text-[19px] text-accent">
              {statement.reference}
            </span>
          </div>

          <Section title="Operator">
            <CardRow label="Submitted by" value={statement.submittedBy} />
            <CardRow label="EORI number" value={statement.eoriNumber} mono />
          </Section>

          <Section title="Consignment">
            <CardRow label="Commodity" value={statement.commodity} />
            <CardRow label="HS code" value={statement.hsCode} mono />
            <CardRow label="Origin" value={statement.origin} />
            <CardRow label="Destination" value={statement.destination} />
            <CardRow label="Net weight" value={statement.weight} mono />
          </Section>

          <Section title="Evidence">
            <CardRow label="Plots covered" value={String(statement.plotCount)} mono />
            <CardRow label="Total area" value={`${statement.totalHectares} ha`} mono />
            <CardRow label="Risk level" value={statement.riskLevel} accent />
          </Section>

          <Section title="Verification">
            <p className="text-[13px] leading-relaxed text-muted">
              {statement.verification}
            </p>
          </Section>

          <p className="mt-5 border-t border-border pt-3.5 font-mono text-[9px] uppercase tracking-eyebrow text-dim">
            Generated {statement.generatedAt}
          </p>
        </div>
      </Card>

      <div className="flex flex-col gap-5">
        <Card guide="statement-actions" delay={220}>
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

        <Card delay={320}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            What happens next
          </span>
          <ol className="space-y-2.5">
            {[
              'Statement lodged in the EU TRACES system.',
              'Reference number returned to the operator.',
              'Evidence pack retained for five years.',
            ].map((line, i) => (
              <li key={line} className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
                <span className="font-mono text-[11px] text-accent">
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <span className="mb-1 block font-mono text-[9px] uppercase tracking-eyebrow text-accent">
        {title}
      </span>
      {children}
    </div>
  );
}

/* ========================================================================
   SHARED
   ======================================================================== */

/** Cyan tick used across the checklist and verification rows. */
function Check() {
  return (
    <span
      aria-hidden
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-success/50 bg-success/15"
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
        <path
          d="M2.5 6.4l2.2 2.2 4.8-5"
          stroke="#10b981"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
