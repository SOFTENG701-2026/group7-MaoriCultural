import { wrap } from 'svelte-spa-router/wrap';

const routes = {
  '/quiz': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/QuizPage/QuizPage.svelte').then(m => m.default),
  }),

  // Fallback: redirect unknown paths to quiz
  '*': wrap({
    asyncComponent: () =>
      import('./pages/SongPages/QuizPage/QuizPage.svelte').then(m => m.default),
  }),
};

export default routes;
