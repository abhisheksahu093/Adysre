/**
 * Client-side resume text extraction. PDF via pdfjs, DOCX via mammoth, TXT read
 * directly. All in the browser: the file never leaves the machine and there is
 * no server or paid OCR. Imported dynamically so the heavy parsers only load
 * when a file is actually processed.
 */

async function extractPdf(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  // Resolve the worker from the package (Next bundles this URL as an asset).
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
  const data = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((it) => ('str' in it ? it.str : '')).join(' '));
  }
  return pages.join('\n');
}

async function extractDocx(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value;
}

/** True for the file types the scanner accepts. */
export function isSupportedResume(file: File): boolean {
  return /\.(pdf|docx|txt)$/i.test(file.name);
}

export async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf') || file.type === 'application/pdf') return extractPdf(file);
  if (name.endsWith('.docx') || file.type.includes('officedocument.wordprocessing')) return extractDocx(file);
  return file.text();
}
