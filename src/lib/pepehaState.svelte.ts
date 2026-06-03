// Pepeha module state — reactive singleton persisted to localStorage.
// Tracks learner level, the chosen practice-school example, which stickers
// have been collected, and the whānau-circle choices.
//
// Cultural safety: the selected school is a fixed, teacher-reviewed *practice
// example* for Kiki. It is never presented as the learner's own pepeha, and no
// private family data is ever stored here.

import { SCHOOL_PROFILES, type SchoolProfile } from '../pages/PepehaPages/schools'

const STORAGE_KEY = 'mca-pepeha'

export type LearnerLevel = 'beginner' | 'confident'

// The four pieces the learner collects for Kiki's practice pepeha.
export type StickerId = 'ingoa' | 'maunga' | 'awa' | 'whanau'

class PepehaState {
  level = $state<LearnerLevel>('beginner')
  selectedSchoolId = $state<string | null>(null)
  collectedStickers = $state<StickerId[]>([])
  // Labels of the whānau-circle stickers the learner picked (e.g. "My teacher").
  // Generic, non-private labels only — never real family names.
  whanauChoices = $state<string[]>([])

  constructor() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw) as {
        level?: string
        selectedSchoolId?: string | null
        collectedStickers?: string[]
        whanauChoices?: string[]
      }
      if (data.level === 'beginner' || data.level === 'confident') {
        this.level = data.level
      }
      if (typeof data.selectedSchoolId === 'string') {
        this.selectedSchoolId = data.selectedSchoolId
      }
      if (Array.isArray(data.collectedStickers)) {
        this.collectedStickers = data.collectedStickers.filter(isStickerId)
      }
      if (Array.isArray(data.whanauChoices)) {
        this.whanauChoices = data.whanauChoices.filter((s): s is string => typeof s === 'string')
      }
    } catch {
      // Corrupt data — start fresh.
    }
  }

  // The currently selected practice-school profile, or null if none chosen yet.
  get selectedSchool(): SchoolProfile | null {
    return SCHOOL_PROFILES.find(s => s.id === this.selectedSchoolId) ?? null
  }

  hasSticker(id: StickerId): boolean {
    return this.collectedStickers.includes(id)
  }

  setLevel(l: LearnerLevel): void {
    this.level = l
    this.save()
  }

  selectSchool(id: string): void {
    this.selectedSchoolId = id
    this.save()
  }

  addSticker(id: StickerId): void {
    if (!this.collectedStickers.includes(id)) {
      this.collectedStickers = [...this.collectedStickers, id]
      this.save()
    }
  }

  setWhanauChoices(labels: string[]): void {
    this.whanauChoices = labels
    this.save()
  }

  // Reset Kiki's collected pieces for a fresh run (e.g. "Try another school").
  // Keeps the chosen level.
  reset(): void {
    this.selectedSchoolId = null
    this.collectedStickers = []
    this.whanauChoices = []
    this.save()
  }

  private save(): void {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          level: this.level,
          selectedSchoolId: this.selectedSchoolId,
          collectedStickers: this.collectedStickers,
          whanauChoices: this.whanauChoices,
        })
      )
    } catch {
      /* storage unavailable */
    }
  }
}

function isStickerId(s: unknown): s is StickerId {
  return s === 'ingoa' || s === 'maunga' || s === 'awa' || s === 'whanau'
}

export const pepehaState = new PepehaState()
