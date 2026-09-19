'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { Step } from '@/lib/types';
import { Stepper } from './Stepper';
import { Button } from './ui/Button';

/**
 * Chrome shared by every agent demo:
 *   1. "Demo mode" strip
 *   2. app header (agent name, Guide + Auto-play toggles)
 *   3. step bar (eyebrow + title) and the segmented stepper
 */
export function DemoShell({
  agent,
  tagline,
  steps,
  activeIndex,
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
  onSelectStep: (id: string) => void;
  guideOn: boolean;
  onToggleGuide: () => void;
  autoplayOn: boolean;
  onToggleAutoplay: () => void;
  onSkip: () => void;
  children: ReactNode;
}) {
  const step = steps[activeIndex];

  return (
    <div className="demo-stage relative min-h-screen">
      {/* 1 — demo mode strip */}
      <div className="sticky top-0 z-40 border-b border-accent/20 bg-accent/[0.07] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-1.5">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-eyebrow text-accent">
            <span aria-hidden className="demo-pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
            Demo mode
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-eyebrow text-muted sm:block">
            Cynea AI · guided demo
          </span>
          <button
            type="button"
            onClick={onSkip}
            className="font-mono text-[10px] uppercase tracking-eyebrow text-muted transition-colors hover:text-accent"
          >
            Skip to results →
          </button>
        </div>
      </div>

      {/* 2 — app header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="font-display text-[19px] font-semibold tracking-[-0.4px] text-foreground transition-colors hover:text-accent"
            >
              Cynea
            </Link>
            <span aria-hidden className="text-border-hi">
              /
            </span>
            <span className="font-display text-[19px] font-semibold tracking-[-0.4px] text-accent">
              {agent}
            </span>
            <span className="hidden text-[12px] text-muted md:block">{tagline}</span>
          </div>

          <div className="flex items-center gap-2">
            <Toggle label="Guide" on={guideOn} onClick={onToggleGuide} />
            <Toggle label="Auto-play" on={autoplayOn} onClick={onToggleAutoplay} />
          </div>
        </div>
      </header>

      {/* 3 — step bar + stepper */}
      <div className="mx-auto max-w-6xl px-5 pt-7">
        <Stepper steps={steps} activeIndex={activeIndex} onSelect={onSelectStep} />

        <div key={step.id} className="demo-step-in mt-7">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
            Step {step.number} of {steps.length} · {step.name}
          </span>
          <h1 className="mt-2.5 max-w-3xl font-display text-[32px] font-semibold leading-[1.08] tracking-display text-foreground sm:text-[40px] lg:text-[46px]">
            {step.title}
          </h1>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 pb-32 pt-8">{children}</main>
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
    <Button variant="ghost" small onClick={onClick} className="!gap-2">
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
          on ? 'bg-accent shadow-glow-accent' : 'bg-dim'
        }`}
      />
      <span className="font-mono text-[10px] uppercase tracking-eyebrow">
        {label}
      </span>
    </Button>
  );
}
