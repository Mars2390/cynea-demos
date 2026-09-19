'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GuideCue } from '@/lib/types';
import { cueHoldMs, timing, wordDelay } from '@/lib/timing';
import { AnnotationChip } from './ui/AnnotationChip';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Padding around a spotlit element. */
const SPOT_PAD = 10;
/** Below this viewport width the spotlight is suppressed (matches leads). */
const SPOT_MIN_WIDTH = 768;

/**
 * Bottom-left guide bubble: mono eyebrow, word-by-word typewriter copy, and a
 * "click or → for next" hint. Drives a single travelling spotlight plus an
 * optional annotation chip.
 *
 * Cues advance automatically after their dwell, or early on click / →.
 */
export function GuideBubble({
  cues,
  stepId,
  enabled,
  firedEvents,
}: {
  cues: GuideCue[];
  /** Changing this resets the cue sequence. */
  stepId: string;
  enabled: boolean;
  /** Event names that have fired, for cues gated with `on`. */
  firedEvents: string[];
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Reset whenever the step changes.
  useEffect(() => {
    clearTimer();
    setIndex(0);
    setVisible(false);
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

  // Reveal the current cue after its gate delay, then schedule the next one.
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

      // Auto-advance once this cue has had its dwell, if more remain.
      if (index < cues.length - 1) {
        timerRef.current = setTimeout(() => {
          setIndex((i) => Math.min(i + 1, cues.length - 1));
        }, cueHoldMs(cue.text));
      }
    }, openDelay);

    return () => {
      clearTimeout(showTimer);
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cue?.text, gateOpen, index, cues.length, stepId]);

  // Advance on → (click handling lives on the bubble itself).
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') advance();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, advance]);

  // Track the spotlight target. Polled per frame so the box follows elements
  // that are still animating in, and stays correct through scroll and resize.
  const target = visible ? cue?.target : undefined;

  useEffect(() => {
    if (!target) {
      setRect(null);
      return;
    }

    let frame = 0;
    const tick = () => {
      if (window.innerWidth < SPOT_MIN_WIDTH) {
        setRect(null);
      } else {
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
        } else {
          setRect(null);
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  if (!enabled || !cue) return null;

  const words = cue.text.trim().split(/\s+/);

  return (
    <>
      {/* Travelling spotlight — one element, never re-mounted. */}
      {rect && (
        <div
          aria-hidden
          className="demo-spot pointer-events-none fixed z-50 rounded-[14px] border-2 shadow-spot"
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
        />
      )}

      {/* The bubble. */}
      <button
        type="button"
        onClick={advance}
        aria-live="polite"
        className="demo-rise fixed bottom-5 left-5 z-[70] max-w-[330px] cursor-pointer rounded-card border border-accent/30 bg-[#08121a]/92 p-4 text-left shadow-glow-accent backdrop-blur-md transition-colors duration-200 hover:border-accent/55 sm:max-w-[360px]"
      >
        <div className="mb-2 flex items-center gap-2">
          <span aria-hidden className="relative flex h-2 w-2 items-center justify-center">
            <span className="demo-orb-ring absolute h-2 w-2 rounded-full bg-accent/70" />
            <span className="demo-orb h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
            Cynea · {index + 1}/{cues.length}
          </span>
        </div>

        <p key={`${stepId}-${index}`} className="text-[14px] leading-relaxed text-foreground">
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
          <span
            aria-hidden
            className="demo-cursor ml-0.5 inline-block h-[14px] w-[6px] translate-y-[2px] bg-accent"
            style={{ animationDelay: `${words.length * timing.guideTypewriterMs}ms` }}
          />
        </p>

        <span className="mt-2.5 block font-mono text-[9px] uppercase tracking-eyebrow text-dim">
          click or → for next
        </span>
      </button>
    </>
  );
}
