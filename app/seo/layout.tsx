import type { Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { paper } from '@/lib/tokens';

/**
 * SEO's type stack — the first suite with its own. Fraunces (editorial
 * variable serif with optical sizing) for display, Inter for body and UI,
 * JetBrains Mono inherited from the root layout for eyebrows and data.
 * Loaded here so the fonts ship only with /seo; globals.css re-points the
 * font utilities under [data-suite='seo'] to these variables.
 */
// Variable weight + optical size only. The SOFT axis alone doubled the file
// (118 kB → 66 kB latin without it); next/font cannot pin a weight while
// keeping an axis, so the weight stays variable and CSS picks 500.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-fraunces',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/** Paper ground for the browser chrome; the root layout's is the dark ink. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: paper.background,
};

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${fraunces.variable} ${inter.variable}`}>{children}</div>;
}
