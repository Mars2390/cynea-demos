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
  captureTotals,
  extractedFields,
  invoices,
} from '@/demos/finance/fixtures';

const gbp = (n: number) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });

/**
 * STEP 1 — CAPTURE · Invoice Processing Agent
 *
 * Three invoices "read" in sequence: the extracted fields tick in one at a
 * time per invoice, then the outcome lands — two coded, one held as a
 * duplicate. The reading is the demonstration, so it is animated rather than
 * shown complete.
 */
export function StepCapture() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  // Total ticks across all invoices; each invoice owns a slice of them.
  const perInvoice = extractedFields.length;
  const totalTicks = invoices.length * perInvoice;
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
    }, Math.round(timing.scanLogLineMs * 0.55));
    return () => clearInterval(id);
  }, [reduced, totalTicks]);

  const read = Math.min(invoices.length, Math.floor(ticks / perInvoice));

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        {invoices.map((inv, idx) => {
          const own = Math.max(0, Math.min(perInvoice, ticks - idx * perInvoice));
          const done = own >= perInvoice;
          const flagged = inv.status === 'flagged';

          return (
            <Card
              key={inv.id}
              guide={`invoice-${inv.id}`}
              glass={idx === 0}
              glow={done && flagged}
              delay={60 + idx * 110}
              className="!p-0 overflow-hidden"
            >
              {/* PDF-style header */}
              <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5">
                <div className="min-w-0">
                  <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-muted">
                    Invoice · PDF
                  </span>
                  <span className="mt-1 block truncate text-[14px] font-medium text-foreground">
                    {inv.vendor}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-dim">
                    {inv.number} · {inv.date}
                  </span>
                </div>
                <span className="shrink-0 text-right">
                  <span className="block font-mono text-[15px] tabular-nums text-foreground">
                    {gbp(inv.total)}
                  </span>
                  <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-dim">
                    incl. VAT
                  </span>
                </span>
              </div>

              <div className="px-4 py-3.5">
                <CardRow label="Net" value={gbp(inv.net)} mono />
                <CardRow label="VAT 20%" value={gbp(inv.vat)} mono />
                <CardRow label="PO" value={inv.po} mono />
              </div>

              {/* Extraction ticks */}
              <div className="border-t border-border px-4 py-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-eyebrow text-muted">
                    Extracted
                  </span>
                  {!done && own > 0 && (
                    <span className="demo-scan-bar h-[2px] w-16 rounded-full bg-border" />
                  )}
                </div>
                <ol className="space-y-1.5">
                  {extractedFields.map((f, fi) => {
                    const on = fi < own;
                    const value =
                      f === 'Vendor'
                        ? inv.vendor
                        : f === 'Amount'
                          ? gbp(inv.net)
                          : f === 'VAT line'
                            ? gbp(inv.vat)
                            : f === 'Account code'
                              ? inv.account
                              : inv.costCentre;
                    return (
                      <li
                        key={f}
                        className="flex items-center justify-between gap-2 text-[12px]"
                      >
                        <span className="flex items-center gap-2">
                          {on ? (
                            <span className="demo-pop block">
                              <Check size={3} />
                            </span>
                          ) : (
                            <Pending />
                          )}
                          <span className={on ? 'text-muted' : 'text-dim'}>{f}</span>
                        </span>
                        <span
                          className={`truncate font-mono text-[11px] transition-opacity duration-300 ${
                            on ? 'text-foreground opacity-100' : 'opacity-0'
                          }`}
                        >
                          {value}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Outcome */}
              <div
                className={`border-t px-4 py-3 transition-colors duration-500 ${
                  !done
                    ? 'border-border'
                    : flagged
                      ? 'border-warning/40 bg-warning/[0.07]'
                      : 'border-success/30 bg-success/[0.06]'
                }`}
              >
                {/* The outcome is always in the DOM so the prerendered page
                    carries it; it is only revealed once the read completes. */}
                <div className={done ? 'demo-rise flex items-start gap-2.5' : 'hidden'}>
                  {flagged ? (
                    <Pill tone="warn" dot>
                      Review
                    </Pill>
                  ) : (
                    <Pill tone="success" dot>
                      Coded
                    </Pill>
                  )}
                  <span
                    className={`text-[12px] leading-snug ${
                      flagged ? 'text-foreground' : 'text-muted'
                    }`}
                  >
                    {inv.note}
                  </span>
                </div>
                {!done && (
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-dim">
                    {own > 0 ? 'Reading…' : 'Queued'}
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card guide="capture-totals" delay={420}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={(read / invoices.length) * 100}
              run={loaded}
              size={78}
              tone="success"
              label={`${read}/${invoices.length}`}
              sublabel="read"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                This batch
              </span>
              <div className="mt-2">
                <Pill tone={read === invoices.length ? 'success' : 'accent'} dot>
                  {captureTotals.status}
                </Pill>
              </div>
            </div>
          </div>
        </Card>

        <Card delay={480}>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            What Capture does with each one
          </span>
          <ol className="space-y-2">
            {[
              'Reads the PDF and extracts vendor, amounts, VAT and PO.',
              'Validates the totals and matches the PO to the purchase ledger.',
              'Codes to account and cost centre, then queues for approval.',
              'Holds anything that already exists — before it hits the ledger.',
            ].map((line, i) => (
              <li key={line} className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
                <span className="shrink-0 font-mono text-[11px] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {line}
              </li>
            ))}
          </ol>
          <p className="mt-3 border-t border-border pt-3 font-mono text-[10px] uppercase tracking-eyebrow text-dim">
            <Counter to={captureTotals.rekeyed} run={loaded} /> fields re-keyed
          </p>
        </Card>
      </div>
    </div>
  );
}
