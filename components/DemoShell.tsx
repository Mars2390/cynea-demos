'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { Step } from '@/lib/types';
import { Stepper } from './Stepper';
import { MeshBackground } from './MeshBackground';
import { TopProgressBar } from './TopProgressBar';
import { CHROME_TOP } from '@/lib/scroll';
import { VoiceToggle } from './VoiceToggle';
import { LookSwitch } from './LookSwitch';

/**
 * Chrome shared by every agent demo:
 *   0. ambient mesh + thin top progress bar
 *   1. "Demo mode" strip
 *   2. app header (agent name, Guide + Auto-play toggles)
 *   3. step bar (eyebrow + title) and the segmented stepper
 */
export function DemoShell({
  agent,
  tagline,
  steps,
  activeIndex,
  stepId,
  progress,
  onSelectStep,
  guideOn,
  onToggleGuide,
  autoplayOn,
  onToggleAutoplay,
  onSkip,
  children,
}: {
  agent: string;
  tagline: string;
  steps: Step[];
  activeIndex: number;
  stepId: string;
  /** 0–1 across the whole flow, for the top bar. */
  progress: number;
  onSelectStep: (id: string) => void;
  guideOn: boolean;
  onToggleGuide: () => void;
  /**
   * Legacy. The live suites are human-paced — a step settles and waits for
   * the viewer — so they no longer pass these. Only app/diligence still does.
   */
  autoplayOn?: boolean;
  onToggleAutoplay?: () => void;
  onSkip: () => void;
  children: ReactNode;
}) {
  const step = steps[activeIndex];

  return (
    <div className="demo-stage relative min-h-screen">
      <MeshBackground stepId={stepId} />
      <TopProgressBar progress={progress} />

      {/* 1 — demo mode strip */}
      <div
        data-chrome={CHROME_TOP}
        className="sticky top-0 z-40 border-b border-accent/20 bg-background/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 sm:px-5">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-eyebrow text-accent">
            <span
              aria-hidden
              className="demo-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
            Demo mode
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-eyebrow text-muted md:block">
            Cynea AI · guided demo
          </span>
          <button
            type="button"
            onClick={onSkip}
            className="demo-tap shrink-0 font-mono text-[10px] uppercase tracking-eyebrow text-muted transition-colors hover:text-accent"
          >
            Skip to results →
          </button>
        </div>
      </div>

      {/* 2 — app header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2.5 px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-baseline gap-2.5">
            <Link
              href="/"
              className="font-display text-[18px] font-semibold tracking-[-0.4px] text-foreground transition-colors hover:text-accent sm:text-[19px]"
            >
              Cynea
            </Link>
            <span aria-hidden className="text-border-hi">
              /
            </span>
            <span className="font-display text-[18px] font-semibold tracking-[-0.4px] text-accent sm:text-[19px]">
              {agent}
            </span>
            <span className="hidden truncate text-[12px] text-muted lg:block">
              {tagline}
            </span>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Toggle label="Guide" on={guideOn} onClick={onToggleGuide} />
            <VoiceToggle />
            <LookSwitch />
            {onToggleAutoplay && (
              <Toggle
                label="Auto-play"
                on={Boolean(autoplayOn)}
                onClick={onToggleAutoplay}
              />
            )}
          </div>
        </div>
      </header>

      {/* 3 — step bar + stepper */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-5 sm:pt-7">
        <Stepper
          steps={steps}
          activeIndex={activeIndex}
          onSelect={onSelectStep}
        />

        <div key={step.id} className="demo-step-in demo-scrim mt-6 sm:mt-7">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
            Step {step.number} of {steps.length} · {step.name}
          </span>
          <h1 className="mt-2.5 max-w-3xl font-display text-[27px] font-semibold leading-[1.1] tracking-display text-foreground xs:text-[32px] sm:text-[40px] lg:text-[46px]">
            {step.title}
          </h1>
          {step.role && (
            <span className="mt-2.5 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              {step.role}
            </span>
          )}
        </div>
      </div>

      {/* With the guide on, the trailing space is load-bearing rather than
          cosmetic: guided scrolling has to be able to lift a target near the
          end of the document clear of the fixed bubble, which needs roughly one
          bubble-height of scroll range beyond the last element. With the guide
          off there is no bubble and no guided scrolling, so the same space
          would just be an empty gap — a third of a phone viewport. */}
      <main
        className={`mx-auto max-w-6xl px-4 pt-7 sm:px-5 sm:pt-8 ${
          guideOn ? 'pb-[200px]' : 'pb-20'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

function Toggle({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`demo-tap inline-flex h-7 items-center gap-2 rounded-btn border px-2.5 transition-all duration-200 ease-demo ${
        on
          ? 'border-accent/45 bg-accent/10 text-accent'
          : 'border-border-hi bg-card/70 text-muted hover:border-border-hi hover:text-foreground'
      }`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200 ${
          on ? 'bg-accent shadow-glow-accent' : 'bg-dim'
        }`}
      />
      <span className="font-mono text-[10px] uppercase tracking-eyebrow">
        {label}
      </span>
    </button>
  );
}
