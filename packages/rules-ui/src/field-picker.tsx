'use client';

import { Input } from 'adysre';
import { useId } from 'react';
import type { FieldDescriptor } from '@adysre/rules-types';
import { useBuilder } from './context.tsx';

export interface FieldPickerProps {
  path: string;
  onChange: (path: string) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * Which field a rule reads.
 *
 * A text box with a `datalist` rather than a select, because the field list is
 * a suggestion and not a constraint: a provider offers what it knows, and a
 * host with no provider at all, or a path a provider has not heard of yet, has
 * to be able to write `order.total` anyway. A select would make the rules a
 * deployment can express depend on whether its schema loader happened to
 * enumerate everything.
 *
 * `datalist` is also the reason this is not a custom listbox. Typeahead,
 * keyboard behaviour and screen-reader semantics come from the platform, and a
 * hand-rolled version of all three is where a builder's accessibility usually
 * goes to die.
 *
 * ─── Labels, not paths ──────────────────────────────────────────────────────
 * What the box SHOWS is the field's label; what the rule STORES is its path.
 * Every other cell of a condition row reads as language ("is greater than", "a
 * value"), and a raw `customer.tier` in the middle of that row was the one
 * place the builder leaked its schema at a business user. The path is still
 * one keystroke away: it is the title, it is what an unknown entry is taken to
 * be, and clearing the box lets anybody type one.
 */

/**
 * What a field is called in the row.
 *
 * The bare label, which is what the sentence preview under the builder says
 * too ("Order total is greater than 1,000"). The group is prepended only when
 * another field answers to the same label - "Order: Name" beside "Customer:
 * Name" - because a qualifier that is never needed is noise in a cell that has
 * to be read at a glance.
 */
function displayName(descriptor: FieldDescriptor, fields: readonly FieldDescriptor[]): string {
  if (descriptor.group === undefined) return descriptor.label;

  const label = descriptor.label.toLowerCase();
  const shared = fields.filter((other) => other.label.toLowerCase() === label).length > 1;
  return shared ? `${descriptor.group}: ${descriptor.label}` : descriptor.label;
}

export function FieldPicker({
  path,
  onChange,
  disabled,
  className,
  ...rest
}: FieldPickerProps): React.JSX.Element {
  const { fields, labels, loading } = useBuilder();
  const listId = useId();

  const known = fields.find((descriptor) => descriptor.path === path);

  /**
   * Resolve what was typed or picked.
   *
   * A label the catalogue knows becomes its path; anything else is taken as a
   * path verbatim, which is what keeps a field nobody enumerated writable.
   * Matching ignores case and surrounding space, because a person retyping a
   * label should not have to reproduce it exactly.
   */
  function resolve(text: string): string {
    const wanted = text.trim().toLowerCase();
    if (wanted === '') return '';

    const match = fields.find(
      (descriptor) =>
        displayName(descriptor, fields).toLowerCase() === wanted ||
        descriptor.label.toLowerCase() === wanted ||
        // The qualified form is accepted whether or not it is what the box
        // would have shown, so a pasted "Order: Name" still resolves.
        (descriptor.group !== undefined &&
          `${descriptor.group}: ${descriptor.label}`.toLowerCase() === wanted),
    );
    return match?.path ?? text;
  }

  return (
    <>
      <Input
        aria-label={rest['aria-label'] ?? labels.chooseField}
        className={className}
        disabled={disabled}
        list={listId}
        placeholder={loading ? labels.loading : labels.fieldPlaceholder}
        // The path behind the label, so what the rule actually reads is
        // checkable at a glance without leaving the row.
        title={path}
        value={known === undefined ? path : displayName(known, fields)}
        onChange={(event) => onChange(resolve(event.target.value))}
      />
      <datalist id={listId}>
        {fields.map((descriptor) => (
          // Value, not text: a datalist puts the option's VALUE in the box, so
          // offering paths here is what put a path in front of the user.
          <option key={descriptor.path} value={displayName(descriptor, fields)}>
            {descriptor.path}
          </option>
        ))}
      </datalist>
    </>
  );
}
