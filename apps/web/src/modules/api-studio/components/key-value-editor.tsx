'use client';

import { useTranslations } from 'next-intl';
import { Plus, Trash2 } from 'lucide-react';
import { Input, cn } from 'adysre';
import type { KeyValueEntry } from '../types';
import { createEntry } from '../utils/entries';

/**
 * The table behind params, headers, url-encoded fields and variables.
 *
 * One editor for all four, because they are one shape: an ordered list of rows
 * that may repeat a key and may be switched off without being deleted. The
 * checkbox is the reason this is not a `Record` anywhere in the module.
 *
 * A blank row is always kept at the end, so adding one is typing rather than
 * hunting for a button; the button stays for keyboard and screen-reader users,
 * who should not have to discover an implicit affordance.
 */
export function KeyValueEditor({
  entries,
  onChange,
  keyPlaceholder,
  valuePlaceholder,
  disabled = false,
  suggestions,
}: {
  entries: KeyValueEntry[];
  onChange: (entries: KeyValueEntry[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  disabled?: boolean;
  /** Datalist of common names, e.g. header names. */
  suggestions?: readonly string[];
}) {
  const t = useTranslations('apiStudio');
  const listId = suggestions ? `kv-suggestions-${suggestions.length}` : undefined;

  function update(id: string, patch: Partial<KeyValueEntry>): void {
    onChange(entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }

  function remove(id: string): void {
    onChange(entries.filter((entry) => entry.id !== id));
  }

  function append(): void {
    onChange([...entries, createEntry()]);
  }

  /** Typing in the trailing blank row turns it into a real one. */
  function handleLastRowEdit(id: string, patch: Partial<KeyValueEntry>): void {
    const isLast = entries[entries.length - 1]?.id === id;
    const next = entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry));
    onChange(isLast ? [...next, createEntry()] : next);
  }

  const rows = entries.length > 0 ? entries : [createEntry()];

  return (
    <div className="space-y-1">
      {suggestions && (
        <datalist id={listId}>
          {suggestions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      )}

      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="w-8 pb-1 font-medium">
              <span className="sr-only">{t('table.enabled')}</span>
            </th>
            <th scope="col" className="pb-1 font-medium">{t('table.key')}</th>
            <th scope="col" className="pb-1 font-medium">{t('table.value')}</th>
            <th scope="col" className="w-9 pb-1 font-medium">
              <span className="sr-only">{t('table.remove')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry, index) => {
            const isTrailing = index === rows.length - 1 && entry.key === '' && entry.value === '';
            return (
              <tr key={entry.id} className="group">
                <td className="py-0.5 pr-1">
                  <input
                    type="checkbox"
                    checked={entry.enabled}
                    disabled={disabled || isTrailing}
                    onChange={(event) => update(entry.id, { enabled: event.target.checked })}
                    aria-label={t('table.enableRow', { name: entry.key || t('table.newRow') })}
                    className="h-3.5 w-3.5 rounded border-input accent-primary disabled:opacity-40"
                  />
                </td>
                <td className="py-0.5 pr-1">
                  <Input
                    value={entry.key}
                    disabled={disabled}
                    list={listId}
                    placeholder={keyPlaceholder ?? t('table.key')}
                    aria-label={t('table.key')}
                    onChange={(event) => handleLastRowEdit(entry.id, { key: event.target.value })}
                    className={cn('h-8 font-mono text-xs', !entry.enabled && 'opacity-50')}
                  />
                </td>
                <td className="py-0.5 pr-1">
                  <Input
                    value={entry.value}
                    disabled={disabled}
                    placeholder={valuePlaceholder ?? t('table.value')}
                    aria-label={t('table.value')}
                    onChange={(event) => handleLastRowEdit(entry.id, { value: event.target.value })}
                    className={cn('h-8 font-mono text-xs', !entry.enabled && 'opacity-50')}
                  />
                </td>
                <td className="py-0.5">
                  <button
                    type="button"
                    onClick={() => remove(entry.id)}
                    disabled={disabled || isTrailing}
                    aria-label={t('table.removeRow', { name: entry.key || t('table.newRow') })}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors',
                      'hover:bg-muted hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      'disabled:pointer-events-none disabled:opacity-30',
                    )}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        type="button"
        onClick={append}
        disabled={disabled}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground',
          'hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        {t('table.addRow')}
      </button>
    </div>
  );
}
