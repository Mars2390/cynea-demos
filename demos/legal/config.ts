import type { Step } from '@/lib/types';

export const agent = {
  name: 'Legal',
  role: 'Legal suite · five agents',
  tagline: 'The document work behind the judgement calls.',
};

/**
 * One client matter told across five agents in the order the work actually
 * happens: the enquiry lands, the law is researched, the other side's draft is
 * read against the playbook, disclosure is redacted, and once the contract is
 * executed the obligations start ticking.
 */
export const steps: Step[] = [
  {
    number: 1,
    id: 'intake',
    name: 'Intake',
    role: 'Matter Intake Agent',
    title: 'A new enquiry lands. Intake takes it from first contact to opened matter.',
    why: 'The first hour of a matter shapes the next hundred. Intake makes that hour count.',
    next: 'Research the question →',
  },
  {
    number: 2,
    id: 'precedent',
    name: 'Precedent',
    role: 'Legal Research Agent',
    title: 'The legal question. Precedent finds the authorities.',
    why: 'Confident answers without sources are a liability. Cited answers are advice.',
    next: 'Read the contract →',
  },
  {
    number: 3,
    id: 'counsel',
    name: 'Counsel',
    role: 'Contract Review Agent',
    title: "The other side's draft contract. Counsel reads it against the playbook.",
    why: 'The first read of a contract is where value is won or lost. Counsel does the first read, every time, the same way.',
    next: 'Run the disclosure pass →',
  },
  {
    number: 4,
    id: 'redact',
    name: 'Redact',
    role: 'Document Redaction Agent',
    title: 'Disclosure. 47 documents. Redact runs the pass.',
    why: 'Inconsistent redaction is a professional risk. Redact makes the pass consistent, and leaves a log that proves it.',
    next: 'Track the obligations →',
  },
  {
    number: 5,
    id: 'docket',
    name: 'Docket',
    role: 'Deadline & Obligations Agent',
    title: 'The contract is executed. Now the obligations begin.',
    why: "Missing a date is the most expensive mistake in legal work. Docket makes sure you don't.",
    next: 'Finish →',
  },
];

/** Agent descriptions, verbatim from the brief, shown under each step title. */
export const descriptions: Record<string, string> = {
  intake:
    'Takes new client enquiries, gathers the facts and documents, runs conflict checks, and opens the matter file ready for a fee earner.',
  precedent:
    'Searches legislation, case law, and your own matter history, and returns cited, checkable summaries rather than confident guesses.',
  counsel:
    'Reads contracts against your playbook, flags non-standard clauses and missing protections, and produces a mark-up your lawyer reviews instead of starting from page one.',
  redact:
    'Identifies and redacts personal data, privileged content, and commercially sensitive terms across document sets, consistently, with a log of what was removed and why.',
  docket:
    'Extracts dates, renewals, and obligations from executed contracts and court documents, and makes sure nothing lapses because nobody was watching.',
};

/** Terminal state, reached at /legal/ready. */
export const readyStep = {
  id: 'ready',
  heading: 'This is what legal work looks like on Cynea.',
  sub: 'Five agents. One matter. From enquiry to obligations tracked.',
  bookLabel: 'Book a demo with Irene',
  bookHref: 'mailto:irene@cynea.ai',
  replayLabel: 'Replay the demo',
  trustPills: ['No credit card', '14-day free trial', 'Your own Gmail or Outlook'],
  disclaimer:
    'This was a demo. Every company, matter, contract, and citation you just saw was fictional. Nothing was submitted or sent.',
};

export const stepIds = steps.map((s) => s.id);
export const firstStepId = steps[0].id;
