import type { Step } from '@/lib/types';

export const agent = {
  name: 'Compliance',
  role: 'Compliance suite · six agents',
};

/**
 * One importer's compliance year, told across six agents. The steps are
 * deliberately in calendar order — a regulation lands, a supplier onboards, a
 * shipment clears, the quarter closes, the year is disclosed, the auditor
 * asks — so the suite reads as a single story rather than a feature list.
 *
 * The terminal "ready" state is handled separately.
 */
export const steps: Step[] = [
  {
    number: 1,
    id: 'sentinel',
    name: 'Sentinel',
    role: 'Regulatory Watch Agent',
    title: 'A new regulation applies to you in 90 days.',
    why: 'Regulations move constantly. The cost of missing one is far higher than the cost of watching them.',
    next: 'Screen a supplier →',
  },
  {
    number: 2,
    id: 'screen',
    name: 'Screen',
    role: 'KYC & AML Screening Agent',
    title: 'A new supplier just onboarded — sanctions and watchlist check runs.',
    why: "You can't onboard a supplier you haven't screened. Screen makes that automatic and defensible.",
    next: 'Clear a shipment →',
  },
  {
    number: 3,
    id: 'diligence',
    name: 'Diligence',
    role: 'EUDR Due Diligence Agent',
    title: 'A coffee shipment arrives from Kenya — EUDR applies.',
    why: 'The statement is the artefact the regulation actually requires — Diligence produces it from the evidence already collected.',
    next: 'Report emissions →',
  },
  {
    number: 4,
    id: 'carbon',
    name: 'Carbon',
    role: 'CBAM Reporting Agent',
    title: 'Quarterly CBAM report due.',
    why: 'CBAM penalties scale with emissions. Getting the numbers right the first time is the whole game.',
    next: 'Compile ESG metrics →',
  },
  {
    number: 5,
    id: 'ledger',
    name: 'Ledger',
    role: 'ESG Data Agent',
    title: 'Annual ESG disclosure.',
    why: "ESG disclosure is a data problem, not a writing problem. If the numbers aren't traceable, the disclosure isn't defensible.",
    next: 'Answer the auditor →',
  },
  {
    number: 6,
    id: 'registrar',
    name: 'Registrar',
    role: 'Audit Trail Agent',
    title: 'An auditor asks for evidence. Everything is already there.',
    why: 'The audit is easy when the evidence already exists. Registrar makes evidence the default, not a scramble.',
    next: 'Finish →',
  },
];

/** Terminal state, reached at /compliance/ready. */
export const readyStep = {
  id: 'ready',
  heading: 'This is what a compliance department on Cynea looks like.',
  sub: 'Six agents. One workflow. Every regulation covered.',
  bookLabel: 'Book a demo with Irene',
  bookHref: 'mailto:irene@cynea.ai',
  replayLabel: 'Replay the demo',
  trustPills: [
    'No credit card',
    '14-day free trial',
    'Your own Gmail or Outlook',
  ],
  disclaimer:
    'This was a demo. Every company, shipment, regulation and reference number you just saw was fictional. Nothing was submitted or sent.',
};

export const stepIds = steps.map((s) => s.id);
export const firstStepId = steps[0].id;
