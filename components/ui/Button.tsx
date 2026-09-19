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
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-btn font-sans font-medium ' +
  'transition-all duration-200 ease-demo disabled:opacity-40 disabled:cursor-not-allowed ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-background';

const variants: Record<Variant, string> = {
  // Primary: cyan bg, near-black text, soft cyan glow.
  primary:
    'bg-accent text-[#04121a] shadow-glow-accent hover:bg-accent-hover ' +
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
}: ButtonProps) {
  // Spec: 16px horizontal padding, 36px tall.
  const size = small
    ? 'h-7 px-3 text-[12px]'
    : 'h-9 px-4 text-[15px] leading-none';
  const cls = `${base} ${variants[variant]} ${size} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls} data-guide={guide}>
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
    >
      {children}
    </button>
  );
}
