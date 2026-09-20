'use client';

import { useEffect, useState } from 'react';
import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Check, Pending } from '@/components/ui/Check';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import {
  bundle,
  bundleDocuments,
  redactionCategories,
  redactionReview,
  redactTotals,
} from '@/demos/legal/fixtures';

/**
 * STEP 4 — REDACT · Document Redaction Agent
 *
 * The scan moves document by document; the category counters climb with it;
 * the one thing Redact will not decide alone surfaces as it is found. The
 * counts are the bundle's — the eight documents listed are a sample of the
 * forty-seven.
 */
export function StepRedact() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = bundleDocuments.length;
  const [scanned, setScanned] = useState(0);

  useEffect(() => {
    if (reduced) {
      setScanned(total);
      return;
    }
    setScanned(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setScanned(i);
      if (i >= total) clearInterval(id);
    }, Math.round(timing.scanLogLineMs * 0.6));
    return () => clearInterval(id);
  }, [reduced, total]);

  const progress = scanned / total;
  const done = scanned === total;
  const reviewFound = bundleDocuments.findIndex((d) => 'review' in d && d.review) < scanned;
  const runningTotal = Math.round(redactTotals.redactions * progress);
  const share = (count: number) => (done ? count : Math.round(count * progress));

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      {/* The bundle, document by document. */}
      <Card guide="bundle" glass glow delay={60}>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              {bundle.name} · {bundle.matter}
            </span>
            <span className="mt-1.5 block font-display text-[22px] font-semibold leading-tight tracking-[-0.5px] text-foreground">
              {bundle.documents} documents
              <span className="ml-2 text-[14px] font-normal text-muted">
                {bundle.pages.toLocaleString('en-GB')} pages
              </span>
            </span>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Pill tone={done ? 'success' : 'accent'} dot>
              {done ? 'Pass complete' : `Scanning ${Math.min(scanned + 1, total)} of ${total}`}
            </Pill>
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-dim">
              Disclosure due {bundle.deadline}
            </span>
          </div>
        </div>

        <div className="mb-3 h-[2px] w-full rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-demo"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <ol className="space-y-1.5">
          {bundleDocuments.map((d, i) => {
            const isDone = i < scanned;
            const active = !isDone && i === scanned;
            const flagged = 'review' in d && d.review;
            return (
              <li
                key={d.id}
                className={`flex items-center justify-between gap-3 rounded-[12px] border px-3 py-2.5 transition-colors duration-500 ${
                  !isDone
                    ? 'border-border/50 bg-card/30'
                    : flagged
                      ? 'border-warning/40 bg-warning/[0.06]'
                      : 'border-border/60 bg-card/40'
                }`}
              >
                <span className="min-w-0">
                  <span className={`block truncate text-[13px] ${isDone ? 'text-foreground' : 'text-dim'}`}>
                    {d.name}
                  </span>
                  <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-dim">
                    {d.id} · {d.pages} pages
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2.5">
                  {isDone && (
                    <span className={`font-mono text-[11px] tabular-nums ${flagged ? 'text-warning' : 'text-muted'}`}>
                      {d.redactions}
                    </span>
                  )}
                  {isDone ? (
                    <span className="demo-pop block">
                      {flagged ? <Pill tone="warn">Review</Pill> : <Check size={3} />}
                    </span>
                  ) : active ? (
                    <span className="demo-scan-bar block h-[2px] w-14 rounded-full bg-border" />
                  ) : (
                    <Pending />
                  )}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-dim">
          Showing {total} of {bundle.documents} documents
        </p>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-5">
        {/* What was removed, and why. */}
        <Card guide="redact-categories" delay={200} glow={done}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={progress * 100}
              run={loaded}
              size={82}
              tone="success"
              label={String(runningTotal)}
              sublabel="redacted"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Redactions
              </span>
              {/* Final status always in the DOM for the prerender. */}
              <div className="mt-2">
                <span className={done ? 'demo-pop block' : 'hidden'}>
                  <Pill tone="success" dot>
                    {redactTotals.status}
                  </Pill>
                </span>
                {!done && (
                  <Pill tone="accent" dot>
                    Applying consistently
                  </Pill>
                )}
              </div>
            </div>
          </div>
          <ol className="mt-4 space-y-1 border-t border-border pt-3.5">
            {redactionCategories.map((c) => (
              <li key={c.id} className="flex items-baseline justify-between gap-3 py-1.5">
                <span className="min-w-0">
                  <span className="block text-[13px] text-foreground">{c.label}</span>
                  <span className="block text-[11px] text-dim">{c.examples}</span>
                </span>
                <span className="shrink-0 font-mono text-[15px] tabular-nums text-accent">
                  <Counter to={share(c.count)} run={loaded} />
                </span>
              </li>
            ))}
          </ol>
        </Card>

        {/* The one Redact will not decide alone. Always in the DOM for the
            prerender; revealed when its document is scanned. */}
        <Card
          guide="redact-review"
          delay={300}
          className={reviewFound ? 'border-warning/40' : ''}
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              For human review
            </span>
            {reviewFound ? (
              <span className="demo-pop block">
                <Pill tone="warn" dot>
                  Needs sign-off
                </Pill>
              </span>
            ) : (
              <Pill tone="muted">None yet</Pill>
            )}
          </div>
          <div className={reviewFound ? 'demo-rise' : 'hidden'}>
            <p className="text-[14px] leading-snug text-foreground">{redactionReview.flag}</p>
            <div className="mt-3">
              <CardRow label="Document" value={redactionReview.document} mono />
              <CardRow label="Reason" value={redactionReview.reason} />
            </div>
          </div>
          {!reviewFound && (
            <p className="text-[13px] text-dim">Anything Redact is not sure about stops here.</p>
          )}
        </Card>

        {/* The log. */}
        <Card delay={380}>
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Redaction log
          </span>
          <p className="text-[13px] leading-relaxed text-muted">
            Every redaction, with the document, the page, the category and
            the rule it matched — the record that shows the pass was
            consistent.
          </p>
          <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
            <Button disabled={!done}>Download log</Button>
            <p className="text-[12px] leading-relaxed text-dim">
              Visual only in this demo. No file is produced.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
