import { wrap } from 'svelte-spa-router/wrap';

const routes = {
  // Home / map — "Map of Kiwi's Aotearoa Adventure".
  '/': wrap({
    asyncComponent: () =>
      import('./pages/NavPage/NavPage.svelte').then(m => m.default),
  }),

  '/quiz': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/QuizPage/QuizPage.svelte').then(m => m.default),
  }),

  '/reward': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/RewardPage/RewardPage.svelte').then(m => m.default),
  }),

  // Fallback: unknown paths return to the home map.
  '*': wrap({
    asyncComponent: () =>
      import('./pages/NavPage/NavPage.svelte').then(m => m.default),
  }),
};

export default routes;