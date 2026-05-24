import { push } from 'svelte-spa-router';
import { wrap } from 'svelte-spa-router/wrap';

const onMapNavigate = (id: string) => {
  if (id === 'waiata') push('/song');
};

const onSongStart = () => push('/song/play');
const onSongFinish = () => push('/quiz');
const onBackToMap = () => push('/');

const routes = {
  '/': wrap({
    asyncComponent: () =>
      import('./pages/NavPage/NavPage.svelte').then(m => m.default),
    props: { onnavigate: onMapNavigate },
  }),

  '/song': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/IntroductionPage/IntroductionPage.svelte').then(
        m => m.default,
      ),
    props: { onback: onBackToMap, onStart: onSongStart },
  }),

  '/song/play': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/PlayMusicPage/index.svelte').then(m => m.default),
    props: { onBack: () => push('/song'), onNext: onSongFinish },
  }),

  '/song/learn': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/LearningSongWithAIPage/LearningSongWithAIPage.svelte')
        .then(m => m.default),
    props: { onback: () => push('/song'), onfinish: onSongFinish },
  }),

  '/quiz': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/QuizPage/QuizPage.svelte').then(m => m.default),
    props: { onBack: () => push('/song/play'), onMap: onBackToMap, onFinish: onBackToMap },
  }),

  '/reward': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/RewardPage/RewardPage.svelte').then(m => m.default),
  }),

  '*': wrap({
    asyncComponent: () =>
      import('./pages/NavPage/NavPage.svelte').then(m => m.default),
    props: { onnavigate: onMapNavigate },
  }),
};

export default routes;
