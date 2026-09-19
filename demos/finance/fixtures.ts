/**
 * ALL DATA HERE IS FICTIONAL and static. No API calls, no backend.
 * Companies, people, invoices, transactions and figures are invented for
 * demonstration only. One financial month — November 2026 — at a mid-size
 * company, told across six agents.
 */

/* ========================================================================
   STEP 1 — CAPTURE · Invoice Processing Agent
   ======================================================================== */

export type InvoiceStatus = 'coded' | 'flagged';

export const invoices = [
  {
    id: 'inv-1',
    vendor: 'Halden Packaging Ltd',
    number: 'HP-2026-3311',
    date: '17 Nov 2026',
    net: 4860.0,
    vat: 972.0,
    total: 5832.0,
    po: 'PO-8817',
    account: '5100 · Packaging',
    costCentre: 'OPS-02',
    status: 'coded' as InvoiceStatus,
    note: 'Queued for approval',
  },
  {
    id: 'inv-2',
    vendor: 'Nordic Freight Partners AS',
    number: 'NFP-77120',
    date: '18 Nov 2026',
    net: 2140.0,
    vat: 428.0,
    total: 2568.0,
    po: 'PO-8823',
    account: '5300 · Logistics',
    costCentre: 'OPS-01',
    status: 'coded' as InvoiceStatus,
    note: 'Queued for approval',
  },
  {
    id: 'inv-3',
    vendor: 'Brightline Media Group',
    number: 'BMG-0492',
    date: '19 Nov 2026',
    net: 1250.0,
    vat: 250.0,
    total: 1500.0,
    po: 'PO-8790',
    account: '6200 · Marketing',
    costCentre: 'MKT-01',
    status: 'flagged' as InvoiceStatus,
    note: 'Duplicate detected — invoice already recorded 14 Nov',
  },
] as const;

/** The fields Capture extracts from each PDF, in the order they tick in. */
export const extractedFields = [
  'Vendor',
  'Amount',
  'VAT line',
  'Account code',
  'Cost centre',
] as const;

export const captureTotals = {
  coded: 2,
  flagged: 1,
  rekeyed: 0,
  status: '2 coded · 1 flagged · 0 re-keyed',
} as const;

/* ========================================================================
   STEP 2 — RECONCILE · Bookkeeping Agent
   ======================================================================== */

export const matchedRows = [
  { bank: 'HALDEN PACKAGING', invoice: 'HP-2026-3311', ledger: '5100 Packaging', amount: 5832.0, date: '18 Nov' },
  { bank: 'NORDIC FREIGHT', invoice: 'NFP-77120', ledger: '5300 Logistics', amount: 2568.0, date: '19 Nov' },
  { bank: 'PAYROLL NOV', invoice: 'PAY-2026-11', ledger: '7000 Salaries', amount: 48210.0, date: '25 Nov' },
  { bank: 'HMRC VAT', invoice: 'VAT-Q3', ledger: '2200 VAT control', amount: 12940.0, date: '07 Nov' },
  { bank: 'CLOUDLINE', invoice: 'CL-118820', ledger: '6400 Software', amount: 1188.0, date: '01 Nov' },
  { bank: 'ARDEN ESTATES', invoice: 'AE-LEASE-11', ledger: '6100 Premises', amount: 6500.0, date: '01 Nov' },
] as const;

export const exceptions = [
  {
    kind: 'Timing difference',
    detail: 'Bank £3,200.00 on 28 Nov; invoice dated 30 Nov.',
    action: 'Match to pending invoice',
  },
  {
    kind: 'FX variance £42',
    detail: 'Invoice €5,000.00 at 0.8516 = £4,258.00; bank shows £4,300.00.',
    action: 'Adjust FX variance',
  },
  {
    kind: 'No matching invoice',
    detail: 'Bank £890.00 to Meridian Tools; nothing on file.',
    action: 'Request supplier copy',
  },
] as const;

export const reconcileTotals = {
  matched: 214,
  exceptions: 3,
  status: '214 matched · 3 exceptions · close-ready',
} as const;

/* ========================================================================
   STEP 3 — EXAMINE · Expense Audit Agent
   ======================================================================== */

export type ClaimOutcome = 'approved' | 'rejected' | 'escalated';

export const claims = [
  {
    id: 'c1',
    who: 'Priya Natarajan',
    date: '12 Nov',
    amount: 68.4,
    category: 'Travel · rail',
    outcome: 'approved' as ClaimOutcome,
    note: null,
  },
  {
    id: 'c2',
    who: 'Tomasz Wierzbicki',
    date: '09 Nov',
    amount: 42.0,
    category: 'Meals',
    outcome: 'approved' as ClaimOutcome,
    note: null,
  },
  {
    id: 'c3',
    who: 'Aisha Bello',
    date: '06 Nov',
    amount: 58.5,
    category: 'Meals',
    outcome: 'rejected' as ClaimOutcome,
    note: 'Duplicate — same meal submitted 04 Nov',
  },
  {
    id: 'c4',
    who: 'Daniel Okafor',
    date: '14 Nov',
    amount: 340.0,
    category: 'Client entertainment',
    outcome: 'escalated' as ClaimOutcome,
    note: '£340 client dinner — over £250 threshold, needs manager approval',
  },
  {
    id: 'c5',
    who: 'Léa Fontaine',
    date: '11 Nov',
    amount: 124.9,
    category: 'Software',
    outcome: 'approved' as ClaimOutcome,
    note: null,
  },
] as const;

export const policyChecks = [
  'Within limit',
  'Receipt attached',
  'Category allowed',
] as const;

export const examineTotals = {
  approved: 3,
  rejected: 1,
  escalated: 1,
  status: '3 approved · 1 rejected · 1 escalated',
} as const;

/* ========================================================================
   STEP 4 — ANOMALY · Anomaly Detection Agent
   ======================================================================== */

export const transactions = [
  { who: 'Payroll run · November', amount: -48210.0, kind: 'Payroll', flag: false },
  { who: 'Halden Packaging Ltd', amount: -5832.0, kind: 'Supplier', flag: false },
  { who: 'Customer refund #4471', amount: -129.0, kind: 'Refund', flag: false },
  { who: 'Stripe payout', amount: 22480.15, kind: 'Receipt', flag: false },
  { who: 'Vantage Procurement Ltd', amount: -6200.0, kind: 'Supplier · new', flag: true },
  { who: 'Cloudline SaaS', amount: -1188.0, kind: 'Supplier', flag: false },
  { who: 'Vantage Procurement Ltd', amount: -6100.0, kind: 'Supplier · new', flag: true },
  { who: 'Transfer to savings', amount: -15000.0, kind: 'Transfer', flag: false },
  { who: 'Ashworth & Co', amount: 8750.0, kind: 'Receipt', flag: false },
  { who: 'Vantage Procurement Ltd', amount: -6100.0, kind: 'Supplier · new', flag: true },
] as const;

export const anomaly = {
  headline: 'Unusual pattern — 3 payments to new supplier within 48h, total £18,400',
  supplier: 'Vantage Procurement Ltd',
  window: '48 hours',
  total: 18400.0,
  payments: 3,
  context: 'Compared to your last 6 months: 0 similar patterns',
  firstSeen: '21 Nov 2026 · 09:14',
} as const;

export const anomalyTotals = {
  watched: 1247,
  raised: 1,
  missed: 0,
  status: '1,247 watched · 1 raised · 0 missed',
} as const;

/* ========================================================================
   STEP 5 — FORECAST · Cash Flow Agent
   ======================================================================== */

/** Projected closing balance per week, £k. Week 0 is today. */
export const cashCurve = [68, 74, 61, 55, 49, 38, 22, 12.4, 31, 45, 52, 58, 64] as const;

export const forecast = {
  horizonDays: 90,
  bufferK: 25,
  crunchWeek: 7,
  crunchBalance: 12400,
  crunchLabel: 'Week 7 — projected balance £12,400, below £25,000 buffer',
  status: '90 days projected · 1 crunch flagged',
  asOf: '24 Nov 2026',
} as const;

export const forecastActions = [
  { label: 'Chase 2 overdue invoices', amount: '£34,200', effect: 'Clears the crunch on its own' },
  { label: 'Delay 1 payment to 15 Dec', amount: '£8,900', effect: 'Adds a week of headroom' },
  { label: 'Short-term facility if needed', amount: null, effect: 'Last resort, pre-approved' },
] as const;

/* ========================================================================
   STEP 6 — REPORTER · Financial Reporting Agent
   ======================================================================== */

export const boardPack = {
  title: 'Board Pack — November 2026 · Draft v1',
  period: 'November 2026',
  pages: 14,
  reviewMinutes: 30,
  status: 'Draft ready · 14 pages · review in ~30 min',
  draftedAt: '01 Dec 2026 · 07:40',
} as const;

/** Management accounts, £k. Variance is actual minus budget. */
export const pnl = [
  { line: 'Revenue', actual: 412, budget: 370, variance: 42, unit: 'k' },
  { line: 'Cost of sales', actual: 248, budget: 218, variance: 30, unit: 'k' },
  { line: 'Gross margin', actual: 39.8, budget: 41.0, variance: -1.2, unit: '%' },
  { line: 'Operating expenses', actual: 118, budget: 119, variance: -1, unit: 'k' },
  { line: 'EBITDA', actual: 46, budget: 33, variance: 13, unit: 'k' },
] as const;

export const balanceSheet = [
  { line: 'Cash', value: 68 },
  { line: 'Receivables', value: 142 },
  { line: 'Payables', value: 96 },
  { line: 'Net assets', value: 486 },
] as const;

export const cashFlow = [
  { line: 'Operating', value: 31 },
  { line: 'Investing', value: -12 },
  { line: 'Financing', value: -8 },
  { line: 'Net movement', value: 11 },
] as const;

export const commentary = [
  'Revenue +£42k vs budget, driven by two new contracts.',
  'Gross margin −1.2% — supplier cost increase on packaging.',
  'Opex in line; marketing spend deferred to December.',
  'Cash +£11k; receivables up £28k on the new contracts.',
] as const;
