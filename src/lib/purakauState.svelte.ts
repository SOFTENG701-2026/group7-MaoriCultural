// Purākau module state — reactive singleton persisted to localStorage.
// Tracks which pūrākau (stories) the child has finished and which story is
// currently being read. Completing a story also flips the shared `purakau`
// completion flag (see `progress`) so the map marker is marked done and the
// "Pūrākau" medal lights up in the reward panel — this is the module's call to
// the kick-off `awardBadge` contract, implemented here via the shared
// `progress` store the rest of the app already reads.

import { progress } from './progress.svelte'

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
  // storybook and lights the shared map/medal flag the first time any pūrākau
  // is completed.
  completeActiveStory(): void {
    const id = this.activeStoryId
    if (!id) return
    if (!this.completedStoryIds.includes(id)) {
      this.completedStoryIds = [...this.completedStoryIds, id]
      this.save()
    }
    this.justColoredStoryId = id
    this.activeStoryId = null
    // Cross-module integration: light the "Pūrākau" medal + map marker.
    progress.markComplete('purakau')
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
