/**
 * Turn an assembled playground page into copyable / downloadable source.
 *
 * Pure functions over registry data - no DOM, no store. The UI passes the
 * resolved sections in; localised strings (section headings, missing-section
 * notes) come in as arguments because this module must not know about i18n.
 */

import { FRAMEWORKS, type Framework } from '@/data/components';
import type { PlaygroundSection } from '@/data/playground';
import { applyContentOverrides } from '@/lib/playground/content';

/** Base name for generated files; the framework's extension is appended. */
export const EXPORT_FILE_BASE = 'adysre-page';

export interface ExportSectionFile {
  slotId: string;
  title: string;
  fileName: string;
  /** `null` when this section has no source for the chosen framework. */
  code: string | null;
}

export interface AssembledExport {
  framework: Framework;
  label: string;
  lang: string;
  ext: string;
  fileName: string;
  /** Every section concatenated in page order, with heading comments. */
  code: string;
  sections: ExportSectionFile[];
  /** How many sections actually ship source for this framework. */
  available: number;
  total: number;
}

/** Comment syntax per Shiki lang - the languages the registry actually uses. */
function comment(lang: string, text: string): string {
  if (lang === 'html') return `<!-- ${text} -->`;
  if (lang === 'css') return `/* ${text} */`;
  return `// ${text}`;
}

/**
 * Frameworks worth offering for this page: every framework at least one
 * selected section ships source for, in the registry's display order.
 */
export function exportableFrameworks(
  sections: PlaygroundSection[],
): { framework: Framework; label: string; available: number; total: number }[] {
  return FRAMEWORKS.filter((f) =>
    sections.some((s) => s.component.code[f.id] !== undefined),
  ).map((f) => ({
    framework: f.id,
    label: f.label,
    available: sections.filter((s) => s.component.code[f.id] !== undefined).length,
    total: sections.length,
  }));
}

/**
 * Assemble the page's source for one framework.
 *
 * Sections missing that framework are kept in place as a comment (built from
 * the translated `missingNote`) instead of silently dropped - a page exported
 * with a hole should say where the hole is.
 */
export function assembleExport(
  sections: PlaygroundSection[],
  framework: Framework,
  missingNote: (sectionTitle: string, frameworkLabel: string) => string,
  /** Per-slug text edits to bake into the exported source. */
  overridesBySlug: Record<string, Record<string, string>> = {},
): AssembledExport | undefined {
  const meta = FRAMEWORKS.find((f) => f.id === framework);
  if (!meta || sections.length === 0) return undefined;

  const sectionFiles: ExportSectionFile[] = sections.map(({ slot, component }) => {
    const source = component.code[framework];
    // The user's edits are text substitutions; the same strings appear in the
    // source (inline or as prop defaults), so replacing them ships the custom
    // content in the downloaded code exactly as it shows in the preview.
    const edited =
      source === undefined
        ? null
        : applyContentOverrides(source, overridesBySlug[component.slug]).trim();
    return {
      slotId: slot.id,
      title: component.title,
      fileName: `${component.slug}.${meta.ext}`,
      code: edited,
    };
  });

  const parts = sectionFiles.map((s) =>
    s.code !== null
      ? `${comment(meta.lang, `─── ${s.title} ───`)}\n${s.code}`
      : comment(meta.lang, missingNote(s.title, meta.label)),
  );

  return {
    framework,
    label: meta.label,
    lang: meta.lang,
    ext: meta.ext,
    fileName: `${EXPORT_FILE_BASE}.${meta.ext}`,
    code: parts.join('\n\n'),
    sections: sectionFiles,
    available: sectionFiles.filter((s) => s.code !== null).length,
    total: sectionFiles.length,
  };
}

/** Hand `text` to the browser as a file download, then release the blob. */
export function downloadText(fileName: string, text: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
