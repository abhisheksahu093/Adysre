/**
 * Refuse to publish a workspace package with anything but pnpm.
 *
 * ─── Why this guard exists ──────────────────────────────────────────────────
 * The published manifest is NOT the one on disk. `exports` points at `src/*.ts`
 * so the workspace can consume the package with no build step;
 * `publishConfig.exports` points at `dist/*.js` for consumers. Substituting one
 * for the other at pack time is a **pnpm** feature. `npm publish` ignores
 * `publishConfig` entirely.
 *
 * So `npm publish` uploads a package whose `exports` reference `./src/index.ts`
 * while `files` ships only `dist` - the source is not in the tarball. npm
 * reports success, the tarball looks plausible, and every consumer gets
 * ERR_MODULE_NOT_FOUND on the first import. Version numbers cannot be reused,
 * so the only fix is a bump and a deprecation.
 *
 * That happened once, to `adysre@0.1.0`. It cost a version number. This is the
 * same guard, moved somewhere eleven more packages can share it rather than
 * carrying eleven copies of the same file.
 *
 * Runs from `prepublishOnly`, which fires before the tarball is built.
 */

const agent = process.env.npm_config_user_agent ?? '';

if (!agent.startsWith('pnpm/')) {
  const client = agent.split('/')[0] || 'an unknown client';

  console.error(`
  ✗ Refusing to publish with ${client}.

    This package's published manifest is produced by pnpm's publishConfig
    substitution: 'exports' has to be rewritten from src/*.ts to dist/*.js.
    ${client} ignores publishConfig, so it would upload a package whose
    'exports' point at source files that are not in the tarball. It would
    appear to succeed and be broken for every consumer.

    Publish with:

      pnpm publish --no-git-checks
`);

  process.exit(1);
}
