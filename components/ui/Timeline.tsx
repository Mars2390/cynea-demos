'use client';

import { Check } from './Check';

export interface TimelineEvent {
  agent: string;
  event: string;
  at: string;
  reference: string;
  source: string;
}

/**
 * Vertical trail of logged events.
 *
 * Each entry carries the reference an auditor would actually follow and the
 * data the decision came from — a timeline without those is a changelog, not
 * evidence. The connecting rail is decorative and hidden from assistive tech;
 * the list itself is an ordered list so the sequence survives without it.
 */
export function Timeline({
  events,
  guide,
}: {
  events: readonly TimelineEvent[];
  guide?: string;
}) {
  return (
    <ol data-guide={guide} className="relative">
      {events.map((e, i) => {
        const last = i === events.length - 1;
        return (
          <li
            key={e.reference}
            style={{ animationDelay: `${140 + i * 120}ms` }}
            className="demo-rise relative flex gap-3.5 pb-5 last:pb-0 sm:gap-4"
          >
            {/* Rail + node */}
            <span className="relative flex w-4 shrink-0 justify-center">
              {!last && (
                <span
                  aria-hidden
                  className="absolute top-5 h-full w-px bg-border"
                />
              )}
              <span className="relative z-10 mt-0.5">
                <Check size={4} />
              </span>
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
                  {e.agent}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-eyebrow text-dim">
                  {e.at}
                </span>
              </span>

              <span className="mt-1 block text-[13.5px] leading-snug text-foreground">
                {e.event}
              </span>

              <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-[11px] text-accent-secondary">
                  {e.reference}
                </span>
                <span className="text-[12px] text-muted">{e.source}</span>
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
