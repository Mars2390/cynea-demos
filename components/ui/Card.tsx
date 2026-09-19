'use client';

import type { ReactNode } from 'react';
import { useSheen } from '@/lib/hooks';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Registers this card as a spotlight target via data-guide. */
  guide?: string;
  /** Ambient breathing glow behind the card. */
  glow?: boolean;
  /** Entry animation delay in ms. */
  delay?: number;
  /** Apply the rise-in entry animation. */
  rise?: boolean;
  /** Frosted panel treatment — for the hero card of a step. */
  glass?: boolean;
  /** Cursor-following inner sheen. On by default; it is what makes the cards
   *  feel lit from within. */
  sheen?: boolean;
}

export function Card({
  children,
  className = '',
  guide,
  glow = false,
  delay = 0,
  rise = true,
  glass = false,
  sheen = true,
}: CardProps) {
  const ref = useSheen<HTMLDivElement>();

  const surface = glass
    ? 'demo-glass'
    : 'border border-border bg-card hover:border-border-hi';

  return (
    <div className="relative">
      {glow && (
        <div
          aria-hidden
          className="demo-glow pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-accent/20 blur-3xl"
        />
      )}
      <div
        ref={ref}
        data-guide={guide}
        style={delay ? { animationDelay: `${delay}ms` } : undefined}
        className={`${rise ? 'demo-rise' : ''} ${sheen ? 'demo-sheen' : ''} ${surface} rounded-card p-5 transition-colors duration-300 ease-demo ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

/** A label/value row, as used in the consignment and statement panels. */
export function CardRow({
  label,
  value,
  accent = false,
  mono = false,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2.5 last:border-0 sm:gap-6">
      <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
        {label}
      </span>
      <span
        className={`min-w-0 break-words text-right text-[14px] ${mono ? 'font-mono' : 'font-sans'} ${
          accent ? 'text-accent' : 'text-foreground'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/** Section heading used inside the statement document preview. */
export function CardSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <span className="mb-1 block font-mono text-[9px] uppercase tracking-eyebrow text-accent">
        {title}
      </span>
      {children}
    </div>
  );
}
