import type { ComponentContentMap } from '../types';

/** English prose for the buttons category. Keys are component slugs. */
export const buttonsContent: ComponentContentMap = {
  'gradient-glow-button': {
    title: 'Gradient Glow Button',
    description: 'A call-to-action button with a gradient fill and a soft coloured glow on hover.',
    customization:
      'Swap the two `from-`/`to-` colours for your brand and update the shadow to match - the glow reads as a blur of the same hue. Adjust the `-translate-y-px` lift for a stronger or subtler hover.',
    seoTitle: 'Gradient Glow Button - Free Tailwind CSS Component',
    seoDescription:
      'A copy-paste gradient button with a hover glow, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['tailwind button', 'gradient button', 'glow button', 'cta button', 'react button'],
  },
  'loading-button': {
    title: 'Loading Button',
    description: 'A button that shows an inline spinner and blocks input while work is in flight.',
    customization:
      'The spinner is a bordered circle with one contrasting edge - change `border-t-white` to recolour it. Drive `loading` from your submit handler; the button disables itself so double-submits are impossible.',
    seoTitle: 'Loading Button with Spinner - Free React Component',
    seoDescription:
      'An accessible loading button with an inline spinner and aria-busy, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['loading button', 'spinner button', 'async button', 'react loading state'],
  },
  'outline-button': {
    title: 'Outline Button',
    description:
      'A bordered button with a transparent fill that floods with colour on hover.',
    customization:
      'The whole component is one hue used three ways - `border-blue-600`, `text-blue-700`, and the `hover:bg-blue-600` fill. Change all three together or the hover state will not match the border it grew out of. The dark variants are a shade lighter on purpose: a transparent button inherits the page background, so the resting label has to be re-tuned to hold 4.5:1 where a filled button would not.',
    seoTitle: 'Outline Button - Free Tailwind CSS Component',
    seoDescription:
      'A bordered outline button that fills on hover, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['outline button', 'bordered button', 'secondary button', 'tailwind outline button'],
  },
  'ghost-button': {
    title: 'Ghost Button',
    description:
      'A borderless button that stays invisible until hover - for the quiet half of a button pair.',
    customization:
      'Pair it with a filled button as the Cancel to its Save; the point is that it recedes. The transparent border at rest is not decoration - it reserves the 1px so the button does not jump when it sits beside a bordered sibling. Deepen `hover:bg-gray-100` to `gray-200` if your surface is already grey.',
    seoTitle: 'Ghost Button - Free Tailwind CSS Component',
    seoDescription:
      'A subtle borderless ghost button with a hover surface, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['ghost button', 'text button', 'subtle button', 'tertiary button'],
  },
  'icon-button': {
    title: 'Icon Button',
    description:
      'A square, icon-only button whose accessible name is enforced by its own type signature.',
    customization:
      'An icon-only button has no text node, so without `aria-label` it announces as nothing but "button". The TypeScript variant omits `aria-label` from the inherited attributes and re-declares it as a required `label` prop - the compiler, not a code review, is what stops an unnamed one shipping. Keep the 40px box: it clears the minimum target size even when the glyph inside is 20px.',
    seoTitle: 'Accessible Icon Button - Free React Component',
    seoDescription:
      'A square icon-only button with an enforced aria-label, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['icon button', 'aria-label button', 'accessible icon button', 'square button'],
  },
  'pill-button': {
    title: 'Pill Button',
    description: 'A fully rounded button with a leading count badge for unread or pending totals.',
    customization:
      'The `rounded-full` radius is deliberately larger than any height the button can reach, which is what keeps the ends true semicircles at every size instead of a radius you have to re-guess. The count is a real text node, not an `aria-hidden` decoration, so the accessible name reads "12 Notifications" - which is the whole reason a badge is there. `tabular-nums` stops the width jittering as the number ticks.',
    seoTitle: 'Pill Button with Count Badge - Free Tailwind Component',
    seoDescription:
      'A rounded pill button with a leading count badge, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['pill button', 'rounded button', 'badge button', 'notification count button'],
  },
  'split-button': {
    title: 'Split Button',
    description:
      'A default action attached to a dropdown toggle, with a real keyboard-navigable menu.',
    customization:
      'Two buttons, one visual unit: the default action stays one tab stop and one Enter away, and the toggle carries its own `aria-label` because "Save" and "more save options" are different actions. The menu is not a hover popup - arrow keys move between items, Escape closes and returns focus to the toggle, and a click outside dismisses it. Replace `MENU_ITEMS` with your own actions and pass a handler to `onSelect`.',
    seoTitle: 'Split Button with Dropdown Menu - Free React Component',
    seoDescription:
      'An accessible split button with an attached keyboard-navigable dropdown menu, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['split button', 'dropdown button', 'button with menu', 'accessible menu button'],
  },
  'social-login-button': {
    title: 'Social Login Button',
    description:
      'A full-width OAuth provider button with a brand icon slot - "Continue with GitHub".',
    customization:
      'Full width because it stacks under the email field in a sign-in card, and a provider row narrower than the form reads as an afterthought. Swap the `icon` prop for any provider mark; draw it with `fill="currentColor"` so it follows the label into dark mode instead of staying a black glyph on a black button. The glyph is `aria-hidden` - the label already names the provider.',
    seoTitle: 'Social Login Button - Free OAuth Button Component',
    seoDescription:
      'A full-width social login button with a brand icon slot for GitHub, Google or Microsoft, in HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['social login button', 'oauth button', 'github login button', 'sign in with button'],
  },
  'copy-button': {
    title: 'Copy Button',
    description:
      'Copies text to the clipboard and confirms with a check and a "Copied" label for two seconds.',
    customization:
      '`navigator.clipboard` needs a secure context and can be blocked by permissions policy, so the `catch` falls back to the deprecated textarea-and-`execCommand` trick - a copy button that silently does nothing is worse than an ugly one. `min-w-28` fixes the width so the box does not jump when "Copy" becomes "Copied", and `aria-live="polite"` makes the swap an announcement rather than a picture change nobody hears.',
    seoTitle: 'Copy to Clipboard Button - Free React Component',
    seoDescription:
      'A copy-to-clipboard button with a check confirmation, aria-live feedback and a fallback for insecure contexts. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['copy button', 'copy to clipboard', 'clipboard button', 'react copy button'],
  },
  'destructive-button': {
    title: 'Destructive Button',
    description:
      'A red button that arms on the first click and only deletes on the second.',
    customization:
      'Red is not the safeguard - it is invisible to a red-blind user and means nothing to a screen reader. The confirm step is the protection, and `aria-live` is what carries it. The type omits `onClick` and exposes `onConfirm` instead, so wiring the deletion to the arming click is not expressible. It disarms on blur and after four seconds, so an armed button left alone cannot ambush the next click that lands on it.',
    seoTitle: 'Destructive Button with Confirm Step - Free React Component',
    seoDescription:
      'A red destructive button with a two-click confirm step and aria-live feedback, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['destructive button', 'delete button', 'danger button', 'confirm button'],
  },
};
