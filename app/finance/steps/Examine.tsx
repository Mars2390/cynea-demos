'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Check, Pending } from '@/components/ui/Check';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import { claims, examineTotals, policyChecks } from '@/demos/finance/fixtures';

const gbp = (n: number) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });

/**
 * STEP 3 — EXAMINE · Expense Audit Agent
 *
 * Five claims run through three policy checks each. The outcome colours are
 * the semantic ones: lime approved, red rejected, amber escalated — the
 * viewer should be able to read the result of any card from its colour alone.
 */
export function StepExamine() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const perClaim = policyChecks.length;
  const totalTicks = claims.length * perClaim;
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    if (reduced) {
      setTicks(totalTicks);
      return;
    }
    setTicks(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTicks(i);
      if (i >= totalTicks) clearInterval(id);
    }, Math.round(timing.scanLogLineMs * 0.5));
    return () => clearInterval(id);
  }, [reduced, totalTicks]);

  const reviewed = Math.min(claims.length, Math.floor(ticks / perClaim));

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <Card guide="claims-list" glass glow delay={60}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Expense claims · policy review
          </span>
          {reviewed === claims.length ? (
            <Pill tone="success" dot>
              Complete
            </Pill>
          ) : (
            <Pill tone="accent" dot>
              Reviewing
            </Pill>
          )}
        </div>

        <ol className="space-y-2">
          {claims.map((c, idx) => {
            const own = Math.max(0, Math.min(perClaim, ticks - idx * perClaim));
            const done = own >= perClaim;
            // Escalated is amber like its card border, note and counter.
            const tone = c.outcome === 'approved' ? 'success' : 'warn';
            const border = !done
              ? 'border-border/60 bg-card/40'
              : c.outcome === 'approved'
                ? 'border-success/30 bg-success/[0.05]'
                : c.outcome === 'rejected'
                  ? 'border-error/40 bg-error/[0.06]'
                  : 'border-warning/40 bg-warning/[0.06]';
            const label =
              c.outcome === 'approved'
                ? 'Approved'
                : c.outcome === 'rejected'
                  ? 'Rejected'
                  : 'Escalated';

            return (
              <li
                key={c.id}
                data-guide={`claim-${c.id}`}
                className={`rounded-[12px] border px-3.5 py-3 transition-colors duration-500 ${border}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <div className="min-w-0">
                    <span className="block text-[13.5px] text-foreground">{c.who}</span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-eyebrow text-dim">
                      {c.date} · {c.category}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className="font-mono text-[14px] tabular-nums text-foreground">
                      {gbp(c.amount)}
                    </span>
                    {done ? (
                      <span className="demo-pop block">
                        <Pill tone={c.outcome === 'rejected' ? 'error' : tone}>{label}</Pill>
                      </span>
                    ) : (
                      <Pill tone="muted">{own > 0 ? 'Checking' : 'Queued'}</Pill>
                    )}
                  </div>
                </div>

                {/* Policy ticks */}
                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                  {policyChecks.map((p, pi) => {
                    const on = pi < own;
                    return (
                      <span key={p} className="flex items-center gap-1.5 text-[11px]">
                        {on ? (
                          <span className="demo-pop block">
                            <Check size={3} />
                          </span>
                        ) : (
                          <Pending />
                        )}
                        <span className={on ? 'text-muted' : 'text-dim'}>{p}</span>
                      </span>
                    );
                  })}
                </div>

                {/* Always in the DOM for the prerender; revealed on completion. */}
                {c.note && (
                  <p
                    className={`${done ? 'demo-rise' : 'hidden'} mt-2.5 border-t pt-2 text-[12px] leading-relaxed ${
                      c.outcome === 'rejected'
                        ? 'border-error/25 text-error'
                        : 'border-warning/25 text-warning'
                    }`}
                  >
                    {c.note}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Card guide="examine-totals" delay={200}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={(reviewed / claims.length) * 100}
              run={loaded}
              size={82}
              tone="success"
              label={`${reviewed}/${claims.length}`}
              sublabel="reviewed"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Outcome
              </span>
              <div className="mt-2">
                <Pill tone={reviewed === claims.length ? 'success' : 'accent'} dot>
                  {examineTotals.status}
                </Pill>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3.5">
            <Stat label="Approved" tone="text-success">
              <Counter to={examineTotals.approved} run={loaded} />
            </Stat>
            <Stat label="Rejected" tone="text-error">
              <Counter to={examineTotals.rejected} run={loaded} delayMs={100} />
            </Stat>
            <Stat label="Escalated" tone="text-warning">
              <Counter to={examineTotals.escalated} run={loaded} delayMs={200} />
            </Stat>
          </div>
        </Card>

        <Card delay={300}>
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Only one reaches a manager
          </span>
          <p className="text-[13px] leading-relaxed text-muted">
            Four of five claims never needed a human. The one that did arrives
            with the policy line it tripped and the amount over the threshold —
            a decision, not a chore.
          </p>
        </Card>
      </div>
    </div>
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
