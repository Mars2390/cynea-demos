'use client';

import { useEffect, useState } from 'react';

const KEY = 'look';
const GLASS = 'glass';

/**
 * Runs before hydration so the chosen look paints first — no dark→glass flash.
 * `?look=glass` (or `?look=dark`) selects and remembers; otherwise the last
 * choice is used. Inlined by RootLayout.
 */
export const LOOK_BOOT_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get('${KEY}');if(q){localStorage.setItem('${KEY}',q);}var v=q||localStorage.getItem('${KEY}');if(v==='${GLASS}'){document.documentElement.setAttribute('data-look','${GLASS}');}}catch(e){}})();`;

/**
 * PROTOTYPE — review-only switch between the original look and "Aurora
 * Glass". Toggles <html data-look> in place so the two can be compared on the
 * same URL. Remove with the prototype.
 */
export function LookSwitch() {
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
      url.searchParams.set(KEY, next ? GLASS : 'dark');
      history.replaceState(history.state, '', url);
    } catch {
      /* storage or history unavailable — the attribute alone is enough */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={glass}
      title="Prototype: switch between the original look and Aurora Glass"
      className="demo-tap fixed bottom-4 right-4 z-[80] rounded-full border border-border-hi bg-background/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-eyebrow text-muted backdrop-blur-md transition-colors hover:border-accent/50 hover:text-foreground print:hidden"
    >
      Look · {glass ? 'Glass' : 'Dark'}
    </button>
  );
}
