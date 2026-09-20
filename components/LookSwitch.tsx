'use client';

import { useEffect, useState } from 'react';

const KEY = 'look';
const GLASS = 'glass';

/**
 * Runs before hydration so the chosen look paints first — no flat→glass flash.
 * `?look=glass` or `?look=flat` selects and remembers (`dark` is kept as an
 * alias of `flat` for older links); otherwise the last choice is used.
 * Inlined by RootLayout.
 */
export const LOOK_BOOT_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get('${KEY}');if(q==='flat'){q='dark';}if(q){localStorage.setItem('${KEY}',q);}var v=q||localStorage.getItem('${KEY}');if(v==='${GLASS}'){document.documentElement.setAttribute('data-look','${GLASS}');}}catch(e){}})();`;

/**
 * PROTOTYPE — review-only switch between the original look and "Aurora
 * Glass". Toggles <html data-look> in place so the two can be compared on the
 * same URL. Remove with the prototype.
 *
 * Renders as a sibling of the Guide and Voice toggles: DemoShell places it in
 * the header cluster; the hub and the ready screens pin it to the page's top
 * corner (`corner`), above their heroes. It used to float fixed at the
 * bottom-right, where it sat on the guide bubble at phone widths.
 */
export function LookSwitch({ corner = false }: { corner?: boolean }) {
  const [glass, setGlass] = useState(false);

  useEffect(() => {
    setGlass(document.documentElement.getAttribute('data-look') === GLASS);
  }, []);

  const toggle = () => {
    const next = !glass;
    setGlass(next);
    const root = document.documentElement;
    if (next) root.setAttribute('data-look', GLASS);
    else root.removeAttribute('data-look');
    try {
      localStorage.setItem(KEY, next ? GLASS : 'dark');
      const url = new URL(location.href);
      url.searchParams.set(KEY, next ? GLASS : 'flat'); // 'dark' still accepted
      history.replaceState(history.state, '', url);
    } catch {
      /* storage or history unavailable — the attribute alone is enough */
    }
  };

  const button = (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={glass}
      title="Prototype: switch between the original look and Aurora Glass"
      className="demo-tap inline-flex h-7 shrink-0 items-center rounded-btn border border-border-hi bg-card/70 px-2.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted transition-all duration-200 ease-demo hover:text-foreground print:hidden"
    >
      Look · {glass ? 'Glass' : 'Flat'}
    </button>
  );

  if (!corner) return button;
  return <div className="absolute right-4 top-4 z-10 sm:right-5 sm:top-5">{button}</div>;
}
