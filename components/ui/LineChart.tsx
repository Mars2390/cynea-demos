'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/**
 * Hand-drawn SVG line chart for the 90-day cash projection. No library.
 *
 * The line draws itself in via stroke-dashoffset — driven through `style`, not
 * the SVG presentation attribute, because Chrome will not reliably transition
 * the attribute form (the same lesson as ProgressRing). Under reduced motion
 * the line is simply present.
 */
export function LineChart({
  values,
  bufferK,
  crunchIndex,
  run,
  guide,
  markerGuide,
}: {
  /** One value per week, in £k. */
  values: readonly number[];
  bufferK: number;
  crunchIndex: number;
  run: boolean;
  guide?: string;
  markerGuide?: string;
}) {
  const reduced = useReducedMotion();
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (!run) {
      setDrawn(false);
      return;
    }
    if (reduced) {
      setDrawn(true);
      return;
    }
    const t = setTimeout(() => setDrawn(true), 220);
    return () => clearTimeout(t);
  }, [run, reduced]);

  // Chart geometry in a fixed viewBox; the SVG scales to its container.
  const W = 640;
  const H = 240;
  const padL = 36;
  const padR = 16;
  const padT = 18;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const max = Math.max(...values, bufferK) * 1.12;
  const min = 0;
  const x = (i: number) => padL + (i / (values.length - 1)) * innerW;
  const y = (v: number) => padT + innerH - ((v - min) / (max - min)) * innerH;

  const points = values.map((v, i) => [x(i), y(v)] as const);
  const path = points
    .map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`)
    .join(' ');
  const area = `${path} L ${x(values.length - 1).toFixed(1)} ${(padT + innerH).toFixed(1)} L ${padL} ${(padT + innerH).toFixed(1)} Z`;

  // Generous over-estimate of path length; only the ratio matters.
  const length = 1400;
  const [cx, cy] = points[crunchIndex];

  return (
    <div data-guide={guide} className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Projected cash balance over ${values.length - 1} weeks, dipping below the £${bufferK}k buffer in week ${crunchIndex}.`}
      >
        <defs>
          <linearGradient id="cash-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--accent-ch) / 0.28)" />
            <stop offset="100%" stopColor="rgb(var(--accent-ch) / 0)" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={padL}
            x2={W - padR}
            y1={padT + innerH * (1 - f)}
            y2={padT + innerH * (1 - f)}
            style={{ stroke: 'rgb(var(--foreground-ch) / 0.06)' }}
            strokeWidth={1}
          />
        ))}

        {/* Buffer line */}
        <line
          x1={padL}
          x2={W - padR}
          y1={y(bufferK)}
          y2={y(bufferK)}
          strokeWidth={1.5}
          strokeDasharray="4 5"
          style={{ stroke: 'rgb(var(--warning-ch) / 0.8)' }}
        />
        <text
          x={W - padR}
          y={y(bufferK) - 6}
          textAnchor="end"
          className="font-mono"
          style={{
            fill: 'rgb(var(--warning-ch))',
            fontSize: 9,
            letterSpacing: '0.14em',
          }}
        >
          £{bufferK}K BUFFER
        </text>

        {/* Area under the line, fades in after the line draws */}
        <path
          d={area}
          fill="url(#cash-fill)"
          style={{
            opacity: drawn ? 1 : 0,
            transition: 'opacity 700ms ease 700ms',
          }}
        />

        {/* The line */}
        <path
          d={path}
          fill="none"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            stroke: 'rgb(var(--accent-ch))',
            strokeDasharray: length,
            strokeDashoffset: drawn ? 0 : length,
            transition: 'stroke-dashoffset 1400ms cubic-bezier(.2,.8,.2,1)',
          }}
        />

        {/* Week ticks */}
        {values.map((_, i) =>
          i % 3 === 0 ? (
            <text
              key={i}
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              style={{
                fill: 'rgb(var(--dim-ch))',
                fontSize: 9,
                letterSpacing: '0.12em',
              }}
              className="font-mono"
            >
              W{i}
            </text>
          ) : null,
        )}

        {/* Crunch marker */}
        <g
          style={{
            opacity: drawn ? 1 : 0,
            transition: 'opacity 400ms ease 1300ms',
          }}
        >
          <line
            x1={cx}
            x2={cx}
            y1={padT}
            y2={padT + innerH}
            strokeWidth={1}
            strokeDasharray="3 4"
            style={{ stroke: 'rgb(var(--warning-ch) / 0.5)' }}
          />
          <circle
            cx={cx}
            cy={cy}
            r={9}
            style={{ fill: 'rgb(var(--warning-ch) / 0.18)' }}
          />
          <circle
            cx={cx}
            cy={cy}
            r={4.5}
            style={{
              fill: 'rgb(var(--warning-ch))',
              stroke: 'rgb(var(--background-ch))',
              strokeWidth: 2,
            }}
          />
        </g>
      </svg>

      {/* HTML marker label sits over the SVG so the guide can spotlight it. */}
      <div
        data-guide={markerGuide}
        className="pointer-events-none absolute"
        style={{
          left: `${(cx / W) * 100}%`,
          top: `${(cy / H) * 100}%`,
          transform: 'translate(-50%, -140%)',
          opacity: drawn ? 1 : 0,
          transition: 'opacity 400ms ease 1300ms',
        }}
      >
        <span className="block whitespace-nowrap rounded-[8px] border border-warning/50 bg-background/95 px-2 py-1 font-mono text-[10px] uppercase tracking-eyebrow text-warning backdrop-blur-sm">
          Week {crunchIndex} · £{values[crunchIndex]}k
        </span>
      </div>
    </div>
  );
}
