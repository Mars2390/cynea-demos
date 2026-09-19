'use client';

import { timing } from './timing';

/**
 * Guided scrolling for the demo engine.
 *
 * When a guide cue spotlights an element that is off-screen, the page brings it
 * into view first — otherwise the spotlight lights up something the visitor
 * cannot see.
 *
 * Implemented as a requestAnimationFrame tween over window.scrollTo rather than
 * scrollIntoView({ behavior: 'smooth' }), because we need three things the
 * native API does not give us: an exact landing offset that accounts for the
 * fixed guide bubble, a controllable duration and easing, and a reliable
 * completion signal (the spotlight's position transition has to be suppressed
 * for exactly the length of the scroll).
 */

/** Marks the fixed/sticky chrome that can obscure a target. */
export const CHROME_TOP = 'top-strip';
export const CHROME_BUBBLE = 'guide-bubble';

/** Input that means the visitor has taken over; their intent always wins. */
export const INPUT_EVENTS: (keyof WindowEventMap)[] = [
  'wheel',
  'touchstart',
  'keydown',
  'pointerdown',
];

let frame: number | null = null;
let detach: (() => void) | null = null;
let onCancel: (() => void) | null = null;

/** Stops any tween in flight and releases its listeners. */
export function cancelScroll() {
  if (frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
  if (detach) {
    detach();
    detach = null;
  }
  const cb = onCancel;
  onCancel = null;
  cb?.();
}

/**
 * The vertical band genuinely free of fixed chrome.
 *
 * The guide bubble only counts against the band when the target actually
 * overlaps it horizontally — on a desktop viewport a right-hand target sits
 * well clear of a bottom-left bubble, and reserving space for it there would
 * scroll the page for no reason.
 */
export function getSafeArea(targetRect?: DOMRect): { top: number; bottom: number } {
  const viewportH = window.innerHeight;

  // Clamped at 0: if the sticky strip ever fails to stick its rect goes
  // negative, and a negative ceiling would let us park a target off-screen.
  let top = 0;
  const strip = document.querySelector<HTMLElement>(
    `[data-chrome="${CHROME_TOP}"]`,
  );
  if (strip) {
    top = Math.max(0, Math.min(strip.getBoundingClientRect().bottom, viewportH));
  }

  let bottom = viewportH;
  const bubble = document.querySelector<HTMLElement>(
    `[data-chrome="${CHROME_BUBBLE}"]`,
  );
  if (bubble) {
    const b = bubble.getBoundingClientRect();
    const overlapsHorizontally =
      !targetRect || !(targetRect.right < b.left || targetRect.left > b.right);
    if (overlapsHorizontally) bottom = Math.min(bottom, b.top);
  }

  return { top, bottom };
}

/** Scroll position that puts `rect` where we want it, or null to stay put. */
export function desiredScrollTop(rect: DOMRect): number | null {
  const safe = getSafeArea(rect);
  const pad = timing.scrollPadPx;
  const safeTop = safe.top + pad;
  const safeBottom = safe.bottom - pad;
  const safeHeight = safeBottom - safeTop;

  if (safeHeight <= 0) return null;

  // Already fully visible with breathing room — leave it alone.
  if (rect.top >= safeTop && rect.bottom <= safeBottom) return null;

  const fits = rect.height <= safeHeight;
  const landingTop = fits
    ? // Optical centre sits a little above true centre, and the upward bias
      // keeps the element clear of the bubble's corner.
      safeTop + (safeHeight - rect.height) * timing.scrollBiasFromTop
    : // Taller than the band: show the start, since these read top-down.
      safeTop;

  const delta = rect.top - landingTop;
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const to = Math.max(0, Math.min(maxScroll, window.scrollY + delta));

  // A few pixels of correction reads as a twitch, not a move.
  if (Math.abs(to - window.scrollY) < timing.scrollMinDeltaPx) return null;

  return to;
}

const easeInOutCubic = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

/**
 * Tweens the window to `to`. Returns the duration in ms, or 0 if nothing ran.
 *
 * Under reduced motion the position is applied in one jump — the destination is
 * identical, only the travel is removed.
 */
export function tweenScrollTo(
  to: number,
  opts: {
    reduced?: boolean;
    onStart?: () => void;
    onDone?: () => void;
  } = {},
): number {
  const { reduced = false, onStart, onDone } = opts;

  cancelScroll();

  const from = window.scrollY;
  const distance = Math.abs(to - from);
  if (distance < 1) {
    onDone?.();
    return 0;
  }

  if (reduced) {
    window.scrollTo(0, to);
    onDone?.();
    return 0;
  }

  const duration = Math.min(
    timing.scrollMaxMs,
    Math.max(timing.scrollMinMs, distance * timing.scrollMsPerPx),
  );

  // The visitor's own input always wins. We listen for input events rather than
  // 'scroll', because our own scrollTo would otherwise cancel the tween on its
  // first frame.
  const stop = () => cancelScroll();
  for (const e of INPUT_EVENTS)
    window.addEventListener(e, stop, { passive: true });
  detach = () => {
    for (const e of INPUT_EVENTS) window.removeEventListener(e, stop);
  };
  onCancel = onDone ?? null;

  const t0 = performance.now();
  const step = (now: number) => {
    const p = Math.min((now - t0) / duration, 1);
    window.scrollTo(0, from + (to - from) * easeInOutCubic(p));
    if (p < 1) {
      frame = requestAnimationFrame(step);
    } else {
      frame = null;
      if (detach) {
        detach();
        detach = null;
      }
      onCancel = null;
      onDone?.();
    }
  };

  onStart?.();
  frame = requestAnimationFrame(step);
  return duration;
}

/**
 * Brings a spotlight target into the safe band.
 * Returns the scroll duration in ms, or 0 when no scroll was needed.
 */
export function scrollTargetIntoSafeView(
  el: HTMLElement,
  opts: { reduced?: boolean; onStart?: () => void; onDone?: () => void } = {},
): number {
  const to = desiredScrollTop(el.getBoundingClientRect());
  if (to === null) {
    opts.onDone?.();
    return 0;
  }
  return tweenScrollTo(to, opts);
}

/**
 * Brings a target into the safe band and KEEPS it there while the cue is up.
 *
 * A single scroll is not enough, because a step's layout is still settling when
 * its first cue fires: the statement card is still a skeleton and grows when
 * the real content swaps in, and the collect step's document grows by ~130px as
 * scan-log lines append. Scrolling once against a layout that is about to move
 * lands the target in the wrong place.
 *
 * So after the initial scroll we re-check on a low-frequency interval and issue
 * a correction if the target has drifted out of the band by more than the
 * threshold. The watcher stops on any input from the visitor — being yanked
 * back after you have scrolled yourself is worse than a misplaced spotlight —
 * and is bounded by both a correction cap and a time window so it always
 * terminates.
 */
export function guideTargetIntoView(
  el: HTMLElement,
  opts: { reduced?: boolean; onStart?: () => void; onDone?: () => void } = {},
): { durationMs: number; dispose: () => void } {
  const durationMs = scrollTargetIntoSafeView(el, opts);

  let stopped = false;
  let corrections = 0;

  const stop = () => {
    if (stopped) return;
    stopped = true;
    clearInterval(interval);
    clearTimeout(window_);
    for (const e of INPUT_EVENTS) window.removeEventListener(e, stop);
  };

  for (const e of INPUT_EVENTS) window.addEventListener(e, stop, { passive: true });

  const interval = setInterval(() => {
    if (stopped) return;
    // Never fight a tween that is already running.
    if (frame !== null) return;
    if (corrections >= timing.scrollMaxCorrections) return stop();

    const to = desiredScrollTop(el.getBoundingClientRect());
    if (to === null) return;

    corrections += 1;
    tweenScrollTo(to, opts);
  }, timing.scrollRecheckMs);

  const window_ = setTimeout(stop, timing.scrollWatchMs);

  return { durationMs, dispose: stop };
}
