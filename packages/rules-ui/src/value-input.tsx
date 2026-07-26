'use client';

import type { JsonValue, ValueType } from '@adysre/rules-types';
import { Input, Select, Textarea, cn } from 'adysre';
import { useEffect, useRef, useState } from 'react';
import { useBuilder } from './context.tsx';
import { formatLiteral, inputKindFor, parseLiteral } from './values.ts';

export interface ValueInputProps {
  value: JsonValue;
  type: ValueType;
  onChange: (value: JsonValue) => void;
  /** A closed set of values, when the field declared one. */
  options?: readonly { value: JsonValue; label: string }[] | undefined;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * One literal value, in whatever control fits its type.
 *
 * The only component in the builder that keeps state of its own, and it has to.
 * The AST holds JSON while the box holds text, and the two disagree in the
 * middle of typing: `-` and `1.` and `gold,` are all on their way somewhere
 * valid, and a box that re-rendered from the parsed value would erase each of
 * them as it was typed. So the text is the draft and the value is what the
 * draft parsed to.
 *
 * The draft is re-synced only when the incoming value disagrees with what the
 * draft ALREADY parses to, which is exactly the case where the change came from
 * somewhere else: an undo, a different rule loaded, an operator that resized
 * its arguments. Comparing against the draft rather than tracking "who typed
 * last" is what makes undo work without the box fighting it.
 */
export function ValueInput({
  value,
  type,
  onChange,
  options,
  disabled,
  className,
  ...rest
}: ValueInputProps): React.JSX.Element {
  const { labels } = useBuilder();
  const [draft, setDraft] = useState(() => formatLiteral(value));
  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(() => {
    const parsed = parseLiteral(draftRef.current, type);
    if (JSON.stringify(parsed) === JSON.stringify(value)) return;
    setDraft(formatLiteral(value));
    // The draft is read through a ref so it is NOT a dependency. This effect
    // exists to overwrite the draft when the value arrived from elsewhere, and
    // an effect that re-ran on every keystroke would be re-deciding whether to
    // discard what was just typed, once per character.
  }, [value, type]);

  const commit = (text: string): void => {
    setDraft(text);
    onChange(parseLiteral(text, type));
  };

  const label = rest['aria-label'] ?? labels.value;

  // A closed set is a select, whatever the underlying type: the field told us
  // every value it can hold, and a free-text box beside a known list is an
  // invitation to typo one of them.
  if (options !== undefined && options.length > 0) {
    return (
      <Select
        aria-label={label}
        className={className}
        disabled={disabled}
        value={formatLiteral(value)}
        onChange={(event) => {
          const chosen = options.find(
            (option) => formatLiteral(option.value) === event.target.value,
          );
          onChange(chosen?.value ?? null);
        }}
      >
        <option value="">{labels.value}</option>
        {options.map((option) => (
          <option key={formatLiteral(option.value)} value={formatLiteral(option.value)}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }

  switch (inputKindFor(type)) {
    case 'checkbox':
      // A select rather than a checkbox: a rule can compare against true, false
      // or nothing at all, and a checkbox has no way to say the third.
      return (
        <Select
          aria-label={label}
          className={className}
          disabled={disabled}
          value={value === null ? '' : String(value)}
          onChange={(event) =>
            onChange(event.target.value === '' ? null : event.target.value === 'true')
          }
        >
          <option value="" />
          <option value="true">{labels.booleanTrue}</option>
          <option value="false">{labels.booleanFalse}</option>
        </Select>
      );

    case 'json':
      return (
        <Textarea
          aria-label={label}
          className={cn('font-mono text-xs', className)}
          disabled={disabled}
          rows={3}
          value={draft}
          onChange={(event) => commit(event.target.value)}
        />
      );

    case 'number':
      return (
        <Input
          aria-label={label}
          className={className}
          disabled={disabled}
          inputMode="decimal"
          type="number"
          value={draft}
          onChange={(event) => commit(event.target.value)}
        />
      );

    case 'date':
      return (
        <Input
          aria-label={label}
          className={className}
          disabled={disabled}
          type="date"
          value={draft}
          onChange={(event) => commit(event.target.value)}
        />
      );

    case 'list':
      return (
        <Input
          aria-label={label}
          className={className}
          disabled={disabled}
          placeholder={labels.listPlaceholder}
          value={draft}
          onChange={(event) => commit(event.target.value)}
        />
      );

    default:
      return (
        <Input
          aria-label={label}
          className={className}
          disabled={disabled}
          value={draft}
          onChange={(event) => commit(event.target.value)}
        />
      );
  }
}
