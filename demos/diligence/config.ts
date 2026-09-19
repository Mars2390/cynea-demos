import type { Step } from '@/lib/types';

export const agent = {
  name: 'Diligence',
  role: 'EUDR Due Diligence Agent',
  tagline: 'Compliance · EUDR due diligence',
};

/** The four guided steps. The terminal "ready" state is handled separately. */
export const steps: Step[] = [
  {
    number: 1,
    id: 'consignment',
    name: 'Consignment',
    title: 'A shipment arrives — EUDR applies automatically.',
    why: 'EUDR applies to specific commodities and derived products. Diligence flags scope automatically so nothing slips through.',
    next: 'Collect plot data →',
  },
  {
    number: 2,
    id: 'collect',
    name: 'Collect',
    title: 'Plot-level data, collected and verified.',
    why: 'Plot-level geolocation and a post-2020 deforestation check are the core EUDR evidence requirements.',
    next: 'Run risk assessment →',
  },
  {
    number: 3,
    id: 'assess',
    name: 'Assess',
    title: 'Five-point risk assessment.',
    why: 'A standardised assessment is what makes the result defensible if an authority asks.',
    next: 'Generate statement →',
  },
  {
    number: 4,
    id: 'statement',
    name: 'Statement',
    title: 'TRACES-ready due diligence statement.',
    why: 'The statement is the artefact the regulation actually requires — Diligence produces it from the evidence already collected.',
    next: 'Finish →',
  },
];

/** Terminal state, reached at ?step=ready. */
export const readyStep = {
  id: 'ready',
  heading: 'Ready to try this on your own consignments?',
  bookLabel: 'Book a demo with Irene',
  bookHref: 'mailto:irene@cynea.ai',
  replayLabel: 'Replay the demo',
  disclaimer:
    'This was a demo. Every company, plot and reference number you just saw was fictional. Nothing was submitted.',
};

export const stepIds = steps.map((s) => s.id);
export const firstStepId = steps[0].id;
