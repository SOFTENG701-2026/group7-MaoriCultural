// Purākau module state — reactive singleton persisted to localStorage.
// Tracks which pūrākau (stories) the child has finished and which story is
// currently being read.
//
// Module-level completion (map marker + badge) is handled by the dedicated
// PurakauRewardPage, which calls progress.markComplete('purakau') and persists
// the badge level — following the Tikanga module pattern.

const STORAGE_KEY = 'mca-purakau'

class PurakauState {
  // Ids of stories the child has fully read (scenes + sequencing + quiz).
  completedStoryIds = $state<string[]>([])
  // The story currently being read in the player, set when the child opens it
  // from the storybook. Kept out of localStorage so a refresh returns to the
  // bookshelf rather than dropping mid-story.
  activeStoryId = $state<string | null>(null)
  // Transient flag: the story that was *just* finished, so the storybook can
  // play the black-and-white → colour reveal once on return (Step 6). Consumed
  // (cleared) after the storybook reads it.
  justColoredStoryId = $state<string | null>(null)

  constructor() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw) as { completedStoryIds?: unknown }
      if (Array.isArray(data.completedStoryIds)) {
        this.completedStoryIds = data.completedStoryIds.filter(
          (s): s is string => typeof s === 'string',
        )
      }
    } catch {
      // Corrupt data — start fresh.
    }
  }

  isComplete(id: string): boolean {
    return this.completedStoryIds.includes(id)
  }

  // Begin reading a story (called from the storybook on "Read this story").
  start(id: string): void {
    this.activeStoryId = id
  }

  // Mark the active story finished. Sets the colour-reveal flag for the
  // storybook and records the story id so the storybook can play the
  // black-and-white → colour reveal animation on return.
  // Module-level progress (map marker + badge) is handled by the dedicated
  // PurakauRewardPage, following the Tikanga module pattern.
  completeActiveStory(): void {
    const id = this.activeStoryId
    if (!id) return
    if (!this.completedStoryIds.includes(id)) {
      this.completedStoryIds = [...this.completedStoryIds, id]
      this.save()
    }
    this.justColoredStoryId = id
    this.activeStoryId = null
  }

  /** How many playable stories have been completed (for reward-page stats). */
  get completedCount(): number {
    return this.completedStoryIds.length
  }

  // Read-and-clear the colour-reveal flag so the animation only plays once.
  consumeJustColored(): string | null {
    const id = this.justColoredStoryId
    this.justColoredStoryId = null
    return id
  }

  private save(): void {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ completedStoryIds: this.completedStoryIds }),
      )
    } catch {
      /* storage unavailable */
    }
  }
}

export const purakauState = new PurakauState()
