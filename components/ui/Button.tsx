'use client';

import type { ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'quiet';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: Variant;
  small?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  /** Marks this element as a spotlight target. */
  guide?: string;
  /**
   * Draws attention once the step's intro has settled, so a first-time viewer
   * never has to wonder what to do next.
   */
  pulse?: boolean;
  ariaLabel?: string;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-btn font-sans font-medium ' +
  'transition-all duration-200 ease-demo disabled:opacity-40 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  // Signal gold fill with near-black text — measured 10.00:1.
  primary:
    'bg-accent text-on-accent shadow-glow-accent hover:bg-accent-hover ' +
    'hover:shadow-glow-accent-lg active:translate-y-px',
  ghost:
    'border border-border-hi bg-card/70 text-foreground hover:bg-card-hover hover:border-accent/40',
  quiet: 'text-muted hover:text-foreground',
};

export function Button({
  children,
  onClick,
  href,
  variant = 'primary',
  small = false,
  disabled = false,
  autoFocus = false,
  className = '',
  guide,
  pulse = false,
  ariaLabel,
}: ButtonProps) {
  // Spec: 16px horizontal padding, 36px tall. `demo-cta` lifts that to a 44px
  // minimum on phones only (see globals.css).
  const size = small
    ? 'h-7 px-3 text-[12px]'
    : 'demo-cta h-9 px-4 text-[15px] leading-none';

  const cls = `${base} ${variants[variant]} ${size} ${pulse ? 'demo-next-pulse' : ''} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls} data-guide={guide} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      className={cls}
      data-guide={guide}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
