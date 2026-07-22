'use client';

import type { LumenCheckoutFieldCopy } from '@/data/templates/lumen-store-content';

/**
 * LUMEN - one labelled form control.
 *
 * Checkout, sign in and create account all render fields from the same data
 * shape, so they render them through the same component: a real `<label>` bound
 * by `htmlFor`/`id`, never a placeholder standing in for a label, and the
 * disabled state carried through to the control rather than faked with styling.
 *
 * `disabled` exists for the checkout's demo payment block, which must be inert
 * in the DOM and not merely greyed out.
 */
export function LumenField({
  field,
  disabled = false,
  required = true,
}: {
  field: LumenCheckoutFieldCopy;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={field.id} className="lum-label">
        {field.label}
      </label>
      <input
        id={field.id}
        name={field.id}
        type={field.type}
        placeholder={field.placeholder}
        autoComplete={field.autoComplete}
        disabled={disabled}
        // A disabled control cannot be required: the constraint would be
        // unsatisfiable and the form could never submit.
        required={required && !disabled}
        className="lum-field mt-2"
      />
    </div>
  );
}
