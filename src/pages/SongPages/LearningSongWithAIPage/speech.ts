// Author: Ethan
// Light wrapper around the browser Speech Recognition API used by FR6 (Try
// singing) and FR8 (Need help). The goal is not to grade pronunciation — for
// Year 1–3 children that would be discouraging — but only to check whether the
// child attempted to say the Māori colour word in roughly the right shape.
//
// The wrapper degrades gracefully: if the browser has no Speech Recognition
// (Safari/Firefox), the page treats any attempt as a reasonable one so the
// activity stays usable. Either way, decisions stay loose and forgiving.

import type { SongLine } from './lyrics'

// Cross-browser handle: Chromium ships the prefixed name.
type SR = typeof window extends { SpeechRecognition: infer T }
  ? T
  : typeof window extends { webkitSpeechRecognition: infer T }
  ? T
  : never

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/** Minimal interface — typed loosely so it covers both prefixed and standard. */
export interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: any) => void) | null
  onerror: ((e: any) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

export const SPEECH_RECOGNITION_SUPPORTED = getRecognitionCtor() !== null

/**
 * Loose pronunciation check. Returns true if the heard transcript contains
 * the line's Māori colour word (or a close phonetic alias). The match is
 * intentionally lenient — small mispronunciations should not block progress
 * (FR6: encourage attempts, never grade).
 */
export function transcriptMatchesLine(transcript: string, line: SongLine): boolean {
  if (!transcript) return false
  const t = transcript
    .toLowerCase()
    // Map macron vowels onto their plain forms so "ma" matches "mā".
    .replace(/[āĀ]/g, 'a')
    .replace(/[ēĒ]/g, 'e')
    .replace(/[īĪ]/g, 'i')
    .replace(/[ōŌ]/g, 'o')
    .replace(/[ūŪ]/g, 'u')
    // Drop punctuation but keep spaces.
    .replace(/[^a-z\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const candidates = [line.maoriWord, ...line.aliases].map((w) =>
    w
      .toLowerCase()
      .replace(/[āĀ]/g, 'a')
      .replace(/[ēĒ]/g, 'e')
      .replace(/[īĪ]/g, 'i')
      .replace(/[ōŌ]/g, 'o')
      .replace(/[ūŪ]/g, 'u'),
  )

  // Word-boundary OR substring contains. "ma" is short enough that a substring
  // hit inside a longer transcript is still a reasonable attempt for a child.
  return candidates.some((c) => {
    if (!c) return false
    if (t === c) return true
    const re = new RegExp(`(^|[\\s-])${escapeRegex(c)}([\\s-]|$)`)
    if (re.test(t)) return true
    // Very short words (mā): allow a substring with at least the same first
    // letter so we don't fire on random sounds like "the".
    if (c.length <= 2) return t.startsWith(c) || t.split(' ').some((w) => w === c)
    return t.includes(c)
  })
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Start a one-shot recognition session. Resolves with the best transcript
 * heard (possibly empty) when recognition ends or times out, or rejects when
 * the API itself errors out. Caller stops it via the returned `stop()`.
 */
export function startListening(opts: {
  onTranscript?: (text: string, isFinal: boolean) => void
  onEnd?: (finalText: string) => void
  onError?: (err: string) => void
  timeoutMs?: number
  lang?: string
}): { stop: () => void; supported: boolean } {
  const Ctor = getRecognitionCtor()
  if (!Ctor) {
    opts.onError?.('unsupported')
    return { stop: () => {}, supported: false }
  }

  let rec: SpeechRecognitionLike | null = new Ctor()
  rec.lang = opts.lang ?? 'en-NZ'
  rec.continuous = false
  rec.interimResults = true
  rec.maxAlternatives = 3

  let finalText = ''
  let interimText = ''
  let stopped = false

  rec.onresult = (e: any) => {
    finalText = ''
    interimText = ''
    for (let i = 0; i < e.results.length; i++) {
      const r = e.results[i]
      // Walk all alternatives so a slightly-different best guess still
      // contributes to the match. We concatenate with spaces.
      let pieces = ''
      for (let j = 0; j < r.length; j++) pieces += ` ${r[j].transcript ?? ''}`
      if (r.isFinal) finalText += pieces
      else interimText += pieces
    }
    opts.onTranscript?.((finalText + ' ' + interimText).trim(), !!finalText)
  }
  rec.onerror = (e: any) => {
    opts.onError?.(String(e?.error ?? 'error'))
  }
  rec.onend = () => {
    if (stopped) return
    stopped = true
    clearTimeout(timer)
    opts.onEnd?.((finalText + ' ' + interimText).trim())
  }

  const timer = setTimeout(() => {
    try {
      rec?.stop()
    } catch {
      /* ignore */
    }
  }, opts.timeoutMs ?? 5000)

  try {
    rec.start()
  } catch (e) {
    opts.onError?.(String(e))
    clearTimeout(timer)
  }

  return {
    supported: true,
    stop: () => {
      if (stopped) return
      stopped = true
      clearTimeout(timer)
      try {
        rec?.abort()
      } catch {
        /* ignore */
      }
      rec = null
      opts.onEnd?.((finalText + ' ' + interimText).trim())
    },
  }
}
