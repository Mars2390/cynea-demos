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
  screeningChecks,
  screeningResult,
  supplier,
} from '@/demos/compliance/fixtures';

/**
 * STEP 2 — SCREEN · KYC & AML Screening Agent
 *
 * The checks tick through one at a time rather than appearing complete: the
 * point of the step is that the screening runs, not that it has run.
 */
export function StepScreen() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const [cleared, setCleared] = useState(0);
  const done = cleared >= screeningChecks.length;

  useEffect(() => {
    if (reduced) {
      setCleared(screeningChecks.length);
      return;
    }
    setCleared(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCleared(i);
      if (i >= screeningChecks.length) clearInterval(id);
    }, timing.scanLogLineMs);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="flex flex-col gap-4 sm:gap-5">
        <Card guide="supplier-card" glass glow delay={60}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              New supplier
            </span>
            <Pill tone="muted">{supplier.onboardedAt}</Pill>
          </div>

          <h2 className="font-display text-[20px] font-semibold leading-tight tracking-[-0.4px] text-foreground sm:text-[22px]">
            {supplier.name}
          </h2>

          <div className="mt-4">
            <CardRow label="Country" value={supplier.country} />
            <CardRow label="Sector" value={supplier.sector} />
            <CardRow label="Registration" value={supplier.registration} mono />
            <CardRow
              label="Beneficial owners"
              value={<Counter to={supplier.beneficialOwners} run={loaded} />}
              mono
            />
          </div>
        </Card>

        <Card delay={200}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={done ? 100 : (cleared / screeningChecks.length) * 100}
              run={loaded}
              size={78}
              tone="success"
              label={`${cleared}/${screeningChecks.length}`}
              sublabel="cleared"
              delayMs={120}
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Lists checked
              </span>
              <span className="mt-1 block font-display text-[26px] font-semibold leading-none tracking-[-0.6px] text-foreground">
                <Counter to={screeningResult.listsChecked} run={loaded} />
              </span>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                across {screeningResult.entitiesChecked} entities, in{' '}
                {screeningResult.durationSeconds} seconds
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Card guide="screen-checklist" glass delay={120}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Screening
            </span>
            {done ? (
              <Pill tone="success" dot>
                Complete
              </Pill>
            ) : (
              <Pill tone="accent" dot>
                Running
              </Pill>
            )}
          </div>

          {!done && (
            <div className="demo-scan-bar mb-3 h-[2px] w-full rounded-full bg-border" />
          )}

          <ol className="space-y-1">
            {screeningChecks.map((c, i) => {
              const ran = i < cleared;
              return (
                <li
                  key={c.label}
                  className={`flex items-start gap-3 rounded-[12px] border border-transparent px-2.5 py-3 transition-colors duration-300 sm:px-3 ${
                    ran ? 'hover:border-border hover:bg-card-hover' : ''
                  }`}
                >
                  <span className="mt-0.5 shrink-0 font-mono text-[11px] text-dim">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="mt-0.5 shrink-0">
                    {ran ? (
                      <span className="demo-pop block">
                        <Check />
                      </span>
                    ) : (
                      <Pending />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[14px] transition-colors duration-300 ${
                        ran ? 'text-foreground' : 'text-dim'
                      }`}
                    >
                      {c.label}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">
                      {c.detail}
                    </span>
                  </span>

                  <span className="shrink-0">
                    {ran ? (
                      <Pill tone="success">{c.result}</Pill>
                    ) : (
                      <Pill tone="muted">Queued</Pill>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>

        <Card guide="screen-result" delay={300} glow>
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5">
              <Check />
            </span>
            <p className="text-[14px] leading-relaxed text-foreground">
              {screeningResult.verdict}
            </p>
          </div>

          <div className="mt-4 border-t border-border pt-3.5">
            <CardRow
              label="Reference"
              value={screeningResult.reference}
              mono
              accent
            />
            <CardRow label="Completed" value={screeningResult.completedAt} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Evidence
            </span>
            <Pill tone="success" dot>
              {screeningResult.evidence}
            </Pill>
          </div>
        </Card>
      </div>
    </div>
  );
}
