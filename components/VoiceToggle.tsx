'use client';

import { useVoice } from '@/lib/voice';

/**
 * Header mute for the narrator. Renders nothing where speech synthesis is
 * unavailable, so those browsers see the demo exactly as before.
 *
 * Until the page has had its first gesture the browser will not speak, so
 * the icon pulses to invite the click that arms it — the honest behaviour,
 * rather than an attempt to get around the autoplay policy.
 */
export function VoiceToggle() {
  const { supported, muted, activated, setMuted } = useVoice();
  if (!supported) return null;

  const on = !muted;
  const waiting = on && !activated;

  return (
    <button
      type="button"
      onClick={() => setMuted(on)}
      role="switch"
      aria-checked={on}
      aria-label={on ? 'Voice on. Click to mute.' : 'Voice off. Click to unmute.'}
      title={waiting ? 'Voice on — click anywhere to start' : on ? 'Mute the narrator' : 'Unmute the narrator'}
      data-voice={waiting ? 'waiting' : on ? 'on' : 'off'}
      className={`demo-tap inline-flex h-7 items-center gap-2 rounded-btn border px-2.5 transition-all duration-200 ease-demo ${
        on
          ? 'border-accent/45 bg-accent/10 text-accent'
          : 'border-border-hi bg-card/70 text-muted hover:border-border-hi hover:text-foreground'
      } ${waiting ? 'demo-voice-wait' : ''}`}
    >
      <SpeakerIcon on={on} />
      <span className="hidden font-mono text-[10px] uppercase tracking-eyebrow sm:inline">
        Voice
      </span>
    </button>
  );
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      {on ? (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 6a9 9 0 0 1 0 12" />
        </>
      ) : (
        <>
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </>
      )}
    </svg>
  );
}
