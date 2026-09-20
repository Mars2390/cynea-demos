/**
 * Fixtures for the SEO suite — one month at a mid-size DTC site.
 *
 * Every company, keyword, page, position and competitor here is fictional.
 * The month runs through November 2026; the OnPage fixes ship on 03 Nov and
 * the rank movements in Serp are dated against them.
 */

/* --------------------------------------------------------------- KEYWORD */

export const client = {
  name: 'Fernwood & Co',
  sector: 'DTC home goods · UK',
  site: 'fernwood.co.uk',
  market: 'United Kingdom · English',
  brief: 'Linen bedding and bath, direct to consumer. New to organic search.',
} as const;

export type Intent = 'informational' | 'commercial' | 'transactional' | 'navigational';

export type Cluster = {
  id: Intent;
  label: string;
  queries: number;
  difficulty: number;
  /** Relative value 0–100. */
  value: number;
  priority: number;
  high: boolean;
  example: string;
};

/** Query counts sum to 2,847. */
export const clusters: readonly Cluster[] = [
  {
    id: 'transactional',
    label: 'Transactional',
    queries: 486,
    difficulty: 47,
    value: 96,
    priority: 92,
    high: true,
    example: 'buy linen duvet cover',
  },
  {
    id: 'commercial',
    label: 'Commercial',
    queries: 812,
    difficulty: 41,
    value: 84,
    priority: 88,
    high: true,
    example: 'best linen bedding uk',
  },
  {
    id: 'informational',
    label: 'Informational',
    queries: 1204,
    difficulty: 22,
    value: 48,
    priority: 61,
    high: true,
    example: 'how to wash linen bedding',
  },
  {
    id: 'navigational',
    label: 'Navigational',
    queries: 345,
    difficulty: 8,
    value: 30,
    priority: 40,
    high: false,
    example: 'fernwood linen',
  },
] as const;

/** Queries that land in the map, in the order they appear. */
export const sampleQueries: readonly { q: string; intent: Intent; vol: number }[] = [
  { q: 'linen bedding', intent: 'commercial', vol: 8100 },
  { q: 'best linen bedding uk', intent: 'commercial', vol: 5400 },
  { q: 'how to wash linen bedding', intent: 'informational', vol: 2900 },
  { q: 'buy linen duvet cover', intent: 'transactional', vol: 1900 },
  { q: 'linen vs cotton sheets', intent: 'informational', vol: 2400 },
  { q: 'fernwood linen', intent: 'navigational', vol: 720 },
  { q: 'linen duvet cover king', intent: 'transactional', vol: 1600 },
  { q: 'is linen bedding worth it', intent: 'informational', vol: 1300 },
  { q: 'stonewashed linen sheets', intent: 'commercial', vol: 1000 },
  { q: 'linen pillowcases sale', intent: 'transactional', vol: 880 },
  { q: 'oeko-tex linen bedding', intent: 'commercial', vol: 590 },
  { q: 'fernwood discount code', intent: 'navigational', vol: 480 },
];

export const keywordTotals = {
  queries: 2847,
  clusters: clusters.length,
  targets: 12,
  status: '2,847 queries mapped · 4 clusters · 12 priority targets',
} as const;

/* ----------------------------------------------------------------- BRIEF */

export const targetKeyword = {
  keyword: 'best linen bedding uk',
  volume: 5400,
  difficulty: 41,
  intent: 'Commercial-investigational',
  cluster: 'Commercial',
} as const;

export const briefStructure: readonly { level: 'H1' | 'H2' | 'H3'; text: string }[] = [
  { level: 'H1', text: 'The best linen bedding in the UK: a buyer’s guide' },
  { level: 'H2', text: 'What makes linen bedding worth the price' },
  { level: 'H3', text: 'GSM, weave and stonewashing' },
  { level: 'H3', text: 'Thread count is the wrong number' },
  { level: 'H2', text: 'The best linen bedding sets, compared' },
  { level: 'H3', text: 'Best overall' },
  { level: 'H3', text: 'Best value' },
  { level: 'H3', text: 'Best for hot sleepers' },
  { level: 'H2', text: 'How to care for linen bedding' },
  { level: 'H3', text: 'Washing and drying' },
  { level: 'H2', text: 'Certifications: OEKO-TEX and European Flax' },
  { level: 'H2', text: 'FAQs' },
];

export const briefEntities = ['linen', 'thread count', 'OEKO-TEX', 'washing', 'GSM'] as const;

export const briefQuestions = [
  'Is linen bedding worth the money?',
  'What GSM is best for linen sheets?',
  'Does linen bedding get softer?',
  'Can you tumble dry linen sheets?',
  'Is linen or cotton better for hot sleepers?',
  'How long does linen bedding last?',
] as const;

export const briefLinks = [
  { anchor: 'stonewashed linen sheets', to: '/bedding/stonewashed-linen' },
  { anchor: 'linen duvet covers', to: '/bedding/linen-duvet-covers' },
  { anchor: 'how to wash linen', to: '/guides/washing-linen' },
  { anchor: 'linen vs cotton', to: '/guides/linen-vs-cotton' },
] as const;

export const briefMeta = {
  wordTarget: 1800,
  benchmark: 'Top 3 rank 1,600–2,200 words',
  sections: 12,
  faqs: briefQuestions.length,
  links: briefLinks.length,
  status: 'Brief ready · 12 sections · 6 FAQs · 4 internal links',
} as const;

/* ---------------------------------------------------------------- ONPAGE */

export const site = {
  domain: 'fernwood.co.uk',
  pages: 84,
  scanned: 84,
} as const;

export type Fix = {
  id: string;
  title: string;
  count: number;
  effect: string;
  /** Expected impact 0–100, for the bar. */
  impact: number;
  kind: 'ctr' | 'crawl' | 'rich' | 'clarity';
};

export const fixes: readonly Fix[] = [
  {
    id: 'f1',
    title: '12 pages missing meta descriptions',
    count: 12,
    effect: 'est. +3.2% CTR',
    impact: 100,
    kind: 'ctr',
  },
  {
    id: 'f2',
    title: '6 title tags over 60 chars',
    count: 6,
    effect: 'est. +1.8% CTR',
    impact: 62,
    kind: 'ctr',
  },
  {
    id: 'f3',
    title: '31 broken internal links',
    count: 31,
    effect: 'crawl depth',
    impact: 48,
    kind: 'crawl',
  },
  {
    id: 'f4',
    title: 'Product schema missing on 22 pages',
    count: 22,
    effect: 'rich results',
    impact: 40,
    kind: 'rich',
  },
  {
    id: 'f5',
    title: 'H1 duplicated on 4 pages',
    count: 4,
    effect: 'clarity',
    impact: 18,
    kind: 'clarity',
  },
] as const;

export const onpageTotals = {
  audited: 84,
  fixes: 47,
  status: '84 pages audited · 47 fixes · ordered by impact',
} as const;

/** One page, before and after the mark-up. */
export const pagePreview = {
  path: '/bedding/linen-duvet-covers',
  fields: [
    {
      label: 'Title tag',
      before: 'Linen Duvet Covers | Linen Bedding | Fernwood & Co – Free UK Delivery',
      after: 'Linen Duvet Covers – Stonewashed, OEKO-TEX | Fernwood & Co',
      note: '71 → 58 chars',
    },
    {
      label: 'Meta description',
      before: '',
      after:
        'Stonewashed European linen duvet covers in 12 colours. OEKO-TEX certified, gets softer with every wash. Free UK delivery over £80.',
      note: 'missing → 148 chars',
    },
    {
      label: 'H1',
      before: 'Linen',
      after: 'Linen duvet covers',
      note: 'duplicated on 4 pages → unique',
    },
    {
      label: 'Schema',
      before: '—',
      after: 'Product · Offer · AggregateRating',
      note: 'none → rich results eligible',
    },
    {
      label: 'Internal links',
      before: '2 outbound',
      after: '5 outbound',
      note: '+ stonewashed, pillowcases, care guide',
    },
  ],
} as const;

/* --------------------------------------------------------------- CRAWLER */

export const crawl = {
  pages: 84,
  assets: 342,
  started: '01 Nov 2026 · 04:12',
  duration: '6 min 40 s',
} as const;

export type Finding = {
  id: string;
  area: string;
  summary: string;
  detail: string;
  tone: 'pass' | 'warn' | 'fail';
};

export const findings: readonly Finding[] = [
  {
    id: 'c1',
    area: 'Crawlability',
    summary: '2 pages blocked by robots.txt (intentional) · 1 accidentally noindexed',
    detail: '/account and /basket blocked by design; /guides/washing-linen carries a stray noindex.',
    tone: 'warn',
  },
  {
    id: 'c2',
    area: 'Page speed',
    summary: '3 pages over 3 s LCP',
    detail: '/bedding (4.1 s), /bath (3.6 s), /sale (3.4 s) — hero images unoptimised.',
    tone: 'warn',
  },
  {
    id: 'c3',
    area: 'Broken links',
    summary: '31 external 404s',
    detail: 'Top offenders: care-guide blog (14), retired supplier pages (9), old press links (8).',
    tone: 'warn',
  },
  {
    id: 'c4',
    area: 'Index coverage',
    summary: '79 indexed · 3 excluded · 2 errors',
    detail: 'The 3 excluded are product pages — see the critical flag.',
    tone: 'fail',
  },
] as const;

export const criticalFlag = {
  title: 'Product pages excluded from index — canonical pointing to category page',
  pages: ['/bedding/linen-duvet-covers', '/bedding/linen-pillowcases', '/bath/linen-towels'],
  fix: 'Self-referencing canonical on each product page; resubmit in Search Console.',
} as const;

export const crawlTotals = {
  critical: 3,
  warnings: 12,
  status: '84 pages · 342 assets · 3 critical · 12 warnings',
} as const;

/* ------------------------------------------------------------------ SERP */

export type RankRow = {
  keyword: string;
  position: number;
  /** Position 7 days ago and 30 days ago. */
  d7: number;
  d30: number;
  competitor: string;
  competitorPos: number;
  cause?: string;
};

/** 12 priority keywords. Movement = d7 − position (positive = gained). */
export const ranks: readonly RankRow[] = [
  { keyword: 'best linen bedding uk', position: 4, d7: 10, d30: 14, competitor: 'linenhouse.co.uk', competitorPos: 2, cause: 'OnPage fix deployed 03 Nov — meta descriptions' },
  { keyword: 'linen duvet cover king', position: 6, d7: 9, d30: 12, competitor: 'bedfolk.com', competitorPos: 3, cause: 'Product schema added 03 Nov — rich result' },
  { keyword: 'stonewashed linen sheets', position: 7, d7: 8, d30: 8, competitor: 'pigletinbed.com', competitorPos: 1 },
  { keyword: 'linen bedding', position: 9, d7: 9, d30: 11, competitor: 'linenhouse.co.uk', competitorPos: 1 },
  { keyword: 'buy linen duvet cover', position: 5, d7: 7, d30: 9, competitor: 'bedfolk.com', competitorPos: 2, cause: 'Canonical fix 04 Nov — page re-indexed' },
  { keyword: 'linen pillowcases sale', position: 11, d7: 8, d30: 8, competitor: 'pigletinbed.com', competitorPos: 4, cause: 'Competitor updated page 05 Nov' },
  { keyword: 'oeko-tex linen bedding', position: 3, d7: 3, d30: 5, competitor: 'linenhouse.co.uk', competitorPos: 5 },
  { keyword: 'how to wash linen bedding', position: 2, d7: 2, d30: 2, competitor: 'goodhousekeeping.com', competitorPos: 1 },
  { keyword: 'linen vs cotton sheets', position: 8, d7: 8, d30: 9, competitor: 'which.co.uk', competitorPos: 1 },
  { keyword: 'is linen bedding worth it', position: 12, d7: 10, d30: 10, competitor: 'bedfolk.com', competitorPos: 6, cause: 'Lost a featured snippet 06 Nov' },
  { keyword: 'linen bedding set', position: 14, d7: 14, d30: 16, competitor: 'dunelm.com', competitorPos: 1 },
  { keyword: 'fernwood linen', position: 1, d7: 1, d30: 1, competitor: '—', competitorPos: 0 },
] as const;

export const serpTotals = {
  tracked: ranks.length,
  gains: 3,
  losses: 2,
  stable: 7,
  status: '12 tracked · 3 gains · 2 losses · 7 stable',
} as const;

/** 30 days of positions for the top keyword, oldest first (lower is better). */
export const rankHistory = {
  keyword: 'best linen bedding uk',
  competitor: 'linenhouse.co.uk',
  from: '08 Oct 2026',
  to: '06 Nov 2026',
  you: [14, 14, 13, 13, 14, 13, 12, 12, 12, 11, 11, 11, 12, 11, 11, 10, 10, 10, 10, 11, 10, 10, 10, 9, 8, 7, 6, 5, 4, 4],
  them: [3, 3, 3, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  /** Index of the day the OnPage fix deployed. */
  fixDay: 26,
} as const;
