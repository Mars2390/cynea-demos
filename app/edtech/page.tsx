import type { Metadata } from 'next';
import { EdtechDemo } from './EdtechDemo';
import { steps } from '@/demos/edtech/config';

export const metadata: Metadata = {
  title: 'EdTech — six agents, one term · Cynea Demo',
  description:
    'Teachers keep the judgement. Agents take the busywork. A guided walkthrough of one school term across six Cynea agents: assessment generation, marking and feedback, curriculum mapping, learner progress, study support and school communications.',
};

/** Bare /edtech opens on step 1; each step lives at /edtech/<step>. */
export default function EdtechPage() {
  return <EdtechDemo initialStep={steps[0].id} />;
}
