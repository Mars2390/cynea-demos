/**
 * Fixtures for the Legal suite — one matter, told across five agents.
 *
 * Every company, person, matter, contract and citation here is fictional.
 * Dates run from the enquiry in November 2026 through the obligations that
 * follow execution of the replacement supply agreement in 2027.
 */

/* ---------------------------------------------------------------- INTAKE */

export const enquiry = {
  client: 'Halcyon Industries Ltd',
  contact: 'Priya Desai · General Counsel',
  matterType: 'Commercial dispute — supply agreement breach',
  received: '24 Nov 2026 · 09:12',
  summary:
    'Vantage Materials Ltd has missed three consecutive monthly deliveries under the Master Supply Agreement, citing force majeure. Halcyon has lost two downstream contracts, wants to recover its losses, and is in parallel negotiating replacement supply terms.',
} as const;

export const factChecklist = [
  {
    label: 'Parties identified',
    detail: 'Halcyon Industries Ltd v Vantage Materials Ltd',
  },
  {
    label: 'Key dates captured',
    detail: 'MSA signed 15 Aug 2024 · first missed delivery 04 Aug 2026',
  },
  {
    label: 'Documents requested',
    detail: 'MSA, delivery schedule, correspondence — 3 of 3 received',
  },
  {
    label: 'Fee basis agreed',
    detail: 'Hourly · partner rate · estimate £18–24k to pre-action',
  },
] as const;

export const conflictChecks = [
  {
    scope: 'Existing clients',
    detail: '0 matches across 412 open matters',
  },
  {
    scope: 'Former clients',
    detail: '0 matches across 1,930 closed matters',
  },
  {
    scope: 'Adverse parties',
    detail: 'Vantage Materials Ltd — no prior relationship',
  },
] as const;

export const matterFile = {
  number: 'MAT-2026-0418',
  feeEarner: 'R. Okonkwo · Partner, Commercial Disputes',
  opened: '24 Nov 2026 · 09:41',
  nextAction: 'Initial advice call · 26 Nov 2026, 10:00',
  status: 'Matter opened · ready for fee earner',
} as const;

export const intakeTotals = {
  facts: factChecklist.length,
  checks: conflictChecks.length,
  minutes: 29,
} as const;

/* ------------------------------------------------------------- PRECEDENT */

export const researchQuestion =
  "Is a force majeure clause enforceable where the supplier's failure was foreseeable?";

export const researchSources = [
  { label: 'Legislation', scope: '4 statutes' },
  { label: 'Case law', scope: '1,140 judgments' },
  { label: 'Internal matter history', scope: '38 matters' },
] as const;

export type Authority = {
  id: string;
  source: (typeof researchSources)[number]['label'];
  cite: string;
  holding: string;
  relevance: string;
  /** Set when the authority cuts the other way. */
  flag?: string;
};

export const authorities: readonly Authority[] = [
  {
    id: 'a1',
    source: 'Case law',
    cite: 'Marlow Freight Ltd v Ardent Steel plc [2021] EWHC 1187 (Comm)',
    holding:
      'A party cannot rely on force majeure where the event was reasonably foreseeable at contracting and it made no provision for it.',
    relevance:
      'Directly on point — Vantage knew of the capacity constraint before signing.',
  },
  {
    id: 'a2',
    source: 'Legislation',
    cite: 'Supply Contracts (Relief) Act 1996, s 7',
    holding:
      'Statutory relief for supply failure is unavailable where the contract allocates that risk to the supplier.',
    relevance: 'The MSA allocates supply-chain risk to the supplier at clause 12.',
  },
  {
    id: 'a3',
    source: 'Case law',
    cite: 'Beacon Polymers Ltd v Kestrel Logistics [2019] EWCA Civ 402',
    holding:
      'Force majeure relieved the supplier where a port closure was unforeseeable and outside its control.',
    relevance:
      'The event there was genuinely unforeseeable; the facts here are the opposite.',
    flag: 'Distinguishing case — narrow circumstances',
  },
  {
    id: 'a4',
    source: 'Internal matter history',
    cite: 'MAT-2024-0117 · Orwell Fabrics v Tidewater Supply',
    holding:
      'Settled on terms after the foreseeability argument succeeded at the interim stage.',
    relevance:
      'Same clause wording, same counsel on the other side, two years ago.',
  },
] as const;

export const precedentTotals = {
  authorities: authorities.length,
  status: '4 authorities · all cited · all checkable',
} as const;

/* --------------------------------------------------------------- COUNSEL */

export const contract = {
  title: 'Master Supply Agreement',
  parties: 'Halcyon Industries Ltd / Vantage Materials Ltd',
  version: 'Draft v3 · received from Vantage 08 Dec 2026',
  pages: 42,
  clauses: 61,
} as const;

export type ClauseStatus = 'match' | 'nonstandard' | 'missing';

export type Clause = {
  id: string;
  ref: string;
  name: string;
  /** The other side's wording. */
  contract: string;
  /** Your playbook's position. */
  playbook: string;
  status: ClauseStatus;
  /** One-line reason, for flagged clauses. */
  reason?: string;
  /** What the mark-up does about it. */
  redline?: string;
};

export const clauses: readonly Clause[] = [
  {
    id: 'k1',
    ref: '3.1',
    name: 'Term',
    contract:
      'Initial term of 36 months from the Commencement Date, renewing automatically for successive 12-month periods.',
    playbook: 'Initial term 24–36 months; auto-renewal acceptable with 90-day notice.',
    status: 'match',
  },
  {
    id: 'k2',
    ref: '5.2',
    name: 'Pricing',
    contract: 'Prices fixed for 12 months, then reviewed annually by agreement.',
    playbook: 'Annual review; index-linked cap preferred.',
    status: 'match',
  },
  {
    id: 'k3',
    ref: '9.1',
    name: 'Delivery',
    contract:
      'Supplier shall deliver in accordance with the Delivery Schedule. Time is of the essence.',
    playbook: 'Time of the essence for scheduled volumes.',
    status: 'match',
  },
  {
    id: 'k4',
    ref: '11.1',
    name: 'Warranties',
    contract:
      'Goods shall conform to the Specification and be free from defects for 12 months from delivery.',
    playbook: 'Conformity warranty, minimum 12 months.',
    status: 'match',
  },
  {
    id: 'k5',
    ref: '14.2',
    name: 'Indemnity cap',
    contract:
      "Supplier's aggregate liability under the indemnities shall not exceed £50,000.",
    playbook: 'Cap at £500,000 or uncapped for supply failure.',
    status: 'nonstandard',
    reason: 'Indemnity cap at £50k — playbook requires £500k or uncapped',
    redline: 'Raise the cap to £500,000 and carve supply failure out of it.',
  },
  {
    id: 'k6',
    ref: '17.1',
    name: 'Force majeure',
    contract:
      'Neither party shall be liable for any failure caused by events beyond its reasonable control.',
    playbook:
      'Force majeure must exclude events attributable to supplier fault or foreseeable at signing.',
    status: 'missing',
    reason: 'No force majeure carve-out for supplier fault',
    redline: 'Insert 17.2: carve-out for supplier fault and foreseeable events.',
  },
  {
    id: 'k7',
    ref: '19.3',
    name: 'Termination',
    contract:
      'Either party may terminate on six months’ notice, or immediately for material breach.',
    playbook: 'Termination for material breach; convenience 3–6 months.',
    status: 'match',
  },
  {
    id: 'k8',
    ref: '22.1',
    name: 'Governing law',
    contract: 'This Agreement is governed by the laws of the State of Delaware.',
    playbook: 'English law and the exclusive jurisdiction of the English courts.',
    status: 'nonstandard',
    reason: 'Governing law: Delaware — playbook prefers English law',
    redline: 'Replace with English law and exclusive English jurisdiction.',
  },
] as const;

export const markup = {
  status: 'Draft mark-up ready · 3 redlines · 1 missing clause inserted',
  redlines: 3,
  inserted: 1,
  reviewMinutes: 25,
} as const;

export const counselTotals = {
  clauses: contract.clauses,
  shown: clauses.length,
  matched: 58,
  flagged: 3,
} as const;

/* ---------------------------------------------------------------- REDACT */

export const bundle = {
  name: 'Disclosure bundle',
  matter: 'MAT-2026-0418',
  documents: 47,
  pages: 1284,
  deadline: '14 Feb 2027',
} as const;

/** A sample of the bundle; the per-document counts sum to the category totals. */
export const bundleDocuments = [
  { id: 'DOC-001', name: 'Master Supply Agreement (executed 2024)', pages: 38, redactions: 15 },
  { id: 'DOC-007', name: 'Delivery schedule — 2026 revisions', pages: 12, redactions: 9 },
  { id: 'DOC-012', name: 'Email chain — missed deliveries, Aug–Oct', pages: 64, redactions: 48 },
  { id: 'DOC-019', name: 'Supplier capacity report, March 2026', pages: 27, redactions: 15 },
  { id: 'DOC-023', name: 'Downstream contract — Ferris Retail', pages: 41, redactions: 17 },
  { id: 'DOC-031', name: 'Board minutes, 12 Jan 2027', pages: 9, redactions: 18, review: true },
  { id: 'DOC-038', name: 'Loss schedule and invoices', pages: 118, redactions: 38 },
  { id: 'DOC-047', name: 'Correspondence with insurers', pages: 22, redactions: 13 },
] as const;

export const redactionCategories = [
  {
    id: 'personal',
    label: 'Personal data',
    count: 128,
    examples: 'names, home addresses, bank details',
  },
  {
    id: 'privileged',
    label: 'Privileged content',
    count: 14,
    examples: 'legal advice, litigation strategy',
  },
  {
    id: 'sensitive',
    label: 'Commercially sensitive terms',
    count: 31,
    examples: 'pricing, volumes, margins',
  },
] as const;

export const redactionReview = {
  flag: 'Possible privilege waiver — para 14.2, needs fee earner sign-off',
  document: 'DOC-031 · Board minutes, 12 Jan 2027',
  reason: 'Legal advice quoted in a document circulated to a third party.',
} as const;

export const redactTotals = {
  redactions: 173,
  forReview: 1,
  status: '173 redactions · 1 for review · log attached',
} as const;

/* ---------------------------------------------------------------- DOCKET */

export const executedContract = {
  title: 'Master Supply Agreement',
  parties: 'Halcyon Industries Ltd / Vantage Materials Ltd',
  version: 'Executed v5 · 19 Jan 2027',
} as const;

export type ObligationKind = 'renewal' | 'obligation' | 'court';

export type Obligation = {
  id: string;
  label: string;
  when: string;
  /** The next concrete date, for the timeline. */
  date: string;
  source: string;
  owner: string;
  kind: ObligationKind;
  /** The source sentence Docket extracted it from. */
  extract: string;
  /** The phrase inside `extract` that carries the date. */
  highlight: string;
};

export const obligations: readonly Obligation[] = [
  {
    id: 'o1',
    label: 'Court deadline — disclosure',
    when: 'Disclosure by 14 Feb 2027',
    date: '14 Feb 2027',
    source: 'Order of 21 Jan 2027, para 4',
    owner: 'R. Okonkwo',
    kind: 'court',
    extract: 'Standard disclosure to be given by 4pm on 14 February 2027.',
    highlight: '14 February 2027',
  },
  {
    id: 'o2',
    label: 'Insurance certificate',
    when: 'Renewal 01 Mar 2027',
    date: '01 Mar 2027',
    source: 'MSA cl. 15.3',
    owner: 'A. Mensah',
    kind: 'renewal',
    extract:
      'Supplier shall provide a renewed certificate of insurance on or before 1 March each year.',
    highlight: 'on or before 1 March each year',
  },
  {
    id: 'o3',
    label: 'Quarterly volume report',
    when: 'Due 5th of Jan, Apr, Jul, Oct',
    date: '05 Apr 2027',
    source: 'MSA cl. 9.6',
    owner: 'S. Lindqvist',
    kind: 'obligation',
    extract:
      'Customer shall deliver a volume forecast by the fifth day of each quarter.',
    highlight: 'fifth day of each quarter',
  },
  {
    id: 'o4',
    label: 'Renewal notice due',
    when: '90 days before 15 Aug 2027',
    date: '17 May 2027',
    source: 'MSA cl. 3.2',
    owner: 'R. Okonkwo',
    kind: 'renewal',
    extract:
      'Notice not to renew must be given no later than 90 days before the end of the Initial Term.',
    highlight: 'no later than 90 days before',
  },
  {
    id: 'o5',
    label: 'Price review',
    when: 'Annual, 01 Jan',
    date: '01 Jan 2028',
    source: 'MSA cl. 5.2',
    owner: 'R. Okonkwo',
    kind: 'obligation',
    extract: 'Prices shall be reviewed annually with effect from 1 January.',
    highlight: 'annually with effect from 1 January',
  },
] as const;

export const docketTotals = {
  tracked: obligations.length,
  unassigned: 0,
  status: '5 obligations tracked · 0 unassigned',
} as const;
