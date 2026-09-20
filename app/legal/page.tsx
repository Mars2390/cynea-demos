import type { Metadata } from 'next';
import { LegalDemo } from './LegalDemo';
import { steps } from '@/demos/legal/config';

export const metadata: Metadata = {
  title: 'Legal — five agents, one matter · Cynea Demo',
  description:
    'The document work behind the judgement calls. A guided walkthrough of one client matter across five Cynea agents: matter intake, legal research, contract review, document redaction and deadline tracking.',
};

/** Bare /legal opens on step 1; each step lives at /legal/<step>. */
export default function LegalPage() {
  return <LegalDemo initialStep={steps[0].id} />;
}
