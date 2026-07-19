import type { ComponentContentMap } from '../types';

/** English prose for the sign-in category. Keys are component slugs. */
export const signInContent: ComponentContentMap = {
  'signin-centered-card': {
    title: 'Centered Card Sign-in',
    description:
      'A centred login card with email, a toggleable password field and a submit button.',
    customization:
      'The card is `w-full max-w-sm`, so it fills a phone and settles at a readable width on desktop. Swap `onSubmit` for your auth call - it is a no-op by default, since this is a display component and never posts anywhere.',
    seoTitle: 'Centered Card Sign-in Form - Free Tailwind Component',
    seoDescription:
      'A centred login card with an accessible email/password form and password show/hide toggle, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['sign-in card', 'login form', 'centered login', 'tailwind auth'],
  },
  'signin-split-image': {
    title: 'Split Panel Sign-in',
    description:
      'A two-column sign-in with the form beside a decorative gradient panel that hides on mobile.',
    customization:
      'The panel is `hidden md:block` because it is atmosphere, not content - it should not push the form below the fold on a phone. The form column always fills the width; the panel uses a CSS gradient so there is no external image to go stale.',
    seoTitle: 'Split Screen Sign-in Form - Free Tailwind Component',
    seoDescription:
      'A two-column login layout with a form and a gradient side panel that stacks on mobile, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['split sign-in', 'two column login', 'split screen auth', 'login layout'],
  },
  'signin-social-buttons': {
    title: 'Social Sign-in',
    description:
      'Google and GitHub buttons above a labelled "or" divider and a standard email/password form.',
    customization:
      'The provider buttons call `onSocial(provider)` and the form calls `onSubmit` - both no-ops by default, so wire them to your own OAuth. The divider word is real text, not a background image, so it survives translation.',
    seoTitle: 'Social Login Buttons Sign-in - Free Tailwind Component',
    seoDescription:
      'A login form with Google and GitHub social buttons, a divider and an email/password fallback, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['social login', 'oauth buttons', 'google github login', 'sign-in divider'],
  },
  'signin-magic-link': {
    title: 'Magic Link Sign-in',
    description:
      'A passwordless sign-in that takes only an email and shows a "check your inbox" confirmation.',
    customization:
      'There is no password field to secure - the email is the only credential surface. After submit the React and TypeScript variants swap in a confirmation state; nothing is actually emailed, so replace `onSubmit` with your real magic-link request.',
    seoTitle: 'Magic Link Sign-in Form - Free React Component',
    seoDescription:
      'A passwordless email-only sign-in with a confirmation state, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['magic link', 'passwordless login', 'email sign-in', 'otp link'],
  },
  'signin-with-2fa-code': {
    title: 'Two-Factor Code Sign-in',
    description:
      'A one-time-code step with a single numeric field styled to look segmented, plus a resend action.',
    customization:
      'It uses one input, not six boxes: `inputMode="numeric"` gets the digit keypad and `autoComplete="one-time-code"` lets the phone offer the SMS code from the keyboard bar. `length` controls the digit cap; `onSubmit(code)` and `onResend` are no-op callbacks.',
    seoTitle: 'Two-Factor 2FA Code Sign-in - Free React Component',
    seoDescription:
      'A 2FA one-time-code entry step with a numeric input and resend action, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['2fa code', 'one-time code', 'otp input', 'two-factor login'],
  },
  'signin-minimal': {
    title: 'Minimal Sign-in',
    description:
      'A bare email/password form with no card chrome, for when it already sits inside a container.',
    customization:
      'No card, border or shadow - just the form on the page background. Minimal is a visual choice, not a semantic discount: both fields keep real `<label>` elements and the right autocomplete tokens.',
    seoTitle: 'Minimal Sign-in Form - Free Tailwind Component',
    seoDescription:
      'A bare, chrome-free email and password login form, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['minimal login', 'bare sign-in', 'simple login form', 'plain auth form'],
  },
  'signin-gradient-side': {
    title: 'Gradient Side Sign-in',
    description:
      'A branded gradient panel beside the form, carrying the logo and tagline through props.',
    customization:
      'Set `brand` and `tagline` for the coloured panel; text on it is solid white and `blue-100` for reliable contrast on the gradient. Below `md` the columns stack so nothing overflows a phone.',
    seoTitle: 'Gradient Side Panel Sign-in - Free Tailwind Component',
    seoDescription:
      'A login form with a branded gradient side panel that stacks on mobile, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['gradient sign-in', 'branded login', 'side panel auth', 'gradient login'],
  },
  'signin-boxed-logo': {
    title: 'Boxed Logo Sign-in',
    description:
      'A gradient logo badge centred above the login card, deriving its initial from the brand prop.',
    customization:
      'The badge is a CSS gradient square with the brand initial - no external asset - and is `aria-hidden` because the brand name is written just beneath it, so a screen reader is not made to read the brand twice.',
    seoTitle: 'Boxed Logo Sign-in Form - Free Tailwind Component',
    seoDescription:
      'A login card with a boxed brand-logo badge above it, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['logo sign-in', 'branded login card', 'logo above form', 'auth card'],
  },
  'signin-inline-error': {
    title: 'Inline Error Sign-in',
    description:
      'A login card in its error state, with a role="alert" banner and an aria-invalid password field.',
    customization:
      'The banner is `role="alert"` so it is announced when it appears, and the password field carries `aria-invalid` plus `aria-describedby` pointing at the message - colour is a redundant cue, never the only one. Pass `error` to toggle the state; omit it for the clean form.',
    seoTitle: 'Sign-in Form with Inline Error - Free React Component',
    seoDescription:
      'A login form error state with an accessible alert banner and aria-invalid field, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['login error', 'form validation', 'aria-invalid', 'inline error sign-in'],
  },
  'signin-remember-forgot': {
    title: 'Remember & Forgot Sign-in',
    description:
      'A login card with a real "remember me" checkbox and a "forgot password?" link that wraps on mobile.',
    customization:
      '"Remember me" is a genuine checkbox with a clickable `<label>`, and "Forgot password?" is an `<a>` that navigates, not a button styled as a link. The row wraps at 320px instead of forcing a horizontal scroll; `onSubmit` receives the `remember` boolean.',
    seoTitle: 'Sign-in with Remember Me & Forgot Password - Free Component',
    seoDescription:
      'A login form with a remember-me checkbox and forgot-password link that wraps on mobile, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['remember me', 'forgot password', 'login checkbox', 'sign-in options'],
  },
};
