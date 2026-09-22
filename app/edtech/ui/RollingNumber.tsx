'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/**
 * A number that rolls to a new value like a split-flap: the old and new
 * digits stack and the stack slides one line, once. `up` is the direction the
 * digits travel — a rank that improved rolls up, one that slipped rolls down.
 * Under reduced motion the new value simply appears.
 */
export function RollingNumber({
  value,
  from,
  direction,
  run,
  className = '',
}: {
  value: number;
  /** Starting value, shown until `run` flips true. */
  from: number;
  direction: 'up' | 'down';
  run: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [moved, setMoved] = useState(false);
  /** Once the slide has finished the stack collapses to the final digits, so
   *  the DOM (and anything reading it) holds one number, not two. */
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!run) {
      setMoved(false);
      setSettled(false);
      return;
    }
    if (reduced) {
      setMoved(true);
      setSettled(true);
      return;
    }
    // Two frames so the un-moved position is committed before the slide.
    let f2 = 0;
    const f1 = requestAnimationFrame(() => {
      f2 = requestAnimationFrame(() => setMoved(true));
    });
    const t = setTimeout(() => setSettled(true), 650);
    return () => {
      cancelAnimationFrame(f1);
      cancelAnimationFrame(f2);
      clearTimeout(t);
    };
  }, [run, reduced]);

  if (from === value || !run || settled) {
    return <span className={className}>{run ? value : from}</span>;
  }

  // 'up': the new digits sit below and the stack slides up to reveal them.
  // 'down': the new digits sit above and the stack slides down.
  const lines = direction === 'up' ? [from, value] : [value, from];
  const rest = direction === 'up' ? 'translateY(0)' : 'translateY(-1em)';
  const done = direction === 'up' ? 'translateY(-1em)' : 'translateY(0)';

  return (
    <span className={`edtech-roll ${className}`} aria-label={String(run ? value : from)}>
      <span style={{ transform: moved ? done : rest }}>
        {lines.map((n, i) => (
          <span key={i} className="block">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}
