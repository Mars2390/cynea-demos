import Link from 'next/link';
import { MeshBackground } from '@/components/MeshBackground';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Pill } from '@/components/ui/Pill';
import type { DemoCard } from '@/lib/types';

const demos: DemoCard[] = [
  {
    slug: 'diligence',
    name: 'Diligence',
    role: 'EUDR Due Diligence Agent',
    blurb:
      'Detects EUDR scope, collects plot-level geolocation, runs a five-point risk assessment and produces a TRACES-ready statement.',
    live: true,
  },
  {
    slug: 'scout',
    name: 'Scout',
    role: 'Prospecting Agent',
    blurb: 'Finds and qualifies prospects that match your best customers.',
    live: false,
  },
  {
    slug: 'reconcile',
    name: 'Reconcile',
    role: 'Finance Agent',
    blurb:
      'Matches transactions, flags exceptions and closes the books faster.',
    live: false,
  },
  {
    slug: 'counsel',
    name: 'Counsel',
    role: 'Legal Agent',
    blurb: 'Reviews contracts, surfaces risky clauses and tracks obligations.',
    live: false,
  },
  {
    slug: 'reception',
    name: 'Reception',
    role: 'Front-Desk Agent',
    blurb: 'Answers, qualifies and routes every inbound enquiry.',
    live: false,
  },
  {
    slug: 'keyword',
    name: 'Keyword',
    role: 'SEO Agent',
    blurb: 'Builds keyword strategy and briefs from live search demand.',
    live: false,
  },
  {
    slug: 'social',
    name: 'Social',
    role: 'Social Media Agent',
    blurb: 'Plans, writes and schedules content across every channel.',
    live: false,
  },
  {
    slug: 'marker',
    name: 'Marker',
    role: 'Assessment Agent',
    blurb: 'Marks submissions consistently and explains every grade.',
    live: false,
  },
];

export default function HubPage() {
  return (
    <div className="demo-stage relative min-h-screen">
      <MeshBackground stepId="ready" />
      <ParticleBackground />

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-16 sm:px-5 sm:pt-28">
        <header className="demo-rise max-w-3xl">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
            Cynea AI · guided demos
          </span>
          <h1 className="mt-4 font-display text-[34px] font-semibold leading-[1.05] tracking-display text-foreground xs:text-[40px] sm:text-[52px] lg:text-display">
            Cynea Agent Demos
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-[16px]">
            Guided, click-through demos of every Cynea agent.
          </p>
        </header>

        <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {demos.map((demo, i) => (
            <DemoTile key={demo.slug} demo={demo} delay={80 + i * 70} />
          ))}
        </div>

        <footer className="mt-20 border-t border-border pt-6">
          <p className="max-w-2xl text-[12px] leading-relaxed text-dim">
            Every demo uses fictional data. No live systems are connected and
            nothing you do in a demo is submitted anywhere.
          </p>
        </footer>
      </main>
    </div>
  );
}

function DemoTile({ demo, delay }: { demo: DemoCard; delay: number }) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            className={`font-display text-[21px] font-semibold tracking-[-0.5px] sm:text-[22px] ${
              demo.live ? 'text-foreground' : 'text-muted'
            }`}
          >
            {demo.name}
          </h2>
          <span className="mt-1 block font-mono text-[9px] uppercase tracking-eyebrow text-dim">
            {demo.role}
          </span>
        </div>

        <span className="shrink-0">
          {demo.live ? (
            <Pill tone="accent" dot>
              Live
            </Pill>
          ) : (
            <Pill tone="muted">Coming soon</Pill>
          )}
        </span>
      </div>

      <p
        className={`mt-4 text-[13px] leading-relaxed ${
          demo.live ? 'text-muted' : 'text-dim'
        }`}
      >
        {demo.blurb}
      </p>

      {demo.live && (
        <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-eyebrow text-accent transition-transform duration-300 ease-demo group-hover:translate-x-1">
          Open demo →
        </span>
      )}
    </>
  );

  const shell =
    'group relative block rounded-card border p-5 transition-all duration-300 ease-demo';

  if (!demo.live) {
    return (
      <div
        style={{ animationDelay: `${delay}ms` }}
        className={`demo-rise ${shell} cursor-not-allowed border-border bg-card/40 opacity-60`}
        aria-disabled
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/${demo.slug}`}
      style={{ animationDelay: `${delay}ms` }}
      className={`demo-rise demo-sheen ${shell} border-accent/25 bg-card hover:-translate-y-0.5 hover:border-accent/50 hover:bg-card-hover hover:shadow-glow-accent`}
    >
      <span
        aria-hidden
        className="demo-glow pointer-events-none absolute -inset-4 -z-10 rounded-[26px] bg-accent/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />
      {inner}
    </Link>
  );
}
