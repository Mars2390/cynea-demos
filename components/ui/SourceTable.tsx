'use client';

import type { ReactNode } from 'react';

export interface SourceColumn {
  key: string;
  label: string;
  /** Right-align numerics so figures line up down the column. */
  numeric?: boolean;
  /** Render as the muted provenance column. */
  source?: boolean;
  /** Hide below `sm` — for columns that are supporting rather than essential. */
  secondary?: boolean;
}

/**
 * Compact table for figures that must be traceable.
 *
 * Every agent that reports numbers — CBAM emissions, ESG metrics — has to show
 * where each figure came from, so provenance is a first-class column rather
 * than a footnote. On a phone the table becomes stacked cards: a four-column
 * grid at 375px would be unreadable, and horizontal scrolling hides exactly
 * the provenance the panel exists to show.
 */
export function SourceTable({
  columns,
  rows,
  caption,
  guide,
}: {
  columns: SourceColumn[];
  rows: Record<string, ReactNode>[];
  caption?: string;
  guide?: string;
}) {
  return (
    <div data-guide={guide}>
      {/* Tablet and up: a real table. */}
      <div className="hidden sm:block">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`border-b border-border pb-2 pr-4 font-mono text-[9px] font-normal uppercase tracking-eyebrow text-muted last:pr-0 ${
                    c.numeric ? 'text-right' : 'text-left'
                  } ${c.secondary ? 'hidden lg:table-cell' : ''}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="demo-rise border-b border-border/70 last:border-0"
                style={{ animationDelay: `${120 + i * 90}ms` }}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`py-2.5 pr-4 align-top text-[13px] last:pr-0 ${
                      c.numeric
                        ? 'text-right font-mono tabular-nums'
                        : 'text-left'
                    } ${
                      c.source
                        ? 'font-mono text-[10px] uppercase tracking-eyebrow text-dim'
                        : 'text-foreground'
                    } ${c.secondary ? 'hidden lg:table-cell' : ''}`}
                  >
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone: stacked cards, so the source line stays readable. */}
      <div className="space-y-2.5 sm:hidden">
        {rows.map((row, i) => (
          <div
            key={i}
            className="demo-rise rounded-[12px] border border-border bg-card/60 p-3"
            style={{ animationDelay: `${120 + i * 90}ms` }}
          >
            <div className="mb-2 text-[13px] text-foreground">
              {row[columns[0].key]}
            </div>
            {columns.slice(1).map((c) => (
              <div
                key={c.key}
                className="flex items-baseline justify-between gap-3 border-t border-border/60 py-1.5 first:border-0"
              >
                <span className="font-mono text-[9px] uppercase tracking-eyebrow text-muted">
                  {c.label}
                </span>
                <span
                  className={`text-right text-[12px] ${
                    c.source
                      ? 'font-mono text-[10px] uppercase tracking-eyebrow text-dim'
                      : 'font-mono tabular-nums text-foreground'
                  }`}
                >
                  {row[c.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {caption && (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-dim">
          {caption}
        </p>
      )}
    </div>
  );
}
