import type { ComponentContentMap } from '../types';

/**
 * English prose for the checkout category. Keys are component slugs.
 *
 * Every entry is a UI-only template: fields render empty with placeholders and
 * the right autocomplete tokens, card inputs are plain `<input>`s, and the
 * default `onSubmit` is a no-op that only cancels navigation. Nothing here
 * processes a payment.
 */
export const checkoutContent: ComponentContentMap = {
  'checkout-single-page': {
    title: 'Single-Page Checkout',
    description:
      'Contact, shipping and payment in one scrolling form with a single place-order button.',
    customization:
      'Each section is a `<fieldset>` with a `<legend>`, so the visual heading and the group a screen reader announces are the same element. Card fields carry `cc-*` autocomplete and `inputMode="numeric"` but process nothing - `onSubmit` defaults to a `preventDefault()` no-op you replace with your own handler.',
    seoTitle: 'Single-Page Checkout Form - Free Tailwind CSS Component',
    seoDescription:
      'A one-page checkout template with contact, shipping and payment fieldsets, in Tailwind, React and TypeScript. Accessible, responsive and MIT licensed.',
    keywords: ['checkout form', 'single page checkout', 'one page checkout', 'tailwind checkout'],
  },
  'checkout-two-column': {
    title: 'Two-Column Checkout',
    description:
      'A checkout form beside a sticky order summary that stacks below the form on mobile.',
    customization:
      'The grid is `lg:grid-cols-[1fr_20rem]`; below `lg` it collapses to one column with the summary under the form, so a phone fills fields first and confirms the total last. Every amount is `text-right tabular-nums` so the price column aligns on the decimal. Drive the totals with `items`, `shipping` and `currency`.',
    seoTitle: 'Two-Column Checkout Layout - Free Tailwind CSS Component',
    seoDescription:
      'A two-column checkout with form and order summary that stacks on mobile, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['two column checkout', 'checkout layout', 'order summary sidebar', 'checkout page'],
  },
  'checkout-multi-step': {
    title: 'Multi-Step Checkout',
    description:
      'A four-step wizard - contact, shipping, payment, review - with a progress bar and step tracker.',
    customization:
      'The current step is state; the fill is a `role="progressbar"` with live `aria-valuenow`/`max` so assistive tech reads "2 of 4" instead of four ambiguous list items, and the active step carries `aria-current="step"`. Pass your own `steps` labels and an `onComplete` for the final step.',
    seoTitle: 'Multi-Step Checkout Wizard - Free React Component',
    seoDescription:
      'A multi-step checkout wizard with an accessible progress bar and step tracker, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['multi step checkout', 'checkout wizard', 'checkout stepper', 'progress checkout'],
  },
  'checkout-order-summary': {
    title: 'Order Summary Card',
    description:
      'A read-only summary card listing line items, subtotal, shipping, tax and a bold total.',
    customization:
      'Line items are a `<ul>`; the totals are a `<dl>` so each amount is the `<dd>` for its `<dt>` label. Amounts are `text-right tabular-nums` so the money column stays flush-right and decimal-aligned. Feed it `items`, plus optional `shipping`, `tax` and `currency` - the subtotal and total are derived.',
    seoTitle: 'Order Summary Card - Free Tailwind CSS Component',
    seoDescription:
      'A checkout order-summary card with line items and totals, in Tailwind, React and TypeScript. Accessible, responsive and MIT licensed.',
    keywords: ['order summary', 'checkout totals', 'cart summary', 'order summary card'],
  },
  'checkout-payment-form': {
    title: 'Payment Card Form',
    description:
      'A card-details form - number, name, expiry, CVC - that is UI only and charges nothing.',
    customization:
      'This is plumbing, not a processor: the value is the `cc-number` / `cc-name` / `cc-exp` / `cc-csc` autocomplete tokens plus `inputMode="numeric"` so browsers and password managers fill the right box. The brand marks are decorative stand-ins, not real logos, and `onSubmit` defaults to a no-op.',
    seoTitle: 'Payment Card Form UI - Free Tailwind CSS Component',
    seoDescription:
      'A UI-only credit-card form with correct autocomplete tokens, in Tailwind, React and TypeScript. Processes no payments. MIT licensed.',
    keywords: ['payment form', 'credit card form', 'card input ui', 'checkout payment'],
  },
  'checkout-shipping-address': {
    title: 'Shipping Address Form',
    description:
      'An address form wired with the exact autocomplete tokens browser autofill expects.',
    customization:
      'Each field uses the token address autofill wants - `name`, `street-address`, `address-level2` (city), `address-level1` (state), `postal-code`, `country-name` - so a returning customer fills it in one tap. City/state and postal/country share a row from `sm` up and stack below it.',
    seoTitle: 'Shipping Address Form - Free Tailwind CSS Component',
    seoDescription:
      'A checkout shipping-address form with correct autofill tokens, in Tailwind, React and TypeScript. Accessible, responsive and MIT licensed.',
    keywords: ['shipping address form', 'address form', 'checkout address', 'autofill address'],
  },
  'checkout-express-buttons': {
    title: 'Express Wallet Buttons',
    description:
      'Apple Pay, Google Pay and PayPal-style express buttons over a labelled "or" divider.',
    customization:
      'The brand marks are plain inline SVG stand-ins, NOT the trademarked logos - drop the real ones in from each provider\'s SDK. Every button is a real `<button>` with an `aria-label`, since the wordmark alone is not a reliable accessible name. Wire `onSelect`, which fires `apple`, `google` or `paypal`.',
    seoTitle: 'Express Checkout Buttons - Free Tailwind CSS Component',
    seoDescription:
      'Apple Pay, Google Pay and PayPal-style express checkout buttons with a divider, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['express checkout', 'wallet buttons', 'apple pay button', 'paypal button'],
  },
  'checkout-review-confirm': {
    title: 'Review & Confirm',
    description:
      'A review step summarizing contact, shipping and a masked card, gated by a terms checkbox.',
    customization:
      'Three summary rows each link back to their section with an Edit anchor; the masked card is display text (dots plus `cardLast4`) - this component never sees a full number. The confirm button sits behind a required terms checkbox. Pass `email`, `address`, `cardLast4` and `total`.',
    seoTitle: 'Review & Confirm Checkout Step - Free Tailwind CSS Component',
    seoDescription:
      'A checkout review-and-confirm step with editable summary rows and a terms gate, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['review order', 'confirm checkout', 'order review', 'checkout confirmation'],
  },
  'checkout-guest-form': {
    title: 'Guest Checkout Form',
    description:
      'A single email field with a continue-as-guest button and a route to sign in.',
    customization:
      'Guest checkout needs only the email, so the field is `type="email"` with `autocomplete="email"` and the primary action is "Continue as guest" - the sign-in route sits below an "or" divider rather than in front of it. Removing the account wall is the point; keep the guest button prominent.',
    seoTitle: 'Guest Checkout Form - Free Tailwind CSS Component',
    seoDescription:
      'A guest checkout form with email capture and a sign-in fallback, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['guest checkout', 'checkout email', 'guest form', 'continue as guest'],
  },
  'checkout-gift-options': {
    title: 'Gift Options',
    description:
      'A "this is a gift" toggle that reveals gift wrap and a message field with a CSS-only peer.',
    customization:
      'Ticking "This is a gift" reveals the details with a `peer-has-[:checked]:block` toggle - no JavaScript, and the panel is truly absent from layout and tab order until checked. The message `<textarea>` has a `maxLength` so the note cannot overflow the packing slip. Set the wrap price with `wrapPrice`.',
    seoTitle: 'Gift Options Checkout - Free Tailwind CSS Component',
    seoDescription:
      'A checkout gift-options block with a CSS-only reveal, gift wrap and a message field, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['gift options', 'gift wrap checkout', 'gift message', 'checkout gift'],
  },
};
