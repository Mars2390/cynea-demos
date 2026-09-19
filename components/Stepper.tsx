'use client';

import type { Step } from '@/lib/types';

/**
 * Segmented stepper, as in the leads demo's "Profile · Scout · Reach" bar.
 * Segment count is driven by the demo config, so the Diligence demo renders
 * four and a future demo can render six without touching this file.
 */
export function Stepper({
  steps,
  activeIndex,
  onSelect,
}: {
  steps: Step[];
  activeIndex: number;
  onSelect?: (id: string) => void;
}) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="tablist"
      aria-label="Demo progress"
      data-guide="stepper"
    >
      {steps.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;

        return (
          <button
            key={step.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Step ${step.number}: ${step.name}`}
            onClick={() => onSelect?.(step.id)}
            className="group flex flex-1 flex-col gap-1.5 text-left focus-visible:outline-none"
          >
            <span
              className={`h-[3px] w-full rounded-full transition-all duration-500 ease-demo ${
                active
                  ? 'bg-accent shadow-glow-accent'
                  : done
                    ? 'bg-accent/45'
                    : 'bg-border-hi group-hover:bg-[#3a3a3a]'
              }`}
            />
            <span
              className={`hidden font-mono text-[9px] uppercase tracking-eyebrow transition-colors duration-300 sm:block ${
                active
                  ? 'text-accent'
                  : done
                    ? 'text-muted'
                    : 'text-dim group-hover:text-muted'
              }`}
            >
              {step.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
