'use client';

import type { JsonValue, Operand, ValueType } from '@adysre/rules-types';
import { Button, Input, Select, cn } from 'adysre';
import { useBuilder } from './context.tsx';
import { FieldPicker } from './field-picker.tsx';
import { labelFor } from './labels.ts';
import {
  OPERAND_SOURCES,
  functionSlots,
  removeFunctionArg,
  resizeFunctionArgs,
  setFunctionArg,
  switchSource,
  type OperandSource,
} from './operands.ts';
import { ValueInput } from './value-input.tsx';

/**
 * How deep the editor will draw nested calculations.
 *
 * The builder cannot produce anything this deep on its own - a new function
 * starts with empty arguments - but an imported rule was not authored by
 * anyone we know, and a component that recurses on whatever it was handed is a
 * component an import can hang. Below the cap the operand is still THERE and
 * still evaluated; it just is not editable in place.
 */
const MAX_OPERAND_DEPTH = 4;

export interface OperandEditorProps {
  operand: Operand;
  onChange: (operand: Operand) => void;
  /**
   * The type the other side of the comparison holds, which is what tells a
   * literal whether to draw a date picker or a number box. A left-hand side has
   * no other side, so it passes nothing and gets a text box.
   */
  expectedType?: ValueType | undefined;
  /** A closed set of values, when the field on the other side declared one. */
  options?: readonly { value: JsonValue; label: string }[] | undefined;
  disabled?: boolean;
  depth?: number;
  className?: string;
  'aria-label'?: string;
}

/**
 * One operand: a value, a field, a variable or a calculation.
 *
 * All four are the same construct in the AST, so they are one component here.
 * That is what makes "compare this field to that field" and "compare it to
 * today" the same edit rather than two features, and it is why a function's
 * arguments are edited by this component recursing into itself.
 */
export function OperandEditor({
  operand,
  onChange,
  expectedType,
  options,
  disabled,
  depth = 0,
  className,
  ...rest
}: OperandEditorProps): React.JSX.Element {
  const { labels, variables, readOnly } = useBuilder();
  const locked = disabled === true || readOnly;

  return (
    <div className={cn('flex flex-wrap items-start gap-2', className)}>
      <Select
        aria-label={labels.source}
        className="w-32 shrink-0"
        disabled={locked}
        value={operand.source}
        onChange={(event) => onChange(switchSource(operand, event.target.value as OperandSource))}
      >
        {OPERAND_SOURCES.map((source) => (
          <option key={source} value={source}>
            {labels.sources[source]}
          </option>
        ))}
      </Select>

      <div className="flex min-w-48 flex-1 flex-col gap-2">
        {operand.source === 'literal' && (
          <ValueInput
            aria-label={rest['aria-label'] ?? labels.value}
            disabled={locked}
            options={options}
            type={expectedType ?? 'any'}
            value={operand.value}
            onChange={(value) => onChange({ source: 'literal', value })}
          />
        )}

        {operand.source === 'field' && (
          <FieldPicker
            disabled={locked}
            path={operand.path}
            onChange={(path) => onChange({ source: 'field', path })}
          />
        )}

        {operand.source === 'variable' &&
          (variables.length > 0 ? (
            <Select
              aria-label={labels.variablePlaceholder}
              disabled={locked}
              value={operand.name}
              onChange={(event) => onChange({ source: 'variable', name: event.target.value })}
            >
              <option value="">{labels.variablePlaceholder}</option>
              {variables.map((descriptor) => (
                <option key={descriptor.name} value={descriptor.name}>
                  {descriptor.label}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              aria-label={labels.variablePlaceholder}
              disabled={locked}
              placeholder={labels.variablePlaceholder}
              value={operand.name}
              onChange={(event) => onChange({ source: 'variable', name: event.target.value })}
            />
          ))}

        {operand.source === 'function' && (
          <FunctionOperand depth={depth} disabled={locked} operand={operand} onChange={onChange} />
        )}
      </div>
    </div>
  );
}

function FunctionOperand({
  operand,
  onChange,
  disabled,
  depth,
}: {
  operand: Extract<Operand, { source: 'function' }>;
  onChange: (operand: Operand) => void;
  disabled: boolean;
  depth: number;
}): React.JSX.Element {
  const { labels, registry } = useBuilder();
  const plugin = registry.function(operand.name);
  const slots = functionSlots(plugin, operand.args);
  const variadic = plugin?.arity === null;

  return (
    <>
      <Select
        aria-label={labels.chooseFunction}
        disabled={disabled}
        value={operand.name}
        onChange={(event) => {
          const name = event.target.value;
          const next = registry.function(name);
          // The arguments resize to the new function for the same reason the
          // reducer resizes a condition's: a call needing two where it has one
          // is a call that cannot run, and padding is honest about which slot
          // is still empty.
          const arity = next?.arity;
          const resized =
            arity === undefined || arity === null
              ? { ...operand, name }
              : resizeFunctionArgs({ ...operand, name }, arity);
          onChange(resized);
        }}
      >
        <option value="">{labels.chooseFunction}</option>
        {[...registry.functions.values()].map((candidate) => (
          <option key={candidate.id} value={candidate.id}>
            {labelFor(candidate, labels)}
          </option>
        ))}
      </Select>

      {depth >= MAX_OPERAND_DEPTH ? (
        <p className="text-xs text-muted-foreground">{labels.tooDeep}</p>
      ) : (
        <div className="flex flex-col gap-2 border-l border-border pl-3">
          {Array.from({ length: slots }, (_, index) => (
            <div key={index} className="flex items-start gap-2">
              <OperandEditor
                aria-label={`${labelFor({ id: operand.name }, labels)} ${index + 1}`}
                className="flex-1"
                depth={depth + 1}
                disabled={disabled}
                operand={operand.args[index] ?? { source: 'literal', value: null }}
                expectedType={plugin?.argTypes?.[index]}
                onChange={(arg) => onChange(setFunctionArg(operand, index, arg))}
              />
              {variadic && operand.args.length > 1 && (
                <Button
                  aria-label={labels.remove}
                  disabled={disabled}
                  size="sm"
                  type="button"
                  variant="ghost"
                  onClick={() => onChange(removeFunctionArg(operand, index))}
                >
                  &times;
                </Button>
              )}
            </div>
          ))}

          {variadic && (
            <Button
              className="self-start"
              disabled={disabled}
              size="sm"
              type="button"
              variant="ghost"
              onClick={() => onChange(resizeFunctionArgs(operand, operand.args.length + 1))}
            >
              {labels.addValue}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
