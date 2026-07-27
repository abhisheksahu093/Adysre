/**
 * Print isolation for the document tools, in one place.
 *
 * Every generator here (invoice, salary slip, resume, signature) prints with
 * the browser's own print-to-PDF: no library, no server, works offline. What
 * that needs is a stylesheet that leaves ONLY the paper on the page.
 *
 * ─── Why the obvious version does not work ──────────────────────────────────
 * The usual recipe is `body * { visibility: hidden }` plus a visible print
 * root. It fails in an app shell, and it failed here:
 *
 * 1. A hidden element still occupies its box, so the app's chrome reserves
 *    space and the document starts on page two, or three.
 * 2. The shell is `h-screen overflow-hidden` with a scrolling `main`, and the
 *    editor columns scroll internally. An ancestor that clips at viewport
 *    height clips in print too, so only the visible sliver reaches the paper.
 * 3. Escaping that with `position: absolute` only works while no ancestor is
 *    positioned. The invoice and payslip preview columns are `relative`, which
 *    made the paper absolute INSIDE a clipped scroll box: it printed blank or
 *    cut off, which is exactly what was reported.
 *
 * So this does not try to hide things or lift the paper out. It removes every
 * element that does not contain the paper, and flattens the ones that do -
 * whatever the shell around them happens to be. `:has()` is what makes that
 * expressible in CSS, and it is available everywhere this app runs.
 */

/** Paper for the `@page` rule. Omit it where the output is not a page (a signature). */
export interface PrintPage {
  /** A paper name a browser understands: `A4`, `Letter`, `Legal`. */
  size: string;
  orientation?: 'portrait' | 'landscape';
  /** CSS length; the templates carry their own padding, so 12mm suits them all. */
  margin?: string;
}

/**
 * Anything that is not a plain identifier is dropped.
 *
 * These values come from our own selects rather than a text field, but they are
 * interpolated into a live stylesheet, and a sanitiser costs one regex.
 */
function safe(token: string): string {
  return token.replace(/[^A-Za-z0-9_-]/g, '');
}

/**
 * The stylesheet that isolates `#rootId` when printing.
 *
 * @param rootId Element wrapping the paper, and nothing else.
 * @param page Paper size and orientation, when the output is a page.
 */
export function printSheetCss(rootId: string, page?: PrintPage): string {
  const id = `#${safe(rootId)}`;

  const atPage =
    page === undefined
      ? ''
      : `@page { size: ${safe(page.size)} ${safe(page.orientation ?? 'portrait')}; margin: ${safe(page.margin ?? '12mm')}; }\n`;

  return `${atPage}@media print {
  /* The shell caps itself at one viewport; a document is as long as it is. */
  html, body {
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    overflow: visible !important;
    background: #fff !important;
  }

  /* Everything that does not contain the paper goes away. 'display: none'
     rather than 'visibility: hidden', because a hidden box still takes up the
     page it was on and that is what produced blank leading pages. */
  body :not(:has(${id})):not(${id}):not(${id} *) { display: none !important; }

  /* The ancestors that DO contain it collapse to plain blocks, so no grid,
     sticky, transform, height or overflow between the body and the paper can
     clip it or push it down a page. */
  body :has(${id}) {
    display: block !important;
    position: static !important;
    overflow: visible !important;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    width: auto !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    background: none !important;
    box-shadow: none !important;
    transform: none !important;
  }

  /* The paper itself: screen chrome off, colours on. Browsers drop background
     fills from print by default, which would flatten every template that uses
     an accent band or a coloured rail. */
  ${id} {
    display: block !important;
    position: static !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    overflow: visible !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  ${id} * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}`;
}
