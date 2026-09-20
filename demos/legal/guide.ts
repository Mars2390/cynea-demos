import type { GuideScript } from '@/lib/types';

/**
 * Guide script, keyed by step id. The first cue of each step is the agent's
 * own line, verbatim from the brief; the cues after it point at the evidence
 * on screen.
 */
export const guide: GuideScript = {
  intake: [
    {
      on: 'step:intake',
      after: 500,
      text: 'Intake takes the enquiry, gathers the facts and documents, runs conflict checks, and opens the matter file — so the fee earner starts on the substance, not the admin.',
      target: 'enquiry-card',
    },
    {
      at: 0,
      text: 'Three searches — existing clients, former clients, adverse parties — run before anyone touches the file. All clear.',
      target: 'conflict-check',
      annotation: 'All clear',
    },
    {
      at: 0,
      text: 'Matter number, fee earner, next action. Opened in twenty-nine minutes, ready to work.',
      target: 'matter-file',
      annotation: 'Ready for fee earner',
    },
  ],

  precedent: [
    {
      on: 'step:precedent',
      after: 500,
      text: 'Precedent searches legislation, case law and your own matter history — and returns cited, checkable summaries, not confident guesses.',
      target: 'research-question',
    },
    {
      at: 0,
      text: 'Four authorities, each with its citation, its holding in one sentence, and why it matters here. Every one links to the source.',
      target: 'authorities',
      annotation: '4 authorities',
    },
    {
      at: 0,
      text: 'One cuts the other way. Precedent says so, and says why it is distinguishable — rather than leaving it out.',
      target: 'authority-a3',
      annotation: 'Distinguishing case',
    },
  ],

  counsel: [
    {
      on: 'step:counsel',
      after: 500,
      text: "Counsel reads the contract against your playbook, flags what's non-standard and what's missing, and produces a mark-up your lawyer reviews — instead of starting from page one.",
      target: 'contract-review',
    },
    {
      at: 0,
      text: 'Three clauses need attention: a cap that is ten times too low, a force majeure with no carve-out, and the wrong governing law. Each with the reason.',
      target: 'flagged-items',
      annotation: '3 flagged',
    },
    {
      at: 0,
      text: 'The mark-up is drafted: three redlines, one missing clause inserted. Your lawyer reviews it in twenty-five minutes.',
      target: 'markup',
      annotation: 'Mark-up ready',
    },
  ],

  redact: [
    {
      on: 'step:redact',
      after: 500,
      text: 'Redact identifies personal data, privileged content and sensitive terms across a document set — consistently, with a log of what was removed and why.',
      target: 'bundle',
    },
    {
      at: 0,
      text: 'One hundred and seventy-three redactions across forty-seven documents, in three categories, applied the same way in every document.',
      target: 'redact-categories',
      annotation: '173 redactions',
    },
    {
      at: 0,
      text: 'One item Redact will not decide alone: a possible privilege waiver. It goes to the fee earner with the paragraph and the reason.',
      target: 'redact-review',
      annotation: 'Needs sign-off',
    },
  ],

  docket: [
    {
      on: 'step:docket',
      after: 500,
      text: 'Docket extracts dates, renewals and obligations from executed contracts and court documents — so nothing lapses because nobody was watching.',
      target: 'contract-read',
    },
    {
      at: 0,
      text: 'Five obligations pulled out of the executed contract and the court order, in date order, each with the clause it came from.',
      target: 'timeline',
      annotation: '5 extracted',
    },
    {
      at: 0,
      text: 'Every one has an owner and a calendar entry. Nothing is waiting for someone to remember it.',
      target: 'docket-totals',
      annotation: '0 unassigned',
    },
  ],
};
