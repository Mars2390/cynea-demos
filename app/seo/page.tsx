import type { Metadata } from 'next';
import { SeoDemo } from './SeoDemo';
import { steps } from '@/demos/seo/config';

export const metadata: Metadata = {
  title: 'SEO — five agents, one month · Cynea Demo',
  description:
    'Rankings built on process, not luck. A guided walkthrough of one SEO month across five Cynea agents: keyword research, content briefs, on-page optimisation, technical crawling and rank tracking.',
};

/** Bare /seo opens on step 1; each step lives at /seo/<step>. */
export default function SeoPage() {
  return <SeoDemo initialStep={steps[0].id} />;
}
