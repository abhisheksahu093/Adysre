import next from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';
import base from './base.js';

/**
 * ESLint config for the Next.js web app.
 *
 * Registers the Next.js and React Hooks plugins on top of the shared base. The
 * app already carries targeted `eslint-disable` comments for these rules; until
 * the plugins were registered, every one of those comments was itself an error
 * ("Definition for rule ... was not found"), so the rules were never actually
 * enforced.
 */
export default [
  ...base,
  {
    plugins: { '@next/next': next, 'react-hooks': reactHooks },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    /**
     * Component-library previews are deliberately framework-free: they are the
     * copy-paste snippets users take into any stack, and the generator bakes
     * them into downloaded React/Vite projects where `next/link` does not
     * exist. A plain `<a>` is correct there, so the Next-specific link rule
     * would be actively wrong.
     */
    files: ['src/components/components/previews/**/*.tsx'],
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      // Same reason: `next/image` needs a Next runtime and a configured loader.
      // A preview must render identically in the library, in the playground and
      // in a downloaded Vite project, so a plain `<img>` is the portable choice.
      '@next/next/no-img-element': 'off',
    },
  },
  {
    // Generated files are rewritten by their generator, not by hand, so lint
    // findings there are noise - fix the generator instead.
    ignores: ['src/data/playground/section-demos.ts'],
  },
];
