import type { GuideScript } from '@/lib/types';

/**
 * Guide script, keyed by step id. Each cue either fires on a timer (`at`, ms
 * after the step mounts) or on an event (`on`). `target` is the data-guide
 * value of the element to spotlight.
 *
 * The first cue of each step carries the guide line from the demo brief; the
 * follow-up cues point at the supporting evidence on screen.
 */
export const guide: GuideScript = {
  consignment: [
    {
      on: 'step:consignment',
      after: 500,
      text: 'As soon as a consignment is logged, Diligence checks it against EUDR scope rules.',
      target: 'consignment-card',
    },
    {
      at: 0,
      text: 'Coffee is an Annex I commodity, so this shipment is in scope the moment it is created.',
      target: 'eudr-status',
      annotation: 'Auto-detected',
    },
    {
      at: 0,
      text: 'No one had to classify it by hand. Scope is derived from the commodity code and origin.',
      target: 'commodity-row',
      annotation: 'Annex I',
    },
  ],

  collect: [
    {
      on: 'step:collect',
      after: 500,
      text: 'Each plot needs geolocation and a deforestation check against the 2020 cutoff.',
      target: 'plot-map',
    },
    {
      at: 0,
      text: 'All forty-two plots returned GPS coordinates — that is the completeness bar EUDR sets.',
      target: 'gps-stat',
      annotation: 'Verified',
    },
    {
      at: 0,
      text: 'Satellite history is compared against the 31 December 2020 cutoff for every plot.',
      target: 'deforestation-check',
      annotation: '2020 cutoff',
    },
  ],

  assess: [
    {
      on: 'step:assess',
      after: 500,
      text: 'Every consignment runs through the same five checks, in the same order, every time.',
      target: 'risk-checklist',
    },
    {
      at: 0,
      text: 'Country risk benchmarking uses the EU country classification, not a guess.',
      target: 'check-4',
      annotation: 'EUDR standard',
    },
    {
      at: 0,
      text: 'The order never changes, so two consignments are always comparable.',
      target: 'risk-summary',
      annotation: 'Standardised',
    },
  ],

  statement: [
    {
      on: 'step:statement',
      after: 500,
      text: 'One click produces the due diligence statement in the format the EU expects.',
      target: 'statement-card',
    },
    {
      at: 0,
      text: 'Every field is filled from evidence already collected — nothing is retyped.',
      target: 'statement-reference',
      annotation: 'Generated',
    },
    {
      at: 0,
      text: 'This is the artefact you submit to TRACES. In this demo the buttons do nothing.',
      target: 'statement-actions',
      annotation: 'Visual only',
    },
  ],
};
