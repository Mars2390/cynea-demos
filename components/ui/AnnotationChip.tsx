/**
 * Small cyan chip that the guide parks beside a spotlit element, e.g.
 * "Auto-detected", "Verified", "EUDR standard". Positioned by GuideBubble,
 * which is why it takes absolute coordinates.
 */
export function AnnotationChip({
  text,
  top,
  left,
  glued = false,
}: {
  text: string;
  top: number;
  left: number;
  /** Suppress the position transition while a guided scroll is in flight. */
  glued?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`demo-annotation pointer-events-none fixed z-[60] whitespace-nowrap rounded-chip border border-accent/50 bg-background/95 px-2 py-1 font-mono text-[10px] uppercase tracking-eyebrow text-accent shadow-glow-accent backdrop-blur-sm ${glued ? 'demo-spot-glued' : ''}`}
      style={{ top, left }}
    >
      {text}
    </div>
  );
}

/** Inline variant used inside static panels, not driven by the guide. */
export function InlineChip({ text }: { text: string }) {
  return (
    <span className="rounded-chip border border-accent/40 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-eyebrow text-accent">
      {text}
    </span>
  );
}
