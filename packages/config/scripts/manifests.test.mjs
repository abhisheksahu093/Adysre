import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

/**
 * The publishing configuration, held to what it claims.
 *
 * Every other invariant in this repo is checked by the package it belongs to.
 * A manifest is checked by nobody: it type-checks nothing, it runs nothing, and
 * it is wrong in ways that only surface when somebody installs the result from
 * npm - by which point the version number is spent and the fix is a bump and a
 * deprecation.
 *
 * That is not hypothetical. `adysre@0.1.0` shipped `exports` pointing at source
 * files that were not in the tarball, appeared to publish fine, and was broken
 * for every consumer. These assertions are the shape of that mistake.
 */

const here = dirname(fileURLToPath(import.meta.url));
const packagesDir = resolve(here, '..', '..');

/** Every `rules-*` package, read from disk rather than listed by hand. */
const rulesPackages = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('rules-'))
  .map((entry) => {
    const directory = join(packagesDir, entry.name);
    return {
      directory: entry.name,
      manifest: JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8')),
      path: directory,
    };
  });

describe('the rules packages are publishable', () => {
  it('found them, rather than silently checking nothing', () => {
    // A glob that matches no directories makes every assertion below vacuous.
    assert.ok(rulesPackages.length >= 11, `only found ${String(rulesPackages.length)}`);
  });

  for (const { directory, manifest, path } of rulesPackages) {
    describe(manifest.name, () => {
      it('is not private, and can therefore be published at all', () => {
        assert.equal(manifest.private, undefined, 'still marked private');
      });

      it('ships dist, and nothing that only exists in the workspace', () => {
        assert.deepEqual(manifest.files, ['dist', 'README.md']);
      });

      it('resolves to source in the workspace and to dist when published', () => {
        // The whole point of the substitution: no build step for a sibling
        // package, real JavaScript for a consumer.
        assert.equal(manifest.exports['.'], './src/index.ts');
        assert.equal(manifest.publishConfig.exports['.'].default, './dist/index.js');
        assert.equal(manifest.publishConfig.exports['.'].types, './dist/index.d.ts');
        assert.equal(manifest.publishConfig.main, './dist/index.js');
      });

      it('publishes publicly, since a scoped package otherwise does not', () => {
        // `@adysre/*` defaults to restricted. Without this a publish either
        // fails outright or quietly goes private.
        assert.equal(manifest.publishConfig.access, 'public');
      });

      it('guards the publish it cannot survive', () => {
        // npm ignores publishConfig, so publishing with it uploads a package
        // whose exports point at files the tarball does not contain.
        assert.ok(manifest.scripts.prepublishOnly?.includes('guard-publisher'));
        assert.ok(manifest.scripts.prepublishOnly?.includes('verify-dist'));
      });

      it('has the README it promises to ship', () => {
        assert.ok(existsSync(join(path, 'README.md')), `packages/${directory}/README.md is missing`);
      });

      it('declares a description, which is what a registry page shows', () => {
        assert.ok((manifest.description ?? '').length > 20, 'no useful description');
      });

      it('declares the runtime it was built for', () => {
        assert.equal(manifest.engines.node, '>=20.0.0');
      });

      it('says whether importing it does anything', () => {
        // `false` lets a consumer's bundler drop what they do not use; a theme
        // that ships CSS has a side effect by definition.
        const expected = manifest.name.endsWith('rules-theme') ? ['*.css'] : false;
        assert.deepEqual(manifest.sideEffects, expected);
      });

      it('depends on siblings by workspace protocol, which pnpm rewrites on pack', () => {
        for (const [name, range] of Object.entries(manifest.dependencies ?? {})) {
          if (!name.startsWith('@adysre/') && name !== 'adysre') continue;
          assert.equal(range, 'workspace:*', `${name} is pinned as ${range}`);
        }
      });

      it('keeps React a peer, so a consumer cannot end up with two copies', () => {
        if (manifest.dependencies?.react !== undefined) {
          assert.fail('react must be a peer dependency, never a dependency');
        }
      });
    });
  }

  it('moves in lockstep, because the AST contract is shared', () => {
    // Mixing rules-core@0.3 with rules-types@0.1 is a combination that
    // type-checks and cannot work: they share the AST and the plugin
    // interfaces. One version across the ecosystem makes that unrepresentable.
    const versions = new Set(rulesPackages.map(({ manifest }) => manifest.version));
    assert.equal(
      versions.size,
      1,
      `versions have drifted apart: ${[...versions].sort().join(', ')}`,
    );
  });

  it('exports its own manifest, so a page can read what it is', () => {
    for (const { manifest } of rulesPackages) {
      assert.equal(manifest.exports['./package.json'], './package.json');
    }
  });
});
