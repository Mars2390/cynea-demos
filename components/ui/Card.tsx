import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Registers this card as a spotlight target via data-guide. */
  guide?: string;
  /** Adds the ambient breathing glow behind the card. */
  glow?: boolean;
  /** Entry animation delay in ms. */
  delay?: number;
  /** Apply the rise-in entry animation. */
  rise?: boolean;
}

export function Card({
  children,
  className = '',
  guide,
  glow = false,
  delay = 0,
  rise = true,
}: CardProps) {
  return (
    <div className="relative">
      {glow && (
        <div
          aria-hidden
          className="demo-glow pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-accent/20 blur-3xl"
        />
      )}
      <div
        data-guide={guide}
        style={delay ? { animationDelay: `${delay}ms` } : undefined}
        className={`${rise ? 'demo-rise' : ''} rounded-card border border-border bg-card p-5 transition-colors duration-300 ease-demo hover:border-border-hi ${className}`}
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
    <div className="flex items-baseline justify-between gap-6 border-b border-border/70 py-2.5 last:border-0">
      <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
        {label}
      </span>
      <span
        className={`text-right text-[14px] ${mono ? 'font-mono' : 'font-sans'} ${
          accent ? 'text-accent' : 'text-foreground'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
