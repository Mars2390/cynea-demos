import type { Metadata } from 'next';
import { DiligenceDemo } from './DiligenceDemo';
import { steps } from '@/demos/diligence/config';

export const metadata: Metadata = {
  title: 'Diligence — EUDR Due Diligence Agent · Cynea Demo',
  description:
    'A guided, click-through demo of Diligence: EUDR scope detection, plot-level collection, five-point risk assessment and a TRACES-ready statement.',
};

/**
 * Bare /diligence is the shareable entry point and opens on step 1. Each
 * subsequent step lives at /diligence/<step>, prerendered by [step]/page.tsx.
 */
export default function DiligencePage() {
  return <DiligenceDemo initialStep={steps[0].id} />;
}
