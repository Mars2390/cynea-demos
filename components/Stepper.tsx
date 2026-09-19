'use client';

import type { Step } from '@/lib/types';

/**
 * Segmented stepper. Segment count is driven by the demo config, so a future
 * demo with six steps needs no change here.
 *
 * The active segment fills from the left rather than switching colour wholesale,
 * which reads as progress through the step rather than a binary on/off.
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
      className="flex items-center gap-1.5 sm:gap-2"
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
            className="demo-tap group flex flex-1 flex-col gap-1.5 text-left"
          >
            <span className="relative h-[3px] w-full overflow-hidden rounded-full bg-border-hi">
              <span
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-demo ${
                  active
                    ? 'w-full bg-accent shadow-glow-accent'
                    : done
                      ? 'w-full bg-accent/45'
                      : 'w-0 bg-muted/50 group-hover:w-full'
                }`}
              />
            </span>
            <span
              className={`hidden font-mono text-[9px] uppercase tracking-eyebrow transition-colors duration-300 xs:block ${
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
