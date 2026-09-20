'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Check, Pending } from '@/components/ui/Check';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import { fixes, onpageTotals, pagePreview, site } from '@/demos/seo/fixtures';

const AUDITS = ['Titles', 'Headings', 'Internal links', 'Schema'] as const;

/**
 * STEP 3 — ONPAGE · On-Page Optimisation Agent
 *
 * The scan counts through the site, the four audits tick, and the fix list
 * lands ordered by expected impact with a bar per fix. Then one page, before
 * and after — a toggle flips between what is live and what the mark-up
 * produces, so the fix list is not abstract.
 */
export function StepOnPage() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = AUDITS.length + fixes.length; // audits first, then fixes land
  const [ticks, setTicks] = useState(0);
  const [mode, setMode] = useState<'current' | 'fixed'>('current');

  useEffect(() => {
    if (reduced) {
      setTicks(total);
      return;
    }
    setTicks(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTicks(i);
      if (i >= total) clearInterval(id);
    }, Math.round(timing.scanLogLineMs * 0.7));
    return () => clearInterval(id);
  }, [reduced, total]);

  const audited = Math.min(AUDITS.length, ticks);
  const landed = Math.max(0, Math.min(fixes.length, ticks - AUDITS.length));
  const done = ticks >= total;
  const scanned = Math.round((Math.min(ticks, AUDITS.length) / AUDITS.length) * site.pages);

  // Once the list has landed, flip the preview to the fixed state on its own.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setMode('fixed'), reduced ? 0 : 900);
    return () => clearTimeout(t);
  }, [done, reduced]);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* The site, scanned. */}
        <Card guide="site-panel" glass glow delay={60}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={(scanned / site.pages) * 100}
              run={loaded}
              size={82}
              tone="success"
              label={String(scanned)}
              sublabel="pages"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Site audit
              </span>
              <span className="mt-1 block font-display text-[20px] leading-tight text-foreground">
                {site.domain}
              </span>
              <div className="mt-2">
                <Pill tone={done ? 'success' : 'accent'} dot>
                  {done ? `${site.pages} pages audited` : audited < AUDITS.length ? 'Scanning' : 'Ranking fixes'}
                </Pill>
              </div>
            </div>
          </div>
          <ol className="mt-4 space-y-1.5 border-t border-border pt-3.5">
            {AUDITS.map((a, i) => {
              const on = i < audited;
              const active = !on && i === audited;
              return (
                <li key={a} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className={on ? 'text-foreground' : 'text-dim'}>{a}</span>
                  {on ? (
                    <span className="demo-pop block">
                      <Check size={3} />
                    </span>
                  ) : active ? (
                    <span className="demo-scan-bar block h-[2px] w-12 rounded-full bg-border" />
                  ) : (
                    <Pending />
                  )}
                </li>
              );
            })}
          </ol>
          {/* Laid out from the start (invisible, not hidden): the pill wraps at
              phone widths, and a card that grows under the guide's spotlight
              would leave the next target parked low. */}
          <div className="mt-4 border-t border-border pt-3.5">
            <span className={done ? 'demo-pop block' : 'invisible block'}>
              <Pill tone="success" dot>
                {onpageTotals.status}
              </Pill>
            </span>
          </div>
        </Card>

        {/* The fix list, by impact. */}
        <Card guide="fix-list" delay={180}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Fix list · ordered by expected impact
            </span>
            <span className="font-mono text-[11px] tabular-nums text-accent">
              <Counter to={done ? onpageTotals.fixes : Math.round((landed / fixes.length) * onpageTotals.fixes)} run={loaded} /> fixes
            </span>
          </div>
          <ol className={`space-y-2 ${done ? 'seo-pulse' : ''}`}>
            {fixes.map((f, i) => {
              const on = i < landed;
              return (
                <li
                  key={f.id}
                  className={`seo-hover rounded-[12px] border px-3.5 py-3 transition-colors duration-500 ${
                    on ? 'border-border bg-card' : 'border-border/50 bg-card/40 opacity-45'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex min-w-0 items-baseline gap-2.5">
                      <span className="font-mono text-[10px] text-dim">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[13.5px] text-foreground">{f.title}</span>
                    </span>
                    <span className={`shrink-0 font-mono text-[10px] uppercase tracking-eyebrow ${f.kind === 'ctr' ? 'text-success' : 'text-muted'}`}>
                      {f.effect}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-eyebrow text-dim">Impact</span>
                    <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-border">
                      <span
                        className={`block h-full rounded-full transition-[width] duration-700 ease-demo ${f.kind === 'ctr' ? 'bg-success' : 'bg-accent'}`}
                        style={{ width: on ? `${f.impact}%` : '0%' }}
                      />
                    </span>
                    <span className="w-8 text-right font-mono text-[10px] tabular-nums text-muted">
                      <Counter to={on ? f.impact : 0} run={loaded} />
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button disabled={!done}>Export fix list</Button>
            <p className="text-[12px] leading-relaxed text-dim">Visual only in this demo. No file is produced.</p>
          </div>
        </Card>
      </div>

      {/* One page, before and after. */}
      <Card guide="page-preview" delay={300}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="min-w-0 font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Page preview · <span className="normal-case tracking-normal text-foreground">{pagePreview.path}</span>
          </span>
          <div role="radiogroup" aria-label="Preview state" className="inline-flex rounded-btn border border-border bg-card/70 p-0.5">
            {(['current', 'fixed'] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={mode === m}
                onClick={() => setMode(m)}
                className={`demo-tap rounded-[10px] px-3 py-1 font-mono text-[10px] uppercase tracking-eyebrow transition-colors duration-200 ${
                  mode === m ? 'bg-accent text-on-accent' : 'text-muted hover:text-foreground'
                }`}
              >
                {m === 'current' ? 'Current' : 'Fixed'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(['current', 'fixed'] as const).map((col) => {
            const active = mode === col;
            return (
              <div
                key={col}
                className={`rounded-[12px] border p-3.5 transition-all duration-300 ${
                  col === 'fixed'
                    ? active ? 'border-success/40 bg-success/[0.04]' : 'border-border bg-card/40'
                    : active ? 'border-error/30 bg-error/[0.03]' : 'border-border bg-card/40'
                } ${active ? 'opacity-100' : 'opacity-50 max-sm:hidden'}`}
              >
                <span className={`mb-2 block font-mono text-[9.5px] uppercase tracking-eyebrow ${col === 'fixed' ? 'text-success' : 'text-error'}`}>
                  {col === 'fixed' ? 'After · mark-up applied' : 'Before · live now'}
                </span>
                <dl className="space-y-2">
                  {pagePreview.fields.map((f) => {
                    const v = col === 'fixed' ? f.after : f.before;
                    return (
                      <div key={f.label} className="border-t border-border/60 pt-2 first:border-0 first:pt-0">
                        <dt className="font-mono text-[9px] uppercase tracking-eyebrow text-dim">{f.label}</dt>
                        <dd className={`mt-0.5 text-[12.5px] leading-snug ${v ? 'text-foreground' : 'italic text-error'}`}>
                          {v || 'missing'}
                        </dd>
                        {col === 'fixed' && (
                          <dd className="mt-0.5 font-mono text-[9.5px] text-success">{f.note}</dd>
                        )}
                      </div>
                    );
                  })}
                </dl>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
