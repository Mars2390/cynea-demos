# cynea-demos

Guided, click-through product demos for Cynea agents. One demo per agent, each
at its own URL. Fully static — no backend, no database, no auth, no API routes,
no environment variables.

Live demo: **[/diligence](/diligence)** — Diligence, the EUDR Due Diligence agent.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v3
- `next/font`: Syne (display), DM Sans (body), JetBrains Mono (mono/eyebrows)
- Hand-written CSS keyframes — no animation libraries
- One `<canvas>` for the drifting particle background
- Step state lives in the URL **path** (`/diligence/assess`). Every step is
  prerendered at build time, so a deep link is served as correct static HTML
  with no switch-on-hydration

No runtime dependencies beyond `next`, `react` and `react-dom`.

## Run locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Layout

```
app/
  layout.tsx            fonts + dark theme
  globals.css           design tokens + every keyframe
  page.tsx              hub page listing all agent demos
  diligence/
    page.tsx            /diligence — opens on step 1 (server, metadata)
    [step]/page.tsx     /diligence/<step> — generateStaticParams, 5 static pages
    DiligenceDemo.tsx   demo state machine: URL, autoplay, guide, ready screen
    steps.tsx           the four step views
components/
  DemoShell.tsx         demo-mode strip, header, step bar, stepper
  GuideBubble.tsx       typewriter guide + travelling spotlight + annotation
  Stepper.tsx           segmented progress bar
  StepFooter.tsx        "Why this matters" + advance button
  ParticleBackground.tsx
  ui/                   Button, Card, Pill, AnnotationChip
lib/
  tokens.ts             colours, fonts, radii
  timing.ts             every demo timing constant
  types.ts              Step, GuideCue, fixture types
demos/
  diligence/
    config.ts           step definitions
    guide.ts            guide script
    fixtures.ts         all static data
```

## Adding a new agent demo

1. `demos/<agent>/config.ts` — steps as `{ number, id, name, title, why, next }`.
2. `demos/<agent>/guide.ts` — guide cues keyed by step id.
3. `demos/<agent>/fixtures.ts` — all static data. Keep it fictional.
4. `app/<agent>/page.tsx`, `app/<agent>/[step]/page.tsx` and a client
   component, following `app/diligence/`.
5. Add a card to the `demos` array in `app/page.tsx`.

The shell, stepper, guide bubble and footer are agent-agnostic — they read the
step config, so a demo with six steps needs no component changes.

### How the guide works

- Cues reveal **word by word** (`.demo-word`), staggered by
  `timing.guideTypewriterMs`.
- The spotlight is a **single element** that transitions its box between
  targets, which is what produces the gliding effect. Mark a target with
  `data-guide="some-id"` and reference that id as a cue's `target`.
- A cue fires either on a timer (`at`, ms after the step mounts) or on an event
  (`on: "step:collect"`), optionally offset by `after`.

## Design tokens

Dark theme only. Defined once in `app/globals.css` and surfaced to Tailwind via
`tailwind.config.ts`.

| Token          | Value     |
| -------------- | --------- |
| `--background` | `#050505` |
| `--foreground` | `#f5f5f5` |
| `--card`       | `#0e0e0e` |
| `--border`     | `#1e1e1e` |
| `--muted`      | `#8a8a8a` |
| `--accent`     | `#00d4ff` |
| `--success`    | `#10b981` |

## Data

All demo data is fictional and hard-coded in `demos/*/fixtures.ts`. Companies,
suppliers, plot identifiers and reference numbers are invented. Nothing is ever
submitted anywhere, and the submit/download buttons are deliberately inert.
