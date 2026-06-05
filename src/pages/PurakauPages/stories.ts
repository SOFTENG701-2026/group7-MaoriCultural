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

// ── Scene images ─────────────────────────────────────────────────────────────
// Keys map to PNG illustrations via SCENE_IMAGES in assets.ts.
//   img-* → Story 1 (Māui and the Giant Fish, 5 illustrations)
//   sky-* → Story 2 (The Separation of Earth and Sky, 7 illustrations)
export type SceneImage =
  | 'img-1' | 'img-2' | 'img-3' | 'img-4' | 'img-5'
  | 'sky-1' | 'sky-2' | 'sky-3' | 'sky-4' | 'sky-5' | 'sky-6' | 'sky-7'

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

// A glowing point the child taps on the full-screen illustration (Story 2's
// "awaken the sparks" / "hang the stars" challenges). x/y are percentages of
// the viewport so spots sit over the art at any size.
export interface Hotspot {
  id: string
  x: number // 0–100 (% from left)
  y: number // 0–100 (% from top)
  emoji: string
}

// One tappable option in an inline story decision (Story 2's "what should the
// children do?"). Mirrors the quiz model but lives inside a scene.
export interface ChoiceOption {
  id: string
  emoji: string
  text: string
  correct: boolean
  hint: string // gentle, choice-specific nudge on a wrong tap (no punishment)
}

export type Interaction =
  | {
      kind: 'prop'
      prompt: string
      clue: string
      correctId: PropId
      cheer: string
    }
  | {
      // Repeated-tap meter. Story 1: pull the fishing line. Story 2: push the
      // sky apart (icon/label customise the button per story).
      kind: 'tap'
      prompt: string
      target: number
      cheer: string
    }
  | {
      // Story 2 climax — tap-and-tap to push earth and sky apart; a beam of
      // light grows brighter with every push until the world breaks open.
      kind: 'push'
      prompt: string
      target: number
      cheer: string
      icon: string
      label: string
    }
  | {
      // Story 2 — tap glowing points scattered across the illustration
      // (awaken the sparks of Te Kore; hang the stars on Ranginui).
      kind: 'hotspots'
      prompt: string
      cheer: string
      spots: Hotspot[]
      need?: number // how many to tap (defaults to all spots)
    }
  | {
      // Story 2 — an inline story decision with gentle, controlled choices.
      kind: 'choice'
      prompt: string
      cheer: string
      options: ChoiceOption[]
    }

export interface Scene {
  id: string
  image: SceneImage
  caption: string
  narration: string[]
  interaction?: Interaction
  // Optional ambient particle layer over the art (immersion only, no input).
  ambient?: 'stars' | 'rain' | 'light'
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
        'Māui dreamed of going fishing with his brothers, but they always said no. "You\'re too young for our waka!" So one night, he secretly wove a strong fishing line from flax, chanting a karakia for strength.',
        'He took the jawbone his grandmother Murirangawhenua gave him and bound it to the line — a magic hook.',
      ],
    },
    {
      id: 'reveal',
      image: 'img-2',
      caption: 'Māui reveals himself at sea',
      narration: [
        'Before dawn, Māui crept into the hull of the waka and hid. Far out at sea, he jumped out — surprising his brothers! "What! You tricked us!"',
        'But Māui had brought a special taonga — a magic fish hook. Which one is it?',
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
        'Māui began his karakia and the brothers\' lines filled with fish — the waka was soon overflowing! "Now my turn," said Māui. The brothers laughed at his little line, but Māui knew his magic hook was special.',
      ],
    },
    {
      id: 'pull',
      image: 'img-4',
      caption: 'The giant fish rises from the sea',
      narration: [
        'With no bait to share, Māui smeared his own blood on the hook. He cast his line deep into the domain of Tangaroa. Suddenly — TUG! Something enormous pulled!',
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
        'The waka shot across the ocean! But Māui held tight, and slowly a giant fish rose — so huge it towered over their canoe.',
        '"This is the fish Murirangawhenua promised us," Māui said. But while he was gone, his greedy brothers chopped at the fish, carving deep gullies and mountains into its flesh.',
        'Over time, the fish became Te Ika-a-Māui — the North Island. The waka became Te Waka-a-Māui — the South Island. And that is how Māui fished up Aotearoa.',
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

// ── Story 2: The Separation of Earth and Sky ─────────────────────────────────
// Text adapted from docs/story2-The Separation of Earth and Sky.txt, retold in
// simple language for Year 1–3 readers across the 7 illustrations in story_2/.
// Four scenes carry an interaction (awaken the void, make the children's
// choice, push the sky apart, hang the stars); the rest are narrated art.
const separationOfEarthAndSky: Story = {
  id: 'rangi-papa',
  title: 'The Separation of Earth and Sky',
  teReo: 'Ranginui rāua ko Papatūānuku',
  summary:
    'The Sky Father and Earth Mother hold each other so tightly that their children live squashed in the dark. Who is strong enough to set the world free? Tap to find out…',
  coverImage: 'sky-2',
  scenes: [
    {
      id: 'void',
      image: 'sky-1',
      caption: 'Te Kore — the great nothing',
      ambient: 'stars',
      narration: [
        'Long, long ago — before the sea, before the land, before light — there was only Te Kore, the great nothing. It was empty and dark, yet deep inside it slept the seeds of everything that could ever be.',
        'Slowly came Te Pō, the long, long night. Tap the sleeping sparks of light to help the world begin to wake!',
      ],
      interaction: {
        kind: 'hotspots',
        prompt: 'Tap each sleeping spark to wake the world.',
        cheer: 'Ka pai! Out of the darkness, the world begins to stir.',
        spots: [
          { id: 's1', x: 22, y: 38, emoji: '✨' },
          { id: 's2', x: 46, y: 30, emoji: '⭐' },
          { id: 's3', x: 67, y: 44, emoji: '✨' },
          { id: 's4', x: 35, y: 62, emoji: '⭐' },
          { id: 's5', x: 78, y: 64, emoji: '✨' },
        ],
      },
    },
    {
      id: 'embrace',
      image: 'sky-2',
      caption: 'Ranginui and Papatūānuku',
      narration: [
        'Then came Ranginui, the Sky Father, and Papatūānuku, the Earth Mother. They loved each other so dearly that they held on tight, with no space and no light between them.',
        'Their children were born in that narrow dark — squashed, damp, and unable to stand. Among them were Tāne of the forests, Tangaroa of the sea, and Tāwhirimātea of the winds and storms.',
      ],
    },
    {
      id: 'debate',
      image: 'sky-3',
      caption: 'The children make a plan',
      narration: [
        'The children grew tired of the cramped dark. They longed for room to stand and grow. "What can we do?" they whispered to one another.',
        'Tūmatauenga, fierce and angry, wanted to harm their parents. But the others were not sure. What do you think the children should do?',
      ],
      interaction: {
        kind: 'choice',
        prompt: 'What should the children do?',
        cheer:
          'Ka pai! The children will gently push their parents apart — so both Ranginui and Papatūānuku can still live.',
        options: [
          {
            id: 'separate',
            emoji: '🙌',
            text: 'Gently push them apart',
            correct: true,
            hint: '',
          },
          {
            id: 'harm',
            emoji: '😠',
            text: 'Harm their parents',
            correct: false,
            hint: "That's Tū's angry idea. But the other brothers don't want to hurt their parents — only to make room. Is there a kinder way?",
          },
          {
            id: 'stay',
            emoji: '🌑',
            text: 'Stay in the dark forever',
            correct: false,
            hint: 'But then they could never stand, see, or grow. The children need light! Look for a gentler way to make space.',
          },
        ],
      },
    },
    {
      id: 'push',
      image: 'sky-4',
      caption: 'Tāne pushes the sky away',
      ambient: 'light',
      narration: [
        'One by one the brothers tried to part the sky and the earth, but none was strong enough. Finally Tāne-mahuta lay on his back, set his feet against Ranginui, and pushed with all his might!',
        'Help Tāne push! Tap, tap, tap to lift the Sky Father high above the land.',
      ],
      interaction: {
        kind: 'push',
        prompt: 'Push with Tāne — tap as hard as you can!',
        target: 8,
        icon: '💪',
        label: 'PUSH!',
        cheer:
          'Heave… HO! Earth and Sky break apart, and for the very first time light pours in. Welcome to Te Ao Mārama — the world of light!',
      },
    },
    {
      id: 'storm',
      image: 'sky-5',
      caption: "Tāwhirimātea's storm",
      ambient: 'rain',
      narration: [
        'Only Tāwhirimātea was angry that his parents were parted. He flew up into the sky to live with his father, then sent down wild winds, clouds, and rain to fight his brothers.',
        "He tore at Tāne's trees and whipped up Tangaroa's seas. Some of the sea-children stayed as fish, while others fled into the forest. That is why storms still race across the land and sea today.",
      ],
    },
    {
      id: 'whakapapa',
      image: 'sky-6',
      caption: 'People and nature, one family',
      narration: [
        "Tūmatauenga became the ancestor of people — of us. His children learned to take wood from Tāne's forest, fish from Tangaroa's sea, and kūmara from the gardens of Rongo.",
        'But no one can tame the weather of Tāwhirimātea. This is a special Māori idea: through whakapapa — our family line — people, atua, and nature all belong to one big family.',
      ],
    },
    {
      id: 'stars',
      image: 'sky-7',
      caption: 'Tāne dresses the sky',
      ambient: 'stars',
      narration: [
        'High above, Ranginui still grieved for Papatūānuku. To comfort his father, Tāne climbed up and dressed him with the glowing sun, the moon, and a blanket of stars.',
        'Help Tāne hang the stars! Tap the night sky to place each shining light.',
      ],
      interaction: {
        kind: 'hotspots',
        prompt: 'Tap the sky to hang each star.',
        cheer:
          'Beautiful! Now Ranginui shines, even far from Papatūānuku. And so creation carried on — through life, knowledge, and the stars above.',
        spots: [
          { id: 't1', x: 18, y: 22, emoji: '⭐' },
          { id: 't2', x: 33, y: 14, emoji: '✨' },
          { id: 't3', x: 50, y: 24, emoji: '🌙' },
          { id: 't4', x: 66, y: 15, emoji: '✨' },
          { id: 't5', x: 80, y: 28, emoji: '⭐' },
          { id: 't6', x: 45, y: 40, emoji: '✨' },
        ],
      },
    },
  ],
  quiz: [
    {
      id: 'q-tane',
      badge: 'Story check',
      question: 'Who pushed the Sky and the Earth apart?',
      options: [
        { id: 'tane', emoji: '🌳', word: 'Tāne-mahuta', correct: true },
        { id: 'tangaroa', emoji: '🌊', word: 'Tangaroa', correct: false },
        { id: 'maui', emoji: '🪝', word: 'Māui', correct: false },
        { id: 'tawhiri', emoji: '🌬️', word: 'Tāwhirimātea', correct: false },
      ],
      funFact:
        "Fun fact: Tāne-mahuta is the atua of the forest. Aotearoa's biggest living kauri tree is named after him!",
      hint: 'He is the atua of the forest. He lay down and pushed with his strong legs.',
      kikiCorrect: 'Ka pai! Tāne-mahuta lifted the sky with his mighty legs.',
    },
    {
      id: 'q-ao-marama',
      badge: 'Kupu check',
      question: 'What do we call the world of light, once the sky was lifted?',
      options: [
        { id: 'aomarama', emoji: '☀️', word: 'Te Ao Mārama', correct: true },
        { id: 'tepo', emoji: '🌑', word: 'Te Pō', correct: false },
        { id: 'tekore', emoji: '⚫', word: 'Te Kore', correct: false },
        { id: 'tewai', emoji: '💧', word: 'Te Wai', correct: false },
      ],
      funFact:
        "Fun fact: Te Ao Mārama means 'the world of light' — the bright world we still live in today.",
      hint: 'Mārama means light. It is the opposite of the dark night, Te Pō.',
      kikiCorrect: 'Tino pai! Te Ao Mārama — the world of light.',
    },
    {
      id: 'q-rain',
      badge: 'Story check',
      question: 'Why does the rain fall?',
      options: [
        { id: 'tears', emoji: '🌧️', word: 'Ranginui cries for Papatūānuku', correct: true },
        { id: 'fish', emoji: '🐟', word: 'The fish jump too high', correct: false },
        { id: 'sleep', emoji: '😴', word: 'Tāne is sleeping', correct: false },
        { id: 'stars', emoji: '⭐', word: 'The stars are falling', correct: false },
      ],
      funFact:
        "Fun fact: Māori say Ranginui's tears fall as rain, and Papatūānuku's sighs rise as mist. They still miss each other!",
      hint: 'Remember — the Sky Father and Earth Mother still long for each other. His tears fall down to her…',
      kikiCorrect: "Ka pai! Ranginui's tears fall as rain.",
    },
  ],
}

// ── Story 3: Māui and the Sun (coming soon — needs illustration assets) ──────
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

// Reading order. Stories unlock in sequence (see `isStoryUnlocked`).
export const STORIES: Story[] = [
  mauiFishesUpTheIsland,
  separationOfEarthAndSky,
  mauiAndTheSun,
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
