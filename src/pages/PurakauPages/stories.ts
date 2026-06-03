// Data model + content for the Purākau module. The whole module is driven by
// this file: the storybook lists these stories, and the player walks through a
// story's `scenes`, `sequence` mini-game and `quiz`. Adding a new pūrākau is
// purely a data change here (plus a SceneArt entry for any new `art` key).
//
// Cultural safety: story text is fixed and teacher-reviewable. It teaches a
// well-known pūrākau in simple language for Year 1–3 readers, weaving in a few
// kupu Māori (Māori words). No content is generated at runtime.

import {
  propTaiaha,
  propPatunihi,
  propFeathers,
  propWahaika,
  propMatau,
} from './assets'

// ── Props (Step 3) ───────────────────────────────────────────────────────────
export type PropId = 'taiaha' | 'patu' | 'raukura' | 'wahaika' | 'matau'

export interface Prop {
  id: PropId
  name: string // te reo Māori name
  en: string // short English gloss (shown under the name)
  img: string
}

// The five carved taonga shown on the tray. Order is fixed; the picker shuffles
// them per attempt so the answer isn't always in the same spot.
export const PROPS: Prop[] = [
  { id: 'taiaha', name: 'Taiaha', en: 'a long fighting staff', img: propTaiaha },
  { id: 'patu', name: 'Patu', en: 'a flat hand club', img: propPatunihi },
  { id: 'raukura', name: 'Raukura', en: 'a bundle of feathers', img: propFeathers },
  { id: 'wahaika', name: 'Wahaika', en: 'a carved hand club', img: propWahaika },
  { id: 'matau', name: 'Matau', en: 'a fish hook', img: propMatau },
]

export function propById(id: PropId): Prop {
  return PROPS.find((p) => p.id === id) ?? PROPS[0]
}

// ── Scenes (Step 3) ──────────────────────────────────────────────────────────
// `art` keys map to a drawing in SceneArt.svelte. `caption` is the short line
// shown on the sequencing card + during playback. `narration` is what Kiki
// reads, one paragraph per array item.
export type SceneArtKey = 'cover' | 'hide' | 'hook' | 'pull' | 'island'

export type Interaction =
  | {
      kind: 'prop'
      prompt: string
      clue: string
      correctId: PropId
      cheer: string
    }
  | {
      kind: 'tap'
      prompt: string
      target: number
      cheer: string
    }

export interface Scene {
  id: string
  art: SceneArtKey
  caption: string
  narration: string[]
  interaction?: Interaction
}

// ── Quiz (Step 5) ────────────────────────────────────────────────────────────
export interface QuizOption {
  id: string
  emoji: string
  word: string
  correct: boolean
}

export interface QuizQuestion {
  id: string
  badge: string
  question: string
  options: QuizOption[]
  funFact: string // shown by Kiki on a correct answer
  hint: string // gentle nudge on a wrong answer (no punishment)
  kikiCorrect: string
}

// ── Story ────────────────────────────────────────────────────────────────────
export interface Story {
  id: string
  title: string
  teReo: string // te reo Māori title shown as the eyebrow
  summary: string // suspenseful one-liner for the storybook page
  cover: SceneArtKey
  locked?: boolean // "coming soon" — visible in the book but not playable yet
  scenes: Scene[]
  quiz: QuizQuestion[]
}

const mauiFishesUpTheIsland: Story = {
  id: 'maui-fish',
  title: 'How Māui Fished Up the Island',
  teReo: 'Te Ika-a-Māui',
  summary:
    "A cheeky boy hides in his brothers' canoe and sails far out to sea. What giant secret waits beneath the waves? Tap to find out…",
  cover: 'cover',
  scenes: [
    {
      id: 'hide',
      art: 'hide',
      caption: 'Māui hides in the waka',
      narration: [
        'Long ago there lived a clever boy named Māui. He was the youngest of many brothers.',
        'Every morning his big brothers paddled their waka — their canoe — far out to sea to fish. But they never took little Māui.',
        'So one night, Māui crept down and hid under the floor of the waka. Shhh!',
      ],
    },
    {
      id: 'hook',
      art: 'hook',
      caption: 'Māui finds his magic hook',
      narration: [
        'When the sun came up, the brothers paddled far, far out to sea. Then — surprise! Māui jumped out!',
        'Māui wanted to catch the biggest fish of all. But for that, he needed one very special taonga.',
      ],
      interaction: {
        kind: 'prop',
        prompt: 'Help Māui! Which taonga can catch a giant fish?',
        clue: 'Clue: look for something made of bone, with a sharp, curved point.',
        correctId: 'matau',
        cheer: "Ka pai! That's the matau — Māui's magic fish hook!",
      },
    },
    {
      id: 'pull',
      art: 'pull',
      caption: 'A giant tug on the line!',
      narration: [
        'Māui tied the matau to a strong line. He said a karakia — a special chant — and threw it into the deep blue sea.',
        'Suddenly… TUG! Something HUGE pulled on the line. Māui held on tight!',
      ],
      interaction: {
        kind: 'tap',
        prompt: 'Help Māui pull! Tap the line as hard as you can!',
        target: 5,
        cheer: 'Heave ho! You did it — up it comes!',
      },
    },
    {
      id: 'island',
      art: 'island',
      caption: 'The fish becomes the island',
      narration: [
        'Up from the water came a fish so enormous that it became land!',
        "That giant fish is now the North Island — Te Ika-a-Māui, 'the fish of Māui'. And the brothers' waka became the South Island — Te Waka-a-Māui!",
        'And that, e hoa — my friend — is how Māui fished up Aotearoa.',
      ],
    },
  ],
  quiz: [
    {
      id: 'q-matau',
      badge: 'Kupu check',
      question: "What do we call Māui's special fish hook?",
      options: [
        { id: 'matau', emoji: '🪝', word: 'Matau', correct: true },
        { id: 'taiaha', emoji: '🪵', word: 'Taiaha', correct: false },
        { id: 'waka', emoji: '🛶', word: 'Waka', correct: false },
        { id: 'whare', emoji: '🏠', word: 'Whare', correct: false },
      ],
      funFact:
        'Fun fact: Māui\'s hook was carved from the magic jawbone of his grandmother, Murirangawhenua!',
      hint: 'Think about the bone hook you gave Māui. It starts with "Ma…"',
      kikiCorrect: '"Matau" means fish hook. Ka pai!',
    },
    {
      id: 'q-island',
      badge: 'Story check',
      question: 'The giant fish became which island?',
      options: [
        { id: 'north', emoji: '🐟', word: 'The North Island', correct: true },
        { id: 'cloud', emoji: '☁️', word: 'A cloud', correct: false },
        { id: 'maunga', emoji: '⛰️', word: 'A mountain', correct: false },
        { id: 'star', emoji: '⭐', word: 'A star', correct: false },
      ],
      funFact:
        'Fun fact: on a map, Te Ika-a-Māui (the North Island) looks like a stingray — Wellington is its mouth!',
      hint: 'Remember — the fish turned into land. We call it Te Ika-a-Māui.',
      kikiCorrect: 'Ka pai! The fish became Te Ika-a-Māui, the North Island.',
    },
    {
      id: 'q-waka',
      badge: 'Kupu check',
      question: 'What is the Māori word for a canoe?',
      options: [
        { id: 'waka', emoji: '🛶', word: 'Waka', correct: true },
        { id: 'maunga', emoji: '⛰️', word: 'Maunga', correct: false },
        { id: 'awa', emoji: '🌊', word: 'Awa', correct: false },
        { id: 'manu', emoji: '🐦', word: 'Manu', correct: false },
      ],
      funFact:
        'Fun fact: the brothers\' waka became Te Waka-a-Māui — the South Island!',
      hint: 'Māui hid inside it at the very start. It floats on the sea.',
      kikiCorrect: 'Tino pai! "Waka" means canoe.',
    },
  ],
}

// "Coming soon" stories — they fill the storybook so it feels like a real book
// and signpost future content, but are clearly locked and not yet playable.
const comingSoon: Story[] = [
  {
    id: 'maui-sun',
    title: 'Māui and the Sun',
    teReo: 'Māui me Te Rā',
    summary:
      'The sun races across the sky far too fast! Can Māui and his brothers catch it and make the days longer? Coming soon…',
    cover: 'island',
    locked: true,
    scenes: [],
    quiz: [],
  },
  {
    id: 'rangi-papa',
    title: 'The Sky and the Earth',
    teReo: 'Ranginui rāua ko Papatūānuku',
    summary:
      'The sky father and earth mother hold each other so tightly that no light can get in. Who will set the world free? Coming soon…',
    cover: 'hide',
    locked: true,
    scenes: [],
    quiz: [],
  },
]

export const STORIES: Story[] = [mauiFishesUpTheIsland, ...comingSoon]

export function storyById(id: string | null): Story | null {
  if (!id) return null
  return STORIES.find((s) => s.id === id) ?? null
}
