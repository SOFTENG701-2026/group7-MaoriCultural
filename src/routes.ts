import { push } from 'svelte-spa-router';
import { wrap } from 'svelte-spa-router/wrap';

// When the child taps a module on the map, route into the correct flow.
const onMapNavigate = (id: string) => {
  if (id === 'waiata')   push('/song');
  if (id === 'tikanga')  push('/tikanga');
  if (id === 'pepeha')   push('/pepeha');
  if (id === 'purakau')  push('/purakau');
};

const onSongStart = () => push('/song/learn');
const onSongFinish = () => push('/quiz');
const onBackToMap = () => push('/');

const routes = {
  // Home / map — "Map of Kiwi's Aotearoa Adventure".
  '/': wrap({
    asyncComponent: () =>
      import('./pages/NavPage/NavPage.svelte').then(m => m.default),
    props: { onnavigate: onMapNavigate },
  }),

  // Waiata intro page (FR1) — child reads/listens to what's coming, then taps
  // ▶ Start to go to the play-along.
  '/song': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/IntroductionPage/IntroductionPage.svelte').then(
        m => m.default,
      ),
    props: { onStart: () => push('/song/play') },
  }),

  // Waiata play-along — listen to the full song with synced lyrics, then
  // Next → the line-by-line sing-along.
  '/song/play': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/PlayMusicPage').then(m => m.default),
    props: { onBack: onBackToMap, onNext: onSongStart },
  }),

  // Line-by-line sing-along with AI help (FR3 – FR9).
  '/song/learn': wrap({
    asyncComponent: () =>
      import(
        './pages/SongPages/LearningSongWithAIPage/LearningSongWithAIPage.svelte'
      ).then(m => m.default),
    props: { onback: () => push('/song/play'), onfinish: onSongFinish },
  }),

  '/quiz': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/QuizPage/QuizPage.svelte').then(m => m.default),
    props: { onBack: () => push('/song/learn'), onMap: onBackToMap, onFinish: onBackToMap },
  }),

  '/reward': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/RewardPage/RewardPage.svelte').then(m => m.default),
  }),

  // ── Tikanga module (8 pages) ──────────────────────────────────────────────
  '/tikanga': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaStartPage.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/what-is'), onMap: onBackToMap },
  }),

  '/tikanga/what-is': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaWhatIsPage.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/station1'), onBack: onBackToMap },
  }),

  '/tikanga/station1': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaStation1Page.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/station2'), onBack: onBackToMap },
  }),

  '/tikanga/station2': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaStation2Page.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/station3'), onBack: onBackToMap },
  }),

  '/tikanga/station3': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaStation3Page.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/station4'), onBack: onBackToMap },
  }),

  '/tikanga/station4': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaStation4Page.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/review'), onBack: onBackToMap },
  }),

  '/tikanga/review': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaReviewPage.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/reward'), onBack: onBackToMap },
  }),

  '/tikanga/reward': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaRewardPage.svelte').then(m => m.default),
    props: { onMap: onBackToMap },
  }),

  // ── Pepeha module (10 pages) ──────────────────────────────────────────────
  '/pepeha': wrap({
    asyncComponent: () =>
      import('./pages/PepehaPages/PepehaStartPage.svelte').then(m => m.default),
    props: { onNext: () => push('/pepeha/what-is'), onMap: onBackToMap },
  }),

  '/pepeha/what-is': wrap({
    asyncComponent: () =>
      import('./pages/PepehaPages/PepehaWhatIsPage.svelte').then(m => m.default),
    props: { onNext: () => push('/pepeha/school'), onBack: () => push('/pepeha') },
  }),

  '/pepeha/school': wrap({
    asyncComponent: () =>
      import('./pages/PepehaPages/PepehaSchoolPage.svelte').then(m => m.default),
    props: { onNext: () => push('/pepeha/maunga'), onBack: () => push('/pepeha/what-is') },
  }),

  '/pepeha/maunga': wrap({
    asyncComponent: () =>
      import('./pages/PepehaPages/PepehaMaungaPage.svelte').then(m => m.default),
    props: { onNext: () => push('/pepeha/awa'), onBack: () => push('/pepeha/school') },
  }),

  '/pepeha/awa': wrap({
    asyncComponent: () =>
      import('./pages/PepehaPages/PepehaAwaPage.svelte').then(m => m.default),
    props: { onNext: () => push('/pepeha/whanau'), onBack: () => push('/pepeha/maunga') },
  }),

  '/pepeha/whanau': wrap({
    asyncComponent: () =>
      import('./pages/PepehaPages/PepehaWhanauPage.svelte').then(m => m.default),
    props: { onNext: () => push('/pepeha/board'), onBack: () => push('/pepeha/awa') },
  }),

  '/pepeha/board': wrap({
    asyncComponent: () =>
      import('./pages/PepehaPages/PepehaBoardPage.svelte').then(m => m.default),
    props: { onNext: () => push('/pepeha/practise'), onBack: () => push('/pepeha/whanau') },
  }),

  '/pepeha/practise': wrap({
    asyncComponent: () =>
      import('./pages/PepehaPages/PepehaPractisePage.svelte').then(m => m.default),
    props: { onNext: () => push('/pepeha/quiz'), onBack: () => push('/pepeha/board') },
  }),

  '/pepeha/quiz': wrap({
    asyncComponent: () =>
      import('./pages/PepehaPages/PepehaQuizPage.svelte').then(m => m.default),
    props: { onNext: () => push('/pepeha/reward'), onBack: () => push('/pepeha/practise') },
  }),

  '/pepeha/reward': wrap({
    asyncComponent: () =>
      import('./pages/PepehaPages/PepehaRewardPage.svelte').then(m => m.default),
    props: { onMap: onBackToMap, onBack: () => push('/pepeha/quiz') },
  }),

  // ── Purākau module (story-based learning) ─────────────────────────────────
  // Step 1 — the flippable storybook hub (also where the finished cover is
  // coloured in on return). Step 6 happens here too.
  '/purakau': wrap({
    asyncComponent: () =>
      import('./pages/PurakauPages/PurakauStorybookPage.svelte').then(m => m.default),
    props: { onMap: onBackToMap },
  }),

  // Steps 2–6 — the story player (Kiki intro → interactive scenes → sequencing
  // → quiz → wrap-up). The active story is read from purakauState.
  '/purakau/play': wrap({
    asyncComponent: () =>
      import('./pages/PurakauPages/PurakauStoryPage.svelte').then(m => m.default),
  }),

  // Fallback: unknown paths return to the home map.
  '*': wrap({
    asyncComponent: () =>
      import('./pages/NavPage/NavPage.svelte').then(m => m.default),
    props: { onnavigate: onMapNavigate },
  }),
};

export default routes;