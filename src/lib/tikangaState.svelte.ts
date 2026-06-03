// Tikanga module state — reactive singleton persisted to localStorage.
// Tracks learner level and which marae stations have been completed.

const STORAGE_KEY = 'mca-tikanga'

export type LearnerLevel = 'beginner' | 'confident'
export type StationProgress = {
  entrance: boolean
  welcome: boolean
  wharenui: boolean
  kaiCare: boolean
}

class TikangaState {
  level = $state<LearnerLevel>('beginner')
  stations = $state<StationProgress>({
    entrance: false,
    welcome: false,
    wharenui: false,
    kaiCare: false,
  })

  constructor() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw) as { level?: string; stations?: Partial<StationProgress> }
      if (data.level === 'beginner' || data.level === 'confident') {
        this.level = data.level
      }
      if (data.stations && typeof data.stations === 'object') {
        this.stations = {
          entrance: !!data.stations.entrance,
          welcome: !!data.stations.welcome,
          wharenui: !!data.stations.wharenui,
          kaiCare: !!data.stations.kaiCare,
        }
      }
    } catch {
      // Corrupt data — start fresh.
    }
  }

  setLevel(l: LearnerLevel): void {
    this.level = l
    this.save()
  }

  completeStation(s: keyof StationProgress): void {
    this.stations = { ...this.stations, [s]: true }
    this.save()
  }

  reset(): void {
    this.stations = { entrance: false, welcome: false, wharenui: false, kaiCare: false }
    this.save()
  }

  private save(): void {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ level: this.level, stations: this.stations })
      )
    } catch {
      /* storage unavailable */
    }
  }
}

export const tikangaState = new TikangaState()
