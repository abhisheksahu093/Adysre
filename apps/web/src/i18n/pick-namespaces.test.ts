import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { pickNamespaces } from './pick-namespaces';

/**
 * This function decides which translations are serialised into every page's
 * HTML. Too many and the document carries 100 KB nobody reads; too few and a
 * client component renders `namespace.key` at a visitor. Both failures are
 * invisible to the type checker, so they are pinned here.
 */

const catalogue = {
  landing: { hero: { title: 'Ship it' } },
  toast: { close: 'Close' },
  apiStudio: { title: 'API Studio' },
  rules: { title: 'Rules' },
};

describe('pickNamespaces', () => {
  it('keeps only what was asked for', () => {
    assert.deepEqual(pickNamespaces(catalogue, ['landing', 'toast']), {
      landing: catalogue.landing,
      toast: catalogue.toast,
    });
  });

  it('keeps a namespace whole, nested keys included', () => {
    const picked = pickNamespaces(catalogue, ['landing']);
    assert.deepEqual(picked.landing, { hero: { title: 'Ship it' } });
  });

  it('returns an empty catalogue rather than everything when asked for nothing', () => {
    // The dangerous failure mode: a route that names no namespaces must ship
    // none, never fall back to the full set.
    assert.deepEqual(pickNamespaces(catalogue, []), {});
  });

  it('skips a namespace that does not exist instead of throwing', () => {
    // A typo in a route's list should degrade to next-intl's own missing
    // message fallback, not take the whole page down.
    assert.deepEqual(pickNamespaces(catalogue, ['landing', 'nope']), {
      landing: catalogue.landing,
    });
  });

  it('does not mutate the source catalogue', () => {
    const before = JSON.stringify(catalogue);
    pickNamespaces(catalogue, ['landing']);
    assert.equal(JSON.stringify(catalogue), before);
  });
});
