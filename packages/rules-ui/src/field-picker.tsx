'use client';

import { Input } from 'adysre';
import { useId } from 'react';
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
 */
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

  return (
    <>
      <Input
        aria-label={rest['aria-label'] ?? labels.chooseField}
        className={className}
        disabled={disabled}
        list={listId}
        placeholder={loading ? labels.loading : labels.fieldPlaceholder}
        // The label of the field they picked, so a path like `c.t` is still
        // checkable at a glance without leaving the row.
        title={known?.label ?? path}
        value={path}
        onChange={(event) => onChange(event.target.value)}
      />
      <datalist id={listId}>
        {fields.map((descriptor) => (
          <option key={descriptor.path} value={descriptor.path}>
            {descriptor.group === undefined
              ? descriptor.label
              : `${descriptor.group}: ${descriptor.label}`}
          </option>
        ))}
      </datalist>
    </>
  );
}
