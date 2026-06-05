# Kiwi's Aotearoa Adventure — Māori Cultural Learning Tool

A child-friendly web learning tool for introducing Year 1–3 learners to selected Māori cultural concepts through an interactive map, stories, songs, pepeha practice, tikanga choices, audio support, and visual rewards.

This project was built as a Svelte + TypeScript single-page application. The learning journey starts on a map of Aotearoa, where Kiki the kiwi guides learners through four modules:

* **Waiata** — listen to and practise Māori songs and key words.
* **Pūrākau** — explore a Māori story through narrated scenes, interactive tasks, and quiz questions.
* **Pepeha** — build Kiki's practice pepeha using safe, fixed school examples.
* **Tikanga** — help Kiki make respectful choices during a marae visit.

The project is designed as a classroom prototype. It focuses on guided participation, encouragement, accessibility, and cultural safety rather than grading children or collecting personal information.

---

## Project Goals

The learning tool aims to support young learners who may still be developing reading confidence, pronunciation confidence, and attention span. The interface therefore uses large visual buttons, short instructions, repeated listening opportunities, positive feedback, and optional audio support.

The main goals are to help children:

1. enter the experience through a playful map rather than a text-heavy menu;
2. hear and practise simple Māori words in context;
3. learn through stories, songs, place-based examples, and respectful-choice scenarios;
4. receive gentle feedback without scores, ranking, or punishment;
5. use Read to Me, text-size, sound, and contrast settings when needed;
6. collect badges as a visible record of learning progress.

---

## Key Features

### Interactive Map Explorer

The home page is an adventure map where children can choose learning locations. Kiki can move around the map when the learner selects a module. The map includes:

* large tappable module icons;
* a Kiki character that walks to selected places;
* locked and unlocked module states;
* a glowing trail showing progress between locations;
* a first-time Waiata spotlight and short map guide tour;
* a rewards button for viewing earned badges;
* a settings button for learning and accessibility preferences.

The current module order is:

1. **Waiata**
2. **Pūrākau**
3. **Pepeha**
4. **Tikanga**

Pūrākau unlocks after Waiata. Pepeha and Tikanga unlock after Pūrākau.

### Rewards and Badges

Each module can unlock a badge. The map rewards panel shows locked badges in grey and earned badges in colour. Badge levels are designed to support growth:

* **Beginner** — learner completed the beginner version or the available base activity.
* **Confident** — learner completed the confident version or stronger challenge path.

The badge logic avoids downgrading: if a learner earns a confident badge, later beginner completion should not replace it with a lower badge.

### Read to Me

Many pages include a Read to Me button that reads page instructions, questions, choices, or feedback aloud using the browser's Web Speech API. This supports young readers and learners who prefer audio prompts.

### Settings Panel

The global settings panel can be opened from the map and remains available across the app. It includes:

* sound on/off;
* low, medium, and high volume;
* Read to Me mode;
* normal or large text;
* high contrast mode.

Settings are saved locally in the browser so the learner's preferences can persist between visits.

---

## Learning Modules

## 1. Waiata Module

The Waiata module introduces Māori words through song-based practice. Learners choose a level, listen to a song, practise line by line, answer short quiz questions, and collect a badge.

### Levels

* **Beginner Level**: practises the colour song *Ngā Tae*.
* **Confident Level**: practises *Te Aroha*.

### Flow

1. Choose Beginner or Confident level.
2. Listen to the selected song.
3. Practise each line with Kiki.
4. Use Try Singing to make a short voice attempt.
5. Use Need Help for a short hint.
6. Answer two short quiz questions.
7. Earn a Waiata badge.

### Current Waiata Features

* line-by-line song practice;
* replay current line by tapping Kiki;
* microphone recording for short attempts;
* forgiving matching for Māori key words;
* visual listening meter while recording;
* AI hint support when configured;
* fallback support when speech recognition or API access is unavailable;
* beginner and confident badge images.

The learning goal is not to judge perfect singing, pitch, rhythm, or accent. The Try Singing activity is designed to encourage oral participation and repeated practice.

---

## 2. Pūrākau Module

The Pūrākau module presents Māori storytelling through an interactive storybook. The current playable story is **How Māui Fished Up the Island** (*Te Ika-a-Māui*).

### Current Playable Story

* **How Māui Fished Up the Island**

The story includes:

* narrated story scenes;
* fixed illustrated scene images;
* a taonga selection interaction;
* a tapping interaction to help Māui pull;
* short comprehension and kupu questions;
* a final Pūrākau reward page.

### Storybook State

The code also defines additional story cards, currently marked as coming soon:

* **How Māui Caught the Sun**
* **The Sky and the Earth**

These are displayed as future story options rather than fully playable content.

### Pūrākau Design Approach

The story text is fixed in the code and is not generated at runtime. This makes the module more predictable and easier for teachers or developers to review. Optional AI support is limited to rephrasing approved hints, not creating new story content.

---

## 3. Pepeha Module

The Pepeha module helps learners understand parts of a pepeha through Kiki's practice example. It does not ask children to enter private family information.

### Main Concepts

Learners collect and practise four pepeha pieces:

* **Ingoa** — name;
* **Maunga** — mountain;
* **Awa** — river;
* **Whānau** — family / caring people.

### Levels

* **Beginner Level**: uses simple words, images, stickers, and English support.
* **Confident Level**: uses fuller te reo Māori sentence patterns and includes short cultural-safety checks.

### Fixed Practice-School Examples

The module uses fixed Auckland school profiles to provide safe practice examples for Kiki. Each profile includes a school name, area, maunga, awa, and short pepeha lines.

Current school profiles include:

* Rosebank School;
* Don Buck School;
* Glen Eden Primary School;
* Kauri Park School.

These examples are used for Kiki's practice pepeha. They are not presented as the learner's own pepeha.

### Flow

1. Choose Beginner or Confident level.
2. Learn what a pepeha is.
3. Choose a fixed school example for Kiki.
4. Find the maunga.
5. Find the awa.
6. Build Kiki's whānau circle.
7. Review Kiki's pepeha board.
8. Complete a short sticker-check activity.
9. Collect a Pepeha badge.

---

## 4. Tikanga Module

The Tikanga module is a short interactive marae-visit story. Learners help Kiki make respectful choices at different stations.

### Levels

* **Beginner Level**: direct, simple respectful-behaviour choices.
* **Confident Level**: more realistic choices and simple Māori terms such as *manuhiri*.

### Flow

1. Choose Beginner or Confident level.
2. Learn what tikanga means.
3. Visit Station 1: Entrance.
4. Visit Station 2: Welcome Area.
5. Visit Station 3: Wharenui.
6. Visit Station 4: Kai and Care.
7. Review the visit.
8. Collect a Tikanga badge.

### Learning Focus

The module teaches safe, simple ideas such as:

* staying with the group;
* watching and listening before acting;
* following the people leading the visit;
* showing respect inside the wharenui;
* waiting before kai;
* helping care for the place after kai;
* understanding that tikanga can depend on people, place, and context.

The module does not attempt to teach the full pōwhiri process or all marae protocols.

---

## AI Features

This project includes limited AI-supported learning features. AI is used only where it directly supports the learning task.

### Waiata AI Speech Recognition

The Try Singing activity can send a short microphone recording to Groq's Whisper API for transcription.

* Model used in the code: `whisper-large-v3`
* Language hint: Māori (`mi`)
* Environment variable: `VITE_GROQ_API_KEY`

The transcript is matched against the current Māori word using forgiving matching rules. The app accepts exact matches and close fuzzy matches, and it is intentionally lenient for young learners.

### Waiata AI Hints

The Waiata module can also request a short AI hint using Groq chat completion when an API key is available.

* Model used in the code: `llama-3.1-8b-instant`
* Hints are constrained to the current lyric, Māori key word, and syllable breakdown.
* If the request fails or no API key is provided, the app falls back to structured rule-based hints.

### Pūrākau Hint Rephrasing

The Pūrākau module includes an optional DeepSeek-based hint rephrase system.

* Environment variable: `VITE_DEEPSEEK_API_KEY`
* The model does not invent new cultural content.
* It only rephrases an approved, pre-written hint.
* If the API key is missing or the response fails validation, the curated hint is used instead.

### Important AI Note

This is a frontend-only prototype. Any `VITE_` environment variable is exposed to the browser bundle. That is acceptable for a classroom prototype, but a production version should move AI API calls behind a small backend proxy.

---

## Cultural Safety and Privacy

The project avoids asking children to enter private identity or family information.

Important safety decisions include:

* Pepeha uses Kiki's fixed practice examples rather than asking learners to type their own pepeha.
* School, maunga, and awa examples are fixed in the code and teacher-reviewable.
* Pūrākau story content is fixed and not generated at runtime.
* AI is not used to create new cultural stories, pepeha content, tikanga rules, or identity information.
* Feedback is supportive and avoids ranking or shaming learners.
* Confident-level Pepeha checks remind learners that personal pepeha should be handled carefully and may involve whānau or people who know their story.

---

## Accessibility Features

The app includes several accessibility-oriented features:

* Read to Me audio support across many pages;
* large image-based buttons for young learners;
* keyboard movement support on the map;
* visible focus styles on many interactive controls;
* high contrast mode;
* large text mode;
* sound and volume controls;
* feedback through text, images, icons, and state changes rather than colour alone;
* reduced-motion support in selected animations.

The app is designed to be more accessible than a text-only learning tool, but it is still a prototype and should be tested further with real users and assistive technologies.

---

## Tech Stack

* **Svelte 5** — component-based frontend framework
* **TypeScript** — typed JavaScript
* **Vite** — development server and build tool
* **svelte-spa-router** — client-side routing
* **Web Speech API** — Read to Me and browser speech support
* **MediaRecorder API** — microphone recording for Try Singing
* **Groq API** — optional Whisper transcription and AI hints
* **DeepSeek API** — optional controlled hint rephrasing in Pūrākau

---

## Getting Started

### Prerequisites

Use Node.js 20 if possible, because the GitHub Actions workflow uses Node 20.

Check your version:

```bash
node -v
npm -v
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

### Windows PowerShell Note

If PowerShell blocks `npm` because scripts are disabled, use:

```powershell
npm.cmd run dev
```

or run the same scripts from Git Bash / Command Prompt.

---

## Environment Variables

Create a `.env.local` file in the project root if AI features are needed:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

These keys are optional for basic navigation and most learning pages. Without API keys:

* Waiata can still fall back to browser speech recognition or count a reasonable attempt depending on browser support.
* Waiata hints fall back to rule-based hints.
* Pūrākau hints fall back to curated pre-written hints.

Do not commit `.env.local` or real API keys to GitHub.

---

## Available Scripts

| Command           | Purpose                                    |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Start the Vite development server.         |
| `npm run build`   | Build the app for production into `dist/`. |
| `npm run preview` | Preview the production build locally.      |
| `npm run check`   | Run Svelte and TypeScript checks.          |

---

## Project Structure

```text
src/
  App.svelte                         # Main app shell and global settings panel
  routes.ts                          # SPA route definitions
  accessibility.css                  # Global high-contrast and large-text rules

  lib/
    SettingsPanel.svelte             # Global settings UI
    settings.svelte.ts               # Settings state, persistence, speech helpers
    progress.svelte.ts               # Module completion state
    pepehaState.svelte.ts            # Pepeha module state
    purakauState.svelte.ts           # Pūrākau module state
    tikangaState.svelte.ts           # Tikanga module state
    ReadToMe.svelte                  # Reusable Read to Me button

  pages/
    NavPage/                         # Main map, markers, Kiki, rewards panel
    SongPages/                       # Waiata start, listen, sing, quiz, reward pages
    PurakauPages/                    # Storybook, story player, interactions, reward
    PepehaPages/                     # Pepeha learning flow and reward
    TikangaPages/                    # Marae visit learning flow and reward

docs/                                # Requirements and story notes
.github/workflows/ci.yml             # PR checks and build workflow
```

---

## Progress, Rewards, and Storage

The app uses browser storage rather than a backend database.

### Module Completion

`src/lib/progress.svelte.ts` stores completed module IDs in `sessionStorage` under:

```text
mca-progress
```

This means progress can survive a page refresh in the same tab, but it is intended to reset for a fresh browser session.

### Settings

`src/lib/settings.svelte.ts` stores settings in `localStorage` under:

```text
mca-settings
```

This allows sound, volume, text size, Read to Me mode, and high contrast choices to persist between visits.

### Module State

Pepeha and Tikanga store their learning state in `localStorage` so learners can move through multi-page flows without losing choices immediately.

### Badge State

Badge levels are stored using module-specific keys such as:

```text
mca-waiata-badge
mca-purakau-badge
mca-pepeha-badge
mca-tikanga-badge
```

The rewards panel reads these values to decide whether to show locked, beginner, or confident badge art.

---

## Development and CI Notes

The repository includes a GitHub Actions workflow that runs on pull requests to `main`.

The workflow:

1. blocks pull requests with `WIP` in the title;
2. installs dependencies;
3. runs `npm run check`;
4. runs `npm run build`.

Branch protection requires changes to be merged through pull requests rather than direct pushes to `main`.

---

## Prototype Limitations

This is a classroom prototype, not a production cultural learning platform.

Known limitations and future improvements include:

* AI API keys are currently frontend environment variables and should be moved behind a backend proxy for production.
* Browser microphone support depends on permissions and browser compatibility.
* Web Speech API voices vary by device and browser.
* The Pūrākau module currently has one playable story; additional stories are marked as coming soon.
* More cultural review would be needed before wider classroom deployment.
* More accessibility testing should be completed with real users and assistive technologies.
* The current progress system is local to the browser and does not support teacher dashboards or cross-device accounts.

---

## Summary

Kiwi's Aotearoa Adventure is an interactive Māori cultural learning prototype for young learners. It combines map exploration, song practice, storytelling, pepeha scaffolding, tikanga decision-making, audio support, and visual rewards. The implementation focuses on short tasks, safe fixed content, supportive feedback, and accessibility features suitable for Year 1–3 learners.
