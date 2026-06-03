// Data model + content for the Purākau module. The whole module is driven by
// this file: the storybook lists these stories, and the player walks through a
// story's `scenes`, `sequence` mini-game and `quiz`. Adding a new pūrākau is
// purely a data change here (plus PNG illustrations in true_alpha_ui_assets).
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

// ── Scene images (Story 1: Māui and the Giant Fish) ──────────────────────────
// Keys map to PNG illustrations via SCENE_IMAGES in assets.ts.
export type SceneImage = 'img-1' | 'img-2' | 'img-3' | 'img-4' | 'img-5'

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
// `image` keys map to a PNG illustration in assets.ts → SCENE_IMAGES.
// `caption` is the short line shown on the sequencing card + during playback.
// `narration` is what Kiki reads, one paragraph per array item.
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
  image: SceneImage
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
  coverImage: SceneImage
  // No content authored yet — shown in the book as "Coming soon", never playable
  // regardless of progress. (Distinct from the sequential gate below.)
  comingSoon?: boolean
  scenes: Scene[]
  quiz: QuizQuestion[]
}

// ── Story 1: Māui and the Giant Fish ─────────────────────────────────────────
// Text adapted from docs/fish_story.txt, split into 5 segments matching
// illustrations 1–5 in true_alpha_ui_assets.
const mauiFishesUpTheIsland: Story = {
  id: 'maui-fish',
  title: 'How Māui Fished Up the Island',
  teReo: 'Te Ika-a-Māui',
  summary:
    "A cheeky boy hides in his brothers' canoe and sails far out to sea. What giant secret waits beneath the waves? Tap to find out…",
  coverImage: 'img-1',
  scenes: [
    {
      id: 'plan',
      image: 'img-1',
      caption: 'Māui secretly makes his fishing line',
      narration: [
        'Māui dreamed of going fishing with his older brothers. But they always made excuses. "No, you\'re too young! We need all the room in our waka for the fish."',
        'Māui was determined. "I\'ll prove how good I am!" One night, he secretly wove a strong fishing line from flax, chanting a karakia to give it strength.',
        'When he was finished, Māui took the jawbone his grandmother Murirangawhenua had given him — and bound it to the line as a magic hook.',
      ],
    },
    {
      id: 'reveal',
      image: 'img-2',
      caption: 'Māui reveals himself at sea',
      narration: [
        'Early next morning, Māui crept into the hull of his brothers\' waka and hid. When the brothers pulled the canoe into the sea, they grumbled, "The waka feels heavy today!"',
        'They paddled far out and dropped anchor. Then — surprise! Māui jumped out from his hiding place! The brothers were shocked. "What! You tricked us!"',
        'But Māui had brought a special taonga hidden in his bag — a magic fish hook. Which one is it?',
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
      id: 'cast',
      image: 'img-3',
      caption: 'Māui casts his magic hook',
      narration: [
        '"I have come to fish because Murirangawhenua said I would be a great fisherman," Māui declared. He began his karakia, and the brothers\' lines filled with fish — the waka was soon overflowing!',
        '"Now it is my turn," said Māui, pulling out his own line. The brothers laughed. "You\'ll be lucky to catch a piece of seaweed with that!" But Māui knew his magic hook was special.',
      ],
    },
    {
      id: 'pull',
      image: 'img-4',
      caption: 'The giant fish rises from the sea',
      narration: [
        'The brothers refused to share their bait, so Māui hit his nose and smeared his own blood on the hook. He stood at the front of the waka, whirled his line, and cast it far out to sea.',
        'The line sank deep into the domain of Tangaroa. Suddenly — TUG! Something enormous pulled on the line! Māui held on with all his strength.',
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
      image: 'img-5',
      caption: 'The fish becomes the North Island',
      narration: [
        'The waka shot across the ocean! "Cut the line!" the brothers cried in terror. But Māui held tight, and slowly a giant fish rose to the surface — so huge it towered over their little canoe.',
        '"This is the fish Murirangawhenua promised us," Māui said. "Guard it while I fetch our people." But as soon as he left, the greedy brothers began chopping at the fish, carving deep gullies and mountains into its flesh.',
        'Over time, the great fish became Te Ika-a-Māui — the North Island of Aotearoa. And the brothers\' waka became Te Waka-a-Māui — the South Island.',
        'And that, e hoa, is how Māui fished up Aotearoa.',
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
        "Fun fact: Māui's hook was carved from the magic jawbone of his grandmother, Murirangawhenua!",
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
        "Fun fact: the brothers' waka became Te Waka-a-Māui — the South Island!",
      hint: 'Māui hid inside it at the very start. It floats on the sea.',
      kikiCorrect: 'Tino pai! "Waka" means canoe.',
    },
  ],
}

// ── Story 2: Māui and the Sun (coming soon — needs illustration assets) ──────
const mauiAndTheSun: Story = {
  id: 'maui-sun',
  title: 'How Māui Caught the Sun',
  teReo: 'Māui me Te Rā',
  summary:
    'The sun zooms across the sky so fast that the days are far too short! Can Māui and his brothers catch Te Rā and teach it to slow down? Coming soon…',
  coverImage: 'img-1', // placeholder — will be updated when assets arrive
  comingSoon: true,
  scenes: [],
  quiz: [],
}

// ── Story 3: The Sky and the Earth (coming soon — needs illustration assets) ─
const rangiAndPapa: Story = {
  id: 'rangi-papa',
  title: 'The Sky and the Earth',
  teReo: 'Ranginui rāua ko Papatūānuku',
  summary:
    'The sky father and earth mother hold each other so tightly that no light can get in. Who will set the world free? Coming soon…',
  coverImage: 'img-1', // placeholder — will be updated when assets arrive
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
