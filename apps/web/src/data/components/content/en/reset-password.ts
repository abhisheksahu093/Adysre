import type { ComponentContentMap } from '../types';

/** English prose for the reset-password category. Keys are component slugs. */
export const resetPasswordContent: ComponentContentMap = {
  'reset-password-request-email': {
    title: 'Request Reset Email',
    description:
      'Step one of a reset: an email field and a submit that mails a recovery link.',
    customization:
      'The field is a real `<label>` plus `type="email"` and `autocomplete="email"`, so mobile gets the right keyboard and the browser can fill it. `onSubmit` is a no-op by default - wire it to your own backend; this component never posts anywhere.',
    seoTitle: 'Forgot Password Email Form - Free Tailwind CSS Component',
    seoDescription:
      'An accessible forgot-password form that collects an email to send a reset link, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['forgot password form', 'reset password email', 'password recovery', 'tailwind auth form'],
  },
  'reset-password-new-password': {
    title: 'Set New Password',
    description:
      'A new-password and confirm-password pair with a show toggle and a live mismatch hint.',
    customization:
      'Both fields carry `autocomplete="new-password"` so a manager offers to generate and save rather than autofill the old value; the toggle swaps the input `type` instead of exposing a second plaintext field. The confirm field flags a mismatch inline and blocks submit until it matches.',
    seoTitle: 'Set New Password Form - Free Tailwind CSS Component',
    seoDescription:
      'An accessible set-a-new-password form with confirm field and show toggle, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['new password form', 'confirm password', 'set password', 'change password form'],
  },
  'reset-password-otp-code': {
    title: 'One-Time Code Entry',
    description:
      'A single numeric field for the emailed 6-digit code, with a resend action.',
    customization:
      'One input with `inputMode="numeric"` and `autocomplete="one-time-code"` is what lets iOS and Android surface the SMS/email code from the keyboard, and it stays a real labelled field - the wide tracking just makes the digits read like separate cells. `length` sets the digit count and `onResend` fires a new code.',
    seoTitle: 'OTP Code Verification Field - Free React Component',
    seoDescription:
      'An accessible one-time-code entry field with numeric input mode and resend, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['otp input', 'one-time code', 'verification code field', 'reset code entry'],
  },
  'reset-password-card': {
    title: 'Reset Password Card',
    description:
      'A branded card with a lock badge, heading and a single new-password field.',
    customization:
      'The lock glyph is `aria-hidden` because it only decorates the heading, which already names the screen. The card is `w-full max-w-sm` so it fills a phone and settles at a readable width on desktop; swap the badge colour to match your brand.',
    seoTitle: 'Reset Password Card - Free Tailwind CSS Component',
    seoDescription:
      'A self-contained reset-password card with a lock icon and new-password field, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['reset password card', 'password reset ui', 'lock icon card', 'auth card'],
  },
  'reset-password-link-sent': {
    title: 'Reset Link Sent',
    description:
      'The confirmation screen after a reset request, with a resend button and back link.',
    customization:
      'A pure state view - no form field, the action is done. The mail glyph is `aria-hidden` and the heading is the `<h1>`, so a screen reader announces the outcome, not the decoration. Pass the recipient `email` and an `onResend` handler.',
    seoTitle: 'Reset Link Sent Confirmation - Free Tailwind CSS Component',
    seoDescription:
      'A check-your-email confirmation screen with resend and back-to-sign-in, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['check your email', 'reset link sent', 'confirmation screen', 'email sent state'],
  },
  'reset-password-success': {
    title: 'Password Reset Success',
    description:
      'The all-done screen with a green check and a link onward to sign in.',
    customization:
      'The green check is `aria-hidden` - colour and glyph are not the message, the heading is. The call to action is an `<a>` because it navigates onward to sign in, not a button that submits a form.',
    seoTitle: 'Password Reset Success Screen - Free Tailwind CSS Component',
    seoDescription:
      'A password-updated success screen with a check icon and continue link, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['password updated', 'reset success', 'success screen', 'confirmation state'],
  },
  'reset-password-with-strength': {
    title: 'Reset With Strength Meter',
    description:
      'A new-password field with a live four-segment strength meter announced to screen readers.',
    customization:
      'The meter is decorative (`aria-hidden`); the same score is stated in words in an `aria-live` region, so assistive tech hears "Password strength: Strong" rather than four coloured bars. Tune the `scorePassword` heuristic to match your own policy.',
    seoTitle: 'Password Strength Meter Form - Free React Component',
    seoDescription:
      'A reset form with a live, accessible password strength meter, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['password strength meter', 'strength indicator', 'new password form', 'password validation'],
  },
  'reset-password-split': {
    title: 'Split Reset Password',
    description:
      'A two-column layout: the reset form on one side, a decorative gradient panel on the other.',
    customization:
      'The gradient panel is `hidden md:flex` because it is atmosphere, not content - it must not push the form below the fold on a phone. The form column always fills the width and the confirm field blocks submit on mismatch.',
    seoTitle: 'Split Reset Password Layout - Free Tailwind CSS Component',
    seoDescription:
      'A two-column reset-password layout with a form and gradient panel that stacks on mobile, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['split reset password', 'two column auth', 'reset password layout', 'gradient panel form'],
  },
  'reset-password-expired-link': {
    title: 'Expired Link Error',
    description:
      'The error state for a stale or used reset link, with a one-tap request for a fresh one.',
    customization:
      'The amber warning glyph is `aria-hidden` and the heading carries the meaning. The primary action is "Request a new link" so the flow never dead-ends; wire it through `onResend`.',
    seoTitle: 'Expired Reset Link Screen - Free Tailwind CSS Component',
    seoDescription:
      'An expired-reset-link error screen with a resend action, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['expired link', 'reset link error', 'link expired screen', 'request new link'],
  },
  'reset-password-minimal': {
    title: 'Minimal Reset Form',
    description:
      'A chrome-free reset form - just a label, an email field and a submit for embedding in a framed page.',
    customization:
      'No card or border, for dropping into a page that already frames it. Stripping the chrome does not strip the semantics: it stays a real `<label>` with `type="email"` and `autocomplete="email"`.',
    seoTitle: 'Minimal Reset Password Form - Free Tailwind CSS Component',
    seoDescription:
      'A borderless, minimal reset-password form with an accessible email field, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['minimal reset form', 'bare password form', 'embedded reset form', 'simple auth form'],
  },
};
