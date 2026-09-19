'use client';

import type { ReactNode } from 'react';
import { useLoaded } from '@/lib/hooks';

/** A single shimmering placeholder bar. */
export function Skeleton({
  w = '100%',
  h = 12,
  className = '',
}: {
  w?: string | number;
  h?: string | number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`demo-skeleton block ${className}`}
      style={{ width: w, height: h }}
    />
  );
}

/** Stack of placeholder rows approximating a label/value table. */
export function SkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <span aria-hidden className="block space-y-3 py-1">
      {Array.from({ length: rows }, (_, i) => (
        <span key={i} className="flex items-center justify-between gap-6">
          <Skeleton w={`${28 + ((i * 13) % 22)}%`} h={9} />
          <Skeleton w={`${34 + ((i * 17) % 26)}%`} h={11} />
        </span>
      ))}
    </span>
  );
}

/**
 * Swaps a skeleton for real content after a short hold, so data appears to load
 * in rather than pop.
 *
 * `aria-busy` is set while loading and the real children mount only once ready,
 * which keeps assistive tech from announcing placeholder noise. Under reduced
 * motion useLoaded resolves immediately, so this is a no-op.
 */
export function Reveal({
  run,
  skeleton,
  children,
  holdMs,
  className = '',
}: {
  run: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  holdMs?: number;
  className?: string;
}) {
  const loaded = useLoaded(run, holdMs);

  return (
    <div aria-busy={!loaded} className={className}>
      {loaded ? (
        <div className="demo-rise" style={{ animationDuration: '.45s' }}>
          {children}
        </div>
      ) : (
        skeleton
      )}
    </div>
  );
}
