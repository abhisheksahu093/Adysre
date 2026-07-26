/**
 * ADYSRE API Studio - key/value table helpers.
 *
 * Headers, query params and url-encoded fields are all the same ordered,
 * duplicate-tolerant table, so they share these helpers rather than each
 * growing their own. The bulk-edit format is here too, because a table and its
 * text form have to round-trip through each other exactly.
 */

import type { KeyValueEntry, WireHeader } from '../types';
import { createId } from './ids';

/** A new row. Enabled by default: a row nobody asked to disable is on. */
export function createEntry(patch: Partial<Omit<KeyValueEntry, 'id'>> = {}): KeyValueEntry {
  return {
    id: createId(),
    key: patch.key ?? '',
    value: patch.value ?? '',
    enabled: patch.enabled ?? true,
    description: patch.description ?? '',
  };
}

/**
 * The rows that actually go on the wire: enabled, and named. An unnamed row is
 * a row the user has started and not finished, not an empty-named header.
 */
export function activeEntries(entries: readonly KeyValueEntry[]): KeyValueEntry[] {
  return entries.filter((entry) => entry.enabled && entry.key.trim() !== '');
}

/** Active rows as wire headers, order and duplicates preserved. */
export function toWireHeaders(entries: readonly KeyValueEntry[]): WireHeader[] {
  return activeEntries(entries).map((entry) => ({
    name: entry.key.trim(),
    value: entry.value,
  }));
}

/** Case-insensitive lookup, because header names are case-insensitive. */
export function findHeader(
  entries: readonly KeyValueEntry[],
  name: string,
): KeyValueEntry | undefined {
  const wanted = name.toLowerCase();
  return entries.find((entry) => entry.enabled && entry.key.trim().toLowerCase() === wanted);
}

/**
 * Set a header the module owns (Content-Type for a body type, Authorization for
 * an auth strategy) without trampling one the user typed by hand.
 *
 * @returns the entries unchanged when the user already set that header.
 */
export function withDefaultHeader(
  entries: readonly KeyValueEntry[],
  name: string,
  value: string,
): KeyValueEntry[] {
  if (findHeader(entries, name)) return [...entries];
  return [...entries, createEntry({ key: name, value })];
}

/** Remove every row with this name, whatever its case. */
export function withoutHeader(
  entries: readonly KeyValueEntry[],
  name: string,
): KeyValueEntry[] {
  const unwanted = name.toLowerCase();
  return entries.filter((entry) => entry.key.trim().toLowerCase() !== unwanted);
}

/**
 * Parse the bulk-edit textarea.
 *
 * One row per line, `key: value`. A leading `//` disables the row, which is how
 * a disabled row survives a round trip through text. Blank lines are skipped; a
 * line with no colon becomes a valueless row rather than being thrown away,
 * because half-typed input is still input.
 */
export function parseBulkEntries(text: string): KeyValueEntry[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line) => {
      const enabled = !line.startsWith('//');
      const body = enabled ? line : line.slice(2).trim();
      const colon = body.indexOf(':');
      return colon === -1
        ? createEntry({ key: body, enabled })
        : createEntry({
            key: body.slice(0, colon).trim(),
            value: body.slice(colon + 1).trim(),
            enabled,
          });
    });
}

/** Render a table as bulk-edit text. Inverse of {@link parseBulkEntries}. */
export function formatBulkEntries(entries: readonly KeyValueEntry[]): string {
  return entries
    .map((entry) => `${entry.enabled ? '' : '//'}${entry.key}: ${entry.value}`)
    .join('\n');
}
