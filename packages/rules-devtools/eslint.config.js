import react from '@adysre/config/eslint/react';

/**
 * The debugger is framework-free React, like `adysre` and the builder: it has to
 * run under Next.js, Vite and anything else a host embeds it in, so it needs the
 * React Hooks rules and must not be pushed towards Next.js-only APIs.
 *
 * `rules-of-hooks` matters here beyond style. The trace view recurses - a group
 * row renders group rows - and a hook called inside one of those branches is a
 * bug that only appears for a rule nested a particular way.
 */
export default react;
