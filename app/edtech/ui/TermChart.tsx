'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/**
 * Twelve weeks of engagement: the whole cohort against the learners who are
 * drifting. Hand-written SVG; pointer events drive a crosshair and a tooltip
 * showing the week and both values. The week the flags were raised is marked.
 *
 * The lines draw in once when `run` flips; the hover layer works from the
 * first frame. No library. The drifting line is the coral companion — a line,
 * never text.
 */
export function TermChart({
  cohort,
  drifting,
  flagWeek,
  flagLabel,
  run,
  guide,
}: {
  cohort: readonly number[];
  drifting: readonly number[];
  /** 1-based week the flags were raised, marked on the chart. */
  flagWeek: number;
  flagLabel: string;
  run: boolean;
  guide?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<SVGSVGElement | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  // A narrower drawing surface on phones, so the SVG is not scaled down so
  // far that its axis labels become unreadable. Decided after mount (SSR
  // renders the desktop surface; the switch is a state update).
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const W = compact ? 380 : 640;
  const H = compact ? 200 : 220;
  const PAD = { l: 34, r: 12, t: 14, b: 24 };
  const n = cohort.length;
  const MIN = 30;
  const MAX = 100;
  const x = (i: number) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + ((MAX - v) / (MAX - MIN)) * (H - PAD.t - PAD.b);

  const pathOf = (series: readonly number[]) =>
    series.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p).toFixed(1)}`).join(' ');
  const cohortPath = useMemo(() => pathOf(cohort), [cohort, W, H]); // eslint-disable-line react-hooks/exhaustive-deps
  const driftPath = useMemo(() => pathOf(drifting), [drifting, W, H]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  const ticks = [100, 80, 60, 40];
  const drawn = run;
  const dash = 1600;
  const fx = x(flagWeek - 1);

  return (
    <div className="relative" data-guide={guide}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full cursor-crosshair select-none"
        role="img"
        aria-label={`Engagement over ${n} weeks. Cohort from ${cohort[0]} to ${cohort[n - 1]} percent; drifting learners from ${drifting[0]} to ${drifting[n - 1]} percent.`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {/* Grid + axis */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="rgb(var(--foreground-ch) / 0.07)" />
            <text x={PAD.l - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="rgb(var(--dim-ch))" fontFamily="var(--font-jetbrains-mono)">
              {t}%
            </text>
          </g>
        ))}
        {[0, Math.floor(n / 3), Math.floor((2 * n) / 3), n - 1].map((i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} fontSize="10" fill="rgb(var(--dim-ch))" fontFamily="var(--font-jetbrains-mono)">
            Wk {i + 1}
          </text>
        ))}

        {/* The week the flags went up */}
        <line x1={fx} x2={fx} y1={PAD.t} y2={H - PAD.b} stroke="rgb(var(--warning-ch) / 0.55)" strokeDasharray="3 4" />
        {/* The label sits on whichever side of the line has room. */}
        <text
          x={fx > W * 0.55 ? fx - 6 : fx + 6}
          y={PAD.t + 10}
          textAnchor={fx > W * 0.55 ? 'end' : 'start'}
          fontSize="9"
          fill="rgb(var(--warning-ch))"
          fontFamily="var(--font-jetbrains-mono)"
          letterSpacing="0.12em"
        >
          {flagLabel.toUpperCase()}
        </text>

        {/* Cohort */}
        <path
          d={cohortPath}
          fill="none"
          stroke="rgb(var(--accent-ch))"
          strokeWidth="2.25"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={reduced ? undefined : dash}
          style={reduced ? undefined : { strokeDashoffset: drawn ? 0 : dash, transition: 'stroke-dashoffset 1400ms cubic-bezier(.2,.8,.2,1)' }}
        />
        {/* Drifting — coral line */}
        <path
          d={driftPath}
          fill="none"
          stroke="rgb(var(--accent-secondary-ch))"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={reduced ? undefined : dash}
          style={reduced ? undefined : { strokeDashoffset: drawn ? 0 : dash, transition: 'stroke-dashoffset 1600ms cubic-bezier(.2,.8,.2,1) 200ms' }}
        />

        {/* Crosshair */}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="rgb(var(--foreground-ch) / 0.28)" />
            <circle cx={x(hover)} cy={y(cohort[hover])} r="4" fill="rgb(var(--accent-ch))" stroke="rgb(var(--card-ch))" strokeWidth="2" />
            <circle cx={x(hover)} cy={y(drifting[hover])} r="4" fill="rgb(var(--accent-secondary-ch))" stroke="rgb(var(--card-ch))" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Tooltip, positioned in percent so it follows the responsive SVG. */}
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-[168px] rounded-[10px] border border-border bg-card px-3 py-2 text-[11px] shadow-[0_8px_24px_-12px_rgb(38_32_20/0.25)]"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            transform: x(hover) > W * 0.62 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
          }}
        >
          <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-dim">Week {hover + 1}</span>
          <span className="mt-1 flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Cohort
            </span>
            <span className="font-mono tabular-nums text-foreground">{cohort[hover]}%</span>
          </span>
          <span className="mt-0.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" /> Drifting
            </span>
            <span className="font-mono tabular-nums text-foreground">{drifting[hover]}%</span>
          </span>
        </div>
      )}
    </div>
  );
}
