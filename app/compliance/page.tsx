import type { Metadata } from 'next';
import { ComplianceDemo } from './ComplianceDemo';
import { steps } from '@/demos/compliance/config';

export const metadata: Metadata = {
  title: 'Compliance — six agents, one workflow · Cynea Demo',
  description:
    'A guided walkthrough of an EU importer’s compliance year across six Cynea agents: regulatory watch, KYC screening, EUDR due diligence, CBAM reporting, ESG data and audit trail.',
};

/**
 * Bare /compliance is the shareable entry point and opens on step 1. Each
 * subsequent step lives at /compliance/<step>, prerendered by [step]/page.tsx.
 */
export default function CompliancePage() {
  return <ComplianceDemo initialStep={steps[0].id} />;
}
