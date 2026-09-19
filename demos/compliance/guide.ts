import type { GuideScript } from '@/lib/types';

/**
 * Guide script, keyed by step id.
 *
 * The first cue of each step is the agent's own line — what it does and why it
 * matters — and the cues after it point at the evidence on screen that proves
 * the claim.
 *
 * Diligence is capped at four cues even though it is the longest step: it
 * carries four panels, and a fifth cue turns a walkthrough into a slideshow
 * the viewer cannot keep up with. One cue per panel, in reading order.
 */
export const guide: GuideScript = {
  sentinel: [
    {
      on: 'step:sentinel',
      after: 500,
      text: 'Sentinel watches the regulations that apply to your business and tells you what changed, what it means, and what to do — before a deadline becomes a penalty.',
      target: 'regulation-card',
    },
    {
      at: 0,
      text: 'Scope is matched against what you actually import, so this is not a newsletter — it is your obligation.',
      target: 'applies-because',
      annotation: 'Auto-matched',
    },
    {
      at: 0,
      text: 'Every flagged regulation arrives with dated actions and an owner, not just a summary.',
      target: 'action-list',
      annotation: 'What to do next',
    },
  ],

  screen: [
    {
      on: 'step:screen',
      after: 500,
      text: 'Screen checks every counterparty against sanctions and watchlists, flags anything for human review, and logs the evidence for your audit file.',
      target: 'supplier-card',
    },
    {
      at: 0,
      text: 'Fourteen lists across sanctions, politically exposed persons, adverse media and watchlists — every beneficial owner included.',
      target: 'screen-checklist',
      annotation: 'Four checks',
    },
    {
      at: 0,
      text: 'The result is written to the audit file with its timestamp, so the check can be evidenced later.',
      target: 'screen-result',
      annotation: 'Audit-ready',
    },
  ],

  diligence: [
    {
      on: 'step:diligence',
      after: 500,
      text: 'As soon as a consignment is logged, Diligence checks it against EUDR scope rules.',
      target: 'consignment-card',
    },
    {
      at: 0,
      text: 'Each plot needs geolocation and a deforestation check against the 2020 cutoff.',
      target: 'plot-map',
      annotation: '2020 cutoff',
    },
    {
      at: 0,
      text: 'Every consignment runs through the same five checks, in the same order, every time.',
      target: 'risk-checklist',
      annotation: 'Standardised',
    },
    {
      at: 0,
      text: 'One click produces the due diligence statement in the format the EU expects.',
      target: 'statement-card',
      annotation: 'TRACES-ready',
    },
  ],

  carbon: [
    {
      on: 'step:carbon',
      after: 500,
      text: 'Carbon pulls embedded emissions from your supplier data, maps them to the CBAM methodology, and drafts the quarterly report — with every figure traceable to source.',
      target: 'quarter-card',
    },
    {
      at: 0,
      text: 'Direct and indirect emissions per supplier, per product, per tonne — the three figures the registry asks for.',
      target: 'emissions-table',
      annotation: 'Per supplier',
    },
    {
      at: 0,
      text: 'Each line names where its number came from: a verified declaration, audited installation data, or an Annex III default.',
      target: 'carbon-provenance',
      annotation: 'Traced to source',
    },
  ],

  ledger: [
    {
      on: 'step:ledger',
      after: 500,
      text: 'Ledger gathers environmental and social metrics from across your operations and maps them to GRI, SASB, and TCFD — so disclosure is backed by data, not estimates.',
      target: 'ledger-card',
    },
    {
      at: 0,
      text: 'Every metric lands in at least one framework, and each one names the system it came from.',
      target: 'mapping-table',
      annotation: 'GRI · SASB · TCFD',
    },
  ],

  registrar: [
    {
      on: 'step:registrar',
      after: 500,
      text: 'Registrar records every check, calculation, and submission with a timestamp and the underlying data — so any compliance decision can be evidenced on demand.',
      target: 'audit-request',
    },
    {
      at: 0,
      text: 'Five logged events, one from each agent you just watched work — written when the check ran, not reconstructed afterwards.',
      target: 'audit-timeline',
      annotation: 'The year, in order',
    },
    {
      at: 0,
      text: 'The package is already assembled. The audit is a download, not a project.',
      target: 'evidence-package',
      annotation: 'Ready on demand',
    },
  ],
};
