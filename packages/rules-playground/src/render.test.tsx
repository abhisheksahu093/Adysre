import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

import { darkRulesTheme } from '@adysre/rules-theme';
import { renderToStaticMarkup } from 'react-dom/server';

import { EXAMPLES } from './examples/index.ts';
import { RulePlayground } from './playground.tsx';

/**
 * Does the sandbox draw.
 *
 * A smoke test, like the builder's and the debugger's. What each example
 * ANSWERS is checked without a renderer in `examples.test.ts`; what is left for
 * a renderer to prove is that composing the builder, the debugger and the
 * pickers over a real example survives being drawn - including the example
 * whose whole point is that it errors.
 */

describe('the playground renders', () => {
  it('opens on the first example, with its verdict', () => {
    const html = renderToStaticMarkup(<RulePlayground />);

    assert.ok(html.includes('Large orders from new customers need approval'));
    // The badge comparing the live run to what the example documents.
    assert.ok(html.includes('As documented: matched'));
    // The builder and the debugger are both mounted.
    assert.ok(html.includes('Add condition'));
    assert.ok(html.includes('Why this answer'));
  });

  it('draws every example without falling over', () => {
    for (const example of EXAMPLES) {
      const html = renderToStaticMarkup(<RulePlayground initialExampleId={example.id} />);
      assert.ok(html.includes(example.title), `${example.id} did not render`);
    }
  });

  it('draws the example that errors, and says so', () => {
    // An errored verdict is a state the panel has to survive, not just report:
    // it is the one where the executor applied no actions from either branch.
    const html = renderToStaticMarkup(<RulePlayground initialExampleId="hidden-fault" />);

    assert.ok(html.includes('A rule that passes for the wrong reason'));
    assert.ok(html.includes('Short-circuiting hid an error'));
  });

  it('wears a theme, which the debugger inside it inherits', () => {
    const html = renderToStaticMarkup(<RulePlayground theme={darkRulesTheme} />);

    assert.ok(html.includes('--background:#09090b'));
  });

  it('says so rather than breaking when given no examples', () => {
    const html = renderToStaticMarkup(<RulePlayground examples={[]} />);

    assert.ok(html.includes('no examples'));
  });
});
