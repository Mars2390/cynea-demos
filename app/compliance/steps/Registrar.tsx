'use client';

import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { Timeline } from '@/components/ui/Timeline';
import { useLoaded } from '@/lib/hooks';
import { auditRequest, auditTrail } from '@/demos/compliance/fixtures';

/**
 * STEP 6 — REGISTRAR · Audit Trail Agent
 *
 * The closing step pays off the five before it: every entry in the trail was
 * written by an agent the viewer has already watched work, which is why the
 * evidence exists before the auditor asks.
 */
export function StepRegistrar() {
  const loaded = useLoaded(true);

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="flex flex-col gap-4 sm:gap-5">
        <Card guide="audit-request" glass glow delay={60}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Audit request
            </span>
            <Pill tone="success" dot>
              {auditRequest.status}
            </Pill>
          </div>

          <p className="text-[15px] leading-snug text-foreground sm:text-[16px]">
            “{auditRequest.ask}”
          </p>

          <div className="mt-4">
            <CardRow label="From" value={auditRequest.from} />
            <CardRow label="Reference" value={auditRequest.reference} mono accent />
            <CardRow label="Received" value={auditRequest.received} />
            <CardRow label="Respond by" value={auditRequest.respondBy} />
          </div>
        </Card>

        <Card delay={200}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Matching evidence
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-[38px] font-semibold leading-none tracking-display text-accent">
              <Counter to={auditRequest.eventsMatched} run={loaded} />
            </span>
            <span className="text-[13px] text-muted">
              logged events, assembled in {auditRequest.assembledSeconds}{' '}
              seconds
            </span>
          </div>
          <p className="mt-3.5 text-[13px] leading-relaxed text-muted">
            Nothing had to be reconstructed. Each entry was written at the
            moment the check ran, by the agent that ran it.
          </p>
        </Card>

        <Card guide="evidence-package" delay={280}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Evidence package
          </span>
          <Button>Download evidence package</Button>
          <p className="mt-3.5 text-[12px] leading-relaxed text-dim">
            Visual only in this demo. No file is produced and nothing is sent.
          </p>
        </Card>
      </div>

      <Card guide="audit-timeline" glass delay={140}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Logged events · the compliance year
          </span>
          <Pill tone="secondary">{auditTrail.length} entries</Pill>
        </div>

        <Timeline events={auditTrail} />

        <p className="mt-5 border-t border-border pt-3.5 text-[12px] leading-relaxed text-dim">
          Every entry carries the reference an auditor would follow and the
          data the decision was derived from.
        </p>
      </Card>
    </div>
  );
}
