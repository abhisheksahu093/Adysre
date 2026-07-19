/**
 * Per-section content editing for the playground.
 *
 * The library's sections render fixed sample text. Rather than author an
 * editable-field schema for all 700+ of them, we read the actual text out of a
 * section's live preview (see `preview-stage`), let the user edit those strings,
 * apply the edits back into the same preview, and substitute them into the
 * exported code by literal find/replace. One mechanism, every component.
 */

export type EditableFieldKind = 'heading' | 'button' | 'text' | 'placeholder' | 'alt' | 'label';

export interface EditableField {
  /** The original rendered text — the override key and export find-target. */
  text: string;
  /** Short hint of where the text lives, shown as the field label. */
  kind: EditableFieldKind;
}

/** postMessage shapes exchanged with a `/preview/[slug]` iframe. */
export interface PreviewFieldsMessage {
  type: 'adysre:preview-fields';
  slug: string;
  fields: EditableField[];
}
export interface PreviewContentMessage {
  type: 'adysre:preview-content';
  slug: string;
  overrides: Record<string, string>;
}

/**
 * Apply text overrides to a code string via literal replace-all.
 *
 * Content words (titles, labels) are the override keys; they occur in the code
 * as inline text or as a prop's default literal, so replacing every occurrence
 * updates what the exported component renders. Skips empty and no-op edits.
 */
export function applyContentOverrides(
  code: string,
  overrides: Record<string, string> | undefined,
): string {
  if (!overrides) return code;
  let out = code;
  for (const [original, value] of Object.entries(overrides)) {
    if (!original || value === original || value.trim() === '') continue;
    out = out.split(original).join(value);
  }
  return out;
}

/** How many fields a slug's overrides actually change (for badges/labels). */
export function overrideCount(overrides: Record<string, string> | undefined): number {
  if (!overrides) return 0;
  return Object.entries(overrides).filter(([o, v]) => v !== o && v.trim() !== '').length;
}
