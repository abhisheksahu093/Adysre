import type { ComponentContentMap } from '../types';

/** English prose for the sign-up category. Keys are component slugs. */
export const signUpContent: ComponentContentMap = {
  'signup-centered-card': {
    title: 'Centered Sign-up Card',
    description:
      'A centred registration card with name, email and password fields and a full-width submit.',
    customization:
      'Every field has a real `<label htmlFor>` rather than a placeholder standing in for one, and `autocomplete="new-password"` tells the browser to offer a generated password instead of autofilling an existing one. It is UI-only: `onSubmit` defaults to a no-op, so nothing is posted until you wire a handler.',
    seoTitle: 'Centered Sign-up Card - Free Tailwind CSS Component',
    seoDescription:
      'A centred account-registration card with accessible labelled fields, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['sign up form', 'registration card', 'create account', 'tailwind signup'],
  },
  'signup-split-benefits': {
    title: 'Split Benefits Sign-up',
    description:
      'A registration form beside a checkmarked benefits panel that stacks below it on mobile.',
    customization:
      'Feed the panel through the `benefits` prop; each row pairs a decorative `aria-hidden` check with its label. The form leads the DOM and the panel follows, so the mobile stack puts the fields first - what the visitor came for - with the benefits reflowing underneath below `md`.',
    seoTitle: 'Split Benefits Sign-up Form - Free Tailwind CSS Component',
    seoDescription:
      'A two-column sign-up with a benefits list that stacks on mobile, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['split signup', 'benefits panel', 'registration form', 'two column signup'],
  },
  'signup-social-first': {
    title: 'Social-first Sign-up',
    description:
      'OAuth buttons above an "or" divider and an email fallback, all inside one card.',
    customization:
      'The Google and GitHub buttons are `type="button"` so a click never fires the email form by accident, and each calls `onSocial` with its provider id. The divider is a real text node between two rules, so the "or" survives translation and forced-colours modes. Both handlers are no-ops until wired.',
    seoTitle: 'Social Sign-up with OAuth Buttons - Free React Component',
    seoDescription:
      'A social-first registration card with Google and GitHub buttons and an email fallback, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['social signup', 'oauth buttons', 'google github signup', 'sign up card'],
  },
  'signup-multi-step': {
    title: 'Multi-step Sign-up',
    description:
      'The first step of a wizard: a labelled progress bar over step 1 of 3 with a Continue button.',
    customization:
      'Drive the header with `currentStep` and `totalSteps`; the bar is a real `role="progressbar"` with `aria-valuenow/min/max`, so it announces "step 1 of 3" rather than being a silent coloured div. Continue is `type="submit"` - in a real wizard it validates the step before advancing - and `onSubmit` is a no-op by default.',
    seoTitle: 'Multi-step Sign-up Wizard - Free Tailwind CSS Component',
    seoDescription:
      'A multi-step registration shell with an accessible progress bar and step 1 fields, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['multi step signup', 'signup wizard', 'progress stepper', 'onboarding form'],
  },
  'signup-password-strength': {
    title: 'Sign-up with Password Strength',
    description:
      'A registration form whose password field drives a live four-segment strength meter.',
    customization:
      'The score updates as you type and is mirrored to an `aria-live="polite"` status line, so a screen-reader user hears the rating change instead of only seeing a bar move. The scoring checks length, mixed case, a digit and a symbol; tune the `scorePassword` heuristic to your policy. UI-only - `onSubmit` is a no-op.',
    seoTitle: 'Password Strength Sign-up Form - Free React Component',
    seoDescription:
      'A registration form with a live, accessible password-strength meter and an aria-live status, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['password strength meter', 'signup form', 'password validation', 'aria-live'],
  },
  'signup-with-terms-consent': {
    title: 'Sign-up with Terms Consent',
    description:
      'A registration card with a required terms-and-privacy consent checkbox linked to its label.',
    customization:
      'The checkbox is `required` and tied to its label via `for`/`id`, so the whole sentence - including the two policy links - is the clickable target. Point `termsHref` and `privacyHref` at your pages. It is display-only: nothing is submitted until you wire `onSubmit`.',
    seoTitle: 'Sign-up with Terms Consent Checkbox - Free Tailwind CSS Component',
    seoDescription:
      'A registration card with a required, accessible terms-and-privacy consent checkbox, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['terms consent signup', 'privacy checkbox', 'registration form', 'gdpr consent'],
  },
  'signup-minimal-email-only': {
    title: 'Minimal Email-only Sign-up',
    description:
      'A single email field and button for passwordless or waitlist sign-up, stacking on mobile.',
    customization:
      'One field, no password - a magic-link or waitlist start. The label is `sr-only` but present, and the row goes vertical below `sm` because a 90px email box beside a button is not a form. Swap the copy for a product-tour or newsletter framing; `onSubmit` stays a no-op until wired.',
    seoTitle: 'Minimal Email Sign-up Form - Free Tailwind CSS Component',
    seoDescription:
      'A one-field email registration form for magic-link or waitlist flows, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['email only signup', 'magic link signup', 'waitlist form', 'minimal signup'],
  },
  'signup-gradient-side': {
    title: 'Gradient Side Sign-up',
    description:
      'A registration form beside a gradient testimonial panel that stacks below it on mobile.',
    customization:
      'The gradient panel paints its own dark surface, so its white text needs no `dark:` variants and looks identical on a light or dark page. It carries a real heading and pull-quote - set via `panelHeading` and `panelText` - rather than being decoration, and it reflows below the form on mobile.',
    seoTitle: 'Gradient Side Sign-up Form - Free Tailwind CSS Component',
    seoDescription:
      'A two-column sign-up with a gradient testimonial panel that stacks on mobile, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['gradient signup', 'split signup', 'testimonial panel', 'registration form'],
  },
  'signup-invite-code': {
    title: 'Invite Code Sign-up',
    description:
      'A private-beta form gating registration behind a monospace invite-code field.',
    customization:
      'The code field uses `autocomplete="off"` and `spellcheck="false"` so the browser does not dictionary-correct or offer to autofill a random string, and a monospace, wide-tracked font keeps O/0 and I/l distinguishable. UI-only - `onSubmit` is a no-op until you validate the code server-side.',
    seoTitle: 'Invite Code Sign-up Form - Free Tailwind CSS Component',
    seoDescription:
      'A private-beta registration form gated by a monospace invite-code field, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['invite code signup', 'private beta form', 'access code', 'registration form'],
  },
  'signup-boxed-logo': {
    title: 'Boxed Logo Sign-up',
    description:
      'A registration card topped by a pure-CSS boxed logo mark and brand name.',
    customization:
      'The logo is a CSS gradient tile showing the brand initial - no `<img>` to preload or let rot - and is `aria-hidden` so a screen reader hears the brand name once, as text, rather than "image" plus the name. Set `brand` and the initial derives itself. Display-only; `onSubmit` defaults to a no-op.',
    seoTitle: 'Boxed Logo Sign-up Card - Free Tailwind CSS Component',
    seoDescription:
      'A branded registration card with a pure-CSS boxed logo mark, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['branded signup', 'logo signup card', 'registration form', 'create account'],
  },
};
