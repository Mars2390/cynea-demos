'use client';

import { meshByStep } from '@/lib/tokens';

/**
 * Ambient gradient mesh. Two large blurred blobs drift on different periods and
 * their hue is re-pointed per step (indigo at intake → emerald in the field →
 * gold at the signed statement), so the background carries the narrative.
 *
 * Pure CSS: no canvas, no library. The hue lives in --mesh-a / --mesh-b as
 * channel triplets, transitioned so the shift between steps is a slow fade
 * rather than a cut.
 */
export function MeshBackground({ stepId }: { stepId: string }) {
  const mesh = meshByStep[stepId] ?? meshByStep.consignment;

  return (
    <div
      aria-hidden
      className="demo-mesh-wrap pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      style={
        {
          '--mesh-a': mesh.a,
          '--mesh-b': mesh.b,
        } as React.CSSProperties
      }
    >
      <div
        className="demo-mesh-a absolute -left-[18%] -top-[22%] h-[78vh] w-[78vw] rounded-full blur-[110px]"
        style={{
          background:
            'radial-gradient(circle, rgb(var(--mesh-a) / var(--mesh-core)) 0%, rgb(var(--mesh-a) / var(--mesh-mid)) 45%, transparent 70%)',
          transition: 'background 1.6s ease',
        }}
      />
      <div
        className="demo-mesh-b absolute -bottom-[26%] -right-[16%] h-[72vh] w-[72vw] rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgb(var(--mesh-b) / var(--mesh-core)) 0%, rgb(var(--mesh-b) / var(--mesh-mid)) 48%, transparent 72%)',
          transition: 'background 1.6s ease',
        }}
      />
      {/* Third blob, centre-right, in the suite accent. Silent (alpha 0) in
          the original look; the glass look lights it so panels in the middle
          of the page have colour behind them too. */}
      <div
        className="demo-mesh-c absolute left-[28%] top-[22%] h-[62vh] w-[56vw] rounded-full blur-[110px]"
        style={{
          background:
            'radial-gradient(circle, rgb(var(--accent-ch) / var(--mesh-c)) 0%, transparent 68%)',
          transition: 'background 1.6s ease',
        }}
      />
      {/* Vignette keeps the mesh from washing out text at the edges, and a
          light scrim across the top protects the headline zone, where text
          sits on the aurora with no panel under it. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgb(var(--background-ch) / var(--mesh-scrim)) 0%, transparent 30%), ' +
            'radial-gradient(120% 90% at 50% 0%, transparent 40%, rgb(var(--background-ch) / var(--mesh-vignette)) 100%)',
        }}
      />
    </div>
  );
}
