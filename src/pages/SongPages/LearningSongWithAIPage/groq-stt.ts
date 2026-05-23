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

export async function startRecording(opts: { maxMs?: number } = {}): Promise<Recorder> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('mic-unsupported')
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

  // Pick the first mime type the browser actually supports. Whisper accepts
  // a wide range, so we just take whatever the platform gives us.
  const mime = pickMimeType()
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
  const chunks: BlobPart[] = []
  let resolver: (b: Blob) => void
  let rejecter: (e: unknown) => void
  const done = new Promise<Blob>((res, rej) => {
    resolver = res
    rejecter = rej
  })

  rec.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data)
  }
  rec.onerror = (e) => rejecter(e)
  rec.onstop = () => {
    const blob = new Blob(chunks, { type: mime || 'audio/webm' })
    // Release the microphone so the browser indicator turns off promptly.
    stream.getTracks().forEach((t) => t.stop())
    resolver(blob)
  }

  rec.start()
  const timer = setTimeout(() => {
    if (rec.state !== 'inactive') rec.stop()
  }, opts.maxMs ?? 5000)

  return {
    stop: () => {
      clearTimeout(timer)
      if (rec.state !== 'inactive') rec.stop()
    },
    done,
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
 */
export async function transcribeWithGroq(audio: Blob): Promise<string> {
  const key = getGroqKey()
  if (!key) throw new Error('no-api-key')

  const form = new FormData()
  // The API expects a file field; Whisper sniffs the format from the upload.
  const ext = audio.type.includes('mp4') ? 'm4a' : audio.type.includes('ogg') ? 'ogg' : 'webm'
  form.append('file', audio, `attempt.${ext}`)
  form.append('model', MODEL)
  form.append('language', MAORI_LANG)
  form.append('response_format', 'json')
  // A short prompt nudges Whisper toward the colour vocabulary we're
  // actually teaching, which helps when a child only says one word.
  form.append('prompt', SONG_LINES.map((l: SongLine) => l.maoriWord).join(' '))

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
