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

  '*': wrap({
    asyncComponent: () =>
      import('./pages/NavPage/NavPage.svelte').then(m => m.default),
    props: { onnavigate: onMapNavigate },
  }),
};

export default routes;