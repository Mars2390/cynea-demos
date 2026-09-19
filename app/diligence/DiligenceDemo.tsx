'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { DemoShell } from '@/components/DemoShell';
import { GuideBubble } from '@/components/GuideBubble';
import { StepFooter } from '@/components/StepFooter';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { timing } from '@/lib/timing';
import { agent, readyStep, steps } from '@/demos/diligence/config';
import { guide } from '@/demos/diligence/guide';
import {
  StepAssess,
  StepCollect,
  StepConsignment,
  StepStatement,
} from './steps';

const READY = readyStep.id;
const BASE = '/diligence';

const isValidStep = (id: string) =>
  id === READY || steps.some((s) => s.id === id);

/** Derives the step id from a pathname like /diligence/assess. */
function stepFromPathname(pathname: string): string {
  const segment = pathname.replace(/\/+$/, '').split('/').pop() ?? '';
  return isValidStep(segment) ? segment : steps[0].id;
}

/**
 * The step lives in the URL path, and the server already rendered the correct
 * step via `initialStep` — so there is no switch-on-hydration.
 *
 * In-demo navigation uses history.pushState rather than the Next router so
 * this component never unmounts. That keeps the Guide / Auto-play toggles and
 * autoplay timer alive across steps, while each URL still resolves to its own
 * statically prerendered page on a fresh load or refresh.
 */
export function DiligenceDemo({ initialStep }: { initialStep: string }) {
  const [stepId, setStepId] = useState(initialStep);
  const [guideOn, setGuideOn] = useState(true);
  const [autoplayOn, setAutoplayOn] = useState(false);
  const [firedEvents, setFiredEvents] = useState<string[]>([
    `step:${initialStep}`,
  ]);

  // Follow browser back/forward.
  useEffect(() => {
    const onPop = () => setStepId(stepFromPathname(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  /**
   * Back-compat for the old query-string model: /diligence?step=assess →
   * /diligence/assess. Only applies on the bare /diligence path, so an
   * explicit path segment always wins. replaceState, not pushState, so Back
   * does not bounce the visitor between the two URL forms.
   *
   * This runs on the client by necessity — reading searchParams on the server
   * would opt the route out of static prerendering.
   */
  useEffect(() => {
    if (window.location.pathname.replace(/\/+$/, '') !== BASE) return;
    const legacy = new URLSearchParams(window.location.search).get('step');
    if (!legacy || !isValidStep(legacy)) return;
    window.history.replaceState({}, '', `${BASE}/${legacy}`);
    setStepId(legacy);
  }, []);

  const goto = useCallback((id: string) => {
    setStepId(id);
    window.history.pushState({}, '', `${BASE}/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Emit a step:<id> event whenever the step changes, for event-gated cues.
  useEffect(() => {
    setFiredEvents((prev) =>
      prev.includes(`step:${stepId}`) ? prev : [...prev, `step:${stepId}`],
    );
  }, [stepId]);

  const activeIndex = useMemo(
    () => Math.max(steps.findIndex((s) => s.id === stepId), 0),
    [stepId],
  );
  const step = steps[activeIndex];
  const isReady = stepId === READY;

  const next = useCallback(() => {
    const i = steps.findIndex((s) => s.id === stepId);
    if (i === -1) return;
    goto(i === steps.length - 1 ? READY : steps[i + 1].id);
  }, [stepId, goto]);

  // Autoplay advances one step per dwell until the ready screen.
  useEffect(() => {
    if (!autoplayOn || isReady) return;
    const t = setTimeout(next, timing.autoplayStepMs);
    return () => clearTimeout(t);
  }, [autoplayOn, isReady, next, stepId]);

  const replay = useCallback(() => {
    setFiredEvents([]);
    goto(steps[0].id);
  }, [goto]);

  if (isReady) {
    return (
      <>
        <ParticleBackground />
        <ReadyScreen onReplay={replay} />
      </>
    );
  }

  return (
    <>
      <ParticleBackground />

      <DemoShell
        agent={agent.name}
        tagline={agent.role}
        steps={steps}
        activeIndex={activeIndex}
        onSelectStep={goto}
        guideOn={guideOn}
        onToggleGuide={() => setGuideOn((v) => !v)}
        autoplayOn={autoplayOn}
        onToggleAutoplay={() => setAutoplayOn((v) => !v)}
        onSkip={() => goto(READY)}
      >
        <div key={stepId} className="demo-step-in">
          {stepId === 'consignment' && <StepConsignment />}
          {stepId === 'collect' && <StepCollect />}
          {stepId === 'assess' && <StepAssess />}
          {stepId === 'statement' && <StepStatement />}
        </div>

        <StepFooter
          why={step.why}
          next={step.next}
          onNext={next}
          stepId={stepId}
        />
      </DemoShell>

      <GuideBubble
        cues={guide[stepId] ?? []}
        stepId={stepId}
        enabled={guideOn}
        firedEvents={firedEvents}
      />
    </>
  );
}

/* ======================================================================== */

function ReadyScreen({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="demo-stage relative flex min-h-screen flex-col items-center justify-center px-5 py-24 text-center">
      <div className="demo-rise relative">
        <span aria-hidden className="relative mx-auto mb-8 flex h-14 w-14 items-center justify-center">
          <span className="demo-orb-ring absolute h-14 w-14 rounded-full bg-accent/25" />
          <span className="demo-orb flex h-10 w-10 items-center justify-center rounded-full border border-accent/50 bg-accent/15 shadow-glow-accent">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
        </span>

        <Pill tone="accent" className="mb-6">
          Demo complete
        </Pill>

        <h1 className="mx-auto max-w-2xl font-display text-[36px] font-semibold leading-[1.06] tracking-display text-foreground sm:text-[48px] lg:text-display">
          {readyStep.heading}
        </h1>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href={readyStep.bookHref}>{readyStep.bookLabel}</Button>
          <Button variant="ghost" onClick={onReplay}>
            {readyStep.replayLabel}
          </Button>
        </div>

        <p className="mx-auto mt-10 max-w-lg border-t border-border pt-6 text-[12px] leading-relaxed text-dim">
          {readyStep.disclaimer}
        </p>

        <Link
          href="/"
          className="mt-8 inline-block font-mono text-[10px] uppercase tracking-eyebrow text-muted transition-colors hover:text-accent"
        >
          ← All Cynea demos
        </Link>
      </div>
    </div>
  );
}
