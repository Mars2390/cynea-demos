'use client';

import { useEffect, useState } from 'react';
import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Check, Pending } from '@/components/ui/Check';
import { Counter } from '@/components/ui/Counter';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import {
  clauses,
  contract,
  counselTotals,
  markup,
  type Clause,
  type ClauseStatus,
} from '@/demos/legal/fixtures';

/**
 * STEP 3 — COUNSEL · Contract Review Agent
 *
 * The flagship. A single reading cursor moves down the clauses; each row is
 * resolved once and stays resolved. The colour discipline is deliberate:
 * clauses that match the playbook get only a lime rail and a tick, so the
 * three that do not — amber for non-standard, vermilion for a missing
 * protection — are the only rows that carry a tint, a pill and a reason.
 * Five quiet rows, three loud ones. That is what makes the mark-up readable.
 */
export function StepCounsel() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = clauses.length;
  // Tick 0 = nothing read; tick n = clause n resolved; tick total+1 = mark-up ready.
  const [ticks, setTicks] = useState(0);

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
    }, Math.round(timing.scanLogLineMs * 0.9));
    return () => clearInterval(id);
  }, [reduced, total]);

  const read = Math.min(total, ticks);
  const reading = read < total ? read : -1; // index of the clause under the cursor
  const ready = ticks > total;
  const flagged = clauses.filter((c, i) => i < read && c.status !== 'match');
  const matched = clauses.filter((c, i) => i < read && c.status === 'match').length;
  const current = reading >= 0 ? clauses[reading] : null;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* The contract, read against the playbook. */}
      <Card guide="contract-review" glass glow delay={60} className="!p-0 overflow-hidden">
        {/* Document header */}
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-muted">
              Contract · draft from the other side
            </span>
            <span className="mt-1.5 block font-display text-[20px] font-semibold leading-tight tracking-[-0.4px] text-foreground sm:text-[22px]">
              {contract.title}
            </span>
            <span className="mt-1 block text-[12.5px] text-muted">{contract.parties}</span>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Pill tone="secondary">{contract.version}</Pill>
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-dim">
              {contract.pages} pages · {contract.clauses} clauses
            </span>
          </div>
        </div>

        {/* Reading progress */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            {ready ? (
              <span className="text-success">
                {counselTotals.clauses} clauses read · {counselTotals.matched} match ·{' '}
                {counselTotals.flagged} flagged
              </span>
            ) : current ? (
              <>
                Reading clause <span className="text-accent">{current.ref}</span> ·{' '}
                {current.name}
              </>
            ) : (
              'Opening the playbook…'
            )}
          </span>
          <span className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-eyebrow text-dim">
            <Legend swatch="bg-success" label="Matches playbook" />
            <Legend swatch="bg-warning" label="Non-standard" />
            <Legend swatch="bg-error" label="Missing protection" />
          </span>
        </div>
        <div className="h-[2px] w-full bg-border">
          <div
            className="h-full bg-accent transition-[width] duration-500 ease-demo"
            style={{ width: `${(read / total) * 100}%` }}
          />
        </div>

        {/* Column headers — desktop only; rows carry their own labels below sm. */}
        <div className="hidden grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)_136px] gap-4 px-5 pt-4 sm:grid">
          <span className="font-mono text-[9px] uppercase tracking-eyebrow text-dim">Contract</span>
          <span className="font-mono text-[9px] uppercase tracking-eyebrow text-dim">Playbook</span>
          <span className="text-right font-mono text-[9px] uppercase tracking-eyebrow text-dim">
            Verdict
          </span>
        </div>

        <ol className="space-y-2 px-5 pb-5 pt-3">
          {clauses.map((c, i) => (
            <ClauseRow
              key={c.id}
              clause={c}
              state={i < read ? c.status : i === reading ? 'reading' : 'unread'}
            />
          ))}
        </ol>
      </Card>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* What needs attention, with the reason. */}
        <Card guide="flagged-items" delay={200} className={flagged.length ? 'border-warning/30' : ''}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Needs attention
            </span>
            <Pill tone={flagged.length ? 'warn' : 'muted'} dot={flagged.length > 0}>
              {flagged.length} flagged
            </Pill>
          </div>
          <ol className="space-y-2">
            {clauses
              .filter((c) => c.status !== 'match')
              .map((c) => {
                const found = flagged.includes(c);
                const missing = c.status === 'missing';
                return (
                  <li
                    key={c.id}
                    className={`${found ? 'demo-rise' : 'hidden'} rounded-[12px] border px-3.5 py-3 ${
                      missing ? 'border-error/40 bg-error/[0.06]' : 'border-warning/40 bg-warning/[0.06]'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                      <span className="min-w-0 text-[13.5px] text-foreground">{c.reason}</span>
                      <span className="shrink-0">
                        <Pill tone={missing ? 'error' : 'warn'}>
                          {missing ? 'Missing' : 'Non-standard'}
                        </Pill>
                      </span>
                    </div>
                    <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-eyebrow text-dim">
                      Clause {c.ref} · {c.name}
                    </span>
                    <span className={`mt-2 block text-[12.5px] leading-relaxed ${missing ? 'text-error' : 'text-warning'}`}>
                      <span className="font-mono text-[9.5px] uppercase tracking-eyebrow">Redline · </span>
                      {c.redline}
                    </span>
                  </li>
                );
              })}
            {flagged.length === 0 && (
              <li className="rounded-[12px] border border-border/60 bg-card/40 px-3.5 py-3 text-[13px] text-dim">
                Nothing yet — Counsel is still reading.
              </li>
            )}
          </ol>
        </Card>

        {/* The mark-up. */}
        <Card guide="markup" delay={300} glow={ready}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Mark-up
            </span>
            {ready ? (
              <span className="demo-pop block">
                <Pill tone="success" dot>
                  Ready
                </Pill>
              </span>
            ) : (
              <Pill tone="accent" dot>
                Drafting
              </Pill>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-border pb-3.5">
            <Stat label="Matched" tone="text-success">
              <Counter to={ready ? counselTotals.matched : matched} run={loaded} />
            </Stat>
            <Stat label="Redlines" tone="text-warning">
              <Counter to={ready ? markup.redlines : flagged.length} run={loaded} />
            </Stat>
            <Stat label="Inserted" tone="text-error">
              <Counter to={ready ? markup.inserted : 0} run={loaded} />
            </Stat>
          </div>
          <div className="mt-3">
            <CardRow label="Review time" value={`~${markup.reviewMinutes} min`} />
            <CardRow label="Basis" value="Playbook v4 · Commercial" mono />
          </div>
          {/* Always in the DOM for the prerender; revealed when the read completes. */}
          <div className={`${ready ? 'demo-rise' : 'hidden'} mt-3.5 border-t border-border pt-3.5`}>
            <Pill tone="success" dot>
              {markup.status}
            </Pill>
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <Button disabled={!ready}>Export mark-up</Button>
            <p className="text-[12px] leading-relaxed text-dim">
              Visual only in this demo. No document is produced.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ======================================================================== */

type RowState = ClauseStatus | 'reading' | 'unread';

const rowSurface: Record<RowState, string> = {
  unread: 'border-border/40 border-l-border bg-card/30 opacity-55',
  reading: 'border-accent/40 border-l-accent bg-accent/[0.05]',
  match: 'border-border/60 border-l-success bg-card/40',
  nonstandard: 'border-warning/40 border-l-warning bg-warning/[0.06]',
  missing: 'border-error/45 border-l-error bg-error/[0.06]',
};

function ClauseRow({ clause: c, state }: { clause: Clause; state: RowState }) {
  const resolved = state === 'match' || state === 'nonstandard' || state === 'missing';
  return (
    <li
      data-guide={`clause-${c.id}`}
      className={`grid gap-x-4 gap-y-2 rounded-[12px] border border-l-2 px-3.5 py-3 transition-all duration-500 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)_136px] sm:items-start ${rowSurface[state]}`}
    >
      {/* Contract */}
      <div className="min-w-0">
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[10px] text-dim">{c.ref}</span>
          <span className={`text-[13px] font-medium ${resolved ? 'text-foreground' : 'text-muted'}`}>
            {c.name}
          </span>
        </span>
        <p className={`mt-1 text-[12.5px] leading-relaxed ${resolved ? 'text-foreground/85' : 'text-dim'}`}>
          {c.contract}
        </p>
      </div>

      {/* Playbook */}
      <div className="min-w-0 border-t border-border/50 pt-2 sm:border-0 sm:pt-0">
        <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-dim sm:hidden">
          Playbook
        </span>
        <p className="text-[12.5px] leading-relaxed text-muted">{c.playbook}</p>
      </div>

      {/* Verdict */}
      <div className="flex items-center gap-2 sm:justify-end">
        {state === 'match' && (
          <span className="demo-pop flex items-center gap-1.5">
            <Check size={3} />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-success">Matches</span>
          </span>
        )}
        {state === 'nonstandard' && (
          <span className="demo-pop block">
            <Pill tone="warn">Non-standard</Pill>
          </span>
        )}
        {state === 'missing' && (
          <span className="demo-pop block">
            <Pill tone="error">Missing</Pill>
          </span>
        )}
        {state === 'reading' && <span className="demo-scan-bar block h-[2px] w-14 rounded-full bg-border" />}
        {state === 'unread' && <Pending />}
      </div>

      {/* Reason — only for flagged clauses, spanning the row. */}
      {c.reason && (
        <p
          className={`${resolved ? 'demo-rise' : 'hidden'} border-t pt-2 text-[12px] leading-relaxed sm:col-span-3 ${
            state === 'missing' ? 'border-error/25 text-error' : 'border-warning/25 text-warning'
          }`}
        >
          {c.reason}
        </p>
      )}
    </li>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="hidden items-center gap-1.5 md:flex">
      <span className={`h-2 w-2 rounded-full ${swatch}`} />
      {label}
    </span>
  );
}

function Stat({
  label,
  tone,
  children,
}: {
  label: string;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <span className={`block font-display text-[24px] font-semibold leading-none ${tone}`}>
        {children}
      </span>
      <span className="mt-1 block font-mono text-[9px] uppercase tracking-eyebrow text-dim">
        {label}
      </span>
    </div>
  );
}
