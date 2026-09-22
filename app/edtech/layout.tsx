import type { Viewport } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import { chalk } from '@/lib/tokens';

/**
 * EdTech's type stack — the second light suite, and the second with its own.
 * Newsreader (a warm, humanist serif) for display, Inter for body and UI,
 * JetBrains Mono inherited from the root layout for eyebrows and data.
 * Loaded here so the fonts ship only with /edtech; globals.css re-points the
 * font utilities under [data-suite='edtech'] to these variables.
 *
 * Newsreader ships its weight axis only. Its optical-size axis more than
 * doubled the file (129 kB → 57 kB latin without it); opsz sits at the
 * default text cut, which reads sturdier at display sizes — welcome here.
 */
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-newsreader',
});

// Same options as the SEO layout, so it resolves to the same file.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/** Ivory ground for the browser chrome; the root layout's is the dark ink. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: chalk.background,
};

export default function EdtechLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${newsreader.variable} ${inter.variable}`}>{children}</div>;
}
