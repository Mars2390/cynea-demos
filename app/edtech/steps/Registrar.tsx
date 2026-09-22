'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import { categories, message, queue, registrarTotals, school } from '@/demos/edtech/fixtures';

/**
 * STEP 6 — REGISTRAR · School Communications Agent
 *
 * The queue fills, category by category — including the twelve follow-ups
 * Signal asked for. Then one message, shown in full, with a toggle between
 * the bare template and the same message in the school's own voice, so the
 * difference is read, not claimed. Nothing goes until the teacher approves.
 */
export function StepRegistrar() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = categories.length + 2; // categories land, the message drafts, the schedule sets
  const [ticks, setTicks] = useState(0);
  const [mode, setMode] = useState<'template' | 'voice'>('template');

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

  const landed = Math.min(categories.length, ticks);
  const drafted = ticks > categories.length;
  const done = ticks >= total;
  const queued = done ? queue.items : Math.round((landed / categories.length) * queue.items);

  // Once the message has drafted, flip it into the school's voice on its own.
  useEffect(() => {
    if (!drafted) return;
    const t = setTimeout(() => setMode('voice'), reduced ? 0 : 900);
    return () => clearTimeout(t);
  }, [drafted, reduced]);

  const lines = mode === 'voice' ? message.voice : message.template;

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* The queue. */}
        <Card guide="queue" glass glow delay={60}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={(queued / queue.items) * 100}
              run={loaded}
              size={82}
              tone="success"
              label={String(queued)}
              sublabel="queued"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Communication queue
              </span>
              <span className="mt-1 block font-display text-[20px] leading-tight text-foreground">
                {queue.items} notifications · one per parent
              </span>
              <div className="mt-2">
                <Pill tone={done ? 'success' : 'accent'} dot>
                  {done ? 'Schedule set' : drafted ? 'Drafting' : 'Queueing'}
                </Pill>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3.5">
            <Stat label="Categories">
              <Counter to={landed} run={loaded} />
            </Stat>
            <Stat label="Parents">
              <Counter to={done ? school.parents : 0} run={loaded} />
            </Stat>
          </div>
          <p className="mt-3 border-t border-border pt-3 font-mono text-[10px] uppercase tracking-eyebrow text-dim">
            {queue.window}
          </p>
        </Card>

        {/* By category. */}
        <Card guide="categories" delay={200}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Categories · {categories.length}
            </span>
            <span className="font-mono text-[11px] tabular-nums text-accent">{landed}/{categories.length}</span>
          </div>
          <ol className={`space-y-2 ${done ? 'edtech-pulse' : ''}`}>
            {categories.map((c, i) => {
              const on = i < landed;
              return (
                <li
                  key={c.name}
                  className={`edtech-hover rounded-[12px] border px-3.5 py-2.5 transition-colors duration-500 ${
                    on ? 'border-border bg-card' : 'border-border/50 bg-card/40 opacity-45'
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] text-foreground">{c.name}</span>
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">
                      <Counter to={on ? c.recipients : 0} run={loaded} /> recipients
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-muted">{c.detail}</span>
                  <span className="mt-2 block h-[3px] overflow-hidden rounded-full bg-border">
                    <span
                      className={`block h-full rounded-full transition-[width] duration-700 ease-demo ${c.name.startsWith('Individual') ? 'bg-warning' : 'bg-accent'}`}
                      style={{ width: on ? `${(c.recipients / school.learners) * 100}%` : '0%' }}
                    />
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>

      {/* One message, in full. */}
      <Card guide="message" delay={300} glow={done}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="min-w-0 font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            One message · <span className="normal-case tracking-normal text-foreground">{message.subject}</span>
          </span>
          <div role="radiogroup" aria-label="Message version" className="inline-flex rounded-btn border border-border bg-card/70 p-0.5">
            {(['template', 'voice'] as const).map((m) => (
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
                {m === 'template' ? 'Template' : `${school.name.split(' ')[0]}'s voice`}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`rounded-[12px] border p-4 transition-all duration-300 ${
            mode === 'voice' ? 'border-success/40 bg-success/[0.04]' : 'border-border bg-card/60'
          } ${drafted ? 'opacity-100' : 'opacity-45'}`}
        >
          <span className="block font-mono text-[9.5px] uppercase tracking-eyebrow text-dim">To · {message.to}</span>
          <span className={`mt-1 block font-mono text-[9.5px] uppercase tracking-eyebrow ${mode === 'voice' ? 'text-success' : 'text-muted'}`}>
            {mode === 'voice' ? 'In the institution’s voice' : 'Bare template · before'}
          </span>
          <div key={mode} className="mt-3 space-y-2.5">
            {lines.map((line, i) => (
              <p
                key={i}
                className={`${drafted ? 'demo-rise' : ''} whitespace-pre-line text-[13.5px] leading-relaxed ${mode === 'voice' ? 'text-foreground' : 'text-muted'}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {line}
              </p>
            ))}
          </div>
          <span className={`mt-3 block border-t border-border/60 pt-2.5 font-mono text-[9.5px] uppercase tracking-eyebrow transition-opacity duration-300 ${mode === 'voice' ? 'text-success opacity-100' : 'opacity-0'}`}>
            {message.signoff}
          </span>
        </div>

        {/* Final status always in the DOM, laid out from the start. */}
        <div className="mt-4 border-t border-border pt-3.5">
          <span className={done ? 'demo-pop block' : 'invisible block'}>
            <Pill tone="success" dot>
              {registrarTotals.status}
            </Pill>
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <Button disabled={!done}>Approve and send</Button>
          <p className="text-[12px] leading-relaxed text-dim">Visual only in this demo. Nothing is sent.</p>
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
