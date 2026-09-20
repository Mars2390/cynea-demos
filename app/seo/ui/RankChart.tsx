'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/**
 * 30-day rank history for one keyword against its closest competitor.
 * Hand-written SVG; pointer events drive a crosshair and a tooltip showing
 * the date, your position and theirs at that day. Lower is better, so the
 * y-axis is inverted: #1 sits at the top.
 *
 * The lines draw in once when `run` flips; the hover layer works from the
 * first frame. No library.
 */
export function RankChart({
  you,
  them,
  from,
  to,
  fixDay,
  fixLabel,
  competitor,
  run,
  guide,
}: {
  you: readonly number[];
  them: readonly number[];
  from: string;
  to: string;
  /** Index of the day a change deployed, marked on the chart. */
  fixDay: number;
  fixLabel: string;
  competitor: string;
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
  const PAD = { l: 30, r: 12, t: 14, b: 24 };
  const n = you.length;
  const maxPos = Math.max(...you, ...them, 15);
  const x = (i: number) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
  const y = (pos: number) => PAD.t + ((pos - 1) / (maxPos - 1)) * (H - PAD.t - PAD.b);

  const pathOf = (series: readonly number[]) =>
    series.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p).toFixed(1)}`).join(' ');
  const youPath = useMemo(() => pathOf(you), [you, W, H]); // eslint-disable-line react-hooks/exhaustive-deps
  const themPath = useMemo(() => pathOf(them), [them, W, H]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dates for the tooltip: 30 consecutive days ending on `to`.
  const dayLabel = (i: number) => {
    const end = new Date(`${to} 12:00`);
    const d = new Date(end);
    d.setDate(end.getDate() - (n - 1 - i));
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  const ticks = [1, 5, 10, 15];
  const drawn = run;
  const dash = 1600;

  return (
    <div className="relative" data-guide={guide}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full cursor-crosshair select-none"
        role="img"
        aria-label={`Rank history, ${from} to ${to}. You moved from ${you[0]} to ${you[n - 1]}; ${competitor} from ${them[0]} to ${them[n - 1]}.`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {/* Grid + axis */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="rgb(var(--foreground-ch) / 0.07)" />
            <text x={PAD.l - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="rgb(var(--dim-ch))" fontFamily="var(--font-jetbrains-mono)">
              #{t}
            </text>
          </g>
        ))}
        {[0, Math.floor(n / 2), n - 1].map((i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} fontSize="10" fill="rgb(var(--dim-ch))" fontFamily="var(--font-jetbrains-mono)">
            {dayLabel(i)}
          </text>
        ))}

        {/* The deployed change */}
        <line x1={x(fixDay)} x2={x(fixDay)} y1={PAD.t} y2={H - PAD.b} stroke="rgb(var(--success-ch) / 0.55)" strokeDasharray="3 4" />
        <text x={x(fixDay) + 6} y={PAD.t + 10} fontSize="9" fill="rgb(var(--success-ch))" fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.12em">
          {fixLabel.toUpperCase()}
        </text>

        {/* Competitor */}
        <path
          d={themPath}
          fill="none"
          stroke="rgb(var(--accent-secondary-ch))"
          strokeWidth="1.5"
          strokeDasharray={reduced ? undefined : dash}
          style={reduced ? undefined : { strokeDashoffset: drawn ? 0 : dash, transition: 'stroke-dashoffset 1400ms cubic-bezier(.2,.8,.2,1)' }}
        />
        {/* You */}
        <path
          d={youPath}
          fill="none"
          stroke="rgb(var(--accent-ch))"
          strokeWidth="2.25"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={reduced ? undefined : dash}
          style={reduced ? undefined : { strokeDashoffset: drawn ? 0 : dash, transition: 'stroke-dashoffset 1600ms cubic-bezier(.2,.8,.2,1)' }}
        />

        {/* Crosshair */}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="rgb(var(--foreground-ch) / 0.28)" />
            <circle cx={x(hover)} cy={y(you[hover])} r="4" fill="rgb(var(--accent-ch))" stroke="rgb(var(--card-ch))" strokeWidth="2" />
            <circle cx={x(hover)} cy={y(them[hover])} r="3.5" fill="rgb(var(--accent-secondary-ch))" stroke="rgb(var(--card-ch))" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Tooltip, positioned in percent so it follows the responsive SVG. */}
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-[168px] rounded-[10px] border border-border bg-card px-3 py-2 text-[11px] shadow-[0_8px_24px_-12px_rgb(16_24_40/0.25)]"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            transform: x(hover) > W * 0.62 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
          }}
        >
          <span className="block font-mono text-[9px] uppercase tracking-eyebrow text-dim">{dayLabel(hover)}</span>
          <span className="mt-1 flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> You
            </span>
            <span className="font-mono tabular-nums text-foreground">#{you[hover]}</span>
          </span>
          <span className="mt-0.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 truncate text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" /> {competitor}
            </span>
            <span className="font-mono tabular-nums text-foreground">#{them[hover]}</span>
          </span>
        </div>
      )}
    </div>
  );
}
