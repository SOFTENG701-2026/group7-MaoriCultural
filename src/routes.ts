import { push } from 'svelte-spa-router';
import { wrap } from 'svelte-spa-router/wrap';

// When the child taps Waiata on the map, head into the Waiata Songs intro;
// other modules aren't built out yet so we let them fall through silently.
const onMapNavigate = (id: string) => {
  if (id === 'waiata') push('/song');
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

  // Waiata intro page (FR1) — child reads/listens to what's coming.
  '/song': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/IntroductionPage/IntroductionPage.svelte').then(
        m => m.default,
      ),
    props: { onback: onBackToMap, onnavigate: onSongStart },
  }),

  // Line-by-line sing-along with AI help (FR3 – FR9).
  '/song/learn': wrap({
    asyncComponent: () =>
      import(
        './pages/SongPages/LearningSongWithAIPage/LearningSongWithAIPage.svelte'
      ).then(m => m.default),
    props: { onback: () => push('/song'), onfinish: onSongFinish },
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

  // Fallback: unknown paths return to the home map.
  '*': wrap({
    asyncComponent: () =>
      import('./pages/NavPage/NavPage.svelte').then(m => m.default),
    props: { onnavigate: onMapNavigate },
  }),
};

export default routes;