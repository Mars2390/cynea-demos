import type { GuideScript } from '@/lib/types';

/**
 * Guide script, keyed by step id. The first cue of each step is the agent's
 * own line; the cues after it point at the evidence on screen.
 */
export const guide: GuideScript = {
  capture: [
    {
      on: 'step:capture',
      after: 500,
      text: 'Capture reads each invoice, validates the data, codes it to the right account, and queues it for approval. Duplicates are caught before they hit the ledger.',
      target: 'invoice-inv-1',
    },
    {
      at: 0,
      text: 'Five fields extracted from the PDF and coded to an account and cost centre — nothing typed by hand.',
      target: 'invoice-inv-2',
      annotation: 'No re-keying',
    },
    {
      at: 0,
      text: 'This one already exists in the ledger from 14 November. It is held for review, not booked twice.',
      target: 'invoice-inv-3',
      annotation: 'Duplicate caught',
    },
  ],

  reconcile: [
    {
      on: 'step:reconcile',
      after: 500,
      text: "Reconcile matches everything that should match, flags only what genuinely doesn't, and gives each exception a next action.",
      target: 'match-columns',
    },
    {
      at: 0,
      text: 'Bank line, invoice and ledger entry snap together. Two hundred and fourteen did this month without anyone looking.',
      target: 'reconcile-totals',
      annotation: '214 matched',
    },
    {
      at: 0,
      text: 'Three did not. Each one arrives with a diagnosis and a suggested action, not just a red flag.',
      target: 'exceptions',
      annotation: 'Next action attached',
    },
  ],

  examine: [
    {
      on: 'step:examine',
      after: 500,
      text: 'Examine checks every claim against policy, catches duplicates and outliers, and only escalates what genuinely needs a human to decide.',
      target: 'claims-list',
    },
    {
      at: 0,
      text: 'Same meal, two days apart. Rejected automatically, with the reason written on the claim.',
      target: 'claim-c3',
      annotation: 'Duplicate',
    },
    {
      at: 0,
      text: 'Over the £250 threshold — so this is the one that actually reaches a manager.',
      target: 'claim-c4',
      annotation: 'Needs a human',
    },
  ],

  anomaly: [
    {
      on: 'step:anomaly',
      after: 500,
      text: "Anomaly watches every transaction against your own history, flags patterns that don't fit, and raises them while they're still small.",
      target: 'stream',
    },
    {
      at: 0,
      text: 'Three payments to a supplier that did not exist last month, inside 48 hours. Individually ordinary. Together, a pattern.',
      target: 'anomaly-card',
      annotation: 'Pattern, not amount',
    },
    {
      at: 0,
      text: 'Judged against six months of your own transactions — not a generic rule.',
      target: 'anomaly-context',
      annotation: 'Your baseline',
    },
  ],

  forecast: [
    {
      on: 'step:forecast',
      after: 500,
      text: 'Forecast projects your cash position from receivables, payables and history — and warns you about the crunch weeks before you hit them.',
      target: 'cash-chart',
    },
    {
      at: 0,
      text: 'Week seven dips to £12,400 — under the £25,000 buffer. You are hearing about it seven weeks early.',
      target: 'crunch-marker',
      annotation: 'Crunch week',
    },
    {
      at: 0,
      text: 'Three ways out, ranked. The first one clears it on its own.',
      target: 'forecast-actions',
      annotation: 'Ranked options',
    },
  ],

  reporter: [
    {
      on: 'step:reporter',
      after: 500,
      text: 'Reporter drafts management accounts, variance commentary, and board pack numbers straight from live data — so reporting day is a review, not a rebuild.',
      target: 'management-accounts',
    },
    {
      at: 0,
      text: 'Every variance comes with a sentence a director can read — not just a number in red.',
      target: 'commentary',
      annotation: 'Plain English',
    },
    {
      at: 0,
      text: 'Fourteen pages, drafted from the same numbers the other five agents produced. Thirty minutes to review.',
      target: 'board-pack',
      annotation: 'Draft v1',
    },
  ],
};
