import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalDemo } from '../LegalDemo';
import { agent, readyStep, steps } from '@/demos/legal/config';

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
  return {
    title: step
      ? `${step.name} · ${step.role} — Cynea ${agent.name}`
      : `${agent.name} — five agents, one matter · Cynea Demo`,
    description: step ? step.title : agent.tagline,
  };
}

export default function LegalStepPage({ params }: { params: { step: string } }) {
  if (!isValidStep(params.step)) notFound();
  return <LegalDemo initialStep={params.step} />;
}
