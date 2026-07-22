import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildTemplateDownload } from './scaffold';
import { TEMPLATES } from '@/data/templates';
import { TEMPLATE_DOWNLOADS, type TemplateDownloadId } from '@/data/templates/types';

/**
 * A template download is the one artifact a visitor takes away and runs on
 * their own machine, where nothing we own can rescue it. These cover the ways
 * it could arrive broken: a project missing its entry point, a source file
 * still importing the `@/` alias this repo provides and their project does not,
 * a static build with no markup, or the two static builds shipping the same
 * page twice.
 *
 * Every case runs against EVERY registered template. Pinning them to the first
 * template is what let a second template ship with no static build at all.
 */

const paths = (slug: string, target: TemplateDownloadId) =>
  buildTemplateDownload(slug, target).map((entry) => entry.path);

describe('buildTemplateDownload', () => {
  it('has templates to build', () => {
    assert.ok(TEMPLATES.length > 0, 'expected at least one registered template');
  });

  it('rejects an unknown template rather than zipping an empty folder', () => {
    assert.throws(() => buildTemplateDownload('does-not-exist', 'react'), /Unknown template/);
  });

  for (const template of TEMPLATES) {
    const { slug, entry, downloads } = template;

    describe(slug, () => {
      it('produces every download target it advertises', () => {
        // Only the declared formats: a template that ships no static build must
        // not offer one, and this is what keeps the dialog honest.
        for (const format of TEMPLATE_DOWNLOADS.filter((f) => downloads.includes(f.id))) {
          assert.ok(paths(slug, format.id).length > 1, `${format.id} produced no real files`);
        }
      });

      it('declares at least one download format', () => {
        assert.ok(downloads.length > 0, `${slug} advertises no downloads at all`);
      });

      it('gives each project target its entry point and manifest', () => {
        const next = paths(slug, 'nextjs');
        assert.ok(next.includes('package.json'));
        assert.ok(next.includes('app/page.tsx'));
        assert.ok(next.includes('app/layout.tsx'));

        const react = paths(slug, 'react');
        assert.ok(react.includes('package.json'));
        assert.ok(react.includes('index.html'));
        assert.ok(react.includes('src/main.tsx'));
      });

      it('imports a component it actually ships', () => {
        for (const target of ['nextjs', 'react'] as const) {
          const files = buildTemplateDownload(slug, target);
          const entryFile = target === 'nextjs' ? 'app/page.tsx' : 'src/main.tsx';
          const source = files.find((f) => f.path === entryFile)?.content ?? '';

          assert.ok(
            source.includes(`{ ${entry.symbol} }`),
            `${target} entry does not import ${entry.symbol}`,
          );
          assert.ok(
            files.some((f) => f.path.endsWith(`${entry.file}.tsx`)),
            `${target} imports ${entry.file} but does not ship it`,
          );
        }
      });

      it('ships the content module, its types and the stylesheet', () => {
        for (const target of ['nextjs', 'react'] as const) {
          const names = paths(slug, target);

          assert.ok(names.some((p) => p.endsWith('content.ts')), `${target} has no content module`);
          assert.ok(names.some((p) => p.endsWith('template-types.ts')), `${target} has no types`);
          assert.ok(
            names.some((p) => p.endsWith(entry.stylesheet)),
            `${target} is missing ${entry.stylesheet}`,
          );
        }
      });

      it('rewrites repo-only imports, which would not resolve in a download', () => {
        for (const target of ['nextjs', 'react'] as const) {
          for (const file of buildTemplateDownload(slug, target)) {
            if (!file.path.endsWith('.tsx') && !file.path.endsWith('.ts')) continue;
            assert.ok(
              !file.content.includes("from '@/"),
              `${target}:${file.path} still imports through the @/ alias`,
            );
          }
        }
      });

      it('gives each static build its own markup, not a shared copy', (t) => {
        if (!downloads.includes('tailwind') || !downloads.includes('html')) {
          return t.skip(`${slug} ships no static builds`);
        }

        const tailwind = buildTemplateDownload(slug, 'tailwind');
        const plain = buildTemplateDownload(slug, 'html');

        const tailwindHtml = tailwind.find((f) => f.path === 'index.html')?.content ?? '';
        const plainHtml = plain.find((f) => f.path === 'index.html')?.content ?? '';

        assert.ok(tailwindHtml.length > 0, 'tailwind build has no index.html');
        assert.ok(plainHtml.length > 0, 'plain build has no index.html');
        assert.notEqual(tailwindHtml, plainHtml, 'both static builds shipped identical markup');

        // The whole point of the plain build: no Tailwind anywhere in it.
        assert.ok(tailwindHtml.includes('cdn.tailwindcss.com'));
        assert.ok(!plainHtml.includes('cdn.tailwindcss.com'));
        assert.ok(plain.some((f) => f.path === 'styles.css'));
      });

      it('opens straight from index.html - static builds need no manifest', (t) => {
        const statics = (['tailwind', 'html'] as const).filter((id) => downloads.includes(id));
        if (statics.length === 0) return t.skip(`${slug} ships no static builds`);

        for (const target of statics) {
          const names = paths(slug, target);
          assert.ok(names.includes('index.html'), `${target} has no index.html`);
          assert.ok(
            names.some((p) => p.endsWith('.js')),
            `${target} is missing its behaviour script`,
          );
          assert.ok(!names.includes('package.json'), `${target} should not need an install`);
        }
      });

      it('documents every download', () => {
        for (const format of TEMPLATE_DOWNLOADS.filter((f) => downloads.includes(f.id))) {
          assert.ok(paths(slug, format.id).includes('README.md'), `${format.id} has no README`);
        }
      });
    });
  }
});
