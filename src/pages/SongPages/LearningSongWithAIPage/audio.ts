// Author: Ethan
// Output-audio helper. Every speaking action in the Waiata module goes through
// `playClipOrSpeak()` so we can wire up real mp3 recordings later without
// touching the page code. When a clip exists, it plays. When it doesn't, we
// fall back to the existing TTS (`speak`) so the page keeps working today.
//
// Add an mp3 by putting it in `src/assets/song-page/audio/<name>.mp3` and
// registering it in `CLIPS` below. The Vite `import.meta.glob` call picks the
// file up at build time, so no extra import statements are needed.

import { speak, stopSpeaking } from '../../../lib/settings.svelte'
import { settings } from '../../../lib/settings.svelte'

/**
 * All audio clips Vite can find on disk. Keys look like
 *   ../../../assets/song-page/audio/line-1.mp3
 * and the value is the hashed URL Vite emits.
 *
 * `eager: true` resolves them at build time so we get a synchronous lookup.
 */
const FILES = import.meta.glob('../../../assets/song-page/audio/*.{mp3,wav,m4a,ogg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/** Clip keys used by the page. Keep stable — the page imports them. */
export type ClipKey =
  | `line-${1 | 2 | 3 | 4 | 5}`
  | `word-${'ma' | 'whero' | 'kakariki' | 'pango' | 'mangu'}`
  | 'kapai'
  | 'try-again'
  | 'click-kiki'

function clipUrl(key: ClipKey): string | null {
  // Match any extension by stem.
  const stem = `/song-page/audio/${key}.`
  for (const path of Object.keys(FILES)) {
    if (path.includes(stem)) return FILES[path]
  }
  return null
}

/** True when the clip file exists on disk (handy for UI). */
export function hasClip(key: ClipKey): boolean {
  return clipUrl(key) !== null
}

/**
 * Play a clip if it exists, otherwise speak the fallback text. Honours the
 * shared sound + volume settings either way. Returns a handle with `onend`
 * (and `stop()`) so callers can chain or cancel like they do with `speak()`.
 */
export type PlayHandle = {
  onend: (() => void) | null
  stop: () => void
}

export function playClipOrSpeak(key: ClipKey, fallbackText: string): PlayHandle {
  const handle: PlayHandle = { onend: null, stop: () => {} }
  if (!settings.soundOn) return handle

  // Cancel anything currently playing so output never overlaps. Both paths
  // (audio element + speechSynthesis) share this cancellation.
  stopAllAudio()
  stopSpeaking()

  const url = clipUrl(key)
  if (url) {
    const a = new Audio(url)
    a.volume = settings.volumeLevel
    a.onended = () => {
      currentAudio = null
      handle.onend?.()
    }
    a.onerror = () => {
      // Asset present but failed to decode — degrade to TTS so the child
      // never sees a silent button.
      currentAudio = null
      fallbackToSpeak(fallbackText, handle)
    }
    currentAudio = a
    handle.stop = () => {
      a.pause()
      a.currentTime = 0
      currentAudio = null
    }
    void a.play().catch(() => fallbackToSpeak(fallbackText, handle))
    return handle
  }

  fallbackToSpeak(fallbackText, handle)
  return handle
}

function fallbackToSpeak(text: string, handle: PlayHandle) {
  const u = speak(text)
  if (!u) return
  u.onend = () => handle.onend?.()
  handle.stop = () => stopSpeaking()
}

let currentAudio: HTMLAudioElement | null = null
export function stopAllAudio(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
}
