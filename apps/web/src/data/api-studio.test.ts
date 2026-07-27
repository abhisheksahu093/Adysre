import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { runAssertions } from '@/modules/api-studio/utils/assertions';
import { AUTH_TYPES, BODY_TYPES, HTTP_METHODS } from '@/modules/api-studio/types/http';
import {
  API_STUDIO_PREVIEW,
  API_STUDIO_STATS,
  AUTH_SCHEMES,
  PREVIEW_ASSERTIONS,
  PREVIEW_RESPONSE,
} from './api-studio';

/**
 * The home-page preview, checked.
 *
 * The section renders whatever the assertion engine answers, which is the point
 * - but it also renders it as the pitch, so a fixture that quietly stopped
 * passing would put a red cross on the marketing page and nobody would find out
 * from a build. This is the test that finds out.
 */

describe('API Studio preview fixture', () => {
  it('passes every assertion, which is what the section shows', () => {
    const run = runAssertions(PREVIEW_ASSERTIONS, PREVIEW_RESPONSE, 'preview');

    assert.equal(run.failed, 0, JSON.stringify(run.results, null, 2));
    assert.equal(run.errored, 0);
    assert.equal(run.skipped, 0);
    assert.equal(run.passed, PREVIEW_ASSERTIONS.length);
  });

  it('shows a request that exists in its own collection rail', () => {
    const active = API_STUDIO_PREVIEW.nodes.find(
      (node) => node.id === API_STUDIO_PREVIEW.activeId,
    );
    assert.ok(active, 'the open tab must name a request in the rail');
    assert.equal(active.method, API_STUDIO_PREVIEW.request.method);
  });

  it('carries exactly one unresolved variable in the URL', () => {
    const variables = API_STUDIO_PREVIEW.request.url.filter((segment) => segment.variable === true);
    assert.equal(variables.length, 1);
    assert.match(variables[0]?.text ?? '', /^\{\{.+\}\}$/);
  });
});

describe('API Studio figures', () => {
  it('counts the module rather than repeating it', () => {
    const value = (id: string): number =>
      API_STUDIO_STATS.find((stat) => stat.id === id)?.value ?? -1;

    assert.equal(value('methods'), HTTP_METHODS.length);
    assert.equal(value('bodies'), BODY_TYPES.length);
    assert.equal(value('auth'), AUTH_SCHEMES.length);
  });

  it('excludes `inherit` and `none`, which are not credentials', () => {
    const schemes: readonly string[] = AUTH_SCHEMES;
    assert.equal(schemes.length, AUTH_TYPES.length - 2);
    assert.ok(!schemes.includes('inherit'));
    assert.ok(!schemes.includes('none'));
  });
});
