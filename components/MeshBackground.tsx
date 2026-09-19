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
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
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
            'radial-gradient(circle, rgb(var(--mesh-a) / 0.17) 0%, rgb(var(--mesh-a) / 0.05) 45%, transparent 70%)',
          transition: 'background 1.6s ease',
        }}
      />
      <div
        className="demo-mesh-b absolute -bottom-[26%] -right-[16%] h-[72vh] w-[72vw] rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgb(var(--mesh-b) / 0.15) 0%, rgb(var(--mesh-b) / 0.04) 48%, transparent 72%)',
          transition: 'background 1.6s ease',
        }}
      />
      {/* Vignette keeps the mesh from washing out text at the edges. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, transparent 40%, rgb(var(--background-ch) / 0.75) 100%)',
        }}
      />
    </div>
  );
}
