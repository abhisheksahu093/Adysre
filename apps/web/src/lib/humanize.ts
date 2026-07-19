/**
 * Turn a camelCase / kebab / snake key into a readable label.
 *
 * Used as a fallback when a message catalogue has no translation for a
 * dynamically-keyed lookup (e.g. a component's prop `descriptionKey` or a
 * variant `labelKey` that predates its translation) — better a sensible label
 * than a thrown MISSING_MESSAGE that takes the whole page down.
 */
export function humanizeKey(key: string): string {
  const s = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .toLowerCase();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : key;
}
