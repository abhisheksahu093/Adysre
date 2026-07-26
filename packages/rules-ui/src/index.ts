/**
 * `@adysre/rules-ui` - the visual builder.
 *
 * Components over `@adysre/rules-react`, which is where the editing actually
 * happens. Nothing in this package holds state of its own beyond what a control
 * needs between keystrokes: every edit is a dispatch, so undo, validation and
 * dirtiness are the same here as they are for a host driving the store without
 * a screen.
 *
 * The decisions the builder has to make - which operators fit a field, how many
 * boxes an operator wants, what an empty box means - live in plain modules
 * beside the components, because a decision that can only be reached through a
 * renderer is a decision nobody tests.
 *
 * Every part is exported, not just the whole. A host that wants the condition
 * tree inside its own form should not have to take the toolbar and the metadata
 * panel with it.
 */

export * from './actions.ts';
export * from './labels.ts';
export * from './operands.ts';
export * from './operators.ts';
export * from './sync.ts';
export * from './values.ts';

export * from './action-editor.tsx';
export * from './condition-row.tsx';
export * from './context.tsx';
export * from './diagnostics.tsx';
export * from './field-picker.tsx';
export * from './group-row.tsx';
export * from './meta-editor.tsx';
export * from './operand-editor.tsx';
export * from './preview.tsx';
export * from './row-actions.tsx';
export * from './rule-builder.tsx';
export * from './toolbar.tsx';
export * from './value-input.tsx';
