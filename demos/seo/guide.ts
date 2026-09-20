import type { GuideScript } from '@/lib/types';

/**
 * Guide script, keyed by step id. The first cue of each step is the agent's
 * own line, verbatim from the brief; the cues after it point at the evidence
 * on screen. Each cue is narrated and held until the line has been said.
 */
export const guide: GuideScript = {
  keyword: [
    {
      on: 'step:keyword',
      after: 500,
      text: 'Keyword maps the queries your buyers actually search, clusters them by intent, and prioritises by difficulty and value — a content plan grounded in data.',
      target: 'query-map',
    },
    {
      at: 0,
      text: 'Two thousand eight hundred and forty-seven queries, sorted into four intents. The three that lead to a purchase are marked high priority.',
      target: 'clusters',
      annotation: '4 clusters',
    },
    {
      at: 0,
      text: 'Twelve priority targets fall out of that — the plan for the month, not a spreadsheet to sift.',
      target: 'keyword-totals',
      annotation: '12 targets',
    },
  ],

  brief: [
    {
      on: 'step:brief',
      after: 500,
      text: 'Brief turns a target keyword into a full editorial brief — search intent, structure, entities to cover, questions to answer — so writers start aimed, not blank.',
      target: 'target-keyword',
    },
    {
      at: 0,
      text: 'The structure comes from what already ranks: twelve sections, six questions people actually ask, four internal links to place.',
      target: 'brief-body',
      annotation: '12 sections',
    },
    {
      at: 0,
      text: 'Eighteen hundred words, benchmarked against the top three. The writer opens this, not a blank page.',
      target: 'brief-ready',
      annotation: 'Brief ready',
    },
  ],

  onpage: [
    {
      on: 'step:onpage',
      after: 500,
      text: 'OnPage audits titles, headings, internal links and schema across your site, and produces the fix list ordered by expected impact.',
      target: 'site-panel',
    },
    {
      at: 0,
      text: 'Forty-seven fixes, ordered by what each one is expected to return — the missing meta descriptions come first because they move click-through most.',
      target: 'fix-list',
      annotation: 'By impact',
    },
    {
      at: 0,
      text: 'One page, before and after. Flip the toggle and the mark-up is already written.',
      target: 'page-preview',
      annotation: 'Before / after',
    },
  ],

  crawler: [
    {
      on: 'step:crawler',
      after: 500,
      text: 'Crawler monitors crawlability, page speed, broken links and index coverage — and flags technical decay before it costs you rankings.',
      target: 'crawl-panel',
    },
    {
      at: 0,
      text: 'Eighty-four pages and three hundred and forty-two assets, checked the way a search engine checks them.',
      target: 'findings',
      annotation: '4 checks',
    },
    {
      at: 0,
      text: 'The one that matters: product pages dropping out of the index because their canonical points at the category. Found before it showed up in revenue.',
      target: 'critical-flag',
      annotation: 'Critical',
    },
  ],

  serp: [
    {
      on: 'step:serp',
      after: 500,
      text: "Serp tracks your positions and your competitors' daily, spots gains and losses early, and connects movements to the changes that caused them.",
      target: 'rank-table',
    },
    {
      at: 0,
      text: 'Three gains, two losses, seven stable — and under each movement, the change that caused it. The meta description fix from OnPage is here as a plus six.',
      target: 'rank-movements',
      annotation: 'Connected to cause',
    },
    {
      at: 0,
      text: 'Thirty days for the top keyword, against the closest competitor. Hover the line to read any day.',
      target: 'rank-chart',
      annotation: '30 days',
    },
  ],
};
