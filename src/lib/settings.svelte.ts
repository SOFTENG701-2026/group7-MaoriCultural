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

/**
 * Speak a line of text, honouring the sound + volume settings. Returns the
 * utterance (so callers can hook `onend`) or `undefined` when sound is off or
 * speech synthesis is unavailable.
 */
export function speak(text: string): SpeechSynthesisUtterance | undefined {
  if (!settings.soundOn) return
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 0.9
  u.volume = settings.volumeLevel
  window.speechSynthesis.speak(u)
  return u
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

/**
 * Automatic narration (read on entry / on a new line). Unlike `speak()` — which
 * is the manual "Read to me" button and only needs sound to be on — this is the
 * *hands-off* reader, so it must ALSO respect the "Read to me" mode: it speaks
 * only in "Out loud" mode (readMode === 'auto'). In the default "On tap" mode
 * nothing auto-reads, and the child uses the Read-to-me button instead. Any new
 * narration (or stopSpeaking) cancels speech in progress, so flipping pages,
 * going back, or leaving interrupts the voice.
 */
export function narrate(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text || !text.trim()) return;
  if (!settings.soundOn || settings.readMode !== 'auto') return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-NZ';
  utterance.rate = 0.85;
  utterance.pitch = 1;
  utterance.volume = settings.volumeLevel;

  synth.speak(utterance);
}
