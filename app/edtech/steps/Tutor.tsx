'use client';

import { useEffect, useState } from 'react';
import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Counter } from '@/components/ui/Counter';
import { useLoaded, useReducedMotion } from '@/lib/hooks';
import { timing } from '@/lib/timing';
import { escalation, school, tutorScope, tutorThread, tutorTotals } from '@/demos/edtech/fixtures';

/**
 * STEP 5 — TUTOR · Study Support Agent
 *
 * A learner asks; the answer builds a sentence at a time from the lesson
 * they actually had, cites it, and offers a worked example. A second
 * question falls outside the course — Tutor says so and hands it to the
 * teacher rather than guessing. The bounds sit beside the thread the whole
 * time.
 */
export function StepTutor() {
  const loaded = useLoaded(true);
  const reduced = useReducedMotion();
  // question · three sentences · source and offer · second question · escalation
  const total = 1 + tutorThread.answer.length + 1 + 1 + 1;
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

  const asked = ticks >= 1;
  const sentences = Math.max(0, Math.min(tutorThread.answer.length, ticks - 1));
  const answered = ticks >= 1 + tutorThread.answer.length + 1;
  const askedAgain = ticks >= total - 1;
  const done = ticks >= total;

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
      {/* The thread. */}
      <Card glass glow delay={60}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Study support · {tutorThread.learner} · {tutorScope.course}
          </span>
          <Pill tone={done ? 'success' : answered ? 'warn' : 'accent'} dot>
            {done ? 'No open questions' : answered ? (askedAgain ? 'Escalating' : 'Answered') : asked ? 'Answering' : 'Listening'}
          </Pill>
        </div>

        <div className="space-y-3">
          {/* The learner asks. */}
          <div data-guide="question" className={`${asked ? 'demo-rise' : 'invisible'} max-w-[88%] rounded-[14px] rounded-tl-[4px] border border-border bg-card/70 px-4 py-3`}>
            <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-dim">{tutorThread.learner}</span>
            <p className="mt-1 text-[13.5px] leading-relaxed text-foreground">{tutorThread.question}</p>
          </div>

          {/* Tutor answers, within bounds. */}
          <div data-guide="answer" className={`${sentences > 0 ? 'demo-rise' : 'invisible'} ml-auto max-w-[92%] rounded-[14px] rounded-tr-[4px] border border-accent/25 bg-accent/[0.05] px-4 py-3`}>
            <span className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-eyebrow text-accent">
              Tutor
              <span className="text-dim">within course</span>
            </span>
            <div className="mt-1 space-y-1.5">
              {tutorThread.answer.map((line, i) => (
                <p
                  key={i}
                  className={`${i < sentences ? 'demo-rise' : 'invisible'} text-[13.5px] leading-relaxed text-foreground`}
                  style={{ animationDelay: `${(i % 3) * 40}ms` }}
                >
                  {line}
                </p>
              ))}
            </div>
            <div className={`mt-3 border-t border-accent/15 pt-2.5 transition-opacity duration-500 ${answered ? 'opacity-100' : 'opacity-0'}`}>
              <span className="block font-mono text-[9.5px] uppercase tracking-eyebrow text-dim">Source</span>
              <span className="mt-0.5 block text-[12px] text-muted">{tutorThread.source}</span>
              <div className="mt-2.5 rounded-[10px] border border-border bg-card/70 px-3 py-2">
                <span className="block text-[12.5px] text-foreground">{tutorThread.offer}</span>
                <span className="mt-1 block text-[12px] italic leading-relaxed text-muted">{tutorThread.example}</span>
              </div>
            </div>
          </div>

          {/* The learner asks again — outside the course. */}
          <div className={`${askedAgain ? 'demo-rise' : 'invisible'} max-w-[88%] rounded-[14px] rounded-tl-[4px] border border-border bg-card/70 px-4 py-3`}>
            <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-dim">{escalation.learner}</span>
            <p className="mt-1 text-[13.5px] leading-relaxed text-foreground">{escalation.question}</p>
          </div>

          {/* Tutor escalates. */}
          <div data-guide="escalation" className={`${done ? 'demo-rise' : 'invisible'} ml-auto max-w-[92%] rounded-[14px] rounded-tr-[4px] border border-warning/30 bg-warning/[0.04] px-4 py-3`}>
            <span className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-eyebrow text-warning">
              Tutor
              <span>outside course · escalated</span>
            </span>
            <p className="mt-1 text-[13.5px] leading-relaxed text-foreground">{escalation.response}</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{escalation.note}</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-5">
        {/* The bounds. */}
        <Card delay={220}>
          <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Bounds · what Tutor may draw on
          </span>
          <span className="mt-1.5 block font-display text-[20px] leading-tight text-foreground">{tutorScope.course}</span>
          <div className="mt-3">
            <CardRow label="Material" value={tutorScope.lessons} />
            <CardRow label="Escalates to" value={tutorScope.teacher} />
            <CardRow label="Outside course" value="Never answered" />
          </div>
        </Card>

        {/* The tally. */}
        <Card delay={300} glow={done}>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Answered">
              <Counter to={answered ? 1 : 0} run={loaded} />
            </Stat>
            <Stat label="Escalated">
              <Counter to={done ? 1 : 0} run={loaded} />
            </Stat>
            <Stat label="Open">0</Stat>
          </div>
          {/* Final status always in the DOM, laid out from the start. */}
          <div className="mt-4 border-t border-border pt-3.5">
            <span className={done ? 'demo-pop block' : 'invisible block'}>
              <Pill tone="success" dot>
                {tutorTotals.status}
              </Pill>
            </span>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-dim">
            {school.teacher} sees every escalation with the question and the lesson context attached.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <span className="block font-display text-[24px] leading-none tabular-nums text-foreground">{children}</span>
      <span className="mt-1 block font-mono text-[9px] uppercase tracking-eyebrow text-dim">{label}</span>
    </div>
  );
}
