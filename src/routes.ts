import { push } from 'svelte-spa-router';
import { wrap } from 'svelte-spa-router/wrap';

// When the child taps a module on the map, route into the correct flow.
const onMapNavigate = (id: string) => {
  if (id === 'waiata')   push('/song');
  if (id === 'tikanga')  push('/tikanga');
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
    props: { onNext: () => push('/tikanga/what-is') },
  }),

  '/tikanga/what-is': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaWhatIsPage.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/station1'), onBack: () => push('/tikanga') },
  }),

  '/tikanga/station1': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaStation1Page.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/station2'), onBack: () => push('/tikanga/what-is') },
  }),

  '/tikanga/station2': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaStation2Page.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/station3'), onBack: () => push('/tikanga/station1') },
  }),

  '/tikanga/station3': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaStation3Page.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/station4'), onBack: () => push('/tikanga/station2') },
  }),

  '/tikanga/station4': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaStation4Page.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/review'), onBack: () => push('/tikanga/station3') },
  }),

  '/tikanga/review': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaReviewPage.svelte').then(m => m.default),
    props: { onNext: () => push('/tikanga/reward'), onBack: () => push('/tikanga/station4') },
  }),

  '/tikanga/reward': wrap({
    asyncComponent: () =>
      import('./pages/TikangaPages/TikangaRewardPage.svelte').then(m => m.default),
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