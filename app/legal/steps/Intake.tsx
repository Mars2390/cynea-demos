'use client';

import { useEffect, useState } from 'react';
import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Check, Pending } from '@/components/ui/Check';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import {
  conflictChecks,
  enquiry,
  factChecklist,
  intakeTotals,
  matterFile,
} from '@/demos/legal/fixtures';

/**
 * STEP 1 — INTAKE · Matter Intake Agent
 *
 * One tick sequence drives the whole step: the facts are gathered first, the
 * three conflict searches run next, and only once all three are clear does
 * the matter file open. That ordering is the point — nothing is opened
 * before the conflicts are known.
 */
export function StepIntake() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const factTicks = factChecklist.length;
  const checkTicks = conflictChecks.length;
  const totalTicks = factTicks + checkTicks + 1; // +1 opens the file
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
    }, Math.round(timing.scanLogLineMs * 0.7));
    return () => clearInterval(id);
  }, [reduced, totalTicks]);

  const factsDone = Math.min(factTicks, ticks);
  const checksDone = Math.max(0, Math.min(checkTicks, ticks - factTicks));
  const checksRunning = ticks >= factTicks && checksDone < checkTicks;
  const opened = ticks >= totalTicks;

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* The enquiry, as it arrived. */}
        <Card guide="enquiry-card" glass glow delay={60}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              New enquiry · {enquiry.received}
            </span>
            <Pill tone="accent" dot>
              Received
            </Pill>
          </div>
          <span className="block font-display text-[22px] font-semibold leading-tight tracking-[-0.5px] text-foreground sm:text-[24px]">
            {enquiry.client}
          </span>
          <span className="mt-1.5 block text-[12.5px] text-muted">{enquiry.contact}</span>
          <div className="mt-3.5">
            <Pill tone="secondary">{enquiry.matterType}</Pill>
          </div>
          <p className="mt-4 border-t border-border pt-4 text-[13.5px] leading-relaxed text-foreground/90">
            {enquiry.summary}
          </p>
        </Card>

        {/* Fact gathering. */}
        <Card guide="fact-checklist" delay={180}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Facts and documents
            </span>
            <Pill tone={factsDone === factTicks ? 'success' : 'accent'} dot>
              {factsDone === factTicks ? 'Gathered' : 'Gathering'}
            </Pill>
          </div>
          <ol className="space-y-2">
            {factChecklist.map((f, i) => {
              const on = i < factsDone;
              return (
                <li
                  key={f.label}
                  className={`flex items-start gap-2.5 rounded-[12px] border px-3 py-2.5 transition-colors duration-500 ${
                    on ? 'border-success/25 bg-success/[0.05]' : 'border-border/60 bg-card/40'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {on ? (
                      <span className="demo-pop block">
                        <Check size={4} />
                      </span>
                    ) : (
                      <Pending />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[13.5px] ${on ? 'text-foreground' : 'text-dim'}`}>
                      {f.label}
                    </span>
                    <span
                      className={`block font-mono text-[10.5px] leading-relaxed transition-opacity duration-300 ${
                        on ? 'text-muted opacity-100' : 'opacity-0'
                      }`}
                    >
                      {f.detail}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        {/* Conflict check. */}
        <Card guide="conflict-check" delay={260} glow={checksDone === checkTicks}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={(checksDone / checkTicks) * 100}
              run={loaded}
              size={78}
              tone="success"
              label={`${checksDone}/${checkTicks}`}
              sublabel="clear"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Conflict check
              </span>
              <div className="mt-2">
                {checksDone === checkTicks ? (
                  <Pill tone="success" dot>
                    All clear
                  </Pill>
                ) : checksRunning ? (
                  <Pill tone="accent" dot>
                    Searching
                  </Pill>
                ) : (
                  <Pill tone="muted">Queued</Pill>
                )}
              </div>
            </div>
          </div>
          <ol className="mt-4 space-y-1.5 border-t border-border pt-3.5">
            {conflictChecks.map((c, i) => {
              const done = i < checksDone;
              const running = !done && checksRunning && i === checksDone;
              return (
                <li
                  key={c.scope}
                  className="flex items-center justify-between gap-3 py-1 text-[13px]"
                >
                  <span className="min-w-0">
                    <span className={`block ${done ? 'text-foreground' : 'text-dim'}`}>
                      {c.scope}
                    </span>
                    <span
                      className={`block font-mono text-[10px] text-muted transition-opacity duration-300 ${
                        done ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {c.detail}
                    </span>
                  </span>
                  <span className="shrink-0">
                    {done ? (
                      <span className="demo-pop block">
                        <Pill tone="success">Clear</Pill>
                      </span>
                    ) : running ? (
                      <span className="demo-scan-bar block h-[2px] w-14 rounded-full bg-border" />
                    ) : (
                      <Pending />
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>

        {/* Matter file. Always in the DOM for the prerender; the values
            reveal once the conflicts have cleared. */}
        <Card guide="matter-file" delay={340} glow={opened}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Matter file
            </span>
            {opened ? (
              <span className="demo-pop block">
                <Pill tone="success" dot>
                  Opened
                </Pill>
              </span>
            ) : (
              <Pill tone="muted">Awaiting clearance</Pill>
            )}
          </div>
          <span
            className={`block font-mono text-[24px] tabular-nums tracking-[-0.5px] transition-colors duration-500 ${
              opened ? 'text-accent' : 'text-dim'
            }`}
          >
            {matterFile.number}
          </span>
          <div className={`mt-3 transition-opacity duration-500 ${opened ? 'opacity-100' : 'opacity-40'}`}>
            <CardRow label="Fee earner" value={matterFile.feeEarner} />
            <CardRow label="Opened" value={matterFile.opened} mono />
            <CardRow label="Next action" value={matterFile.nextAction} accent />
          </div>
          <div className={`mt-4 border-t border-border pt-3.5 ${opened ? 'demo-rise' : 'hidden'}`}>
            <Pill tone="success" dot>
              {matterFile.status}
            </Pill>
          </div>
        </Card>

        <Card delay={420}>
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Enquiry to opened matter
          </span>
          <span className="block font-display text-[30px] font-semibold leading-none text-foreground">
            <Counter to={intakeTotals.minutes} run={loaded} />
            <span className="ml-1.5 text-[14px] font-normal text-muted">minutes</span>
          </span>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            Facts, documents and three conflict searches done before the fee
            earner opens the file. They start on the substance.
          </p>
        </Card>
      </div>
    </div>
  );
}
