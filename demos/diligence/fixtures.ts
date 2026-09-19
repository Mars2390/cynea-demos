import type { Plot, RiskCheck } from '@/lib/types';

/**
 * ALL DATA HERE IS FICTIONAL and static. No API calls, no backend.
 * Companies, suppliers, plot ids and the reference number are invented for
 * demonstration only.
 */

export const consignment = {
  commodity: 'Coffee (green, unroasted)',
  hsCode: '0901.11',
  origin: 'Nyeri County, Kenya',
  destination: 'Hamburg, Germany',
  weight: '18,000 kg',
  importer: 'Northwind Coffee Traders GmbH',
  eudrStatus: 'In scope — auto-detected',
  loggedAt: '14 Mar 2026 · 09:12 CET',
} as const;

export const collection = {
  plotsSubmitted: 42,
  gpsReceived: 42,
  gpsTotal: 42,
  deforestationCheck: 'Passed — no forest loss after 31 Dec 2020',
  riskClassification: 'Low',
  totalHectares: 128.4,
  cutoff: '31 Dec 2020',
} as const;

/** Fictional supplier co-operatives. */
export const suppliers = [
  { name: 'Mweiga Hill Growers Co-op', plots: 14 },
  { name: 'Kagumo Ridge Farmers', plots: 11 },
  { name: 'Thegu River Smallholders', plots: 9 },
  { name: 'Karatina Valley Collective', plots: 8 },
] as const;

/** Plot pins for the static map panel. x/y are percentages. */
export const plots: Plot[] = [
  { id: 'KE-NY-0114', supplier: 'Mweiga Hill Growers Co-op', hectares: 3.2, x: 18, y: 24, gps: true },
  { id: 'KE-NY-0115', supplier: 'Mweiga Hill Growers Co-op', hectares: 2.8, x: 27, y: 18, gps: true },
  { id: 'KE-NY-0121', supplier: 'Mweiga Hill Growers Co-op', hectares: 4.1, x: 34, y: 31, gps: true },
  { id: 'KE-NY-0128', supplier: 'Kagumo Ridge Farmers', hectares: 2.4, x: 46, y: 22, gps: true },
  { id: 'KE-NY-0133', supplier: 'Kagumo Ridge Farmers', hectares: 3.7, x: 55, y: 34, gps: true },
  { id: 'KE-NY-0140', supplier: 'Kagumo Ridge Farmers', hectares: 3.1, x: 63, y: 26, gps: true },
  { id: 'KE-NY-0147', supplier: 'Thegu River Smallholders', hectares: 2.9, x: 72, y: 38, gps: true },
  { id: 'KE-NY-0152', supplier: 'Thegu River Smallholders', hectares: 3.4, x: 81, y: 30, gps: true },
  { id: 'KE-NY-0158', supplier: 'Karatina Valley Collective', hectares: 2.6, x: 24, y: 52, gps: true },
  { id: 'KE-NY-0163', supplier: 'Karatina Valley Collective', hectares: 3.8, x: 38, y: 62, gps: true },
  { id: 'KE-NY-0169', supplier: 'Karatina Valley Collective', hectares: 3.3, x: 52, y: 58, gps: true },
  { id: 'KE-NY-0174', supplier: 'Thegu River Smallholders', hectares: 2.7, x: 66, y: 66, gps: true },
  { id: 'KE-NY-0180', supplier: 'Mweiga Hill Growers Co-op', hectares: 3.5, x: 77, y: 57, gps: true },
  { id: 'KE-NY-0186', supplier: 'Kagumo Ridge Farmers', hectares: 3.0, x: 87, y: 48, gps: true },
];

/** The five-point assessment. All pass in this demo. */
export const riskChecks: RiskCheck[] = [
  {
    label: 'Geodata completeness',
    status: 'pass',
    result: 'Pass',
    detail: '42 of 42 plots returned valid GPS polygons.',
  },
  {
    label: 'Deforestation-free status',
    status: 'pass',
    result: 'Pass',
    detail: 'No forest loss detected after 31 Dec 2020.',
  },
  {
    label: 'Legality (land tenure, permits)',
    status: 'pass',
    result: 'Pass',
    detail: 'Tenure documents and export permits verified.',
  },
  {
    label: 'Country risk benchmarking',
    status: 'low',
    result: 'Low',
    detail: 'Kenya classified low risk for coffee production.',
  },
  {
    label: 'Supply-chain traceability',
    status: 'pass',
    result: 'Pass',
    detail: 'Unbroken chain of custody from plot to port.',
  },
];

export const statement = {
  reference: 'DDS-2026-0342-NWCT',
  submittedBy: consignment.importer,
  eoriNumber: 'DE 8271 4409 33',
  commodity: consignment.commodity,
  hsCode: consignment.hsCode,
  origin: consignment.origin,
  destination: consignment.destination,
  weight: consignment.weight,
  plotCount: collection.plotsSubmitted,
  totalHectares: collection.totalHectares,
  riskLevel: 'Low',
  verification: 'All five assessment criteria satisfied. Deforestation-free confirmed against the 31 Dec 2020 cutoff.',
  status: 'Ready to submit to TRACES',
  generatedAt: '14 Mar 2026 · 09:16 CET',
} as const;

/** Log lines for the step-2 collection scan. */
export const scanLog = [
  'Requesting plot registry from 4 supplier groups…',
  'Received 42 plot submissions.',
  'Validating GPS polygons… 42/42 valid.',
  'Fetching satellite history (2019–2026)…',
  'Comparing canopy cover against 31 Dec 2020 baseline…',
  'No forest loss detected. Risk classification: Low.',
] as const;
