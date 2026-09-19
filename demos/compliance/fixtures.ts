/**
 * ALL DATA HERE IS FICTIONAL and static. No API calls, no backend.
 * Companies, regulations, suppliers, figures and reference numbers are
 * invented for demonstration only.
 *
 * Step 3 deliberately imports demos/diligence/fixtures.ts rather than copying
 * it, so the Northwind consignment data stays byte-identical to the original
 * demo and cannot drift.
 */

/* ========================================================================
   STEP 1 — SENTINEL · Regulatory Watch Agent
   ======================================================================== */

export const regulation = {
  name: 'EU Packaging & Packaging Waste Regulation (PPWR)',
  scope: 'Textile imports — secondary packaging',
  reference: 'REG-2025/0911',
  published: '04 Dec 2025',
  effective: '05 Mar 2026',
  daysUntil: 90,
  impact: 'High',
  status: 'Flagged · not yet enforced',
  detectedAt: '05 Dec 2025 · 06:04 CET',
  source: 'Official Journal of the EU, L-series',
} as const;

export const appliesBecause =
  'You import textile goods into Germany in secondary packaging above the 5 kg threshold. That brings recyclability grading, labelling and reporting obligations into scope for every consignment from the effective date.';

export const regulationActions = [
  {
    n: 1,
    label: 'Audit secondary packaging against Annex II recyclability grades',
    due: 'by 31 Jan 2026',
    owner: 'Packaging',
  },
  {
    n: 2,
    label: 'Add PPWR labelling fields to supplier onboarding pack',
    due: 'by 14 Feb 2026',
    owner: 'Procurement',
  },
  {
    n: 3,
    label: 'Register packaging volumes with the German producer registry',
    due: 'by 28 Feb 2026',
    owner: 'Compliance',
  },
] as const;

/* ========================================================================
   STEP 2 — SCREEN · KYC & AML Screening Agent
   ======================================================================== */

export const supplier = {
  name: 'Adriatic Textile Works d.o.o.',
  country: 'Croatia',
  sector: 'Textile manufacturing',
  registration: 'HR-08841236',
  beneficialOwners: 3,
  onboardedAt: '09 Jan 2026 · 11:24 CET',
} as const;

export const screeningChecks = [
  {
    label: 'Sanctions lists',
    detail: 'EU consolidated, OFAC SDN, UK HMT, UN Security Council',
    result: 'No match',
    records: 4,
  },
  {
    label: 'PEP database',
    detail: 'Politically exposed persons, including close associates',
    result: 'No match',
    records: 3,
  },
  {
    label: 'Adverse media',
    detail: 'Financial crime, labour and environmental reporting',
    result: 'No match',
    records: 2,
  },
  {
    label: 'Watchlists',
    detail: 'Export control, debarment and law-enforcement notices',
    result: 'No match',
    records: 5,
  },
] as const;

export const screeningResult = {
  verdict: 'No matches found · cleared for onboarding',
  evidence: 'Evidence logged · audit-ready',
  reference: 'SCR-2026-0842',
  completedAt: '09 Jan 2026 · 11:24 CET',
  durationSeconds: 6,
  entitiesChecked: 4,
  listsChecked: 14,
} as const;

/* ========================================================================
   STEP 4 — CARBON · CBAM Reporting Agent
   ======================================================================== */

export const quarter = {
  label: 'Q3 2026',
  period: '1 Jul – 30 Sep 2026',
  due: '31 Oct 2026',
  status: 'Report drafted · ready for review',
  reference: 'CBAM-Q3-2026-0091',
  declarant: 'Northwind Trading Group GmbH',
  eori: 'DE 8271 4409 33',
} as const;

/**
 * Embedded emissions per supplier and product.
 * `total` is tCO2e per tonne of goods; `emissions` is the product of the two
 * and is what the registry actually receives.
 */
export const emissionLines = [
  {
    supplier: 'Adriatic Steel Rolling d.o.o.',
    product: 'Hot-rolled coil',
    cnCode: '7208',
    tonnes: 412.5,
    direct: 1.82,
    indirect: 0.34,
    total: 2.16,
    emissions: 891.0,
    source: 'Supplier declaration · verified',
  },
  {
    supplier: 'Nordlys Aluminium AS',
    product: 'Aluminium profiles',
    cnCode: '7604',
    tonnes: 88.2,
    direct: 5.91,
    indirect: 0.83,
    total: 6.74,
    emissions: 594.5,
    source: 'Supplier declaration · verified',
  },
  {
    supplier: 'Cementos del Ebro S.A.',
    product: 'Portland cement',
    cnCode: '2523',
    tonnes: 1240.0,
    direct: 0.64,
    indirect: 0.07,
    total: 0.71,
    emissions: 880.4,
    source: 'Installation data · audited',
  },
  {
    supplier: 'Baltic Nitrogen UAB',
    product: 'Nitrogen fertiliser',
    cnCode: '3102',
    tonnes: 305.6,
    direct: 1.71,
    indirect: 0.23,
    total: 1.94,
    emissions: 592.9,
    source: 'Default values · Annex III',
  },
] as const;

export const emissionTotals = {
  lines: emissionLines.length,
  tonnes: 2046.3,
  emissions: 2958.8,
  tracedToSource: 4,
  suppliersReporting: 4,
} as const;

/* ========================================================================
   STEP 5 — LEDGER · ESG Data Agent
   ======================================================================== */

export const esgTotals = {
  year: 'FY 2026',
  gathered: 87,
  mapped: 87,
  missing: 0,
  frameworks: 3,
  compiledAt: '12 Dec 2026 · 08:12 CET',
  status: 'Backed by data, not estimates',
} as const;

/** Category counts sum to the 87 gathered. */
export const esgCategories = [
  { key: 'environmental', label: 'Environmental', count: 38, tone: 'success' },
  { key: 'social', label: 'Social', count: 31, tone: 'secondary' },
  { key: 'governance', label: 'Governance', count: 18, tone: 'accent' },
] as const;

/** A representative slice of the 87; each row lands in at least one framework. */
export const esgMetrics = [
  {
    category: 'Environmental',
    metric: 'Scope 1 emissions',
    value: '4,180 tCO₂e',
    gri: '305-1',
    sasb: 'EM-IS-110a.1',
    tcfd: 'Metrics & Targets',
    source: 'Utility meters · verified',
  },
  {
    category: 'Environmental',
    metric: 'Scope 2 emissions, market-based',
    value: '1,920 tCO₂e',
    gri: '305-2',
    sasb: 'EM-IS-110a.2',
    tcfd: 'Metrics & Targets',
    source: 'Supplier invoices',
  },
  {
    category: 'Environmental',
    metric: 'Water withdrawal',
    value: '62,400 m³',
    gri: '303-3',
    sasb: 'EM-IS-140a.1',
    tcfd: '—',
    source: 'Site meters',
  },
  {
    category: 'Social',
    metric: 'Recordable injury rate',
    value: '0.42 per 200k hrs',
    gri: '403-9',
    sasb: 'EM-IS-320a.1',
    tcfd: '—',
    source: 'Incident register',
  },
  {
    category: 'Social',
    metric: 'Median gender pay gap',
    value: '3.1 %',
    gri: '405-2',
    sasb: '—',
    tcfd: '—',
    source: 'Payroll export',
  },
  {
    category: 'Governance',
    metric: 'Board independence',
    value: '62 %',
    gri: '2-9',
    sasb: '—',
    tcfd: 'Governance',
    source: 'Board register',
  },
  {
    category: 'Governance',
    metric: 'Supplier code coverage',
    value: '94 %',
    gri: '414-1',
    sasb: '—',
    tcfd: 'Risk Management',
    source: 'Procurement system',
  },
] as const;

/* ========================================================================
   STEP 6 — REGISTRAR · Audit Trail Agent
   ======================================================================== */

export const auditRequest = {
  from: 'Falkenberg & Cie Wirtschaftsprüfung',
  ask: 'Provide evidence for EUDR deforestation-free verification, Q3 2026.',
  reference: 'AUD-2026-Q3-118',
  received: '16 Dec 2026 · 10:05 CET',
  respondBy: '06 Jan 2027',
  status: 'Evidence package ready',
  eventsMatched: 5,
  assembledSeconds: 3,
} as const;

/**
 * The year in order — one logged event per agent, each carrying the reference
 * an auditor would follow and the data it was derived from.
 */
export const auditTrail = [
  {
    agent: 'Sentinel',
    event: 'Regulation flagged — EUDR scope confirmed for coffee imports',
    at: '05 Dec 2025 · 06:04 CET',
    reference: 'REG-2025/0911',
    source: 'Official Journal, L-series',
  },
  {
    agent: 'Screen',
    event: 'Counterparty screened — 14 lists, no matches',
    at: '09 Jan 2026 · 11:24 CET',
    reference: 'SCR-2026-0842',
    source: 'Sanctions, PEP and adverse media',
  },
  {
    agent: 'Diligence',
    event: 'Consignment cleared — 42 plots, deforestation-free',
    at: '14 Mar 2026 · 09:16 CET',
    reference: 'DDS-2026-0342-NWCT',
    source: 'Plot geodata and satellite history',
  },
  {
    agent: 'Carbon',
    event: 'CBAM quarterly report submitted',
    at: '28 Oct 2026 · 16:41 CET',
    reference: 'CBAM-Q3-2026-0091',
    source: 'Verified supplier declarations',
  },
  {
    agent: 'Ledger',
    event: 'ESG metrics mapped — 87 of 87 across three frameworks',
    at: '12 Dec 2026 · 08:12 CET',
    reference: 'ESG-FY2026-0004',
    source: 'Operations data warehouse',
  },
] as const;
