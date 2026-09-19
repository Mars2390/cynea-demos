'use client';

import { Card, CardRow } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Counter } from '@/components/ui/Counter';
import { LineChart } from '@/components/ui/LineChart';
import { useLoaded } from '@/lib/hooks';
import { cashCurve, forecast, forecastActions } from '@/demos/finance/fixtures';

const gbp = (n: number) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

/**
 * STEP 5 — FORECAST · Cash Flow Agent
 * The line draws itself across 13 weeks, the buffer sits underneath in amber,
 * and the crunch marker lands last so the eye is taken to it.
 */
export function StepForecast() {
  const loaded = useLoaded(true);
  const low = Math.min(...cashCurve);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <Card guide="cash-chart" glass glow delay={60}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Projected closing balance · next {forecast.horizonDays} days
          </span>
          <Pill tone="secondary">as of {forecast.asOf}</Pill>
        </div>

        <LineChart
          values={cashCurve}
          bufferK={forecast.bufferK}
          crunchIndex={forecast.crunchWeek}
          run={loaded}
          markerGuide="crunch-marker"
        />

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-border pt-3">
          <Legend swatch="bg-accent" label="Projected cash" />
          <Legend swatch="bg-warning" label={`£${forecast.bufferK}k buffer`} dashed />
          <Legend swatch="bg-warning" label="Crunch week" dot />
        </div>
      </Card>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card delay={220} className="border-warning/40">
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-eyebrow text-warning">
            Crunch flagged
          </span>
          <p className="text-[15px] leading-snug text-foreground">{forecast.crunchLabel}</p>
          <div className="mt-4">
            <CardRow
              label="Lowest point"
              value={
                <Counter to={low} run={loaded} decimals={1} prefix="£" suffix="k" />
              }
              mono
            />
            <CardRow label="Buffer" value={`£${forecast.bufferK}k`} mono />
            <CardRow
              label="Shortfall"
              value={gbp(forecast.bufferK * 1000 - forecast.crunchBalance)}
              mono
              accent
            />
            <CardRow label="Warning lead" value={`${forecast.crunchWeek} weeks`} />
          </div>
          <div className="mt-4 border-t border-border pt-3.5">
            <Pill tone="success" dot>
              {forecast.status}
            </Pill>
          </div>
        </Card>

        <Card guide="forecast-actions" delay={300} glow>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-eyebrow text-muted">
            Suggested actions · ranked
          </span>
          <ol className="space-y-1">
            {forecastActions.map((a, i) => (
              <li
                key={a.label}
                style={{ animationDelay: `${380 + i * 130}ms` }}
                className="demo-rise flex items-start gap-3 rounded-[12px] border border-transparent px-2.5 py-2.5 transition-colors duration-300 hover:border-border hover:bg-card-hover"
              >
                <span className="mt-0.5 shrink-0 font-mono text-[11px] text-dim">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <span className="text-[13.5px] text-foreground">{a.label}</span>
                    {a.amount && (
                      <span className="font-mono text-[12px] tabular-nums text-accent">
                        {a.amount}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">
                    {a.effect}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

function Legend({
  swatch,
  label,
  dashed = false,
  dot = false,
}: {
  swatch: string;
  label: string;
  dashed?: boolean;
  dot?: boolean;
}) {
  return (
    <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-eyebrow text-dim">
      {dot ? (
        <span className={`h-2 w-2 rounded-full ${swatch}`} />
      ) : (
        <span
          className={`h-[2px] w-5 rounded-full ${swatch} ${dashed ? 'opacity-70' : ''}`}
          style={dashed ? { backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0 3px, transparent 3px 6px)' } : undefined}
        />
      )}
      {label}
    </span>
  );
}
