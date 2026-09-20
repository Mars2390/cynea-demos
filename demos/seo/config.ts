import type { Step } from '@/lib/types';

export const agent = {
  name: 'SEO',
  role: 'SEO suite · five agents',
  tagline: 'Rankings built on process, not luck.',
};

/**
 * One SEO month at a mid-size site, told across five agents in the order the
 * work happens: the query map, the brief, the on-page fixes, the technical
 * crawl, and finally the rank movement those changes caused.
 */
export const steps: Step[] = [
  {
    number: 1,
    id: 'keyword',
    name: 'Keyword',
    role: 'Keyword Research Agent',
    title: 'New client. New market. Keyword maps the queries that matter.',
    why: "Keyword research done badly is a list. Done well, it's a plan. Keyword gives you the plan.",
    next: 'Write the brief →',
  },
  {
    number: 2,
    id: 'brief',
    name: 'Brief',
    role: 'Content Brief Agent',
    title: 'One keyword. One brief. The writer starts aimed.',
    why: 'A good brief saves the writer an hour and the editor three. Brief makes both happen every time.',
    next: 'Audit the pages →',
  },
  {
    number: 3,
    id: 'onpage',
    name: 'OnPage',
    role: 'On-Page Optimisation Agent',
    title: "The site, page by page. OnPage finds what's holding it back.",
    why: 'On-page issues compound. Fix the highest-impact ones first and the rest get easier.',
    next: 'Run the crawl →',
  },
  {
    number: 4,
    id: 'crawler',
    name: 'Crawler',
    role: 'Technical SEO Agent',
    title: 'What the crawler sees vs what it should see.',
    why: "Technical SEO is invisible until it isn't. Crawler keeps it visible.",
    next: 'See what moved →',
  },
  {
    number: 5,
    id: 'serp',
    name: 'Serp',
    role: 'Rank Tracking Agent',
    title: 'The result. What moved, and why.',
    why: 'Rank tracking without attribution is trivia. Serp connects movement to cause.',
    next: 'Finish →',
  },
];

/** Agent descriptions, verbatim from the brief, shown under each step title. */
export const descriptions: Record<string, string> = {
  keyword:
    'Maps the queries your buyers actually search, clusters them by intent, and prioritises by difficulty and value, a content plan grounded in data.',
  brief:
    'Turns a target keyword into a full editorial brief, search intent, structure, entities to cover, questions to answer, so writers start aimed, not blank.',
  onpage:
    'Audits titles, headings, internal links, and schema across your site, and produces the fix list ordered by expected impact.',
  crawler:
    'Monitors crawlability, page speed, broken links, and index coverage, and flags technical decay before it costs you rankings.',
  serp:
    "Tracks your positions and your competitors' daily, spots gains and losses early, and connects movements to the changes that caused them.",
};

/** Terminal state, reached at /seo/ready. */
export const readyStep = {
  id: 'ready',
  heading: 'This is what SEO looks like on Cynea.',
  sub: 'Five agents. One month. From query map to rank movement.',
  bookLabel: 'Book a demo with Irene',
  bookHref: 'mailto:irene@cynea.ai',
  replayLabel: 'Replay the demo',
  trustPills: ['No credit card', '14-day free trial', 'Your own Gmail or Outlook'],
  disclaimer:
    'This was a demo. Every company, keyword, page, and ranking you just saw was fictional. Nothing was submitted or sent.',
};

export const stepIds = steps.map((s) => s.id);
export const firstStepId = steps[0].id;
