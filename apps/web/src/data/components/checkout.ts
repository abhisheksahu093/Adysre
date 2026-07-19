import type { ComponentEntry } from './types';

/**
 * Checkout category - UI-only checkout templates.
 *
 * IMPORTANT: every entry here is a *template*. The fields render empty, with
 * placeholders and the right autocomplete tokens, and nothing is submitted
 * anywhere - the default `onSubmit` calls `preventDefault()` and stops. There
 * are no real card numbers, no payment processing, no network calls. Card and
 * CVC inputs are plain `<input>`s carrying `inputMode` and `autocomplete`
 * (`cc-number` / `cc-exp` / `cc-csc`) so a password manager or the browser can
 * fill them - that is the whole of their "payment" behaviour.
 *
 * The one constraint shared across the batch: money is data on the right edge.
 * Amounts are `text-right tabular-nums` so a column of prices lines up on the
 * decimal instead of ragged-right, and every summary stacks its form above the
 * totals below `lg` rather than crushing two columns into a 320px phone.
 */
export const checkoutComponents: ComponentEntry[] = [
  {
    slug: 'checkout-single-page',
    category: 'checkout',
    tags: ['checkout', 'form', 'single-page', 'payment', 'shipping'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1840, copies: 402, downloads: 121 },
    props: [
      { name: 'submitLabel', type: 'string', default: "'Place order'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(e: FormEvent) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  One form, three fieldsets. Each fieldset owns a <legend> so a screen reader
  announces "Contact", "Shipping", "Payment" as it enters the group - the visual
  headings and the accessible structure are the same element, not two that can
  drift. Card fields are plain inputs with cc-* autocomplete; nothing here
  processes a payment.
-->
<form class="mx-auto w-full max-w-lg space-y-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950" action="#" method="post" novalidate>
  <fieldset class="space-y-4 border-0 p-0">
    <legend class="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact</legend>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="cs-email">Email</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="cs-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required />
    </div>
  </fieldset>

  <fieldset class="space-y-4 border-0 p-0">
    <legend class="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping address</legend>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="cs-name">Full name</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="cs-name" name="name" type="text" autocomplete="name" placeholder="Ada Lovelace" required />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="cs-street">Address</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="cs-street" name="street-address" type="text" autocomplete="street-address" placeholder="123 Market St" required />
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="cs-city">City</label>
        <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="cs-city" name="city" type="text" autocomplete="address-level2" placeholder="San Francisco" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="cs-zip">Postal code</label>
        <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="cs-zip" name="postal-code" type="text" autocomplete="postal-code" inputmode="numeric" placeholder="94103" required />
      </div>
    </div>
  </fieldset>

  <fieldset class="space-y-4 border-0 p-0">
    <legend class="text-sm font-semibold text-gray-900 dark:text-gray-100">Payment</legend>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="cs-card">Card number</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="cs-card" name="cc-number" type="text" autocomplete="cc-number" inputmode="numeric" placeholder="1234 1234 1234 1234" required />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="cs-exp">Expiry</label>
        <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="cs-exp" name="cc-exp" type="text" autocomplete="cc-exp" inputmode="numeric" placeholder="MM / YY" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="cs-csc">CVC</label>
        <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="cs-csc" name="cc-csc" type="text" autocomplete="cc-csc" inputmode="numeric" placeholder="123" required />
      </div>
    </div>
  </fieldset>

  <button class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="submit">Place order</button>
</form>`,
      react: `const LABEL = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
const INPUT =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

export function CheckoutSinglePage({
  submitLabel = 'Place order',
  // Default is a no-op that only cancels navigation - this template submits
  // nowhere. Wire your own handler to actually collect the order.
  onSubmit = (e) => e.preventDefault(),
  className = '',
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={\`mx-auto w-full max-w-lg space-y-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 \${className}\`}
    >
      <fieldset className="space-y-4 border-0 p-0">
        <legend className="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact</legend>
        <div>
          <label className={LABEL} htmlFor="cs-email">Email</label>
          <input className={INPUT} id="cs-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required />
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-0 p-0">
        <legend className="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping address</legend>
        <div>
          <label className={LABEL} htmlFor="cs-name">Full name</label>
          <input className={INPUT} id="cs-name" name="name" type="text" autoComplete="name" placeholder="Ada Lovelace" required />
        </div>
        <div>
          <label className={LABEL} htmlFor="cs-street">Address</label>
          <input className={INPUT} id="cs-street" name="street-address" type="text" autoComplete="street-address" placeholder="123 Market St" required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="cs-city">City</label>
            <input className={INPUT} id="cs-city" name="city" type="text" autoComplete="address-level2" placeholder="San Francisco" required />
          </div>
          <div>
            <label className={LABEL} htmlFor="cs-zip">Postal code</label>
            <input className={INPUT} id="cs-zip" name="postal-code" type="text" autoComplete="postal-code" inputMode="numeric" placeholder="94103" required />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-0 p-0">
        <legend className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payment</legend>
        <div>
          <label className={LABEL} htmlFor="cs-card">Card number</label>
          <input className={INPUT} id="cs-card" name="cc-number" type="text" autoComplete="cc-number" inputMode="numeric" placeholder="1234 1234 1234 1234" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL} htmlFor="cs-exp">Expiry</label>
            <input className={INPUT} id="cs-exp" name="cc-exp" type="text" autoComplete="cc-exp" inputMode="numeric" placeholder="MM / YY" required />
          </div>
          <div>
            <label className={LABEL} htmlFor="cs-csc">CVC</label>
            <input className={INPUT} id="cs-csc" name="cc-csc" type="text" autoComplete="cc-csc" inputMode="numeric" placeholder="123" required />
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>
    </form>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

const LABEL = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
const INPUT =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

export interface CheckoutSinglePageProps {
  submitLabel?: string;
  /** Defaults to a no-op that cancels navigation - this template submits nowhere. */
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function CheckoutSinglePage({
  submitLabel = 'Place order',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}: CheckoutSinglePageProps): JSX.Element {
  return (
    <form
      onSubmit={onSubmit}
      className={\`mx-auto w-full max-w-lg space-y-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 \${className}\`}
    >
      <fieldset className="space-y-4 border-0 p-0">
        <legend className="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact</legend>
        <div>
          <label className={LABEL} htmlFor="cs-email">Email</label>
          <input className={INPUT} id="cs-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required />
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-0 p-0">
        <legend className="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping address</legend>
        <div>
          <label className={LABEL} htmlFor="cs-name">Full name</label>
          <input className={INPUT} id="cs-name" name="name" type="text" autoComplete="name" placeholder="Ada Lovelace" required />
        </div>
        <div>
          <label className={LABEL} htmlFor="cs-street">Address</label>
          <input className={INPUT} id="cs-street" name="street-address" type="text" autoComplete="street-address" placeholder="123 Market St" required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="cs-city">City</label>
            <input className={INPUT} id="cs-city" name="city" type="text" autoComplete="address-level2" placeholder="San Francisco" required />
          </div>
          <div>
            <label className={LABEL} htmlFor="cs-zip">Postal code</label>
            <input className={INPUT} id="cs-zip" name="postal-code" type="text" autoComplete="postal-code" inputMode="numeric" placeholder="94103" required />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-0 p-0">
        <legend className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payment</legend>
        <div>
          <label className={LABEL} htmlFor="cs-card">Card number</label>
          <input className={INPUT} id="cs-card" name="cc-number" type="text" autoComplete="cc-number" inputMode="numeric" placeholder="1234 1234 1234 1234" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL} htmlFor="cs-exp">Expiry</label>
            <input className={INPUT} id="cs-exp" name="cc-exp" type="text" autoComplete="cc-exp" inputMode="numeric" placeholder="MM / YY" required />
          </div>
          <div>
            <label className={LABEL} htmlFor="cs-csc">CVC</label>
            <input className={INPUT} id="cs-csc" name="cc-csc" type="text" autoComplete="cc-csc" inputMode="numeric" placeholder="123" required />
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'checkout-two-column',
    category: 'checkout',
    tags: ['checkout', 'two-column', 'order-summary', 'layout', 'responsive'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 2210, copies: 560, downloads: 168 },
    props: [
      { name: 'items', type: 'OrderItem[]', required: true, descriptionKey: 'items' },
      { name: 'currency', type: 'string', default: "'$'", descriptionKey: 'currency' },
      { name: 'shipping', type: 'number', default: '0', descriptionKey: 'shipping' },
      { name: 'onSubmit', type: '(e: FormEvent) => void', descriptionKey: 'onSubmit' },
    ],
    code: {
      tailwind: `<!--
  Form left, summary right - but only from lg up. Below that the grid is one
  column and the summary sits *under* the form: on a phone you fill the fields
  first and confirm the total last, which is the reading order you want anyway.
  Money is text-right + tabular-nums so the price column aligns on the decimal.
-->
<form class="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_20rem]" action="#" method="post" novalidate>
  <div class="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950">
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping &amp; payment</h2>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="ct-email">Email</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="ct-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="ct-name">Full name</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="ct-name" name="name" type="text" autocomplete="name" placeholder="Ada Lovelace" required />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="ct-card">Card number</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="ct-card" name="cc-number" type="text" autocomplete="cc-number" inputmode="numeric" placeholder="1234 1234 1234 1234" required />
    </div>
  </div>

  <aside class="h-fit space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
    <ul class="space-y-2">
      <li class="flex items-baseline justify-between gap-3 text-sm">
        <span class="min-w-0 text-gray-700 dark:text-gray-300">Wireless keyboard</span>
        <span class="shrink-0 text-right tabular-nums text-gray-900 dark:text-gray-100">$79.00</span>
      </li>
      <li class="flex items-baseline justify-between gap-3 text-sm">
        <span class="min-w-0 text-gray-700 dark:text-gray-300">USB-C cable</span>
        <span class="shrink-0 text-right tabular-nums text-gray-900 dark:text-gray-100">$12.00</span>
      </li>
    </ul>
    <dl class="space-y-1 border-t border-gray-200 pt-3 text-sm dark:border-gray-800">
      <div class="flex justify-between gap-3">
        <dt class="text-gray-600 dark:text-gray-400">Subtotal</dt>
        <dd class="text-right tabular-nums text-gray-900 dark:text-gray-100">$91.00</dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt class="text-gray-600 dark:text-gray-400">Shipping</dt>
        <dd class="text-right tabular-nums text-gray-900 dark:text-gray-100">$5.00</dd>
      </div>
      <div class="flex justify-between gap-3 border-t border-gray-200 pt-2 text-base font-semibold dark:border-gray-800">
        <dt class="text-gray-900 dark:text-gray-100">Total</dt>
        <dd class="text-right tabular-nums text-gray-900 dark:text-gray-100">$96.00</dd>
      </div>
    </dl>
    <button class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900" type="submit">Pay $96.00</button>
  </aside>
</form>`,
      react: `const INPUT =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

export function CheckoutTwoColumn({
  items,
  currency = '$',
  shipping = 0,
  onSubmit = (e) => e.preventDefault(),
}) {
  const money = (n) => \`\${currency}\${n.toFixed(2)}\`;
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const total = subtotal + shipping;

  return (
    <form onSubmit={onSubmit} className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping &amp; payment</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ct-email">Email</label>
          <input className={INPUT} id="ct-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ct-name">Full name</label>
          <input className={INPUT} id="ct-name" name="name" type="text" autoComplete="name" placeholder="Ada Lovelace" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ct-card">Card number</label>
          <input className={INPUT} id="ct-card" name="cc-number" type="text" autoComplete="cc-number" inputMode="numeric" placeholder="1234 1234 1234 1234" required />
        </div>
      </div>

      <aside className="h-fit space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.name} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 text-gray-700 dark:text-gray-300">{it.name}</span>
              <span className="shrink-0 text-right tabular-nums text-gray-900 dark:text-gray-100">{money(it.price * it.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-1 border-t border-gray-200 pt-3 text-sm dark:border-gray-800">
          <div className="flex justify-between gap-3">
            <dt className="text-gray-600 dark:text-gray-400">Subtotal</dt>
            <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-600 dark:text-gray-400">Shipping</dt>
            <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(shipping)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-gray-200 pt-2 text-base font-semibold dark:border-gray-800">
            <dt className="text-gray-900 dark:text-gray-100">Total</dt>
            <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(total)}</dd>
          </div>
        </dl>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Pay {money(total)}
        </button>
      </aside>
    </form>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

const INPUT =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

export interface CheckoutTwoColumnProps {
  items: OrderItem[];
  currency?: string;
  shipping?: number;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

export function CheckoutTwoColumn({
  items,
  currency = '$',
  shipping = 0,
  onSubmit = (e) => e.preventDefault(),
}: CheckoutTwoColumnProps): JSX.Element {
  const money = (n: number): string => \`\${currency}\${n.toFixed(2)}\`;
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const total = subtotal + shipping;

  return (
    <form onSubmit={onSubmit} className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping &amp; payment</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ct-email">Email</label>
          <input className={INPUT} id="ct-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ct-name">Full name</label>
          <input className={INPUT} id="ct-name" name="name" type="text" autoComplete="name" placeholder="Ada Lovelace" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ct-card">Card number</label>
          <input className={INPUT} id="ct-card" name="cc-number" type="text" autoComplete="cc-number" inputMode="numeric" placeholder="1234 1234 1234 1234" required />
        </div>
      </div>

      <aside className="h-fit space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.name} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 text-gray-700 dark:text-gray-300">{it.name}</span>
              <span className="shrink-0 text-right tabular-nums text-gray-900 dark:text-gray-100">{money(it.price * it.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-1 border-t border-gray-200 pt-3 text-sm dark:border-gray-800">
          <div className="flex justify-between gap-3">
            <dt className="text-gray-600 dark:text-gray-400">Subtotal</dt>
            <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-600 dark:text-gray-400">Shipping</dt>
            <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(shipping)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-gray-200 pt-2 text-base font-semibold dark:border-gray-800">
            <dt className="text-gray-900 dark:text-gray-100">Total</dt>
            <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(total)}</dd>
          </div>
        </dl>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Pay {money(total)}
        </button>
      </aside>
    </form>
  );
}`,
    },
  },
  {
    slug: 'checkout-multi-step',
    category: 'checkout',
    tags: ['checkout', 'multi-step', 'wizard', 'progress', 'stateful'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1980, copies: 471, downloads: 133 },
    props: [
      { name: 'steps', type: 'string[]', default: "['Contact','Shipping','Payment','Review']", descriptionKey: 'steps' },
      { name: 'onComplete', type: '() => void', descriptionKey: 'onComplete' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Static markup showing step 2 of 4. In the React tabs the current step is state;
  here the progressbar and aria-current are hardcoded to illustrate the pattern.
  The <ol> is the visible tracker; role="progressbar" on the fill gives assistive
  tech a single "2 of 4" reading instead of four ambiguous list items.
-->
<div class="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950">
  <div role="progressbar" aria-valuenow="2" aria-valuemin="1" aria-valuemax="4" aria-label="Checkout step 2 of 4" class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
    <div class="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-blue-500" style="width:50%"></div>
  </div>
  <ol class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
    <li class="text-gray-400 dark:text-gray-500">Contact</li>
    <li class="text-blue-600 dark:text-blue-400" aria-current="step">Shipping</li>
    <li class="text-gray-400 dark:text-gray-500">Payment</li>
    <li class="text-gray-400 dark:text-gray-500">Review</li>
  </ol>

  <div class="mt-5 space-y-4">
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping</h2>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="cm-street">Address</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="cm-street" name="street-address" type="text" autocomplete="street-address" placeholder="123 Market St" />
    </div>
  </div>

  <div class="mt-6 flex items-center justify-between gap-3">
    <button class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button">Back</button>
    <button class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button">Continue</button>
  </div>
</div>`,
      react: `import { useState } from 'react';

const DEFAULT_STEPS = ['Contact', 'Shipping', 'Payment', 'Review'];

export function CheckoutMultiStep({
  steps = DEFAULT_STEPS,
  onComplete = () => {},
  className = '',
}) {
  const [step, setStep] = useState(0);
  const count = steps.length;
  const label = steps[step] ?? '';
  const isLast = step === count - 1;

  const back = () => setStep((s) => Math.max(0, s - 1));
  const next = () => {
    if (isLast) onComplete();
    else setStep((s) => Math.min(count - 1, s + 1));
  };

  return (
    <div className={\`mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <div
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={count}
        aria-label={\`Checkout step \${step + 1} of \${count}\`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-blue-500"
          style={{ width: \`\${((step + 1) / count) * 100}%\` }}
        />
      </div>

      <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
        {steps.map((s, i) => (
          <li
            key={s}
            aria-current={i === step ? 'step' : undefined}
            className={i === step ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}
          >
            {s}
          </li>
        ))}
      </ol>

      <div className="mt-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="cm-field">
            {label} details
          </label>
          <input
            id="cm-field"
            type="text"
            placeholder={\`Enter \${label.toLowerCase()} details\`}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          Back
        </button>
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {isLast ? 'Place order' : 'Continue'}
        </button>
      </div>
    </div>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';

const DEFAULT_STEPS = ['Contact', 'Shipping', 'Payment', 'Review'];

export interface CheckoutMultiStepProps {
  steps?: string[];
  onComplete?: () => void;
  className?: string;
}

export function CheckoutMultiStep({
  steps = DEFAULT_STEPS,
  onComplete = () => {},
  className = '',
}: CheckoutMultiStepProps): JSX.Element {
  const [step, setStep] = useState<number>(0);
  const count = steps.length;
  // Indexing with a variable is T | undefined under noUncheckedIndexedAccess.
  const label = steps[step] ?? '';
  const isLast = step === count - 1;

  const back = (): void => setStep((s) => Math.max(0, s - 1));
  const next = (): void => {
    if (isLast) onComplete();
    else setStep((s) => Math.min(count - 1, s + 1));
  };

  return (
    <div className={\`mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <div
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={count}
        aria-label={\`Checkout step \${step + 1} of \${count}\`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-blue-500"
          style={{ width: \`\${((step + 1) / count) * 100}%\` }}
        />
      </div>

      <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
        {steps.map((s, i) => (
          <li
            key={s}
            aria-current={i === step ? 'step' : undefined}
            className={i === step ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}
          >
            {s}
          </li>
        ))}
      </ol>

      <div className="mt-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="cm-field">
            {label} details
          </label>
          <input
            id="cm-field"
            type="text"
            placeholder={\`Enter \${label.toLowerCase()} details\`}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          Back
        </button>
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {isLast ? 'Place order' : 'Continue'}
        </button>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'checkout-order-summary',
    category: 'checkout',
    tags: ['checkout', 'order-summary', 'cart', 'totals', 'card'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2540, copies: 690, downloads: 205 },
    props: [
      { name: 'items', type: 'OrderItem[]', required: true, descriptionKey: 'items' },
      { name: 'currency', type: 'string', default: "'$'", descriptionKey: 'currency' },
      { name: 'shipping', type: 'number', default: '0', descriptionKey: 'shipping' },
      { name: 'tax', type: 'number', default: '0', descriptionKey: 'tax' },
    ],
    code: {
      tailwind: `<!--
  A read-only summary card. Items use a real <ul>; the totals use a <dl> so each
  amount is the <dd> paired to its <dt> label. Every money value is text-right +
  tabular-nums so the price column stays flush-right and aligned on the decimal.
-->
<section class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950" aria-labelledby="os-title">
  <h2 id="os-title" class="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
  <ul class="mt-4 space-y-3">
    <li class="flex items-baseline justify-between gap-3">
      <span class="min-w-0 text-sm text-gray-700 dark:text-gray-300">Wireless keyboard <span class="text-gray-400">&times;1</span></span>
      <span class="shrink-0 text-right text-sm tabular-nums text-gray-900 dark:text-gray-100">$79.00</span>
    </li>
    <li class="flex items-baseline justify-between gap-3">
      <span class="min-w-0 text-sm text-gray-700 dark:text-gray-300">USB-C cable <span class="text-gray-400">&times;2</span></span>
      <span class="shrink-0 text-right text-sm tabular-nums text-gray-900 dark:text-gray-100">$24.00</span>
    </li>
  </ul>
  <dl class="mt-4 space-y-1.5 border-t border-gray-200 pt-4 text-sm dark:border-gray-800">
    <div class="flex justify-between gap-3">
      <dt class="text-gray-600 dark:text-gray-400">Subtotal</dt>
      <dd class="text-right tabular-nums text-gray-900 dark:text-gray-100">$103.00</dd>
    </div>
    <div class="flex justify-between gap-3">
      <dt class="text-gray-600 dark:text-gray-400">Shipping</dt>
      <dd class="text-right tabular-nums text-gray-900 dark:text-gray-100">$5.00</dd>
    </div>
    <div class="flex justify-between gap-3">
      <dt class="text-gray-600 dark:text-gray-400">Tax</dt>
      <dd class="text-right tabular-nums text-gray-900 dark:text-gray-100">$8.24</dd>
    </div>
    <div class="mt-1 flex justify-between gap-3 border-t border-gray-200 pt-3 text-base font-semibold dark:border-gray-800">
      <dt class="text-gray-900 dark:text-gray-100">Total</dt>
      <dd class="text-right tabular-nums text-gray-900 dark:text-gray-100">$116.24</dd>
    </div>
  </dl>
</section>`,
      react: `export function CheckoutOrderSummary({ items, currency = '$', shipping = 0, tax = 0 }) {
  const money = (n) => \`\${currency}\${n.toFixed(2)}\`;
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const total = subtotal + shipping + tax;

  return (
    <section className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950" aria-labelledby="os-title">
      <h2 id="os-title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it.name} className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 text-sm text-gray-700 dark:text-gray-300">
              {it.name} <span className="text-gray-400">&times;{it.qty}</span>
            </span>
            <span className="shrink-0 text-right text-sm tabular-nums text-gray-900 dark:text-gray-100">{money(it.price * it.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1.5 border-t border-gray-200 pt-4 text-sm dark:border-gray-800">
        <div className="flex justify-between gap-3">
          <dt className="text-gray-600 dark:text-gray-400">Subtotal</dt>
          <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-600 dark:text-gray-400">Shipping</dt>
          <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(shipping)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-600 dark:text-gray-400">Tax</dt>
          <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(tax)}</dd>
        </div>
        <div className="mt-1 flex justify-between gap-3 border-t border-gray-200 pt-3 text-base font-semibold dark:border-gray-800">
          <dt className="text-gray-900 dark:text-gray-100">Total</dt>
          <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(total)}</dd>
        </div>
      </dl>
    </section>
  );
}`,
      typescript: `export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface CheckoutOrderSummaryProps {
  items: OrderItem[];
  currency?: string;
  shipping?: number;
  tax?: number;
}

export function CheckoutOrderSummary({
  items,
  currency = '$',
  shipping = 0,
  tax = 0,
}: CheckoutOrderSummaryProps): JSX.Element {
  const money = (n: number): string => \`\${currency}\${n.toFixed(2)}\`;
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const total = subtotal + shipping + tax;

  return (
    <section className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950" aria-labelledby="os-title">
      <h2 id="os-title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it.name} className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 text-sm text-gray-700 dark:text-gray-300">
              {it.name} <span className="text-gray-400">&times;{it.qty}</span>
            </span>
            <span className="shrink-0 text-right text-sm tabular-nums text-gray-900 dark:text-gray-100">{money(it.price * it.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1.5 border-t border-gray-200 pt-4 text-sm dark:border-gray-800">
        <div className="flex justify-between gap-3">
          <dt className="text-gray-600 dark:text-gray-400">Subtotal</dt>
          <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-600 dark:text-gray-400">Shipping</dt>
          <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(shipping)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-600 dark:text-gray-400">Tax</dt>
          <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(tax)}</dd>
        </div>
        <div className="mt-1 flex justify-between gap-3 border-t border-gray-200 pt-3 text-base font-semibold dark:border-gray-800">
          <dt className="text-gray-900 dark:text-gray-100">Total</dt>
          <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(total)}</dd>
        </div>
      </dl>
    </section>
  );
}`,
    },
  },
  {
    slug: 'checkout-payment-form',
    category: 'checkout',
    tags: ['checkout', 'payment', 'card', 'form', 'ui-only'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2320, copies: 588, downloads: 176 },
    props: [
      { name: 'payLabel', type: 'string', default: "'Pay now'", descriptionKey: 'payLabel' },
      { name: 'onSubmit', type: '(e: FormEvent) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Card fields only, and only fields - this template does not tokenise, validate
  or charge anything. The value is the plumbing: cc-number / cc-name / cc-exp /
  cc-csc autocomplete tokens and inputMode="numeric" so the browser and password
  managers fill the right box and phones show a number pad. The brand marks are
  decorative inline SVG (aria-hidden), not real logos.
-->
<form class="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950" action="#" method="post" novalidate>
  <div class="flex items-center justify-between">
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Payment details</h2>
    <div class="flex gap-1" aria-hidden="true">
      <span class="flex h-5 w-8 items-center justify-center rounded bg-gradient-to-r from-indigo-500 to-blue-600 text-[8px] font-bold text-white">VISA</span>
      <span class="flex h-5 w-8 items-center justify-center rounded bg-gradient-to-r from-orange-500 to-red-500 text-[8px] font-bold text-white">MC</span>
    </div>
  </div>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="pf-card">Card number</label>
    <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="pf-card" name="cc-number" type="text" autocomplete="cc-number" inputmode="numeric" placeholder="1234 1234 1234 1234" />
  </div>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="pf-name">Name on card</label>
    <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="pf-name" name="cc-name" type="text" autocomplete="cc-name" placeholder="Ada Lovelace" />
  </div>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="pf-exp">Expiry</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="pf-exp" name="cc-exp" type="text" autocomplete="cc-exp" inputmode="numeric" placeholder="MM / YY" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="pf-csc">CVC</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="pf-csc" name="cc-csc" type="text" autocomplete="cc-csc" inputmode="numeric" placeholder="123" />
    </div>
  </div>
  <button class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="submit">Pay now</button>
  <p class="text-center text-xs text-gray-500 dark:text-gray-400">Your payment details are never stored by this demo.</p>
</form>`,
      react: `const INPUT =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const LABEL = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

export function CheckoutPaymentForm({
  payLabel = 'Pay now',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}) {
  return (
    <form onSubmit={onSubmit} className={\`w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payment details</h2>
        <div className="flex gap-1" aria-hidden="true">
          <span className="flex h-5 w-8 items-center justify-center rounded bg-gradient-to-r from-indigo-500 to-blue-600 text-[8px] font-bold text-white">VISA</span>
          <span className="flex h-5 w-8 items-center justify-center rounded bg-gradient-to-r from-orange-500 to-red-500 text-[8px] font-bold text-white">MC</span>
        </div>
      </div>
      <div>
        <label className={LABEL} htmlFor="pf-card">Card number</label>
        <input className={INPUT} id="pf-card" name="cc-number" type="text" autoComplete="cc-number" inputMode="numeric" placeholder="1234 1234 1234 1234" />
      </div>
      <div>
        <label className={LABEL} htmlFor="pf-name">Name on card</label>
        <input className={INPUT} id="pf-name" name="cc-name" type="text" autoComplete="cc-name" placeholder="Ada Lovelace" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL} htmlFor="pf-exp">Expiry</label>
          <input className={INPUT} id="pf-exp" name="cc-exp" type="text" autoComplete="cc-exp" inputMode="numeric" placeholder="MM / YY" />
        </div>
        <div>
          <label className={LABEL} htmlFor="pf-csc">CVC</label>
          <input className={INPUT} id="pf-csc" name="cc-csc" type="text" autoComplete="cc-csc" inputMode="numeric" placeholder="123" />
        </div>
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {payLabel}
      </button>
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">Your payment details are never stored by this demo.</p>
    </form>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

const INPUT =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const LABEL = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

export interface CheckoutPaymentFormProps {
  payLabel?: string;
  /** Defaults to a no-op that cancels navigation - this template charges nothing. */
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function CheckoutPaymentForm({
  payLabel = 'Pay now',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}: CheckoutPaymentFormProps): JSX.Element {
  return (
    <form onSubmit={onSubmit} className={\`w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payment details</h2>
        <div className="flex gap-1" aria-hidden="true">
          <span className="flex h-5 w-8 items-center justify-center rounded bg-gradient-to-r from-indigo-500 to-blue-600 text-[8px] font-bold text-white">VISA</span>
          <span className="flex h-5 w-8 items-center justify-center rounded bg-gradient-to-r from-orange-500 to-red-500 text-[8px] font-bold text-white">MC</span>
        </div>
      </div>
      <div>
        <label className={LABEL} htmlFor="pf-card">Card number</label>
        <input className={INPUT} id="pf-card" name="cc-number" type="text" autoComplete="cc-number" inputMode="numeric" placeholder="1234 1234 1234 1234" />
      </div>
      <div>
        <label className={LABEL} htmlFor="pf-name">Name on card</label>
        <input className={INPUT} id="pf-name" name="cc-name" type="text" autoComplete="cc-name" placeholder="Ada Lovelace" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL} htmlFor="pf-exp">Expiry</label>
          <input className={INPUT} id="pf-exp" name="cc-exp" type="text" autoComplete="cc-exp" inputMode="numeric" placeholder="MM / YY" />
        </div>
        <div>
          <label className={LABEL} htmlFor="pf-csc">CVC</label>
          <input className={INPUT} id="pf-csc" name="cc-csc" type="text" autoComplete="cc-csc" inputMode="numeric" placeholder="123" />
        </div>
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {payLabel}
      </button>
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">Your payment details are never stored by this demo.</p>
    </form>
  );
}`,
    },
  },
  {
    slug: 'checkout-shipping-address',
    category: 'checkout',
    tags: ['checkout', 'shipping', 'address', 'form', 'autocomplete'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2110, copies: 512, downloads: 149 },
    props: [
      { name: 'submitLabel', type: 'string', default: "'Save address'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(e: FormEvent) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Every field carries the exact autocomplete token the browser's address
  autofill expects - name, street-address, address-level2 (city),
  address-level1 (state), postal-code, country-name, tel. Get these right and a
  returning customer fills the whole form in one tap; get them wrong and autofill
  silently gives up. City/state and postal/phone share a row from sm up and stack
  below it.
-->
<form class="w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950" action="#" method="post" novalidate>
  <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping address</h2>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="sa-name">Full name</label>
    <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="sa-name" name="name" type="text" autocomplete="name" placeholder="Ada Lovelace" required />
  </div>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="sa-street">Street address</label>
    <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="sa-street" name="street-address" type="text" autocomplete="street-address" placeholder="123 Market St" required />
  </div>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="sa-city">City</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="sa-city" name="city" type="text" autocomplete="address-level2" placeholder="San Francisco" required />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="sa-state">State / region</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="sa-state" name="state" type="text" autocomplete="address-level1" placeholder="CA" required />
    </div>
  </div>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="sa-zip">Postal code</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="sa-zip" name="postal-code" type="text" autocomplete="postal-code" inputmode="numeric" placeholder="94103" required />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="sa-country">Country</label>
      <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="sa-country" name="country" type="text" autocomplete="country-name" placeholder="United States" required />
    </div>
  </div>
  <button class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="submit">Save address</button>
</form>`,
      react: `const INPUT =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const LABEL = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

export function CheckoutShippingAddress({
  submitLabel = 'Save address',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}) {
  return (
    <form onSubmit={onSubmit} className={\`w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping address</h2>
      <div>
        <label className={LABEL} htmlFor="sa-name">Full name</label>
        <input className={INPUT} id="sa-name" name="name" type="text" autoComplete="name" placeholder="Ada Lovelace" required />
      </div>
      <div>
        <label className={LABEL} htmlFor="sa-street">Street address</label>
        <input className={INPUT} id="sa-street" name="street-address" type="text" autoComplete="street-address" placeholder="123 Market St" required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="sa-city">City</label>
          <input className={INPUT} id="sa-city" name="city" type="text" autoComplete="address-level2" placeholder="San Francisco" required />
        </div>
        <div>
          <label className={LABEL} htmlFor="sa-state">State / region</label>
          <input className={INPUT} id="sa-state" name="state" type="text" autoComplete="address-level1" placeholder="CA" required />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="sa-zip">Postal code</label>
          <input className={INPUT} id="sa-zip" name="postal-code" type="text" autoComplete="postal-code" inputMode="numeric" placeholder="94103" required />
        </div>
        <div>
          <label className={LABEL} htmlFor="sa-country">Country</label>
          <input className={INPUT} id="sa-country" name="country" type="text" autoComplete="country-name" placeholder="United States" required />
        </div>
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {submitLabel}
      </button>
    </form>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

const INPUT =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const LABEL = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

export interface CheckoutShippingAddressProps {
  submitLabel?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function CheckoutShippingAddress({
  submitLabel = 'Save address',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}: CheckoutShippingAddressProps): JSX.Element {
  return (
    <form onSubmit={onSubmit} className={\`w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping address</h2>
      <div>
        <label className={LABEL} htmlFor="sa-name">Full name</label>
        <input className={INPUT} id="sa-name" name="name" type="text" autoComplete="name" placeholder="Ada Lovelace" required />
      </div>
      <div>
        <label className={LABEL} htmlFor="sa-street">Street address</label>
        <input className={INPUT} id="sa-street" name="street-address" type="text" autoComplete="street-address" placeholder="123 Market St" required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="sa-city">City</label>
          <input className={INPUT} id="sa-city" name="city" type="text" autoComplete="address-level2" placeholder="San Francisco" required />
        </div>
        <div>
          <label className={LABEL} htmlFor="sa-state">State / region</label>
          <input className={INPUT} id="sa-state" name="state" type="text" autoComplete="address-level1" placeholder="CA" required />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="sa-zip">Postal code</label>
          <input className={INPUT} id="sa-zip" name="postal-code" type="text" autoComplete="postal-code" inputMode="numeric" placeholder="94103" required />
        </div>
        <div>
          <label className={LABEL} htmlFor="sa-country">Country</label>
          <input className={INPUT} id="sa-country" name="country" type="text" autoComplete="country-name" placeholder="United States" required />
        </div>
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {submitLabel}
      </button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'checkout-express-buttons',
    category: 'checkout',
    tags: ['checkout', 'express', 'wallet', 'buttons', 'divider'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2680, copies: 623, downloads: 191 },
    props: [
      { name: 'onSelect', type: '(method: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Express-wallet buttons over a labelled "or" divider. The brand marks are plain
  inline SVG/text stand-ins - NOT the real Apple/Google/PayPal logos, which are
  trademarked and must be dropped in from each provider's own SDK/brand kit. Each
  button is a real <button type="button"> with an aria-label, because the wordmark
  alone is not a reliable accessible name.
-->
<div class="w-full max-w-sm space-y-3">
  <button aria-label="Pay with Apple Pay" class="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-950" type="button">
    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.1 1-.3 2-1 2.8-.6.7-1.7 1.3-2.7 1.2-.1-1 .4-2 1-2.7C14.5 3.6 15.6 3 16.5 3zm2.9 15.3c-.5 1.1-.7 1.6-1.3 2.6-.9 1.4-2.1 3.1-3.6 3.1-1.4 0-1.7-.9-3.5-.9s-2.2.9-3.5.9c-1.5 0-2.7-1.6-3.5-3C1.8 17 1.5 12.6 3.6 10.3c1-1.1 2.3-1.8 3.6-1.8 1.4 0 2.3.9 3.5.9 1.1 0 1.8-.9 3.5-.9 1.2 0 2.5.7 3.4 1.8-3 1.6-2.5 5.9.2 7z"/></svg>
    <span>Apple Pay</span>
  </button>
  <button aria-label="Pay with Google Pay" class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button">
    <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true"><path fill="#4285F4" d="M12 11v2.8h4c-.2 1-1.4 3-4 3-2.4 0-4.3-2-4.3-4.5S9.6 8 12 8c1.3 0 2.2.6 2.7 1l1.9-1.9C15.4 6 13.9 5.3 12 5.3 8.3 5.3 5.3 8.3 5.3 12s3 6.7 6.7 6.7c3.9 0 6.4-2.7 6.4-6.5 0-.5 0-.8-.1-1.2H12z"/></svg>
    <span>Google Pay</span>
  </button>
  <button aria-label="Pay with PayPal" class="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc439] px-5 py-3 text-sm font-bold text-[#003087] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003087] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-950" type="button">
    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M9.5 5h5.2c2.4 0 4 1.4 3.6 3.9-.4 2.6-2.3 3.9-4.8 3.9h-1.4c-.4 0-.7.3-.8.7l-.7 4.2c0 .2-.2.4-.5.4H6.9c-.3 0-.5-.3-.4-.6L8.9 5.4c.1-.2.3-.4.6-.4z"/></svg>
    <span>PayPal</span>
  </button>
  <div class="flex items-center gap-3 py-1" role="separator" aria-label="or pay with card">
    <span class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
    <span class="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">or</span>
    <span class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
  </div>
</div>`,
      react: `const ICON = 'h-4 w-4';

export function CheckoutExpressButtons({ onSelect = () => {}, className = '' }) {
  return (
    <div className={\`w-full max-w-sm space-y-3 \${className}\`}>
      <button
        type="button"
        aria-label="Pay with Apple Pay"
        onClick={() => onSelect('apple')}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-950"
      >
        <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true"><path d="M16.5 3c.1 1-.3 2-1 2.8-.6.7-1.7 1.3-2.7 1.2-.1-1 .4-2 1-2.7C14.5 3.6 15.6 3 16.5 3zm2.9 15.3c-.5 1.1-.7 1.6-1.3 2.6-.9 1.4-2.1 3.1-3.6 3.1-1.4 0-1.7-.9-3.5-.9s-2.2.9-3.5.9c-1.5 0-2.7-1.6-3.5-3C1.8 17 1.5 12.6 3.6 10.3c1-1.1 2.3-1.8 3.6-1.8 1.4 0 2.3.9 3.5.9 1.1 0 1.8-.9 3.5-.9 1.2 0 2.5.7 3.4 1.8-3 1.6-2.5 5.9.2 7z" /></svg>
        <span>Apple Pay</span>
      </button>
      <button
        type="button"
        aria-label="Pay with Google Pay"
        onClick={() => onSelect('google')}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg viewBox="0 0 24 24" className={ICON} aria-hidden="true"><path fill="#4285F4" d="M12 11v2.8h4c-.2 1-1.4 3-4 3-2.4 0-4.3-2-4.3-4.5S9.6 8 12 8c1.3 0 2.2.6 2.7 1l1.9-1.9C15.4 6 13.9 5.3 12 5.3 8.3 5.3 5.3 8.3 5.3 12s3 6.7 6.7 6.7c3.9 0 6.4-2.7 6.4-6.5 0-.5 0-.8-.1-1.2H12z" /></svg>
        <span>Google Pay</span>
      </button>
      <button
        type="button"
        aria-label="Pay with PayPal"
        onClick={() => onSelect('paypal')}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc439] px-5 py-3 text-sm font-bold text-[#003087] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003087] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-950"
      >
        <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true"><path d="M9.5 5h5.2c2.4 0 4 1.4 3.6 3.9-.4 2.6-2.3 3.9-4.8 3.9h-1.4c-.4 0-.7.3-.8.7l-.7 4.2c0 .2-.2.4-.5.4H6.9c-.3 0-.5-.3-.4-.6L8.9 5.4c.1-.2.3-.4.6-.4z" /></svg>
        <span>PayPal</span>
      </button>
      <div className="flex items-center gap-3 py-1" role="separator" aria-label="or pay with card">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}`,
      typescript: `const ICON = 'h-4 w-4';

export interface CheckoutExpressButtonsProps {
  /** Fired with 'apple' | 'google' | 'paypal'. Wire it to your wallet SDK. */
  onSelect?: (method: string) => void;
  className?: string;
}

export function CheckoutExpressButtons({
  onSelect = () => {},
  className = '',
}: CheckoutExpressButtonsProps): JSX.Element {
  return (
    <div className={\`w-full max-w-sm space-y-3 \${className}\`}>
      <button
        type="button"
        aria-label="Pay with Apple Pay"
        onClick={() => onSelect('apple')}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-950"
      >
        <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true"><path d="M16.5 3c.1 1-.3 2-1 2.8-.6.7-1.7 1.3-2.7 1.2-.1-1 .4-2 1-2.7C14.5 3.6 15.6 3 16.5 3zm2.9 15.3c-.5 1.1-.7 1.6-1.3 2.6-.9 1.4-2.1 3.1-3.6 3.1-1.4 0-1.7-.9-3.5-.9s-2.2.9-3.5.9c-1.5 0-2.7-1.6-3.5-3C1.8 17 1.5 12.6 3.6 10.3c1-1.1 2.3-1.8 3.6-1.8 1.4 0 2.3.9 3.5.9 1.1 0 1.8-.9 3.5-.9 1.2 0 2.5.7 3.4 1.8-3 1.6-2.5 5.9.2 7z" /></svg>
        <span>Apple Pay</span>
      </button>
      <button
        type="button"
        aria-label="Pay with Google Pay"
        onClick={() => onSelect('google')}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg viewBox="0 0 24 24" className={ICON} aria-hidden="true"><path fill="#4285F4" d="M12 11v2.8h4c-.2 1-1.4 3-4 3-2.4 0-4.3-2-4.3-4.5S9.6 8 12 8c1.3 0 2.2.6 2.7 1l1.9-1.9C15.4 6 13.9 5.3 12 5.3 8.3 5.3 5.3 8.3 5.3 12s3 6.7 6.7 6.7c3.9 0 6.4-2.7 6.4-6.5 0-.5 0-.8-.1-1.2H12z" /></svg>
        <span>Google Pay</span>
      </button>
      <button
        type="button"
        aria-label="Pay with PayPal"
        onClick={() => onSelect('paypal')}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc439] px-5 py-3 text-sm font-bold text-[#003087] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003087] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-950"
      >
        <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true"><path d="M9.5 5h5.2c2.4 0 4 1.4 3.6 3.9-.4 2.6-2.3 3.9-4.8 3.9h-1.4c-.4 0-.7.3-.8.7l-.7 4.2c0 .2-.2.4-.5.4H6.9c-.3 0-.5-.3-.4-.6L8.9 5.4c.1-.2.3-.4.6-.4z" /></svg>
        <span>PayPal</span>
      </button>
      <div className="flex items-center gap-3 py-1" role="separator" aria-label="or pay with card">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'checkout-review-confirm',
    category: 'checkout',
    tags: ['checkout', 'review', 'confirm', 'summary', 'terms'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1760, copies: 388, downloads: 112 },
    props: [
      { name: 'email', type: 'string', required: true, descriptionKey: 'email' },
      { name: 'address', type: 'string', required: true, descriptionKey: 'address' },
      { name: 'cardLast4', type: 'string', required: true, descriptionKey: 'cardLast4' },
      { name: 'total', type: 'string', required: true, descriptionKey: 'total' },
      { name: 'onConfirm', type: '(e: FormEvent) => void', descriptionKey: 'onConfirm' },
    ],
    code: {
      tailwind: `<!--
  A review step: three summary rows, each with an Edit link back to its section,
  then a terms checkbox gating the confirm button. The masked card (dots + last
  four) is display text passed in by the parent - this component never sees a full
  number. The rows use a <dl>; the Edit links are the section anchors.
-->
<form class="w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950" action="#" method="post" novalidate>
  <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Review your order</h2>
  <dl class="divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
    <div class="flex items-start justify-between gap-3 p-3">
      <div class="min-w-0">
        <dt class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Contact</dt>
        <dd class="mt-0.5 truncate text-sm text-gray-900 dark:text-gray-100">you@example.com</dd>
      </div>
      <a class="shrink-0 rounded text-sm font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" href="#contact">Edit</a>
    </div>
    <div class="flex items-start justify-between gap-3 p-3">
      <div class="min-w-0">
        <dt class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Ship to</dt>
        <dd class="mt-0.5 text-sm text-gray-900 dark:text-gray-100">123 Market St, San Francisco, CA 94103</dd>
      </div>
      <a class="shrink-0 rounded text-sm font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" href="#shipping">Edit</a>
    </div>
    <div class="flex items-start justify-between gap-3 p-3">
      <div class="min-w-0">
        <dt class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Payment</dt>
        <dd class="mt-0.5 text-sm tabular-nums text-gray-900 dark:text-gray-100">&bull;&bull;&bull;&bull; 4242</dd>
      </div>
      <a class="shrink-0 rounded text-sm font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" href="#payment">Edit</a>
    </div>
  </dl>
  <div class="flex items-center justify-between gap-3 text-base font-semibold">
    <span class="text-gray-900 dark:text-gray-100">Total</span>
    <span class="text-right tabular-nums text-gray-900 dark:text-gray-100">$116.24</span>
  </div>
  <label class="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
    <input class="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="checkbox" name="agree" required />
    <span>I agree to the terms of sale and refund policy.</span>
  </label>
  <button class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="submit">Confirm &amp; pay $116.24</button>
</form>`,
      react: `const EDIT =
  'shrink-0 rounded text-sm font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

export function CheckoutReviewConfirm({ email, address, cardLast4, total, onConfirm = (e) => e.preventDefault() }) {
  return (
    <form onSubmit={onConfirm} className="w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Review your order</h2>
      <dl className="divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        <div className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Contact</dt>
            <dd className="mt-0.5 truncate text-sm text-gray-900 dark:text-gray-100">{email}</dd>
          </div>
          <a className={EDIT} href="#contact">Edit</a>
        </div>
        <div className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Ship to</dt>
            <dd className="mt-0.5 text-sm text-gray-900 dark:text-gray-100">{address}</dd>
          </div>
          <a className={EDIT} href="#shipping">Edit</a>
        </div>
        <div className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Payment</dt>
            <dd className="mt-0.5 text-sm tabular-nums text-gray-900 dark:text-gray-100">&bull;&bull;&bull;&bull; {cardLast4}</dd>
          </div>
          <a className={EDIT} href="#payment">Edit</a>
        </div>
      </dl>
      <div className="flex items-center justify-between gap-3 text-base font-semibold">
        <span className="text-gray-900 dark:text-gray-100">Total</span>
        <span className="text-right tabular-nums text-gray-900 dark:text-gray-100">{total}</span>
      </div>
      <label className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
        <input className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="checkbox" name="agree" required />
        <span>I agree to the terms of sale and refund policy.</span>
      </label>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Confirm &amp; pay {total}
      </button>
    </form>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

const EDIT =
  'shrink-0 rounded text-sm font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

export interface CheckoutReviewConfirmProps {
  email: string;
  address: string;
  /** Last four digits only - this component never receives a full card number. */
  cardLast4: string;
  total: string;
  onConfirm?: (e: FormEvent<HTMLFormElement>) => void;
}

export function CheckoutReviewConfirm({
  email,
  address,
  cardLast4,
  total,
  onConfirm = (e) => e.preventDefault(),
}: CheckoutReviewConfirmProps): JSX.Element {
  return (
    <form onSubmit={onConfirm} className="w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Review your order</h2>
      <dl className="divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        <div className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Contact</dt>
            <dd className="mt-0.5 truncate text-sm text-gray-900 dark:text-gray-100">{email}</dd>
          </div>
          <a className={EDIT} href="#contact">Edit</a>
        </div>
        <div className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Ship to</dt>
            <dd className="mt-0.5 text-sm text-gray-900 dark:text-gray-100">{address}</dd>
          </div>
          <a className={EDIT} href="#shipping">Edit</a>
        </div>
        <div className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Payment</dt>
            <dd className="mt-0.5 text-sm tabular-nums text-gray-900 dark:text-gray-100">&bull;&bull;&bull;&bull; {cardLast4}</dd>
          </div>
          <a className={EDIT} href="#payment">Edit</a>
        </div>
      </dl>
      <div className="flex items-center justify-between gap-3 text-base font-semibold">
        <span className="text-gray-900 dark:text-gray-100">Total</span>
        <span className="text-right tabular-nums text-gray-900 dark:text-gray-100">{total}</span>
      </div>
      <label className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
        <input className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="checkbox" name="agree" required />
        <span>I agree to the terms of sale and refund policy.</span>
      </label>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Confirm &amp; pay {total}
      </button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'checkout-guest-form',
    category: 'checkout',
    tags: ['checkout', 'guest', 'email', 'sign-in', 'conversion'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1920, copies: 430, downloads: 128 },
    props: [
      { name: 'signInHref', type: 'string', default: "'#'", descriptionKey: 'signInHref' },
      { name: 'onSubmit', type: '(e: FormEvent) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Guest checkout: one email field, a primary "continue as guest", and a route to
  sign in for people who have an account. The "email me a receipt" line is why the
  field is type="email" with autocomplete - the address is the only thing a guest
  order truly needs. Removing the sign-in step is the whole point; don't bury the
  guest button under an account wall.
-->
<form class="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950" action="#" method="post" novalidate>
  <div>
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Checkout as guest</h2>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">We'll email your receipt and order updates here.</p>
  </div>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="gf-email">Email address</label>
    <input class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="gf-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required />
  </div>
  <button class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="submit">Continue as guest</button>
  <div class="flex items-center gap-3" role="separator" aria-label="or">
    <span class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
    <span class="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">or</span>
    <span class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
  </div>
  <a class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" href="#">Sign in to your account</a>
</form>`,
      react: `export function CheckoutGuestForm({
  signInHref = '#',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}) {
  return (
    <form onSubmit={onSubmit} className={\`w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Checkout as guest</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">We'll email your receipt and order updates here.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="gf-email">Email address</label>
        <input
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          id="gf-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Continue as guest
      </button>
      <div className="flex items-center gap-3" role="separator" aria-label="or">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>
      <a href={signInHref} className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Sign in to your account
      </a>
    </form>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

export interface CheckoutGuestFormProps {
  signInHref?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function CheckoutGuestForm({
  signInHref = '#',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}: CheckoutGuestFormProps): JSX.Element {
  return (
    <form onSubmit={onSubmit} className={\`w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Checkout as guest</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">We'll email your receipt and order updates here.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="gf-email">Email address</label>
        <input
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          id="gf-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Continue as guest
      </button>
      <div className="flex items-center gap-3" role="separator" aria-label="or">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>
      <a href={signInHref} className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Sign in to your account
      </a>
    </form>
  );
}`,
    },
  },
  {
    slug: 'checkout-gift-options',
    category: 'checkout',
    tags: ['checkout', 'gift', 'options', 'wrap', 'message'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1580, copies: 341, downloads: 98 },
    props: [
      { name: 'wrapPrice', type: 'string', default: "'$4.99'", descriptionKey: 'wrapPrice' },
      { name: 'onSubmit', type: '(e: FormEvent) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  "This is a gift" reveals the gift details with a CSS-only peer toggle - no JS.
  The checkbox is the peer; the details panel is peer-checked:block hidden, so it
  is genuinely absent from the layout (and from tab order) until the box is
  ticked. The message textarea has a maxlength so the note can't overflow the card
  it prints on.
-->
<form class="w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950" action="#" method="post" novalidate>
  <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Gift options</h2>
  <label class="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
    <input class="peer mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="checkbox" name="is-gift" />
    <span>This is a gift</span>
  </label>
  <div class="hidden space-y-4 border-t border-gray-200 pt-4 peer-has-[:checked]:block dark:border-gray-800">
    <label class="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800">
      <span class="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
        <input class="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="checkbox" name="gift-wrap" />
        Add gift wrap
      </span>
      <span class="shrink-0 tabular-nums text-gray-500 dark:text-gray-400">$4.99</span>
    </label>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="gift-msg">Gift message</label>
      <textarea class="mt-1 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="gift-msg" name="gift-message" rows="3" maxlength="200" placeholder="Happy birthday! Hope you love it."></textarea>
      <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">Up to 200 characters, printed on the packing slip.</p>
    </div>
  </div>
  <button class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="submit">Save gift options</button>
</form>`,
      react: `export function CheckoutGiftOptions({
  wrapPrice = '$4.99',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}) {
  return (
    <form onSubmit={onSubmit} className={\`w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Gift options</h2>
      {/* The wrapper is a peer; the details panel below stays out of the DOM flow
          and tab order until "This is a gift" is checked - a CSS-only reveal. */}
      <label className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
        <input className="peer mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="checkbox" name="is-gift" />
        <span>This is a gift</span>
      </label>
      <div className="hidden space-y-4 border-t border-gray-200 pt-4 peer-has-[:checked]:block dark:border-gray-800">
        <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800">
          <span className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
            <input className="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="checkbox" name="gift-wrap" />
            Add gift wrap
          </span>
          <span className="shrink-0 tabular-nums text-gray-500 dark:text-gray-400">{wrapPrice}</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="gift-msg">Gift message</label>
          <textarea className="mt-1 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="gift-msg" name="gift-message" rows={3} maxLength={200} placeholder="Happy birthday! Hope you love it." />
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Up to 200 characters, printed on the packing slip.</p>
        </div>
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Save gift options
      </button>
    </form>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

export interface CheckoutGiftOptionsProps {
  wrapPrice?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function CheckoutGiftOptions({
  wrapPrice = '$4.99',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}: CheckoutGiftOptionsProps): JSX.Element {
  return (
    <form onSubmit={onSubmit} className={\`w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Gift options</h2>
      <label className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
        <input className="peer mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="checkbox" name="is-gift" />
        <span>This is a gift</span>
      </label>
      <div className="hidden space-y-4 border-t border-gray-200 pt-4 peer-has-[:checked]:block dark:border-gray-800">
        <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800">
          <span className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
            <input className="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="checkbox" name="gift-wrap" />
            Add gift wrap
          </span>
          <span className="shrink-0 tabular-nums text-gray-500 dark:text-gray-400">{wrapPrice}</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="gift-msg">Gift message</label>
          <textarea className="mt-1 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="gift-msg" name="gift-message" rows={3} maxLength={200} placeholder="Happy birthday! Hope you love it." />
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Up to 200 characters, printed on the packing slip.</p>
        </div>
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Save gift options
      </button>
    </form>
  );
}`,
    },
  },
];
