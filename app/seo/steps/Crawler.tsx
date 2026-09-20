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
import { crawl, crawlTotals, criticalFlag, findings } from '@/demos/seo/fixtures';

/**
 * STEP 4 — CRAWLER · Technical SEO Agent
 *
 * The crawl counts through pages and assets, the four checks resolve one by
 * one, and the findings list gets its one emerald pulse when the last check
 * lands. The critical flag — product pages dropping out of the index — is
 * the story: found by the crawler, not by the revenue line.
 */
export function StepCrawler() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = findings.length + 1; // +1 for the critical flag
  const [ticks, setTicks] = useState(0);

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
    }, Math.round(timing.scanLogLineMs * 1.05));
    return () => clearInterval(id);
  }, [reduced, total]);

  const resolved = Math.min(findings.length, ticks);
  const listDone = resolved === findings.length;
  const flagged = ticks >= total;
  const progress = Math.min(1, ticks / findings.length);

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* The crawl. */}
        <Card guide="crawl-panel" glass glow delay={60}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={progress * 100}
              run={loaded}
              size={82}
              tone="success"
              label={String(Math.round(progress * crawl.pages))}
              sublabel="pages"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Crawl · started {crawl.started}
              </span>
              <div className="mt-2">
                <span className={flagged ? 'demo-pop block' : 'hidden'}>
                  <Pill tone="warn" dot>
                    {crawlTotals.status}
                  </Pill>
                </span>
                {!flagged && (
                  <Pill tone="accent" dot>
                    Crawling
                  </Pill>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3.5">
            <Stat label="Pages">
              <Counter to={Math.round(progress * crawl.pages)} run={loaded} />
            </Stat>
            <Stat label="Assets">
              <Counter to={Math.round(progress * crawl.assets)} run={loaded} />
            </Stat>
            <Stat label="Critical" tone={flagged ? 'text-error' : 'text-foreground'}>
              <Counter to={flagged ? crawlTotals.critical : 0} run={loaded} />
            </Stat>
          </div>
          <div className="mt-3">
            <CardRow label="Duration" value={crawl.duration} mono />
            <CardRow label="Warnings" value={<Counter to={listDone ? crawlTotals.warnings : 0} run={loaded} />} mono />
          </div>
        </Card>

        {/* The one that matters. Always in the DOM for the prerender. */}
        <Card guide="critical-flag" delay={220} className={flagged ? 'border-error/40' : ''} glow={flagged}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Critical
            </span>
            {flagged ? (
              <span className="demo-pop block">
                <Pill tone="error" dot>
                  Fix now
                </Pill>
              </span>
            ) : (
              <Pill tone="muted">Checking index</Pill>
            )}
          </div>
          <div className={flagged ? 'demo-rise' : 'invisible'}>
            <p className="text-[14px] leading-snug text-foreground">{criticalFlag.title}</p>
            <ol className="mt-3 space-y-1">
              {criticalFlag.pages.map((p, i) => (
                <li key={p} className="flex items-center gap-2 font-mono text-[11px] text-error" style={{ animationDelay: `${i * 40}ms` }}>
                  <span className="h-1 w-1 rounded-full bg-error" />
                  {p}
                </li>
              ))}
            </ol>
            <p className="mt-3 border-t border-border pt-2.5 text-[12.5px] leading-relaxed text-muted">
              <span className="font-mono text-[9.5px] uppercase tracking-eyebrow text-dim">Fix · </span>
              {criticalFlag.fix}
            </p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        {/* Findings. */}
        <Card guide="findings" delay={160}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Findings
            </span>
            <span className="font-mono text-[11px] tabular-nums text-accent">
              {resolved}/{findings.length} checks
            </span>
          </div>
          <ol className={`space-y-2 ${listDone ? 'seo-pulse' : ''}`}>
            {findings.map((f, i) => {
              const on = i < resolved;
              const active = !on && i === resolved;
              const fail = f.tone === 'fail';
              return (
                <li
                  key={f.id}
                  className={`seo-hover rounded-[12px] border px-3.5 py-3 transition-colors duration-500 ${
                    !on
                      ? 'border-border/50 bg-card/40 opacity-50'
                      : fail
                        ? 'border-error/35 bg-error/[0.04]'
                        : 'border-warning/35 bg-warning/[0.04]'
                  }`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block font-mono text-[9.5px] uppercase tracking-eyebrow text-dim">{f.area}</span>
                      <span className={`mt-0.5 block text-[13.5px] ${on ? 'text-foreground' : 'text-dim'}`}>{f.summary}</span>
                    </span>
                    <span className="shrink-0">
                      {on ? (
                        <span className="demo-pop block">
                          <Pill tone={fail ? 'error' : 'warn'}>{fail ? 'Error' : 'Warning'}</Pill>
                        </span>
                      ) : active ? (
                        <span className="demo-scan-bar block h-[2px] w-12 rounded-full bg-border" />
                      ) : (
                        <Pending />
                      )}
                    </span>
                  </div>
                  <p className={`${on ? 'demo-rise' : 'invisible'} mt-1.5 text-[12px] leading-relaxed text-muted`}>{f.detail}</p>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button disabled={!flagged}>Export crawl report</Button>
            <p className="text-[12px] leading-relaxed text-dim">Visual only in this demo. No file is produced.</p>
          </div>
        </Card>

        <Card delay={320}>
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Seen the way a search engine sees it
          </span>
          <p className="text-[13px] leading-relaxed text-muted">
            Crawler runs nightly and diffs against last night. A canonical that
            quietly starts pointing the wrong way shows up here the next
            morning — not in next quarter’s revenue.
          </p>
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 font-mono text-[10px] uppercase tracking-eyebrow text-dim">
            <Check size={3} /> Nightly · diffed · 84 pages
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, tone = 'text-foreground', children }: { label: string; tone?: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <span className={`block font-display text-[24px] tabular-nums leading-none ${tone}`}>{children}</span>
      <span className="mt-1 block font-mono text-[9px] uppercase tracking-eyebrow text-dim">{label}</span>
    </div>
  );
}
