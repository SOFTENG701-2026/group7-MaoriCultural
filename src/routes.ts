import { push } from 'svelte-spa-router';
import { wrap } from 'svelte-spa-router/wrap';

const onMapNavigate = (id: string) => {
  if (id === 'waiata') push('/song');
  // Purākau, Pepeha, Tikanga are owned by other team members.
  // Show coming-soon page until their modules are merged.
  else if (id === 'purakau' || id === 'pepeha' || id === 'tikanga') push('/coming-soon');
};

const onSongFinish = () => push('/quiz');
const onBackToMap  = () => push('/');

const routes = {
  '/': wrap({
    asyncComponent: () =>
      import('./pages/NavPage/NavPage.svelte').then(m => m.default),
    props: { onnavigate: onMapNavigate },
  }),

  '/song': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/IntroductionPage/IntroductionPage.svelte').then(m => m.default),
    props: { onback: onBackToMap },
  }),

  // Dev D fix: extract :level from route params and pass it as a prop
  '/song/play/:level': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/PlayMusicPage/PlayMusicPage.svelte').then(m => m.default),
    props: (detail: { params: { level?: string } }) => ({
      level:  detail.params?.level ?? 'easy',
      onBack: () => push('/song/select'),
      // Pass level forward so QuizPage and RewardPage can use it
      onNext: () => push(`/sing/${detail.params?.level ?? 'easy'}`),
    }),
  }),

  '/song/learn': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/LearningSongWithAIPage/LearningSongWithAIPage.svelte')
        .then(m => m.default),
    props: { onback: () => push('/song'), onfinish: onSongFinish },
  }),

  // Dev D: singing practice page (after PlayMusicPage, before QuizPage)
  '/sing/:level': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/SingAlongPage/SingAlongPage.svelte').then(m => m.default),
    props: (detail: { params: { level?: string } }) => ({
      level:  detail.params?.level ?? 'easy',
      onBack: () => push(`/song/play/${detail.params?.level ?? 'easy'}`),
      onNext: () => push(`/quiz/${detail.params?.level ?? 'easy'}`),
    }),
  }),

  // Dev D: level-aware quiz route
  '/quiz/:level': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/QuizPage/QuizPage.svelte').then(m => m.default),
    props: (detail: { params: { level?: string } }) => ({
      level:    detail.params?.level ?? 'easy',
      onBack:   () => push('/song/select'),
      onMap:    onBackToMap,
      onFinish: () => push(`/reward/${detail.params?.level ?? 'easy'}`),
    }),
  }),

  // Keep original /quiz route as fallback (for any existing links)
  '/quiz': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/QuizPage/QuizPage.svelte').then(m => m.default),
    props: { level: 'easy', onBack: () => push('/song/select'), onMap: onBackToMap, onFinish: () => push('/reward/easy') },
  }),

  // Dev D: level-aware reward route
  '/reward/:level': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/RewardPage/RewardPage.svelte').then(m => m.default),
    props: (detail: { params: { level?: string } }) => ({
      level: detail.params?.level ?? 'easy',
    }),
  }),

  '/reward': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/RewardPage/RewardPage.svelte').then(m => m.default),
    props: { level: 'easy' },
  }),

  '/coming-soon': wrap({
    asyncComponent: () =>
      import('./lib/ComingSoon.svelte').then(m => m.default),
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
    props: {
      onNext: () => push('/pepeha/quiz'),
      onBack: () => push('/pepeha/whanau'),
      onChooseSchool: () => push('/pepeha/school'),
    },
  }),

  '/pepeha/quiz': wrap({
    asyncComponent: () =>
      import('./pages/PepehaPages/PepehaQuizPage.svelte').then(m => m.default),
    props: { onNext: () => push('/pepeha/reward'), onBack: () => push('/pepeha/board') },
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

  // Step 6 — reward page (badge ceremony, mirrors TikangaRewardPage pattern).
  '/purakau/reward': wrap({
    asyncComponent: () =>
      import('./pages/PurakauPages/PurakauRewardPage.svelte').then(m => m.default),
    props: { onMap: onBackToMap },
  }),

  // Fallback: unknown paths return to the home map.
  '*': wrap({
    asyncComponent: () =>
      import('./pages/NavPage/NavPage.svelte').then(m => m.default),
    props: { onnavigate: onMapNavigate },
  }),
};

export default routes;