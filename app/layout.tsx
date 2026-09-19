import type { Metadata, Viewport } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { colors } from '@/lib/tokens';
import { LOOK_BOOT_SCRIPT, LookSwitch } from '@/components/LookSwitch';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Cynea Agent Demos',
  description: 'Guided, click-through demos of every Cynea agent.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  // Browser chrome reads this before CSS loads, so it must be a literal
  // value — sourced from the token file to keep one source of truth.
  themeColor: colors.background,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: 'dark' }}
      // The look script may add data-look before React hydrates.
      suppressHydrationWarning
    >
      <head>
        {/* PROTOTYPE — applies the remembered look before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: LOOK_BOOT_SCRIPT }} />
      </head>
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
        {/* PROTOTYPE — review switch; remove with the prototype. */}
        <LookSwitch />
      </body>
    </html>
  );
}
