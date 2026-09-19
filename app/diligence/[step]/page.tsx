import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DiligenceDemo } from '../DiligenceDemo';
import { agent, readyStep, steps } from '@/demos/diligence/config';

/** Every step is prerendered at build time, so each URL is fully static. */
export function generateStaticParams() {
  return [...steps.map((s) => ({ step: s.id })), { step: readyStep.id }];
}

/** Unknown steps 404 instead of rendering on demand — keeps the route static. */
export const dynamicParams = false;

const isValidStep = (id: string) =>
  id === readyStep.id || steps.some((s) => s.id === id);

export function generateMetadata({
  params,
}: {
  params: { step: string };
}): Metadata {
  const step = steps.find((s) => s.id === params.step);

  const title = step
    ? `${step.name} · ${agent.name} — ${agent.role} · Cynea Demo`
    : `${agent.name} — ${agent.role} · Cynea Demo`;

  return {
    title,
    description: step
      ? step.title
      : 'A guided, click-through demo of Diligence, the Cynea EUDR due diligence agent.',
  };
}

export default function DiligenceStepPage({
  params,
}: {
  params: { step: string };
}) {
  if (!isValidStep(params.step)) notFound();

  return <DiligenceDemo initialStep={params.step} />;
}
