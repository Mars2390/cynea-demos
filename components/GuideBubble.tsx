'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GuideCue } from '@/lib/types';
import { cueHoldMs, timing, wordDelay } from '@/lib/timing';
import { useReducedMotion } from '@/lib/hooks';
import { CHROME_BUBBLE, cancelScroll, guideTargetIntoView } from '@/lib/scroll';
import { AnnotationChip } from './ui/AnnotationChip';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Padding around a spotlit element. */
const SPOT_PAD = 10;

/**
 * Bottom-left guide bubble: mono eyebrow, word-by-word typewriter copy, and a
 * "click or space for next" hint. Drives a single travelling spotlight plus an
 * optional annotation chip.
 *
 * When a cue targets an element that is off-screen, the page scrolls it into
 * the band that is free of fixed chrome before the spotlight settles there —
 * see lib/scroll.ts. The spotlight stays visible and glued to the target for
 * the whole journey, which reads as being taken somewhere rather than as a
 * dead pause.
 *
 * Space (or clicking the bubble) advances a cue. Arrow keys are deliberately
 * NOT handled here — they belong to step navigation, so no key does two jobs.
 */
export function GuideBubble({
  cues,
  stepId,
  enabled,
  firedEvents,
  onAdvanceRef,
}: {
  cues: GuideCue[];
  /** Changing this resets the cue sequence. */
  stepId: string;
  enabled: boolean;
  /** Event names that have fired, for cues gated with `on`. */
  firedEvents: string[];
  /** Lets the parent bind Space to cue advance without duplicating listeners. */
  onAdvanceRef?: React.MutableRefObject<(() => void) | null>;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  /** True only while a guided scroll is in flight. */
  const [scrolling, setScrolling] = useState(false);
  /**
   * True while the spotlit target overlaps the bubble. Combined with
   * `scrolling`, this makes the bubble yield only for the moment of transit:
   * a target taller than the safe band always extends behind the bubble at
   * rest, and dimming for the whole cue would be wrong.
   */
  const [yielding, setYielding] = useState(false);
  const bubbleRef = useRef<HTMLButtonElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Tears down the drift watcher for the cue that is going away. */
  const disposeWatchRef = useRef<(() => void) | null>(null);
  const reduced = useReducedMotion();

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopWatching = () => {
    disposeWatchRef.current?.();
    disposeWatchRef.current = null;
  };

  // Reset whenever the step changes.
  useEffect(() => {
    clearTimer();
    stopWatching();
    cancelScroll();
    setIndex(0);
    setVisible(false);
    setScrolling(false);
  }, [stepId]);

  const cue = enabled ? cues[index] : undefined;

  /** A cue gated by `on` only becomes eligible once its event has fired. */
  const gateOpen = useMemo(() => {
    if (!cue) return false;
    if (cue.on) return firedEvents.includes(cue.on);
    return true;
  }, [cue, firedEvents]);

  const advance = useCallback(() => {
    clearTimer();
    setIndex((i) => Math.min(i + 1, cues.length - 1));
  }, [cues.length]);

  // Expose advance to the parent so it can own the keyboard map.
  useEffect(() => {
    if (!onAdvanceRef) return;
    onAdvanceRef.current = enabled ? advance : null;
    return () => {
      onAdvanceRef.current = null;
    };
  }, [advance, enabled, onAdvanceRef]);

  /**
   * Reveal the current cue, bring its target into view, then schedule the next.
   *
   * The scroll is kicked off here rather than in the measuring effect below so
   * its duration is known at the moment the dwell timer is set: travel time is
   * added to the hold, otherwise a long scroll would eat the reading time.
   */
  useEffect(() => {
    if (!cue || !gateOpen) {
      setVisible(false);
      return;
    }

    clearTimer();
    setVisible(false);

    const openDelay = (index === 0 ? (cue.at ?? 0) : 0) + (cue.after ?? 0);

    const showTimer = setTimeout(() => {
      setVisible(true);

      let scrollMs = 0;
      if (cue.target) {
        const el = document.querySelector<HTMLElement>(
          `[data-guide="${cue.target}"]`,
        );
        if (el) {
          const guided = guideTargetIntoView(el, {
            reduced,
            onStart: () => setScrolling(true),
            onDone: () => setScrolling(false),
          });
          scrollMs = guided.durationMs;
          disposeWatchRef.current = guided.dispose;
        }
      }
      if (scrollMs === 0) setScrolling(false);

      if (index < cues.length - 1) {
        timerRef.current = setTimeout(
          () => setIndex((i) => Math.min(i + 1, cues.length - 1)),
          cueHoldMs(cue.text) + scrollMs,
        );
      }
    }, openDelay);

    return () => {
      clearTimeout(showTimer);
      clearTimer();
      stopWatching();
      cancelScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cue?.text, cue?.target, gateOpen, index, cues.length, stepId, reduced]);

  // Track the spotlight target. Polled per frame so the box follows elements
  // that are still animating in, stays glued through a guided scroll, and
  // remains correct through manual scrolling and resize.
  const target = visible ? cue?.target : undefined;

  useEffect(() => {
    if (!target) {
      setRect(null);
      return;
    }

    let frame = 0;
    const tick = () => {
      const el = document.querySelector<HTMLElement>(
        `[data-guide="${target}"]`,
      );
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({
          top: r.top - SPOT_PAD,
          left: r.left - SPOT_PAD,
          width: r.width + SPOT_PAD * 2,
          height: r.height + SPOT_PAD * 2,
        });

        // Yield only while the target is genuinely behind the bubble.
        const b = bubbleRef.current?.getBoundingClientRect();
        const overlapping = b
          ? !(
              r.right < b.left ||
              r.left > b.right ||
              r.bottom < b.top ||
              r.top > b.bottom
            )
          : false;
        setYielding((prev) => (prev === overlapping ? prev : overlapping));
      } else {
        setRect(null);
        setYielding(false);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  // Release any tween and watcher if the guide is switched off or unmounts.
  useEffect(
    () => () => {
      stopWatching();
      cancelScroll();
    },
    [],
  );

  if (!enabled || !cue) return null;

  const words = cue.text.trim().split(/\s+/);
  const glued = scrolling ? 'demo-spot-glued' : '';

  return (
    <>
      {/* Travelling spotlight — one element, never re-mounted. */}
      {rect && (
        <div
          aria-hidden
          className={`demo-spot pointer-events-none fixed z-50 rounded-[14px] border-2 shadow-spot ${glued}`}
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      )}

      {rect && cue.annotation && (
        <AnnotationChip
          text={cue.annotation}
          top={Math.max(rect.top - 30, 8)}
          left={rect.left + 4}
          glued={scrolling}
        />
      )}

      {/* The bubble. Frosted so the mesh reads through it. */}
      <button
        ref={bubbleRef}
        type="button"
        data-chrome={CHROME_BUBBLE}
        onClick={advance}
        aria-live="polite"
        aria-label="Guide. Click to advance."
        className={`demo-glass demo-rise fixed bottom-4 left-4 z-[70] max-w-[calc(100vw-2rem)] cursor-pointer rounded-card p-4 text-left transition-[color,border-color,opacity] duration-200 hover:border-accent/40 sm:bottom-5 sm:left-5 sm:max-w-[360px] ${scrolling && yielding ? 'demo-bubble-yield' : ''}`}
      >
        <div className="mb-2 flex items-center gap-2">
          <span
            aria-hidden
            className="relative flex h-2 w-2 shrink-0 items-center justify-center"
          >
            <span className="demo-orb-ring absolute h-2 w-2 rounded-full bg-accent/70" />
            <span className="demo-orb h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
            Cynea · {index + 1}/{cues.length}
          </span>
        </div>

        <p
          key={`${stepId}-${index}`}
          className="text-[13.5px] leading-relaxed text-foreground sm:text-[14px]"
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="demo-word inline-block"
              style={{ animationDelay: wordDelay(i) }}
            >
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
          {!reduced && (
            <span
              aria-hidden
              className="demo-cursor ml-0.5 inline-block h-[14px] w-[6px] translate-y-[2px] bg-accent"
              style={{
                animationDelay: `${words.length * timing.guideTypewriterMs}ms`,
              }}
            />
          )}
        </p>

        <span className="mt-2.5 block font-mono text-[9px] uppercase tracking-eyebrow text-dim">
          click or space for next
        </span>
      </button>
    </>
  );
}
