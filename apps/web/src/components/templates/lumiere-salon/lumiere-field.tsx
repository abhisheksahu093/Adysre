'use client';

import type { LumiereFormFieldCopy } from '@/data/templates/lumiere-salon-content';

/**
 * LUMIERE - one labelled form control.
 *
 * The booking form and the contact form render fields from the same data shape,
 * so they render them through the same component: a real `<label>` bound by
 * `htmlFor`/`id`, never a placeholder standing in for a label, and a hint wired
 * to the control with `aria-describedby` rather than left floating beside it.
 *
 * `type` decides the element. A `select` receives its options as children,
 * because they are derived from the treatment menu and the team rather than
 * duplicated into the copy object.
 */
export function LumiereField({
  field,
  required = true,
  children,
}: {
  field: LumiereFormFieldCopy;
  required?: boolean;
  children?: React.ReactNode;
}) {
  const hintId = `${field.id}-hint`;
  // `exactOptionalPropertyTypes` forbids passing `aria-describedby={undefined}`,
  // so the attribute is spread in only when there is a hint to point at.
  const described = field.hint === undefined ? {} : { 'aria-describedby': hintId };

  return (
    <div>
      <label htmlFor={field.id} className="lumi-label">
        {field.label}
      </label>

      {field.type === 'select' ? (
        <select
          id={field.id}
          name={field.id}
          required={required}
          defaultValue=""
          className="lumi-field mt-2"
          {...described}
        >
          {/* An empty, disabled first option makes the placeholder unselectable
              once the visitor has moved on, which a plain option would not. */}
          <option value="" disabled>
            {field.placeholder}
          </option>
          {children}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          id={field.id}
          name={field.id}
          rows={4}
          placeholder={field.placeholder}
          required={required}
          className="lumi-field mt-2"
          {...described}
        />
      ) : (
        <input
          id={field.id}
          name={field.id}
          type={field.type}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          required={required}
          className="lumi-field mt-2"
          {...described}
        />
      )}

      {field.hint !== undefined && (
        <p id={hintId} className="mt-2 text-[13px] leading-[1.6] text-[var(--lumi-ink-faint)]">
          {field.hint}
        </p>
      )}
    </div>
  );
}
