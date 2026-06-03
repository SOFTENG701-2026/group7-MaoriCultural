// Tracks which modules the child has completed.
// Uses sessionStorage so progress survives tab refresh but resets when:
//   - the terminal server is stopped and restarted (new session)
//   - the browser tab is closed and reopened
// This gives a clean start on each dev server run.
// Key: 'mca-progress' — Devs A, B, C write to it; Dev D reads from it.

const STORAGE_KEY = 'mca-progress'

class Progress {
  completed = $state<Set<string>>(new Set())

  constructor() {
    if (typeof sessionStorage === 'undefined') return

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return

      const data = JSON.parse(raw) as { completed?: string[] }

      if (Array.isArray(data.completed)) {
        this.completed = new Set(data.completed)
      }
    } catch {
      // Corrupt data — start fresh.
    }
  }

  isComplete(id: string): boolean {
    return this.completed.has(id)
  }

  markComplete(id: string): void {
    if (this.completed.has(id)) return

    this.completed = new Set([...this.completed, id])
    this.save()
  }

  reset(): void {
    this.completed = new Set()
    this.save()
  }

  private save(): void {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ completed: [...this.completed] })
      )
    } catch {
      // storage unavailable
    }
  }
}

export const progress = new Progress()