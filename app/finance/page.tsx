import type { Metadata } from 'next';
import { FinanceDemo } from './FinanceDemo';
import { steps } from '@/demos/finance/config';

export const metadata: Metadata = {
  title: 'Finance — six agents, one workflow · Cynea Demo',
  description:
    'The numbers, handled, from bookkeeping to board pack. A guided walkthrough of one financial month across six Cynea agents: invoice capture, reconciliation, expense audit, anomaly detection, cash forecasting and board reporting.',
};

/** Bare /finance opens on step 1; each step lives at /finance/<step>. */
export default function FinancePage() {
  return <FinanceDemo initialStep={steps[0].id} />;
}
