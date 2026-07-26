/**
 * On-device PDF handling with pdf.js.
 *
 * The worker ships from the app's own origin (Next bundles it as an asset), so
 * PDFs are parsed and rasterized entirely in the browser, offline, and never
 * leave ADYSRE. Imported dynamically so the parser only loads when a PDF is
 * actually opened.
 */

import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

/** True for a PDF, by MIME or extension (some browsers omit the type). */
export function isPdf(file: File): boolean {
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
}

/** Load a PDF document from a file, with the worker resolved from the package. */
export async function getPdfDocument(file: File): Promise<PDFDocumentProxy> {
  const pdfjs = await import('pdfjs-dist');
  // Same-origin worker asset bundled by Next; no CDN, works offline.
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
  const data = await file.arrayBuffer();
  return pdfjs.getDocument({ data }).promise;
}

/** The embedded text of a page, whitespace-collapsed (empty for scans). */
export async function extractPageText(page: PDFPageProxy): Promise<string> {
  const content = await page.getTextContent();
  return content.items
    .map((item) => ('str' in item ? item.str : ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Rasterize a page to a canvas at the given scale, for OCR of scanned PDFs. */
export async function renderPageToCanvas(page: PDFPageProxy, scale: number): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const canvasContext = canvas.getContext('2d');
  if (!canvasContext) throw new Error('Canvas is not available');
  await page.render({ canvasContext, viewport }).promise;
  return canvas;
}
