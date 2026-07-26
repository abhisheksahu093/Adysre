import react from '@adysre/config/eslint/react';

/**
 * The builder is framework-free React, like `adysre`: it has to run under
 * Next.js, Vite and anything else a host embeds a rule editor in, so it needs
 * the React Hooks rules and must not be pushed towards Next.js-only APIs.
 *
 * `rules-of-hooks` matters here beyond style. This package recurses - a group
 * renders groups, an operand renders operands - and a hook called inside one of
 * those branches is a bug that only appears for a rule shaped a particular way.
 */
export default react;
