// Author: Ethan
// Browser-side input pipeline for FR6 (Try singing). Records a short clip
// from the child's microphone and POSTs it to Groq's Whisper large-v3
// transcription endpoint with `language=mi`, which is much more accurate
// for Māori colour words than the built-in browser SpeechRecognition.
//
// The Groq API key is read from `import.meta.env.VITE_GROQ_API_KEY` so the
// build-time value can vary by environment. NOTE: any `VITE_`-prefixed env
// is shipped in the client bundle. That's fine for a classroom prototype
// but should be replaced with a tiny backend proxy before production.

import { SONG_LINES, type SongLine } from './lyrics'

/**
 * Loose phonetic match between a Whisper transcript and the line's target
 * Māori word. Deliberately lenient — small mispronunciations should never
 * block a Year 1–3 child (FR6: encourage attempts, do not grade).
 */
export function transcriptMatchesLine(transcript: string, line: SongLine): boolean {
  if (!transcript) return false
  const t = normalise(transcript)
  const candidates = [line.maoriWord, ...line.aliases].map(normalise)
  return candidates.some((c) => {
    if (!c) return false
    if (t === c) return true
    const re = new RegExp(`(^|[\\s-])${escapeRegex(c)}([\\s-]|$)`)
    if (re.test(t)) return true
    // Very short words like "mā" — allow a leading match without breaking on
    // random sounds elsewhere in the transcript.
    if (c.length <= 2) return t.startsWith(c) || t.split(' ').some((w) => w === c)
    return t.includes(c)
  })
}

function normalise(s: string): string {
  return s
    .toLowerCase()
    .replace(/[āĀ]/g, 'a')
    .replace(/[ēĒ]/g, 'e')
    .replace(/[īĪ]/g, 'i')
    .replace(/[ōŌ]/g, 'o')
    .replace(/[ūŪ]/g, 'u')
    .replace(/[^a-z\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Standard Levenshtein edit distance — used by `transcriptFuzzyMatchesLine`. */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  // Two-row rolling DP to keep memory at O(min(a, b)).
  let prev = new Array(b.length + 1)
  let curr = new Array(b.length + 1)
  for (let j = 0; j <= b.length; j++) prev[j] = j
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[b.length]
}

/**
 * Forgiving phonetic match — Levenshtein distance against each token in the
 * transcript. Allowed edit distance scales with the candidate length so we
 * accept "fero" / "hero" for "whero" but don't accept "no" for "mā".
 *
 * This is the looser companion to `transcriptMatchesLine`; the page tries
 * the exact matcher first, then this one, to keep an "exact" vs "fuzzy"
 * distinction in the staged result.
 */
export function transcriptFuzzyMatchesLine(transcript: string, line: SongLine): boolean {
  if (!transcript) return false
  const t = normalise(transcript)
  if (!t) return false
  const tokens = t.split(' ').filter(Boolean)
  const candidates = [line.maoriWord, ...line.aliases].map(normalise).filter(Boolean)
  for (const c of candidates) {
    // Around 30 % of the candidate's length, rounded down, but at least 1.
    // "whero" (5) → 1; "kakariki" (8) → 2; "mā"→"ma" (2) → 1.
    const maxDist = Math.max(1, Math.floor(c.length * 0.35))
    for (const w of tokens) {
      if (Math.abs(w.length - c.length) > maxDist) continue
      if (levenshtein(w, c) <= maxDist) return true
    }
  }
  return false
}

/**
 * Four-level scoring for a Try-singing attempt, ordered strongest →
 * weakest:
 *   • `exact`   — `transcriptMatchesLine` accepted (word found verbatim)
 *   • `fuzzy`   — `transcriptFuzzyMatchesLine` accepted (close phonetic)
 *   • `attempt` — Whisper didn't find the word, but the child *did* speak
 *                 (the recorder heard voice during the take). Still counts
 *                 as a reasonable attempt under FR6.
 *   • `silent`  — no voice and no useful transcript → ask the child to try
 *                 again, the only level that does NOT unlock the line.
 */
export type AttemptLevel = 'exact' | 'fuzzy' | 'attempt' | 'silent'

export function scoreAttempt(
  transcript: string,
  line: SongLine,
  voiceHeard: boolean,
): AttemptLevel {
  if (transcriptMatchesLine(transcript, line)) return 'exact'
  if (transcriptFuzzyMatchesLine(transcript, line)) return 'fuzzy'
  if (voiceHeard) return 'attempt'
  return 'silent'
}

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/audio/transcriptions'
const MODEL = 'whisper-large-v3'
const MAORI_LANG = 'mi'

export function hasGroqKey(): boolean {
  return !!getGroqKey()
}

function getGroqKey(): string {
  // `import.meta.env` is replaced by Vite at build time.
  const env = (import.meta as unknown as { env?: Record<string, string> }).env
  return (env?.VITE_GROQ_API_KEY ?? '').trim()
}

/**
 * Record from the default microphone for up to `maxMs` milliseconds.
 * Resolves with the captured audio Blob (typically webm/opus on Chromium,
 * mp4/aac on Safari). Rejects on permission denial or unsupported browser.
 */
export type Recorder = {
  /** Stop the recording early; the returned promise resolves with the blob. */
  stop: () => void
  /** Resolves once stopping (manual or after `maxMs`) completes. */
  done: Promise<Blob>
}

export type RecordOptions = {
  /** Hard cap on recording length, ms. The recorder stops automatically. */
  maxMs?: number
  /**
   * Auto-stop after this many ms of silence *following* a stretch of voice.
   * Lets a child speak one word and have the mic shut off promptly instead
   * of waiting for the hard cap. Set 0 to disable.
   */
  silenceMs?: number
  /**
   * Wait at least this long before silence-auto-stop can fire, so the mic
   * doesn't bail out before the child has had a chance to start speaking.
   */
  minMs?: number
  /** Normalised audio level [0, 1] — called ~60Hz while recording. */
  onLevel?: (level: number) => void
  /** Fired when voice activity is detected for the first time. */
  onVoiceStart?: () => void
}

export async function startRecording(opts: RecordOptions = {}): Promise<Recorder> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('mic-unsupported')
  }
  const stream = await navigator.mediaDevices.getUserMedia({
    // Echo / noise / gain hints help on laptop mics; browsers that don't
    // know these keys simply ignore them.
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
  })

  const mime = pickMimeType()
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
  const chunks: BlobPart[] = []
  let resolver: (b: Blob) => void
  let rejecter: (e: unknown) => void
  const done = new Promise<Blob>((res, rej) => {
    resolver = res
    rejecter = rej
  })

  // --- Live level + silence detection via Web Audio --------------------
  // We tap the same MediaStream into an AnalyserNode so we can report RMS
  // (for the on-screen meter) and auto-stop after a stretch of silence.
  const VOICE_THRESHOLD = 0.045 // RMS above which we consider audio "voice"
  const audioCtx: AudioContext | null = createAudioContext()
  let analyser: AnalyserNode | null = null
  // Backed by an explicit ArrayBuffer to satisfy the stricter
  // `Uint8Array<ArrayBuffer>` overload of getByteTimeDomainData in newer
  // lib.dom typings (otherwise TS picks `Uint8Array<ArrayBufferLike>`).
  let timeData: Uint8Array<ArrayBuffer> | null = null
  let rafId: number | null = null
  const startedAt = performance.now()
  let lastVoiceAt = 0
  let voiceSeen = false

  if (audioCtx) {
    const source = audioCtx.createMediaStreamSource(stream)
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 1024
    analyser.smoothingTimeConstant = 0.4
    source.connect(analyser)
    timeData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))
  }

  const minMs = opts.minMs ?? 400
  const silenceMs = opts.silenceMs ?? 0

  const tick = () => {
    if ((rec.state as string) === 'inactive') return
    if (analyser && timeData) {
      analyser.getByteTimeDomainData(timeData)
      let sum = 0
      for (let i = 0; i < timeData.length; i++) {
        const v = (timeData[i] - 128) / 128
        sum += v * v
      }
      const rms = Math.sqrt(sum / timeData.length)
      opts.onLevel?.(rms)
      const now = performance.now()
      if (rms > VOICE_THRESHOLD) {
        if (!voiceSeen) {
          voiceSeen = true
          opts.onVoiceStart?.()
        }
        lastVoiceAt = now
      } else if (
        silenceMs > 0 &&
        voiceSeen &&
        now - startedAt > minMs &&
        lastVoiceAt > 0 &&
        now - lastVoiceAt > silenceMs &&
        (rec.state as string) !== 'inactive'
      ) {
        rec.stop()
        return
      }
    }
    rafId = requestAnimationFrame(tick)
  }

  rec.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data)
  }
  rec.onerror = (e) => rejecter(e)
  rec.onstop = () => {
    if (rafId != null) cancelAnimationFrame(rafId)
    audioCtx?.close().catch(() => {})
    const blob = new Blob(chunks, { type: mime || 'audio/webm' })
    stream.getTracks().forEach((t) => t.stop())
    resolver(blob)
  }

  rec.start()
  rafId = requestAnimationFrame(tick)
  const hardCap = setTimeout(() => {
    if ((rec.state as string) !== 'inactive') rec.stop()
  }, opts.maxMs ?? 5000)

  return {
    stop: () => {
      clearTimeout(hardCap)
      if ((rec.state as string) !== 'inactive') rec.stop()
    },
    done,
  }
}

function createAudioContext(): AudioContext | null {
  try {
    const Ctor =
      (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    return Ctor ? new Ctor() : null
  } catch {
    return null
  }
}

function pickMimeType(): string | null {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4;codecs=mp4a.40.2',
    'audio/mp4',
  ]
  for (const m of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported?.(m)) return m
  }
  return null
}

/**
 * Send a recording to Groq Whisper and return the transcript. The API key is
 * read from `VITE_GROQ_API_KEY` at build time; throws "no-api-key" when it
 * isn't set so the page can show a clear setup hint.
 *
 * `opts.targetWord` lets the caller bias Whisper toward the current line's
 * word (much sharper than listing all 5 colour words) — paired with
 * `temperature=0` to keep decoding deterministic.
 */
export async function transcribeWithGroq(
  audio: Blob,
  opts: { targetWord?: string } = {},
): Promise<string> {
  const key = getGroqKey()
  if (!key) throw new Error('no-api-key')

  const form = new FormData()
  // The API expects a file field; Whisper sniffs the format from the upload.
  const ext = audio.type.includes('mp4') ? 'm4a' : audio.type.includes('ogg') ? 'ogg' : 'webm'
  form.append('file', audio, `attempt.${ext}`)
  form.append('model', MODEL)
  form.append('language', MAORI_LANG)
  form.append('response_format', 'json')
  // Lower temperature = greedy decoding = much more stable identification
  // when the child only utters one short word.
  form.append('temperature', '0')
  // Bias the model toward what we *expect* to hear. When the page tells us
  // which line is active, focus on that one word; otherwise fall back to
  // the full colour-word list as a softer hint.
  const prompt = opts.targetWord
    ? `Māori colour word: ${opts.targetWord}.`
    : SONG_LINES.map((l: SongLine) => l.maoriWord).join(' ')
  form.append('prompt', prompt)

  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`groq-${res.status}: ${detail.slice(0, 200)}`)
  }
  const data = (await res.json()) as { text?: string }
  return (data.text ?? '').trim()
}
