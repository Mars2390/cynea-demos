import type { Step } from '@/lib/types';

export const agent = {
  name: 'Finance',
  role: 'Finance suite · six agents',
  tagline: 'The numbers, handled, from bookkeeping to board pack.',
};

/**
 * One financial month at a mid-size company, told across six agents in story
 * order rather than department order: invoices arrive, the books reconcile,
 * expenses are checked, something odd surfaces, cash is projected, and the
 * board pack drafts itself from the result.
 */
export const steps: Step[] = [
  {
    number: 1,
    id: 'capture',
    name: 'Capture',
    role: 'Invoice Processing Agent',
    title: 'Invoices arrive. Capture reads them, validates them, codes them.',
    why: 'Every hour spent re-keying invoices is an hour not spent closing the month. Capture turns manual entry into review.',
    next: 'Reconcile the books →',
  },
  {
    number: 2,
    id: 'reconcile',
    name: 'Reconcile',
    role: 'Bookkeeping Agent',
    title: 'Bank feed + invoices + ledger. Reconcile matches them.',
    why: 'Month-end chaos is almost always a reconciliation problem. Close the loop continuously and the close becomes a formality.',
    next: 'Check the expenses →',
  },
  {
    number: 3,
    id: 'examine',
    name: 'Examine',
    role: 'Expense Audit Agent',
    title: 'Expense claims from the team. Examine checks them against policy.',
    why: 'Expense review is high-volume, low-judgment work — until something actually unusual appears. Examine removes the noise so the real exceptions get attention.',
    next: 'Watch the stream →',
  },
  {
    number: 4,
    id: 'anomaly',
    name: 'Anomaly',
    role: 'Anomaly Detection Agent',
    title: "Somewhere in the transaction stream, something doesn't fit.",
    why: "Fraud and error don't announce themselves. They look like normal transactions until the pattern emerges — by which point it's usually too late.",
    next: 'Project the cash →',
  },
  {
    number: 5,
    id: 'forecast',
    name: 'Forecast',
    role: 'Cash Flow Agent',
    title: '90 days ahead. Where does cash land?',
    why: "Most businesses don't fail because they're unprofitable. They fail because they run out of cash at the wrong moment. Forecast gives you the warning early enough to act.",
    next: 'Draft the board pack →',
  },
  {
    number: 6,
    id: 'reporter',
    name: 'Reporter',
    role: 'Financial Reporting Agent',
    title: 'Board pack, due Friday. Reporter drafts it from live data.',
    why: "The board pack shouldn't be built from scratch every month. Reporter drafts it, you review it, the board sees it.",
    next: 'Finish →',
  },
];

/** Agent descriptions, shown as the role line under each step title. */
export const descriptions: Record<string, string> = {
  capture:
    'Reads incoming invoices, extracts and validates the data, codes them to the right accounts, and queues them for approval, no re-keying.',
  reconcile:
    'Matches transactions across bank feeds, invoices, and your ledger, flags the exceptions, and leaves your books close-ready instead of month-end chaos.',
  examine:
    'Reviews expense claims against policy, catches duplicates and outliers, and escalates only what genuinely needs a human decision.',
  anomaly:
    'Watches transaction streams for patterns that do not fit, unusual amounts, timings, counterparties, and raises them while they are still small.',
  forecast:
    'Projects cash position from receivables, payables, and historical patterns, and warns you about the crunch weeks before you hit them.',
  reporter:
    'Drafts management accounts, variance commentary, and board pack numbers from your live data, so reporting day is a review, not a rebuild.',
};

/** Terminal state, reached at /finance/ready. */
export const readyStep = {
  id: 'ready',
  heading: 'This is what finance looks like on Cynea.',
  sub: 'Six agents. One workflow. From invoice to board pack.',
  bookLabel: 'Book a demo with Irene',
  bookHref: 'mailto:irene@cynea.ai',
  replayLabel: 'Replay the demo',
  trustPills: ['No credit card', '14-day free trial', 'Your own Gmail or Outlook'],
  disclaimer:
    'This was a demo. Every company, invoice, transaction and figure you just saw was fictional. Nothing was submitted or sent.',
};

export const stepIds = steps.map((s) => s.id);
export const firstStepId = steps[0].id;
