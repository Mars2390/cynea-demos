'use client';

import { useEffect, useState } from 'react';
import { timing } from '@/lib/timing';

/**
 * Thin bar pinned to the top of the viewport. It runs an indeterminate sweep on
 * first paint, then converts into a determinate demo-progress bar for the rest
 * of the session.
 *
 * `progress` is 0–1 across the whole flow, including the ready screen.
 */
export function TopProgressBar({ progress }: { progress: number }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), timing.topbarLoadMs);
    return () => clearTimeout(t);
  }, []);

  const pct = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[80] h-[2px] overflow-hidden bg-border/60"
      role="progressbar"
      aria-label="Demo progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={loading ? undefined : Math.round(pct)}
    >
      {loading ? (
        <div
          className="demo-topbar h-full w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--accent), transparent)',
          }}
        />
      ) : (
        <div
          className="h-full transition-[width] duration-700 ease-demo"
          style={{
            width: `${pct}%`,
            background:
              'linear-gradient(90deg, var(--accent-secondary), var(--accent))',
            boxShadow: '0 0 12px rgb(var(--accent-ch) / 0.55)',
          }}
        />
      )}
    </div>
  );
}
