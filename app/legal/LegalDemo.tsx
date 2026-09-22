'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { DemoShell } from '@/components/DemoShell';
import { GuideBubble } from '@/components/GuideBubble';
import { StepFooter } from '@/components/StepFooter';
import { MeshBackground } from '@/components/MeshBackground';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { LookSwitch } from '@/components/LookSwitch';
import { useIntroSettled, useKeyboard, useReducedMotion } from '@/lib/hooks';
import { tweenScrollTo } from '@/lib/scroll';
import { cancel as cancelSpeech, prime as primeVoice, speak } from '@/lib/voice';
import { agent, descriptions, readyStep, steps } from '@/demos/legal/config';
import { guide } from '@/demos/legal/guide';
import {
  StepCounsel,
  StepDocket,
  StepIntake,
  StepPrecedent,
  StepRedact,
} from './steps';

const READY = readyStep.id;
const BASE = '/legal';

const isValidStep = (id: string) =>
  id === READY || steps.some((s) => s.id === id);

/** Derives the step id from a pathname like /legal/counsel. */
function stepFromPathname(pathname: string): string {
  const segment = pathname.replace(/\/+$/, '').split('/').pop() ?? '';
  return isValidStep(segment) ? segment : steps[0].id;
}

/**
 * The Legal suite: five agents told as one client matter.
 *
 * Same engine as Compliance and Finance. The root carries data-suite="legal",
 * which re-points every colour token to the "Bar" fork in globals.css — and,
 * under the glass look, to Bar's lifted neutrals. No component below knows
 * which suite it is in.
 *
 * No ?step= back-compat: /legal is a new route with no legacy links.
 */
export function LegalDemo({ initialStep }: { initialStep: string }) {
  const [stepId, setStepId] = useState(initialStep);
  const [guideOn, setGuideOn] = useState(true);
  const [firedEvents, setFiredEvents] = useState<string[]>([
    `step:${initialStep}`,
  ]);
  /** Bumped by Replay to force a full remount of the step subtree. */
  const [runId, setRunId] = useState(0);

  const advanceCueRef = useRef<(() => void) | null>(null);
  const reduced = useReducedMotion();

  // Follow browser back/forward.
  useEffect(() => {
    const onPop = () => setStepId(stepFromPathname(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goto = useCallback((id: string) => {
    setStepId(id);
    window.history.pushState({}, '', `${BASE}/${id}`);
  }, []);

  /**
   * Return to the top when the step changes.
   *
   * In an effect rather than inside `goto` because of effect ordering: React
   * runs child effects before parent effects, and GuideBubble cancels any
   * in-flight scroll on a step change. Starting it inside `goto` — which runs
   * during the event, before any effect — meant the bubble cancelled it.
   */
  const firstStepRender = useRef(true);
  useEffect(() => {
    if (firstStepRender.current) {
      firstStepRender.current = false;
      return;
    }
    tweenScrollTo(0, { reduced });
  }, [stepId, runId, reduced]);

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

  const prev = useCallback(() => {
    if (isReady) {
      goto(steps[steps.length - 1].id);
      return;
    }
    const i = steps.findIndex((s) => s.id === stepId);
    if (i > 0) goto(steps[i - 1].id);
  }, [stepId, isReady, goto]);

  /** Full reset: clears fired cues and remounts the step subtree. */
  const replay = useCallback(() => {
    setFiredEvents([`step:${steps[0].id}`]);
    setRunId((n) => n + 1);
    setGuideOn(true);
    goto(steps[0].id);
  }, [goto]);

  const settled = useIntroSettled(`${stepId}-${runId}`);

  // Human-paced: nothing advances on a timer. The step settles and waits for
  // the viewer — Next, an arrow key, the stepper or Skip.
  // Arrows move between steps; Space advances a guide cue; Esc opens replay.
  useKeyboard({
    ArrowRight: () => {
      if (!isReady) next();
    },
    ArrowLeft: prev,
    ' ': () => advanceCueRef.current?.(),
    Escape: () => {
      if (isReady) replay();
      else goto(READY);
    },
  });

  // The narrator's closer on the ready screen. The step cues are spoken by
  // GuideBubble; here there is no bubble, so the shell speaks. Cancelled on
  // Replay, on ← back to the last step, or when the page goes away.
  useEffect(() => {
    if (!isReady) return;
    primeVoice(); // listen for the gesture from the first frame
    const t = setTimeout(
      () =>
        speak(
          `That was the ${agent.name} suite. Ready to try this with your own business? Book a demo with Irene.`,
        ),
      700,
    );
    return () => {
      clearTimeout(t);
      cancelSpeech();
    };
  }, [isReady, runId]);

  /** 0–1 across the whole flow, including the ready screen. */
  const progress = isReady ? 1 : (activeIndex + 1) / (steps.length + 1);

  if (isReady) {
    return (
      <div data-suite="legal" className="isolate min-h-screen bg-background">
        <MeshBackground stepId="legal-ready" />
        <ParticleBackground />
        <LookSwitch corner />
        <ReadyScreen onReplay={replay} />
      </div>
    );
  }

  return (
    <div data-suite="legal" className="isolate min-h-screen bg-background">
      <ParticleBackground />

      <DemoShell
        agent={agent.name}
        tagline={agent.role}
        steps={steps}
        activeIndex={activeIndex}
        stepId={stepId}
        progress={progress}
        onSelectStep={goto}
        guideOn={guideOn}
        onToggleGuide={() => setGuideOn((v) => !v)}
        onSkip={() => goto(READY)}
      >
        {/* runId in the key makes Replay remount the step, so every counter,
            ring and skeleton starts from zero again. */}
        <div key={`${stepId}-${runId}`} className="demo-step-in">
          {/* The agent's own description, verbatim from the brief. */}
          <p className="demo-rise demo-scrim mb-5 max-w-3xl text-[13.5px] leading-relaxed text-muted sm:mb-6 sm:text-[14px]">
            {descriptions[stepId]}
          </p>
          {stepId === 'intake' && <StepIntake />}
          {stepId === 'precedent' && <StepPrecedent />}
          {stepId === 'counsel' && <StepCounsel />}
          {stepId === 'redact' && <StepRedact />}
          {stepId === 'docket' && <StepDocket />}
        </div>

        <StepFooter
          why={step.why}
          next={step.next}
          onNext={next}
          stepId={`${stepId}-${runId}`}
          attention={settled}
          guideOn={guideOn}
        />
      </DemoShell>

      <GuideBubble
        cues={guide[stepId] ?? []}
        stepId={`${stepId}-${runId}`}
        enabled={guideOn}
        firedEvents={firedEvents}
        onAdvanceRef={advanceCueRef}
      />
    </div>
  );
}

/* ======================================================================== */

function ReadyScreen({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="demo-stage relative flex min-h-screen flex-col items-center justify-center px-5 py-24 text-center">
      <div className="demo-rise demo-scrim relative">
        <span
          aria-hidden
          className="relative mx-auto mb-8 flex h-14 w-14 items-center justify-center"
        >
          <span className="demo-orb-ring absolute h-14 w-14 rounded-full bg-accent/25" />
          <span className="demo-orb flex h-10 w-10 items-center justify-center rounded-full border border-accent/50 bg-accent/15 shadow-glow-accent">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
        </span>

        <Pill tone="accent" className="mb-6">
          Demo complete
        </Pill>

        <h1 className="mx-auto max-w-3xl font-display text-[27px] font-semibold leading-[1.1] tracking-display text-foreground xs:text-[32px] sm:text-[40px] lg:text-[48px]">
          {readyStep.heading}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-[17px]">
          {readyStep.sub}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href={readyStep.bookHref} pulse>
            {readyStep.bookLabel}
          </Button>
          <Button variant="ghost" onClick={onReplay}>
            {readyStep.replayLabel}
          </Button>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {readyStep.trustPills.map((t) => (
            <Pill key={t} tone="muted">
              {t}
            </Pill>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl border-t border-border pt-6 text-[12px] leading-relaxed text-dim">
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
