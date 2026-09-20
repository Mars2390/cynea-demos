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
  briefEntities,
  briefLinks,
  briefMeta,
  briefQuestions,
  briefStructure,
  targetKeyword,
} from '@/demos/seo/fixtures';

/** The brief assembles in this order, one section per tick. */
const SECTIONS = ['Search intent', 'Structure', 'Entities to cover', 'Questions to answer', 'Internal links', 'Length'] as const;

/**
 * STEP 2 — BRIEF · Content Brief Agent
 *
 * One keyword goes in; the brief builds section by section — intent, then the
 * heading structure (each heading 40 ms after the last), entities, the
 * questions people actually ask, the internal links to place, and the length
 * benchmarked against what already ranks. The writer opens this, not a blank
 * page.
 */
export function StepBrief() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  const total = SECTIONS.length;
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
    }, Math.round(timing.scanLogLineMs * 1.1));
    return () => clearInterval(id);
  }, [reduced, total]);

  const built = Math.min(total, ticks);
  const ready = built === total;
  const on = (i: number) => i < built;

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* The target. */}
        <Card guide="target-keyword" glass glow delay={60}>
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Target keyword · {targetKeyword.cluster} cluster
              </span>
              <span className="mt-1.5 block font-display text-[26px] leading-tight text-foreground sm:text-[30px]">
                “{targetKeyword.keyword}”
              </span>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <Pill tone="secondary">{targetKeyword.intent}</Pill>
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-dim">
                <span className="tabular-nums text-muted">{targetKeyword.volume.toLocaleString('en-GB')}</span> / mo ·
                difficulty <span className="tabular-nums text-muted">{targetKeyword.difficulty}</span>
              </span>
            </div>
          </div>
        </Card>

        {/* The brief, building. */}
        <Card guide="brief-body" delay={180}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              Editorial brief
            </span>
            <span className="font-mono text-[11px] tabular-nums text-accent">
              {built}/{total} sections
            </span>
          </div>

          <ol className="space-y-2.5">
            {/* 1 — intent */}
            <Section title={SECTIONS[0]} on={on(0)} active={built === 0}>
              <p className="text-[13px] text-foreground">
                {targetKeyword.intent} — the searcher is comparing before buying. Lead with a
                verdict, then justify it.
              </p>
            </Section>

            {/* 2 — structure */}
            <Section title={SECTIONS[1]} on={on(1)} active={built === 1}>
              <ol className="space-y-1">
                {briefStructure.map((h, i) => (
                  <li
                    key={h.text}
                    className={`${on(1) ? 'demo-rise' : 'invisible'} flex items-baseline gap-2.5 text-[12.5px]`}
                    style={{ animationDelay: `${i * 40}ms`, paddingLeft: h.level === 'H3' ? 28 : h.level === 'H2' ? 12 : 0 }}
                  >
                    <span className={`shrink-0 font-mono text-[9.5px] uppercase tracking-eyebrow ${h.level === 'H1' ? 'text-accent' : 'text-dim'}`}>
                      {h.level}
                    </span>
                    <span className={h.level === 'H1' ? 'font-display text-[14px] text-foreground' : 'text-foreground'}>
                      {h.text}
                    </span>
                  </li>
                ))}
              </ol>
            </Section>

            {/* 3 — entities */}
            <Section title={SECTIONS[2]} on={on(2)} active={built === 2}>
              <div className="flex flex-wrap gap-1.5">
                {briefEntities.map((e, i) => (
                  <span key={e} className={on(2) ? 'demo-pop block' : 'invisible'} style={{ animationDelay: `${i * 40}ms` }}>
                    <Pill tone="secondary">{e}</Pill>
                  </span>
                ))}
              </div>
            </Section>

            {/* 4 — questions */}
            <Section title={SECTIONS[3]} on={on(3)} active={built === 3} note="from People Also Ask">
              <ol className="space-y-1">
                {briefQuestions.map((q, i) => (
                  <li
                    key={q}
                    className={`${on(3) ? 'demo-rise' : 'invisible'} flex items-baseline gap-2 text-[12.5px] text-foreground`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <span className="font-mono text-[10px] text-dim">{String(i + 1).padStart(2, '0')}</span>
                    {q}
                  </li>
                ))}
              </ol>
            </Section>

            {/* 5 — internal links */}
            <Section title={SECTIONS[4]} on={on(4)} active={built === 4}>
              <ol className="space-y-1">
                {briefLinks.map((l, i) => (
                  <li
                    key={l.to}
                    className={`${on(4) ? 'demo-rise' : 'invisible'} flex flex-wrap items-baseline justify-between gap-x-3 text-[12.5px]`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <span className="text-foreground">“{l.anchor}”</span>
                    <span className="font-mono text-[10.5px] text-dim">{l.to}</span>
                  </li>
                ))}
              </ol>
            </Section>

            {/* 6 — length */}
            <Section title={SECTIONS[5]} on={on(5)} active={built === 5}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[13px] text-foreground">
                  Target{' '}
                  <span className="font-mono tabular-nums">
                    <Counter to={on(5) ? briefMeta.wordTarget : 0} run={loaded} group />
                  </span>{' '}
                  words
                </span>
                <span className="text-[12px] text-muted">{briefMeta.benchmark}</span>
              </div>
            </Section>
          </ol>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Card guide="brief-ready" delay={280} glow={ready}>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={(built / total) * 100}
              run={loaded}
              size={82}
              tone="success"
              label={String(ready ? briefMeta.sections : Math.round((built / total) * briefMeta.sections))}
              sublabel="sections"
              live
            />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
                Status
              </span>
              <div className="mt-2">
                <span className={ready ? 'demo-pop block' : 'hidden'}>
                  <Pill tone="success" dot>
                    {briefMeta.status}
                  </Pill>
                </span>
                {!ready && (
                  <Pill tone="accent" dot>
                    Drafting
                  </Pill>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <CardRow label="Sections" value={<Counter to={ready ? briefMeta.sections : 0} run={loaded} />} mono />
            <CardRow label="FAQs" value={<Counter to={on(3) ? briefMeta.faqs : 0} run={loaded} />} mono />
            <CardRow label="Internal links" value={<Counter to={on(4) ? briefMeta.links : 0} run={loaded} />} mono />
            <CardRow label="Word target" value={`${briefMeta.wordTarget.toLocaleString('en-GB')}`} mono accent />
          </div>
          <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
            <Button disabled={!ready}>Export brief</Button>
            <p className="text-[12px] leading-relaxed text-dim">
              Visual only in this demo. No document is produced.
            </p>
          </div>
        </Card>

        <Card delay={360}>
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Aimed, not blank
          </span>
          <p className="text-[13px] leading-relaxed text-muted">
            Every heading, entity and question comes from what already ranks for
            this query. The writer’s judgement goes into the writing, not into
            guessing what the page needs to contain.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ======================================================================== */

function Section({
  title,
  on,
  active,
  note,
  children,
}: {
  title: string;
  on: boolean;
  active: boolean;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <li
      className={`seo-hover rounded-[12px] border px-3.5 py-3 transition-colors duration-500 ${
        on ? 'border-border bg-card' : active ? 'border-accent/30 bg-accent/[0.03]' : 'border-border/60 bg-card/40 opacity-50'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[9.5px] uppercase tracking-eyebrow text-muted">
          {title}
          {note && <span className="text-dim"> · {note}</span>}
        </span>
        {on ? (
          <span className="demo-pop block">
            <Check size={3} />
          </span>
        ) : active ? (
          <span className="demo-scan-bar block h-[2px] w-12 rounded-full bg-border" />
        ) : (
          <Pending />
        )}
      </div>
      <div className={on ? '' : 'invisible'}>{children}</div>
    </li>
  );
}
