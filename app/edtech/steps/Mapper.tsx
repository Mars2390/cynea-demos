'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Check, Pending } from '@/components/ui/Check';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import { frameworks, gaps, mapperTotals, pending, strands } from '@/demos/edtech/fixtures';

/**
 * STEP 3 — MAPPER · Curriculum Mapping Agent
 *
 * The framework is chosen; the four strands map one after another, each
 * bar filling to what the content and assessment already cover. The ring
 * settles on ninety-four percent, and the four gaps are named — with what
 * kind of gap each one is, so the planning list writes itself.
 */
export function StepMapper() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = strands.length + gaps.length + 1; // strands map, gaps land, pending
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
    }, Math.round(timing.scanLogLineMs * 0.8));
    return () => clearInterval(id);
  }, [reduced, total]);

  const mapped = Math.min(strands.length, ticks);
  const landed = Math.max(0, Math.min(gaps.length, ticks - strands.length));
  const done = ticks >= total;
  const covered = strands.slice(0, mapped).reduce((n, s) => n + s.covered, 0);
  const seen = strands.slice(0, mapped).reduce((n, s) => n + s.total, 0);
  const percent = mapped ? Math.round((covered / seen) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        {/* The framework and its strands. */}
        <Card guide="framework" glass glow delay={60}>
          <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Framework
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Curriculum framework">
            {frameworks.map((f, i) => (
              <span
                key={f}
                role="radio"
                aria-checked={i === 0}
                className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-eyebrow ${
                  i === 0 ? 'border-accent/45 bg-accent/[0.06] text-accent' : 'border-border text-dim'
                }`}
              >
                {f}
              </span>
            ))}
          </div>

          <ol className="mt-5 space-y-3 border-t border-border pt-4">
            {strands.map((s, i) => {
              const on = i < mapped;
              const active = !on && i === mapped;
              const pct = on ? (s.covered / s.total) * 100 : 0;
              return (
                <li key={s.name} className="edtech-hover rounded-[12px] border border-border bg-card/60 px-3.5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5 text-[13.5px] text-foreground">
                      {on ? (
                        <span className="demo-pop block">
                          <Check size={3} />
                        </span>
                      ) : active ? (
                        <span className="demo-scan-bar block h-[2px] w-6 rounded-full bg-border" />
                      ) : (
                        <Pending />
                      )}
                      {s.name}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-muted">
                      <Counter to={on ? s.covered : 0} run={loaded} />
                      <span className="text-dim">/{s.total}</span>
                    </span>
                  </div>
                  <span className="mt-2 block h-[3px] overflow-hidden rounded-full bg-border">
                    <span
                      className="block h-full rounded-full bg-accent transition-[width] duration-700 ease-demo"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>

        {/* Coverage at a glance. */}
        <Card guide="coverage" delay={220} glow={done}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={percent}
              run={loaded}
              size={92}
              tone="success"
              label={`${percent}%`}
              sublabel="covered"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Coverage
              </span>
              <span className="mt-1 block font-display text-[20px] leading-tight text-foreground">
                {mapped < strands.length ? `Mapping ${strands[mapped].name}…` : 'Whole framework mapped'}
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3.5 sm:grid-cols-4 lg:grid-cols-2">
            <Stat label="Objectives">
              <Counter to={seen} run={loaded} />
            </Stat>
            <Stat label="Covered">
              <Counter to={covered} run={loaded} />
            </Stat>
            <Stat label="Gaps">
              <Counter to={landed} run={loaded} />
            </Stat>
            <Stat label="Pending">
              <Counter to={done ? mapperTotals.pending : 0} run={loaded} />
            </Stat>
          </div>
          {/* Final status always in the DOM, laid out from the start. */}
          <div className="mt-4 border-t border-border pt-3.5">
            <span className={done ? 'demo-pop block' : 'invisible block'}>
              <Pill tone="success" dot>
                {mapperTotals.status}
              </Pill>
            </span>
          </div>
        </Card>
      </div>

      {/* The gaps, named. */}
      <Card guide="gaps" delay={300}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Gaps · {gaps.length} · and 1 pending
          </span>
          <span className="font-mono text-[11px] tabular-nums text-warning">{landed} named</span>
        </div>
        <ol className={`grid gap-2 sm:grid-cols-2 ${done ? 'edtech-pulse' : ''}`}>
          {gaps.map((g, i) => {
            const on = i < landed;
            return (
              <li
                key={g.objective}
                className={`edtech-hover flex items-start justify-between gap-3 rounded-[12px] border px-3.5 py-3 transition-colors duration-500 ${
                  on ? 'border-warning/30 bg-warning/[0.04]' : 'border-border/50 bg-card/40 opacity-45'
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-[13px] text-foreground">{g.objective}</span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-eyebrow text-dim">
                    {g.strand} · {g.note}
                  </span>
                </span>
                <span className={on ? 'demo-pop shrink-0' : 'invisible shrink-0'}>
                  <Pill tone="warn" dot>
                    {g.state === 'not-taught' ? 'Not taught' : 'No assessment'}
                  </Pill>
                </span>
              </li>
            );
          })}
          <li
            className={`flex items-start justify-between gap-3 rounded-[12px] border px-3.5 py-3 transition-colors duration-500 sm:col-span-2 ${
              done ? 'border-border bg-card' : 'border-border/50 bg-card/40 opacity-45'
            }`}
          >
            <span className="min-w-0">
              <span className="block text-[13px] text-foreground">{pending.objective}</span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-eyebrow text-dim">
                Physics · {pending.note}
              </span>
            </span>
            <span className={done ? 'demo-pop shrink-0' : 'invisible shrink-0'}>
              <Pill tone="muted">Pending</Pill>
            </span>
          </li>
        </ol>
        <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Button disabled={!done}>Export coverage report</Button>
          <p className="text-[12px] leading-relaxed text-dim">Visual only in this demo. No file is produced.</p>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block font-display text-[22px] leading-none tabular-nums text-foreground">{children}</span>
      <span className="mt-1 block font-mono text-[9px] uppercase tracking-eyebrow text-dim">{label}</span>
    </div>
  );
}
