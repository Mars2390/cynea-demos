'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { timing } from './timing';

/**
 * Whether the app has completed its first client render.
 *
 * Load-in effects (skeletons, counting numbers) must NOT run on first paint:
 * the page is statically prerendered, so the server HTML has to contain the
 * real fixture data rather than placeholder bars, and the first frame a
 * visitor sees should be content, not a shimmer. Once the app is running,
 * entering a new step is a genuine client-side transition and the load-in
 * effects are exactly right.
 *
 * Module scope, not state: it is a property of the session, not of any
 * component, and it must be readable during the first render.
 */
let appHasMounted = false;

/**
 * Tracks the user's reduced-motion preference reactively.
 *
 * Starts false so the server render and first client render agree; the real
 * value lands in an effect. Callers must therefore treat `true` as "disable
 * animation", never as "hide content".
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Counts from 0 to `to` with an ease-out curve, driven by requestAnimationFrame.
 *
 * `run` gates the start so counters fire when their step becomes active rather
 * than on mount. Under reduced motion the final value is returned immediately —
 * the number is information, not decoration.
 */
export function useCountUp(
  to: number,
  run: boolean,
  opts: { durationMs?: number; delayMs?: number; decimals?: number } = {},
): number {
  const {
    durationMs = timing.counterMs,
    delayMs = 0,
    decimals = 0,
  } = opts;
  const reduced = useReducedMotion();
  // Captured during construction, so it is stable and identical on server and
  // first client render — which is what keeps hydration consistent.
  const firstPaint = useRef(!appHasMounted);
  const [value, setValue] = useState(firstPaint.current ? to : 0);
  const frame = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    appHasMounted = true;
  }, []);

  useEffect(() => {
    if (!run) {
      setValue(firstPaint.current ? to : 0);
      return;
    }
    // On first paint the final figure is already in the server HTML. Counting
    // up from zero here would mean visibly wiping a correct number and
    // replaying it, so the sweep is reserved for later step entries.
    if (reduced || firstPaint.current) {
      setValue(to);
      return;
    }

    const factor = 10 ** decimals;
    const start = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / durationMs, 1);
        // easeOutCubic: fast then settling, which reads as "counting up".
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(to * eased * factor) / factor);
        if (p < 1) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    };

    timer.current = setTimeout(start, delayMs);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      cancelAnimationFrame(frame.current);
    };
  }, [to, run, reduced, durationMs, delayMs, decimals]);

  return value;
}

/**
 * Writes the cursor's position within an element to --sheen-x / --sheen-y,
 * which .demo-sheen reads for its radial highlight.
 *
 * Coordinates are written straight to the style attribute rather than through
 * React state: this fires on every mousemove and must not re-render.
 */
export function useSheen<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let queued = false;
    let lastX = 0;
    let lastY = 0;

    const apply = () => {
      queued = false;
      el.style.setProperty('--sheen-x', `${lastX}px`);
      el.style.setProperty('--sheen-y', `${lastY}px`);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      lastX = e.clientX - r.left;
      lastY = e.clientY - r.top;
      if (!queued) {
        queued = true;
        requestAnimationFrame(apply);
      }
    };

    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [reduced]);

  return ref;
}

/**
 * Skeleton-to-content gate. Returns false for `holdMs` after `run` turns true,
 * then true. Under reduced motion it returns true immediately so no one waits
 * on a shimmer they cannot see.
 */
export function useLoaded(
  run: boolean,
  holdMs: number = timing.skeletonMs,
): boolean {
  const reduced = useReducedMotion();
  const firstPaint = useRef(!appHasMounted);
  // True on first paint so the prerendered HTML carries the real data.
  const [loaded, setLoaded] = useState(firstPaint.current);

  useEffect(() => {
    appHasMounted = true;
  }, []);

  useEffect(() => {
    if (!run) {
      setLoaded(firstPaint.current);
      return;
    }
    if (reduced || firstPaint.current) {
      setLoaded(true);
      return;
    }
    setLoaded(false);
    const t = setTimeout(() => setLoaded(true), holdMs);
    return () => clearTimeout(t);
  }, [run, holdMs, reduced]);

  return loaded;
}

/**
 * True once the current step's intro animations have settled. Used to decide
 * when the Next button should start asking for attention.
 */
export function useIntroSettled(
  stepId: string,
  settleMs: number = timing.introSettleMs,
): boolean {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setSettled(false);
    const t = setTimeout(() => setSettled(true), settleMs);
    return () => clearTimeout(t);
  }, [stepId, settleMs]);

  return settled;
}

/**
 * Global key handler that ignores presses originating from form fields or
 * contenteditable regions, so demo shortcuts never hijack typing.
 */
export function useKeyboard(map: Record<string, () => void>) {
  const mapRef = useRef(map);
  mapRef.current = map;

  const isTypingTarget = useCallback((el: EventTarget | null) => {
    if (!(el instanceof HTMLElement)) return false;
    const tag = el.tagName;
    return (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      el.isContentEditable
    );
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      const handler = mapRef.current[e.key];
      if (!handler) return;
      e.preventDefault();
      handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isTypingTarget]);
}
