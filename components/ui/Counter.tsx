'use client';

import { useCountUp } from '@/lib/hooks';

/**
 * Number that ticks up when its step becomes active.
 *
 * The rendered text is always the live value, so screen readers and
 * reduced-motion users get the real figure rather than a stuck zero.
 */
export function Counter({
  to,
  run,
  decimals = 0,
  delayMs = 0,
  prefix = '',
  suffix = '',
  /** Thousands separator, e.g. 18,000 kg. */
  group = false,
  className = '',
}: {
  to: number;
  run: boolean;
  decimals?: number;
  delayMs?: number;
  prefix?: string;
  suffix?: string;
  group?: boolean;
  className?: string;
}) {
  const value = useCountUp(to, run, { decimals, delayMs });

  const body = group
    ? value.toLocaleString('en-GB', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : value.toFixed(decimals);

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {body}
      {suffix}
    </span>
  );
}

/** "42/42" style paired counter, where both halves settle together. */
export function CounterRatio({
  to,
  total,
  run,
  className = '',
}: {
  to: number;
  total: number;
  run: boolean;
  className?: string;
}) {
  const value = useCountUp(to, run);
  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {value}/{total}
    </span>
  );
}
