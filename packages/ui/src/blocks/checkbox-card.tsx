'use client';

import type { InputHTMLAttributes } from 'react';

/**
 * Live preview for `checkbox-card`.
 *
 * Mirrors the `typescript` code variant verbatim. The first card ships checked so
 * the selected treatment - border, tint and tick - is on screen without a click,
 * and the cards stay independent (unlike the radio version) because that is what
 * a checkbox card is for. Keep this in step with `src/data/components/forms-choice.ts`.
 */
interface CheckboxCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  id: string;
  title: string;
  description: string;
}

export function CheckboxCard({ id, title, description, ...props }: CheckboxCardProps) {
  return (
    <label
      htmlFor={id}
      className="relative flex cursor-pointer items-start gap-3 rounded-xl border border-gray-300 bg-white p-4 transition-colors hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950 dark:has-[:focus-visible]:outline-blue-400"
    >
      <input id={id} type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-400 bg-white text-white peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:[&>svg]:opacity-100 dark:border-gray-500 dark:bg-gray-900 dark:peer-checked:border-blue-500 dark:peer-checked:bg-blue-500"
      >
        <svg
          className="h-3.5 w-3.5 opacity-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          focusable="false"
        >
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">{description}</span>
      </span>
    </label>
  );
}

export default function CheckboxCardPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <CheckboxCard
        id="preview-addon-analytics"
        name="addons"
        value="analytics"
        title="Advanced analytics"
        description="Funnels, retention and cohort reports."
        defaultChecked
      />
      <CheckboxCard
        id="preview-addon-sso"
        name="addons"
        value="sso"
        title="SAML single sign-on"
        description="Okta, Entra ID and any SAML 2.0 provider."
      />
      <CheckboxCard
        id="preview-addon-audit"
        name="addons"
        value="audit"
        title="Audit log export"
        description="Stream every privileged action to your SIEM."
      />
    </div>
  );
}
