import type { ComponentContentMap } from '../types';

/** English prose for the change-password category. Keys are component slugs. */
export const changePasswordContent: ComponentContentMap = {
  'change-password-basic': {
    title: 'Basic Change Password',
    description:
      'A three-field change-password form - current, new and confirm - with a show/hide toggle and live mismatch feedback.',
    customization:
      'Each field owns a real `<label>` and the correct `autocomplete` token so a manager fills the current value and saves the new one. The confirm field flips `aria-invalid` and describes an alert the instant it drifts from the new password; `onSubmit` is a no-op you replace at the call site.',
    seoTitle: 'Change Password Form - Free Tailwind CSS Component',
    seoDescription:
      'An accessible change-password form with current/new/confirm fields, show/hide toggle and mismatch validation, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['change password form', 'password form', 'account security', 'tailwind form'],
  },
  'change-password-with-strength': {
    title: 'Change Password With Strength Meter',
    description:
      'A new-password form with a live strength bar whose label is announced through an aria-live region.',
    customization:
      'Strength is five independent checks - length, upper, lower, digit, symbol - so the meter cannot be gamed by repeating one class. The bar is `aria-hidden` decoration; the text line beneath carries `aria-live="polite"` so the rating actually reaches a screen reader as it changes.',
    seoTitle: 'Password Strength Meter Form - Free React Component',
    seoDescription:
      'A change-password form with a live password strength meter announced via aria-live, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['password strength meter', 'change password', 'strength indicator', 'aria-live form'],
  },
  'change-password-card': {
    title: 'Change Password Card',
    description:
      'A self-contained card with current/new/confirm fields and a Cancel plus Update button pair.',
    customization:
      'The card is `w-full max-w-sm`, so it fills a narrow column and caps on desktop. The action row is `flex-col-reverse` on phones so the primary button sits on top and two buttons never crowd into one bad tap row; both `onSubmit` and `onCancel` default to no-ops.',
    seoTitle: 'Change Password Card - Free Tailwind CSS Component',
    seoDescription:
      'A change-password card with current/new/confirm fields and dual actions, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['change password card', 'password card', 'settings card', 'account form'],
  },
  'change-password-inline': {
    title: 'Inline Change Password Row',
    description:
      'A settings-page row with a description on one side and a compact change-password form on the other.',
    customization:
      'The row is `flex-col` on phones and `sm:flex-row` above, so the label block and the form stack cleanly at 320px and sit side by side on wider screens. The submit button goes full width on mobile and shrinks to auto from `sm` up.',
    seoTitle: 'Inline Change Password Row - Free Tailwind CSS Component',
    seoDescription:
      'A settings-row change-password form that stacks on mobile, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['inline password form', 'settings row', 'change password', 'account settings'],
  },
  'change-password-with-requirements': {
    title: 'Change Password With Requirements',
    description:
      'A new-password field over a live checklist of rules that tick green as each is satisfied.',
    customization:
      'The rules list is the `aria-live` region: as each check passes it re-announces politely, and every row carries an `sr-only` "met"/"not met" so the state is never colour-only. The submit button stays disabled until all rules pass. Edit the `rules` array to match your policy.',
    seoTitle: 'Password Requirements Checklist - Free React Component',
    seoDescription:
      'A change-password form with a live, accessible requirements checklist, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['password requirements', 'password checklist', 'validation rules', 'change password'],
  },
  'change-password-modal': {
    title: 'Change Password Modal',
    description:
      'A dialog-styled change-password card with a title, close button and current/new fields.',
    customization:
      'The shell wires `role="dialog"`, `aria-modal` and `aria-labelledby`; the focus-trap, Escape-to-close and body-scroll-lock are host concerns and belong at the call site. The action row stacks on phones and the close button is a labelled icon target.',
    seoTitle: 'Change Password Modal - Free Tailwind CSS Component',
    seoDescription:
      'A change-password dialog with an accessible title and close button, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['change password modal', 'password dialog', 'modal form', 'account modal'],
  },
  'change-password-split': {
    title: 'Split Change Password',
    description:
      'An explainer panel beside the form, collapsing to a single stack on mobile with the copy first.',
    customization:
      'Two columns from `md` up, one stack below it with the guidance panel first in reading order. The divider swaps from a bottom border on phones to a right border on desktop, so the seam always follows the layout.',
    seoTitle: 'Split Change Password Layout - Free Tailwind CSS Component',
    seoDescription:
      'A two-column change-password layout with a tips panel that stacks on mobile, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['split password form', 'two column form', 'change password', 'responsive form'],
  },
  'change-password-2fa': {
    title: 'Change Password With 2FA Code',
    description:
      'A new-password field paired with a six-digit verification code input to confirm the change.',
    customization:
      'The code field is `inputmode="numeric"` for the digit pad and `autocomplete="one-time-code"` so the OS can offer the incoming code, and non-digits are stripped as you type. Submit stays inert until the code is a full six digits; `onSubmit` is a no-op by default.',
    seoTitle: 'Change Password With 2FA - Free React Component',
    seoDescription:
      'A change-password form with a six-digit 2FA verification code input, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['2fa password form', 'verification code', 'one-time code', 'change password'],
  },
  'change-password-success-state': {
    title: 'Change Password Success State',
    description:
      'A change-password card that swaps to a confirmation panel with a check icon after submit.',
    customization:
      'On submit the same card replaces the fields with a `role="status"` success panel, so the confirmation is announced when it appears. A "Back to settings" button returns to the form; nothing here persists a credential - `onSubmit` is a no-op.',
    seoTitle: 'Change Password Success State - Free React Component',
    seoDescription:
      'A change-password form with a post-submit success confirmation, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['password success state', 'confirmation panel', 'change password', 'form success'],
  },
  'change-password-minimal': {
    title: 'Minimal Change Password',
    description:
      'A stripped pair of underlined new and confirm fields with a single save button.',
    customization:
      'Underline-only inputs and a compact `max-w-xs` width for tight spaces, still with real labels, `autocomplete="new-password"` and live mismatch validation. Swap the near-black button for your brand accent to reskin it.',
    seoTitle: 'Minimal Change Password Form - Free Tailwind CSS Component',
    seoDescription:
      'A minimal underlined change-password form with mismatch validation, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['minimal password form', 'underline input', 'change password', 'compact form'],
  },
};
