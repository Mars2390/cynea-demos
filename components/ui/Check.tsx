/**
 * Emerald tick. Colour comes from currentColor so it follows the token, and
 * green stays reserved for cleared/pass states across every agent.
 */
export function Check({ size = 4 }: { size?: 3 | 4 | 5 }) {
  const box = size === 3 ? 'h-3 w-3' : size === 5 ? 'h-5 w-5' : 'h-4 w-4';
  const glyph = size === 3 ? 'h-2 w-2' : size === 5 ? 'h-3 w-3' : 'h-2.5 w-2.5';

  return (
    <span
      aria-hidden
      className={`inline-flex ${box} shrink-0 items-center justify-center rounded-full border border-success/50 bg-success/15 text-success`}
    >
      <svg viewBox="0 0 12 12" className={glyph} fill="none">
        <path
          d="M2.5 6.4l2.2 2.2 4.8-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Hollow ring used for a check that has not run yet. */
export function Pending() {
  return (
    <span
      aria-hidden
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border-hi"
    >
      <span className="h-1 w-1 rounded-full bg-dim" />
    </span>
  );
}
