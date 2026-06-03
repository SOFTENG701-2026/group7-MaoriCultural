// Author: Shirley
// Global, reactive accessibility & learning settings (FR14). One shared instance
// is imported across pages so the map, Waiata songs and quizzes all respond to
// the same preferences. Choices are saved to localStorage so they persist
// between visits.

export type Volume = 'low' | 'medium' | 'high'
export type ReadMode = 'tap' | 'auto' // read instructions on button tap, or aloud on page entry
export type TextSize = 'normal' | 'large'

const STORAGE_KEY = 'mca-settings'

class Settings {
  // Background music + sound effects master switch.
  soundOn = $state(true)
  // Simple, child-friendly volume steps.
  volume = $state<Volume>('medium')
  // How instruction text is read out.
  readMode = $state<ReadMode>('tap')
  // Normal vs large text.
  textSize = $state<TextSize>('normal')
  // Boost UI contrast for clearer vision.
  highContrast = $state(false)
  // Whether the settings panel is currently showing (any page can flip this).
  open = $state(false)

  constructor() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const s = JSON.parse(raw) as Partial<Record<string, unknown>>
      if (typeof s.soundOn === 'boolean') this.soundOn = s.soundOn
      if (s.volume === 'low' || s.volume === 'medium' || s.volume === 'high') this.volume = s.volume
      if (s.readMode === 'tap' || s.readMode === 'auto') this.readMode = s.readMode
      if (s.textSize === 'normal' || s.textSize === 'large') this.textSize = s.textSize
      if (typeof s.highContrast === 'boolean') this.highContrast = s.highContrast
    } catch {
      // Corrupt/old data — fall back to defaults.
    }
  }

  // Numeric volume (0–1) for speech / audio elements.
  get volumeLevel(): number {
    return this.volume === 'low' ? 0.3 : this.volume === 'high' ? 1 : 0.65
  }

  // A plain snapshot for persistence.
  toJSON() {
    return {
      soundOn: this.soundOn,
      volume: this.volume,
      readMode: this.readMode,
      textSize: this.textSize,
      highContrast: this.highContrast,
    }
  }
}

export const settings = new Settings()

// ── Voice selection ──────────────────────────────────────────────────────────
// The default speechSynthesis voice is often a harsh "screen-reader" voice. We
// pick the warmest, most natural English voice the device offers, preferring
// cloud-quality "Natural"/Google voices and NZ/AU/GB accents (closest to this
// app's setting) before falling back to decent local voices like Samantha.

// Cloud / neural voices that sound markedly more human when present.
const NATURAL_HINTS = ['natural', 'google', 'siri', 'premium', 'enhanced', 'neural']
// Good-quality built-in voices by name (macOS / Windows), in rough preference.
const NICE_NAMES = ['Samantha', 'Karen', 'Catherine', 'Serena', 'Moira', 'Tessa', 'Fiona', 'Daniel', 'Aria', 'Jenny', 'Libby', 'Sonia']

let chosenVoice: SpeechSynthesisVoice | null = null

function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase()
  const lang = v.lang.replace('_', '-').toLowerCase()
  let s = 0
  // Accent dominates — the app is set in Aotearoa, so a New Zealand voice wins
  // outright; the Australian accent is the closest stand-in, then British.
  if (lang.startsWith('en-nz') || name.includes('new zealand') || name.includes('aotearoa')) s += 200
  else if (lang.startsWith('en-au') || name.includes('australia')) s += 120
  else if (lang.startsWith('en-gb') || name.includes('british') || name.includes('united kingdom')) s += 45
  else if (lang.startsWith('en')) s += 25
  // Quality — cloud / neural / enhanced voices sound far more human.
  if (NATURAL_HINTS.some((h) => name.includes(h))) s += 60
  const ni = NICE_NAMES.findIndex((n) => v.name.includes(n))
  if (ni >= 0) s += 24 - ni
  if (v.localService) s += 2 // tie-breaker: offline voices are reliable
  return s
}

function refreshVoice(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    const voices = window.speechSynthesis.getVoices()
    if (!voices.length) return
    const english = voices.filter((v) => /^en/i.test(v.lang))
    const pool = english.length ? english : voices
    const best = pool.reduce((b, v) => (scoreVoice(v) > scoreVoice(b) ? v : b), pool[0])
    if (best && best.name !== chosenVoice?.name) {
      chosenVoice = best
      // Surface the pick so you can see which accent/voice you're hearing.
      console.info(`[speak] voice → ${best.name} (${best.lang})`)
    }
  } catch {
    /* getVoices unavailable — fall back to the engine default */
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoice()
  // Voices often load asynchronously; refresh when the engine reports them.
  try {
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoice)
  } catch {
    /* older engines: getVoices() was already populated above */
  }
}

/**
 * Speak a line of text, honouring the sound + volume settings. Uses the nicest
 * available voice with warm, child-friendly pacing. Never throws — speech is
 * non-essential, so a TTS failure must never break the caller's flow. Returns
 * the utterance (so callers can hook `onend`) or `undefined`.
 */
export function speak(text: string): SpeechSynthesisUtterance | undefined {
  if (!settings.soundOn) return
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
    if (!chosenVoice) refreshVoice()
    const u = new SpeechSynthesisUtterance(text)
    if (chosenVoice) {
      u.voice = chosenVoice
      u.lang = chosenVoice.lang
    }
    u.rate = 0.95 // a touch slower for young readers
    u.pitch = 1.12 // a little brighter / friendlier (Kiki)
    u.volume = settings.volumeLevel
    window.speechSynthesis.speak(u)
    return u
  } catch {
    return undefined
  }
}

/**
 * Speak automatically ONLY when the learner has chosen "Out loud" mode
 * (readMode === 'auto'). Used for narration / hints / cheers so that, by
 * default (readMode === 'tap'), nothing is voiced unless the child taps a
 * "Read to me" / 🔊 button — those call `speak()` directly and always sound.
 */
export function narrate(text: string): SpeechSynthesisUtterance | undefined {
  if (settings.readMode !== 'auto') return
  return speak(text)
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
