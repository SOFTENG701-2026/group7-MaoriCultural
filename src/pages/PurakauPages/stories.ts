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
export type SceneArtKey =
  | 'cover'
  | 'hide'
  | 'hook'
  | 'pull'
  | 'island'
  | 'sun-race'
  | 'plait'
  | 'snare'
  | 'long-day'

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
  // No content authored yet — shown in the book as "Coming soon", never playable
  // regardless of progress. (Distinct from the sequential gate below.)
  comingSoon?: boolean
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

// Story 2 — unlocked once the child finishes Story 1 (see `isStoryUnlocked`).
// Same data-driven shape: scenes (with a tap + a prop interaction), then a quiz.
const mauiAndTheSun: Story = {
  id: 'maui-sun',
  title: 'How Māui Caught the Sun',
  teReo: 'Māui me Te Rā',
  summary:
    'The sun zooms across the sky so fast that the days are far too short! Can Māui and his brothers catch Te Rā and teach it to slow down? Tap to find out…',
  cover: 'long-day',
  scenes: [
    {
      id: 'short-days',
      art: 'sun-race',
      caption: 'The sun races by too fast',
      narration: [
        'In the old days, the sun — Te Rā — raced across the sky far too fast.',
        'The days were so short that no one had time to fish, cook, or play before dark.',
        '"This is no good!" said clever Māui. "Let us catch the sun and slow it down."',
      ],
    },
    {
      id: 'plait',
      art: 'plait',
      caption: 'Plaiting strong flax ropes',
      narration: [
        'Māui and his brothers gathered harakeke — flax leaves — and plaited them into long, strong ropes.',
        'They worked hard to weave a great snare to catch Te Rā.',
      ],
      interaction: {
        kind: 'tap',
        prompt: 'Help plait the flax! Tap to twist the rope tight.',
        target: 5,
        cheer: 'Ka pai! The taura — the rope — is strong now!',
      },
    },
    {
      id: 'tame',
      art: 'snare',
      caption: 'Māui tames the sun',
      narration: [
        'The brothers crept east to the deep pit where the sun sleeps. As Te Rā rose, they dropped their snare around it!',
        'The sun pulled and roared. Māui needed one special taonga to make it listen.',
      ],
      interaction: {
        kind: 'prop',
        prompt: 'Which taonga can Māui use to make the sun slow down?',
        clue: 'Clue: look for a flat, smooth striking club held in one hand.',
        correctId: 'patu',
        cheer: 'Ka pai! The patu — Māui taps Te Rā and tells it to slow down!',
      },
    },
    {
      id: 'long-days',
      art: 'long-day',
      caption: 'Long, sunny days at last',
      narration: [
        'At last the sun grew tired and promised to move slowly across the sky.',
        'From that day on, the days were long and bright — with plenty of time to fish, cook, and play.',
        'And that, e hoa — my friend — is how Māui caught the sun.',
      ],
    },
  ],
  quiz: [
    {
      id: 'q-ra',
      badge: 'Kupu check',
      question: 'What is the Māori word for the sun?',
      options: [
        { id: 'ra', emoji: '☀️', word: 'Rā', correct: true },
        { id: 'marama', emoji: '🌙', word: 'Marama', correct: false },
        { id: 'whetu', emoji: '⭐', word: 'Whetū', correct: false },
        { id: 'ua', emoji: '🌧️', word: 'Ua', correct: false },
      ],
      funFact:
        'Fun fact: the sun\'s full name is Tama-nui-te-rā — "the great son, the sun"!',
      hint: 'Think of the bright light in the sky by day. We call it "Te Rā".',
      kikiCorrect: '"Rā" means sun. Ka pai!',
    },
    {
      id: 'q-taura',
      badge: 'Kupu check',
      question: 'Māui wove his snare from plaited flax. What is the Māori word for rope?',
      options: [
        { id: 'taura', emoji: '🪢', word: 'Taura', correct: true },
        { id: 'maunga', emoji: '⛰️', word: 'Maunga', correct: false },
        { id: 'manu', emoji: '🐦', word: 'Manu', correct: false },
        { id: 'awa', emoji: '🌊', word: 'Awa', correct: false },
      ],
      funFact:
        'Fun fact: flax — harakeke — is still woven today to make kete (baskets) and strong ropes!',
      hint: 'It is the strong plaited cord Māui used to snare the sun.',
      kikiCorrect: 'Tino pai! "Taura" means rope.',
    },
    {
      id: 'q-why',
      badge: 'Story check',
      question: 'Why did Māui want to catch the sun?',
      options: [
        { id: 'long', emoji: '🌅', word: 'To make the days longer', correct: true },
        { id: 'eat', emoji: '🍽️', word: 'To eat it', correct: false },
        { id: 'hide', emoji: '🙈', word: 'To hide it away', correct: false },
        { id: 'race', emoji: '🏁', word: 'To race it for fun', correct: false },
      ],
      funFact:
        'Fun fact: thanks to Māui, we now have long days to work, learn, and play in the sun!',
      hint: 'Remember — the days were too short. Māui wanted more daylight.',
      kikiCorrect: 'Ka pai! Māui slowed the sun so the days would be longer.',
    },
  ],
}

// "Coming soon" story — fills the book and signposts future content, but has no
// scenes/quiz yet, so it is never playable (regardless of progress).
const rangiAndPapa: Story = {
  id: 'rangi-papa',
  title: 'The Sky and the Earth',
  teReo: 'Ranginui rāua ko Papatūānuku',
  summary:
    'The sky father and earth mother hold each other so tightly that no light can get in. Who will set the world free? Coming soon…',
  cover: 'hide',
  comingSoon: true,
  scenes: [],
  quiz: [],
}

// Reading order. Stories unlock in sequence (see `isStoryUnlocked`).
export const STORIES: Story[] = [
  mauiFishesUpTheIsland,
  mauiAndTheSun,
  rangiAndPapa,
]

export function storyById(id: string | null): Story | null {
  if (!id) return null
  return STORIES.find((s) => s.id === id) ?? null
}

// Sequential gate: the first playable story is always open; every later story
// unlocks only once the previous *playable* story has been completed. A
// `comingSoon` story is never unlocked (it has no content yet). `isComplete` is
// injected so this stays free of store/UI dependencies.
export function isStoryUnlocked(
  id: string,
  isComplete: (storyId: string) => boolean,
): boolean {
  const i = STORIES.findIndex((s) => s.id === id)
  if (i < 0) return false
  if (STORIES[i].comingSoon) return false
  // Find the nearest earlier playable story; if none, this is the first one.
  for (let p = i - 1; p >= 0; p--) {
    if (STORIES[p].comingSoon) continue
    return isComplete(STORIES[p].id)
  }
  return true
}

// The story whose completion unlocks `id` (for the "finish X to unlock" label).
export function prerequisiteStory(id: string): Story | null {
  const i = STORIES.findIndex((s) => s.id === id)
  if (i < 0) return null
  for (let p = i - 1; p >= 0; p--) {
    if (!STORIES[p].comingSoon) return STORIES[p]
  }
  return null
}
