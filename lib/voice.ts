'use client';

import { useEffect, useState } from 'react';

/**
 * Narrator — the browser's built-in speech synthesis, nothing else.
 *
 * What this module owns:
 *  - support detection (absent API → every call is a silent no-op)
 *  - voice selection: a female English voice by name, else any English voice
 *    (en-GB first), else the browser default; re-picked on `voiceschanged`
 *  - mute, remembered in localStorage and shared across every suite
 *  - the user-activation gate: Chrome and Safari refuse to speak until the
 *    page has had a gesture, so a cold deep link is silent until the first
 *    click or key. We do not try to get around that; we remember that a line
 *    is wanted and speak it on the gesture.
 *  - one utterance at a time: cancel before speak, sentence chunking so
 *    Chrome's ~15s network-voice cutoff never truncates a line, a live
 *    reference to the current utterances so Chrome cannot garbage-collect
 *    them mid-sentence, and a skip when the tab is hidden.
 */

const STORAGE_KEY = 'cynea-voice';
const RATE = 0.95;
const PITCH = 1;
const VOLUME = 1;

/** Preferred voices, best first. Matched case-insensitively as substrings. */
const PREFERRED = [
  'Samantha',
  'Karen',
  'Aria',
  'Ava',
  'Allison',
  'Serena',
  'Moira',
  'Fiona',
  'Kate',
  'Google UK English Female',
  'Microsoft Sonia',
  'Microsoft Libby',
  'Microsoft Aria',
  'Microsoft Jenny',
  'Microsoft Hazel',
  'Microsoft Zira',
  'Google US English',
];

export type SpeakResult = 'speaking' | 'queued' | 'skipped';

type Listener = () => void;

const listeners = new Set<Listener>();
const notify = () => listeners.forEach((l) => l());

/** Subscribe to mute / activation changes. Returns an unsubscribe. */
export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ------------------------------------------------------------ support */

/** Set when the engine accepted lines twice and never started either. */
let engineDead = false;

export function isSupported(): boolean {
  return (
    !engineDead &&
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'
  );
}

/* --------------------------------------------------------------- mute */

let mutedCache: boolean | null = null;

export function isMuted(): boolean {
  if (mutedCache !== null) return mutedCache;
  let v = false;
  try {
    v = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'off';
  } catch {
    v = false;
  }
  mutedCache = v;
  return v;
}

export function setMuted(muted: boolean): void {
  mutedCache = muted;
  try {
    localStorage.setItem(STORAGE_KEY, muted ? 'off' : 'on');
  } catch {
    /* storage unavailable — the in-memory value still applies for this page */
  }
  // Settle so a cue holding on the interrupted line moves on.
  if (muted) cancel({ settle: true });
  notify();
}

/* --------------------------------------------------------- activation */

let activated = false;
let gateInstalled = false;
/** The line asked for before the first gesture; spoken on the gesture. */
let pending: { text: string; onEnd?: () => void } | null = null;

export function isActivated(): boolean {
  return activated;
}

/** The browser's own record of a gesture on this page, where exposed. */
function browserHasBeenActive(): boolean {
  try {
    const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } })
      .userActivation;
    return Boolean(ua && ua.hasBeenActive);
  } catch {
    return false;
  }
}

function installGate() {
  if (gateInstalled || typeof window === 'undefined') return;
  gateInstalled = true;
  // A gesture that happened before we were listening still counts.
  if (!activated && browserHasBeenActive()) activated = true;
  const arm = () => {
    if (activated) return;
    activated = true;
    window.removeEventListener('pointerdown', arm, true);
    window.removeEventListener('keydown', arm, true);
    // Speak before notifying, so a subscriber can see a line is under way.
    if (pending) {
      const p = pending;
      pending = null;
      speak(p.text, { onEnd: p.onEnd });
    }
    notify();
  };
  if (activated) return;
  window.addEventListener('pointerdown', arm, true);
  window.addEventListener('keydown', arm, true);
}

/**
 * Get ready before there is anything to say: install the gesture gate, hook
 * visibility, and warm the voice list. Called from the header toggle and from
 * the ready screen on mount, so an early click is never missed.
 */
export function prime(): void {
  if (!isSupported()) return;
  installGate();
  hookVisibility();
  ensureVoice();
}

/* -------------------------------------------------------------- voice */

let chosen: SpeechSynthesisVoice | null = null;
let voicesHooked = false;

/**
 * Local voices first. Measured in Chrome on Windows: the Google network
 * voices start but never fire `end`, which leaves every listener waiting;
 * the OS voices fire both. The premium named voices (Samantha, Karen, Aria…)
 * are local on macOS, iOS and Edge, so quality is not traded away there.
 */
function pickFrom(pool: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  for (const name of PREFERRED) {
    const hit = pool.find((v) => v.name.toLowerCase().includes(name.toLowerCase()));
    if (hit) return hit;
  }
  const female = pool.find((v) => /female|woman/i.test(v.name));
  if (female) return female;
  const gb = pool.find((v) => /^en[-_]gb/i.test(v.lang));
  if (gb) return gb;
  return pool[0] ?? null;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const english = voices.filter((v) => /^en([-_]|$)/i.test(v.lang));
  return (
    pickFrom(english.filter((v) => v.localService)) ??
    pickFrom(english) ??
    voices.find((v) => v.default) ??
    voices[0] ??
    null
  );
}

function ensureVoice(): SpeechSynthesisVoice | null {
  if (!isSupported()) return null;
  if (!voicesHooked) {
    voicesHooked = true;
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      chosen = pickVoice();
    });
  }
  if (!chosen) chosen = pickVoice();
  return chosen;
}

/** The chosen voice's name, for diagnostics. */
export function voiceName(): string | null {
  return ensureVoice()?.name ?? null;
}

/* ------------------------------------------------------------ speaking */

let generation = 0;
/** Live reference: Chrome drops an utterance that is only held by its queue. */
let live: SpeechSynthesisUtterance[] = [];
let liveOnEnd: (() => void) | undefined;
let visibilityHooked = false;
/** Consecutive lines the engine accepted but never started. */
let deadStarts = 0;
const START_WATCHDOG_MS = 4000;
/** Rough speaking time for a chunk, used to bound a missing `end` event. */
const MS_PER_WORD = 430; // ~150 wpm at rate 0.95
const CHUNK_LATENCY_MS = 900;
/** Small gap after cancel() before the next speak(); Chrome drops otherwise. */
const AFTER_CANCEL_MS = 40;

/** True from speak() returning 'speaking' until that line ends or is cancelled. */
export function hasActiveLine(): boolean {
  return live.length > 0;
}

/**
 * Splits at sentence boundaries so long lines never hit Chrome's cutoff.
 * No lookbehind: older Safari fails to parse the regex, and a parse error in a
 * shared module would take the whole bundle down.
 */
function chunk(text: string): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  const out: string[] = [];
  const re = /[^.!?…]+[.!?…]+["')\]]*\s*|[^.!?…]+$/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(clean))) {
    const part = m[0].trim();
    if (part) out.push(part);
  }
  return out.length ? out : [clean];
}

function estimateMs(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return CHUNK_LATENCY_MS + words * MS_PER_WORD;
}

function hookVisibility() {
  if (visibilityHooked || typeof document === 'undefined') return;
  visibilityHooked = true;
  document.addEventListener('visibilitychange', () => {
    // Hidden tabs are skipped, not paused: Chrome stalls synthesis in the
    // background and resumes it unpredictably. The cue that is speaking is
    // treated as finished so the bubble carries on; the next cue speaks when
    // the tab is visible again.
    if (document.visibilityState === 'hidden') cancel({ settle: true });
  });
}

/** Ends the current line for generation `gen`, firing its onEnd once. */
function finishLine(gen: number) {
  if (gen !== generation) return;
  live = [];
  const cb = liveOnEnd;
  liveOnEnd = undefined;
  cb?.();
}

/**
 * Speaks the chunks of one line strictly one after another. Chrome's network
 * voices play a queued utterance's audio but sometimes never fire its `end`
 * (and occasionally never `start`), which would leave anything waiting on
 * the line hanging — so each chunk carries two watchdogs: one for a start
 * that never comes, one for an end that never comes. Either way the line
 * moves on within about a second of when it should have.
 */
function playSequentially(parts: string[], gen: number, voice: SpeechSynthesisVoice | null) {
  const synth = window.speechSynthesis;
  let i = 0;

  const next = () => {
    if (gen !== generation) return;
    if (i >= parts.length) {
      finishLine(gen);
      return;
    }
    const part = parts[i++];
    const u = new SpeechSynthesisUtterance(part);
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? 'en-GB';
    u.rate = RATE;
    u.pitch = PITCH;
    u.volume = VOLUME;

    let started = false;
    let settled = false;
    let startDog: ReturnType<typeof setTimeout> | null = null;
    let endDog: ReturnType<typeof setTimeout> | null = null;
    const clearDogs = () => {
      if (startDog) clearTimeout(startDog);
      if (endDog) clearTimeout(endDog);
      startDog = endDog = null;
    };
    const settle = () => {
      if (settled || gen !== generation) return;
      settled = true;
      clearDogs();
      // A gap before the next chunk: Chrome drops a speak() that follows an
      // end or a cancel too closely.
      setTimeout(next, AFTER_CANCEL_MS);
    };

    u.onstart = () => {
      started = true;
      deadStarts = 0;
      if (startDog) clearTimeout(startDog);
      startDog = null;
      // The audio plays even when `end` never arrives; bound the wait.
      endDog = setTimeout(() => {
        if (settled || gen !== generation) return;
        try {
          synth.cancel(); // clears the stuck utterance; fires 'interrupted', ignored below
        } catch {
          /* nothing to clear */
        }
        settle();
      }, Math.round(estimateMs(part) * 1.2) + 600);
    };
    u.onend = settle;
    u.onerror = (e) => {
      // 'interrupted' / 'canceled' come from a cancel(): ours (generation has
      // moved on, so settle is a no-op) or the end watchdog's (settled already).
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      settle();
    };

    live = [u];
    startDog = setTimeout(() => {
      if (started || settled || gen !== generation) return;
      deadStarts += 1;
      if (deadStarts >= 2) {
        // The engine accepts lines and never starts them (no usable voice).
        // Retire the narrator for this page: the toggle hides, nothing queues.
        engineDead = true;
        cancel({ settle: true });
        notify();
        return;
      }
      try {
        synth.cancel();
      } catch {
        /* nothing to clear */
      }
      // Give up on this chunk but keep the line moving.
      settle();
    }, START_WATCHDOG_MS);

    try {
      synth.resume(); // harmless when not paused; clears a background stall
      synth.speak(u);
    } catch {
      clearDogs();
      finishLine(gen);
    }
  };

  next();
}

/**
 * Speak `text`. Returns what happened:
 *  - 'speaking': audio is playing; `onEnd` fires when the last chunk ends
 *    (or on cancel with settle, so a caller holding on it never deadlocks)
 *  - 'queued': no gesture yet; will speak on the first one, then `onEnd`
 *  - 'skipped': unsupported, muted, or the tab is hidden — nothing will fire
 */
export function speak(text: string, opts: { onEnd?: () => void } = {}): SpeakResult {
  if (!isSupported() || isMuted() || !text.trim()) return 'skipped';
  installGate();
  hookVisibility();
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return 'skipped';
  if (!activated && browserHasBeenActive()) activated = true;
  if (!activated) {
    pending = { text, onEnd: opts.onEnd };
    return 'queued';
  }

  cancel();
  const gen = ++generation;
  const voice = ensureVoice();
  const parts = chunk(text);
  liveOnEnd = opts.onEnd;
  // Mark the line live now so a caller can see one is under way; the first
  // utterance replaces this placeholder when it is created.
  live = [new SpeechSynthesisUtterance('')];

  // Chrome drops an utterance queued in the same tick as cancel().
  setTimeout(() => {
    if (gen !== generation) return;
    playSequentially(parts, gen, voice);
  }, AFTER_CANCEL_MS);

  return 'speaking';
}

/**
 * Stop whatever is speaking or queued. With `settle`, the interrupted line's
 * `onEnd` fires so a caller holding on it moves on; without it the caller
 * is assumed to have moved on already (a step change, a replay).
 */
export function cancel(opts: { settle?: boolean } = {}): void {
  pending = null;
  generation += 1;
  const cb = liveOnEnd;
  liveOnEnd = undefined;
  live = [];
  if (isSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* nothing to stop */
    }
  }
  if (opts.settle) cb?.();
}

export function isSpeaking(): boolean {
  return isSupported() && (window.speechSynthesis.speaking || window.speechSynthesis.pending);
}

/* --------------------------------------------------------------- hook */

/** Mute state, support and activation for the header toggle. SSR-safe. */
export function useVoice() {
  const [state, setState] = useState({ supported: false, muted: false, activated: false });

  useEffect(() => {
    const read = () =>
      setState({ supported: isSupported(), muted: isMuted(), activated: isActivated() });
    prime();
    read();
    return subscribe(read);
  }, []);

  return { ...state, setMuted };
}
