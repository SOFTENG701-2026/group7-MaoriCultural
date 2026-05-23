// Grace Liao
// Tracks which activities the child has completed. Persisted to localStorage
// so progress survives page refreshes. Imported across pages so any component
// can read or update completion state reactively.

const STORAGE_KEY = 'mca-progress'

class Progress {
  completed = $state<Set<string>>(new Set())

  constructor() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
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

  private save(): void {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ completed: [...this.completed] })
      )
    } catch { /* storage unavailable */ }
  }
}

export const progress = new Progress()
