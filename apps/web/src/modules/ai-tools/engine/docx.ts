/**
 * Minimal, valid .docx (OOXML) writer, built in the browser from the shared ZIP
 * util. Just enough of the WordprocessingML package to carry plain paragraphs,
 * so extracted text can be saved as a Word document with no server or library.
 */

import { createZip } from '@/lib/zip';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/** Escape the five XML entities so arbitrary text is safe inside a `<w:t>`. */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** One `<w:p>` paragraph; `xml:space="preserve"` keeps leading/trailing spaces. */
function paragraph(line: string): string {
  if (line.length === 0) return '<w:p/>';
  return `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`;
}

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

/** Build a .docx Blob whose body is the given text, split into paragraphs. */
export function buildDocx(text: string): Blob {
  const body = text.split('\n').map(paragraph).join('');
  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr/></w:body></w:document>`;

  // `[Content_Types].xml` must come first in the package.
  const zip = createZip([
    { path: '[Content_Types].xml', content: CONTENT_TYPES },
    { path: '_rels/.rels', content: ROOT_RELS },
    { path: 'word/document.xml', content: document },
  ]);
  return new Blob([zip], { type: DOCX_MIME });
}
