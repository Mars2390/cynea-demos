'use client';

import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Reveal, SkeletonRows } from '@/components/ui/Skeleton';
import { useLoaded } from '@/lib/hooks';
import {
  appliesBecause,
  regulation,
  regulationActions,
} from '@/demos/compliance/fixtures';

/**
 * STEP 1 — SENTINEL · Regulatory Watch Agent
 * A regulation lands, and the agent says why it is yours and what to do.
 */
export function StepSentinel() {
  const loaded = useLoaded(true);

  // 90 days of a 114-day window between publication and effect.
  const elapsedPct = Math.round(((114 - regulation.daysUntil) / 114) * 100);

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <Card guide="regulation-card" glass glow delay={60}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Regulatory watch
          </span>
          <Pill tone="warn" dot>
            {regulation.status}
          </Pill>
        </div>

        <h2 className="font-display text-[20px] font-semibold leading-tight tracking-[-0.4px] text-foreground sm:text-[23px]">
          {regulation.name}
        </h2>
        <p className="mt-1.5 text-[13px] text-muted">{regulation.scope}</p>

        <Reveal run skeleton={<SkeletonRows rows={5} />} className="mt-4">
          <CardRow label="Reference" value={regulation.reference} mono />
          <CardRow label="Published" value={regulation.published} />
          <CardRow label="Effective" value={regulation.effective} accent />
          <CardRow
            label="Days until"
            value={<Counter to={regulation.daysUntil} run={loaded} />}
            mono
          />
          <CardRow label="Impact" value={regulation.impact} />
          <CardRow label="Source" value={regulation.source} />
        </Reveal>

        <div
          data-guide="applies-because"
          className="mt-4 rounded-[14px] border border-accent/35 bg-accent/[0.07] px-4 py-3.5"
        >
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-eyebrow text-accent">
            Applies to you because
          </span>
          <p className="text-[13.5px] leading-relaxed text-foreground">
            {appliesBecause}
          </p>
        </div>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Card delay={180}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={elapsedPct}
              run={loaded}
              size={82}
              tone="accent"
              label={String(regulation.daysUntil)}
              sublabel="days"
              delayMs={160}
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Runway to enforcement
              </span>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                Flagged {regulation.detectedAt}, the day it appeared in the
                Official Journal — not the day someone noticed.
              </p>
            </div>
          </div>
        </Card>

        <Card guide="action-list" delay={260} glow>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            What to do next
          </span>
          <ol className="space-y-1">
            {regulationActions.map((a, i) => (
              <li
                key={a.n}
                style={{ animationDelay: `${300 + i * 130}ms` }}
                className="demo-rise flex items-start gap-3 rounded-[12px] border border-transparent px-2.5 py-2.5 transition-colors duration-300 hover:border-border hover:bg-card-hover"
              >
                <span className="mt-0.5 shrink-0 font-mono text-[11px] text-dim">
                  {String(a.n).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] leading-snug text-foreground">
                    {a.label}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
                      {a.due}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow text-dim">
                      {a.owner}
                    </span>
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
