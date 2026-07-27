import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { printSheetCss } from './print-sheet';

/**
 * The print stylesheet, checked.
 *
 * A print bug is invisible until somebody opens a print dialog, which no test
 * can do, so what is asserted here is the part that actually broke: the rules
 * that neutralise the app shell around the paper. The generators were shipping
 * a sheet that hid siblings and forgot the ancestors, and the paper came out
 * blank or clipped.
 */

describe('printSheetCss', () => {
  const css = printSheetCss('invoice-print', { size: 'A4', orientation: 'landscape' });

  it('sets the paper from the document, not from a default', () => {
    assert.match(css, /@page \{ size: A4 landscape; margin: 12mm; \}/);
  });

  it('omits @page where the output is not a page', () => {
    const plain = printSheetCss('signature-preview');
    assert.ok(!plain.includes('@page'));
    assert.match(plain, /@media print/);
  });

  it('frees html and body from the shell height that clipped the document', () => {
    assert.match(css, /html, body \{[^}]*height: auto !important;/);
    assert.match(css, /html, body \{[^}]*overflow: visible !important;/);
  });

  it('drops everything that does not contain the paper', () => {
    assert.ok(
      css.includes(
        'body :not(:has(#invoice-print)):not(#invoice-print):not(#invoice-print *) { display: none !important; }',
      ),
    );
  });

  it('flattens the ancestors that do contain it', () => {
    // The four that broke printing here: a `relative` column, a scrolling main
    // and two `overflow-hidden` shell wrappers.
    const chain = /body :has\(#invoice-print\) \{([^}]*)\}/.exec(css)?.[1] ?? '';
    for (const declaration of [
      'position: static !important',
      'overflow: visible !important',
      'height: auto !important',
      'display: block !important',
      'transform: none !important',
    ]) {
      assert.ok(chain.includes(declaration), `missing: ${declaration}`);
    }
  });

  it('keeps template backgrounds, which browsers drop from print by default', () => {
    assert.match(css, /#invoice-print \* \{[^}]*print-color-adjust: exact !important;/);
  });

  it('never lets a value out of a select become CSS', () => {
    const injected = printSheetCss('root; } body { display: none', {
      size: 'A4; } * { display: none',
      orientation: 'portrait',
    });
    // Both interpolations are stripped back to identifier characters, so the
    // only braces in the sheet are the ones this module wrote.
    assert.ok(injected.includes('#rootbodydisplaynone'));
    assert.match(injected, /@page \{ size: A4displaynone portrait; margin: 12mm; \}/);
  });
});
