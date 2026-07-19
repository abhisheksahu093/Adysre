import type { ComponentEntry } from './types';

/**
 * Cart category.
 *
 * Ten shopping-cart surfaces, not ten skins of one list: a slide-over drawer, a
 * full page, the bare line-item list, an empty state, a header mini-dropdown, a
 * page-with-summary split, a stepper cart that recomputes a subtotal live, a
 * promo-code form, a saved-for-later shelf, and a cart whose summary sticks on
 * scroll. Two constraints recur across all of them and are the reason the batch
 * is worth having:
 *   1. Money is data, not decoration. Every price is right-aligned with
 *      `tabular-nums` so columns of figures line up and a total reads as a total,
 *      not a sentence - the subtotal is always derived from the items, never a
 *      second hardcoded number that can drift.
 *   2. A cart row cannot fit at 320px. Thumbnail + name + qty + price + remove is
 *      four too many columns for a phone, so every row stacks (`flex-col`) and
 *      only becomes a row from `sm:` up, and every summary sidebar drops BELOW
 *      the items on mobile rather than being squeezed beside them.
 * Thumbnails are pure-CSS gradient tiles - no image to preload, break, or rot -
 * and every remove/quantity control is a real <button> with an aria-label, so
 * the icon-only controls are never nameless in the accessibility tree.
 */
export const cartComponents: ComponentEntry[] = [
  {
    slug: 'cart-drawer-side',
    category: 'cart',
    tags: ['cart', 'drawer', 'slide-over', 'panel', 'ecommerce'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
      { id: 'empty', labelKey: 'empty' },
    ],
    props: [
      { name: 'items', type: 'CartLine[]', required: true, descriptionKey: 'items' },
      { name: 'open', type: 'boolean', default: 'true', descriptionKey: 'open' },
      { name: 'currency', type: 'string', default: "'$'", descriptionKey: 'currency' },
      { name: 'onClose', type: '() => void', descriptionKey: 'onClose' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The panel is scoped to its own relative container (absolute inset-0), not
  fixed to the viewport - this is a demo drawer, not a global one. In production
  swap the wrapper for a fixed overlay and move focus into the panel on open.
  The backdrop is a real <button> so a click OR a keypress closes the drawer;
  a bare <div> onClick is a mouse-only affordance.
-->
<div class="relative h-[30rem] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
  <button type="button" class="absolute inset-0 z-10 bg-black/40" aria-label="Close cart"></button>

  <aside
    class="absolute inset-y-0 right-0 z-20 flex w-full max-w-sm flex-col bg-white shadow-xl dark:bg-gray-900"
    role="dialog"
    aria-label="Shopping cart"
  >
    <header class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
      <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Your cart (2)</h2>
      <button
        type="button"
        class="-mr-1 flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Close cart"
      >
        <svg viewBox="0 0 20 20" fill="none" class="h-5 w-5" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </header>

    <ul class="flex-1 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
      <li class="flex gap-3 p-4">
        <div class="h-16 w-16 flex-none rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500" aria-hidden="true"></div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">Aero Runner</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Qty 1</p>
        </div>
        <div class="text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">$120.00</div>
      </li>
      <li class="flex gap-3 p-4">
        <div class="h-16 w-16 flex-none rounded-lg bg-gradient-to-br from-rose-400 to-orange-500" aria-hidden="true"></div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">Trail Cap</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Qty 2</p>
        </div>
        <div class="text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">$50.00</div>
      </li>
    </ul>

    <footer class="border-t border-gray-200 p-4 dark:border-gray-800">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
        <span class="font-semibold tabular-nums text-gray-900 dark:text-gray-100">$170.00</span>
      </div>
      <a href="#" class="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Checkout</a>
    </footer>
  </aside>
</div>`,
      react: `function formatMoney(cents, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartDrawerSide({ items, open = true, currency = '$', onClose, className = '' }) {
  if (!open) return null;
  const count = items.reduce((n, it) => n + it.qty, 0);
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);

  return (
    <div className={\`relative h-[30rem] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <button type="button" onClick={onClose} className="absolute inset-0 z-10 bg-black/40" aria-label="Close cart" />

      <aside className="absolute inset-y-0 right-0 z-20 flex w-full max-w-sm flex-col bg-white shadow-xl dark:bg-gray-900" role="dialog" aria-label="Shopping cart">
        <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Your cart ({count})</h2>
          <button type="button" onClick={onClose} className="-mr-1 flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Close cart">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </header>

        {items.length === 0 ? (
          <p className="flex-1 px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">Your cart is empty.</p>
        ) : (
          <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
            {items.map((it) => (
              <li key={it.id} className="flex gap-3 p-4">
                <div className={\`h-16 w-16 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p>
                </div>
                <div className="text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</div>
              </li>
            ))}
          </ul>
        )}

        <footer className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</span>
          </div>
          <a href="#" className="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Checkout</a>
        </footer>
      </aside>
    </div>
  );
}`,
      typescript: `export interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  /** Tailwind \`from-*\`/\`to-*\` pair for the gradient thumbnail tile. */
  tint: string;
}

export interface CartDrawerSideProps {
  items: CartLine[];
  open?: boolean;
  currency?: string;
  onClose?: () => void;
  className?: string;
}

function formatMoney(cents: number, currency = '$'): string {
  return currency + (cents / 100).toFixed(2);
}

export function CartDrawerSide({
  items,
  open = true,
  currency = '$',
  onClose,
  className = '',
}: CartDrawerSideProps): JSX.Element | null {
  if (!open) return null;
  const count = items.reduce((n, it) => n + it.qty, 0);
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);

  return (
    <div className={\`relative h-[30rem] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <button type="button" onClick={onClose} className="absolute inset-0 z-10 bg-black/40" aria-label="Close cart" />

      <aside className="absolute inset-y-0 right-0 z-20 flex w-full max-w-sm flex-col bg-white shadow-xl dark:bg-gray-900" role="dialog" aria-label="Shopping cart">
        <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Your cart ({count})</h2>
          <button type="button" onClick={onClose} className="-mr-1 flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Close cart">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </header>

        {items.length === 0 ? (
          <p className="flex-1 px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">Your cart is empty.</p>
        ) : (
          <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
            {items.map((it) => (
              <li key={it.id} className="flex gap-3 p-4">
                <div className={\`h-16 w-16 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p>
                </div>
                <div className="text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</div>
              </li>
            ))}
          </ul>
        )}

        <footer className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</span>
          </div>
          <a href="#" className="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Checkout</a>
        </footer>
      </aside>
    </div>
  );
}`,
    },
  },
  {
    slug: 'cart-full-page',
    category: 'cart',
    tags: ['cart', 'page', 'checkout', 'ecommerce', 'summary'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'CartLine[]', required: true, descriptionKey: 'items' },
      { name: 'currency', type: 'string', default: "'$'", descriptionKey: 'currency' },
      { name: 'shippingCents', type: 'number', default: '0', descriptionKey: 'shippingCents' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Two columns on desktop, one on mobile - and the summary is SECOND in the DOM,
  so on a phone it lands below the items where a shopper expects it, with no
  order- override needed. The item table is a real list, not a <table>: a cart
  row wraps at 320px, and a table cell cannot stack.
-->
<section class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">Shopping cart</h1>

  <div class="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
    <ul class="divide-y divide-gray-100 dark:divide-gray-800">
      <li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <div class="h-20 w-20 flex-none rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500" aria-hidden="true"></div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Aero Runner</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Size 42 - Qty 1</p>
        </div>
        <div class="text-sm font-semibold tabular-nums text-gray-900 sm:text-right sm:w-24 dark:text-gray-100">$120.00</div>
      </li>
      <li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <div class="h-20 w-20 flex-none rounded-lg bg-gradient-to-br from-rose-400 to-orange-500" aria-hidden="true"></div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Trail Cap</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">One size - Qty 2</p>
        </div>
        <div class="text-sm font-semibold tabular-nums text-gray-900 sm:text-right sm:w-24 dark:text-gray-100">$50.00</div>
      </li>
    </ul>

    <aside class="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
      <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
      <dl class="mt-4 space-y-2 text-sm">
        <div class="flex justify-between"><dt class="text-gray-600 dark:text-gray-400">Subtotal</dt><dd class="font-medium tabular-nums text-gray-900 dark:text-gray-100">$170.00</dd></div>
        <div class="flex justify-between"><dt class="text-gray-600 dark:text-gray-400">Shipping</dt><dd class="font-medium tabular-nums text-gray-900 dark:text-gray-100">$8.00</dd></div>
        <div class="flex justify-between border-t border-gray-200 pt-2 text-base dark:border-gray-800"><dt class="font-semibold text-gray-900 dark:text-gray-100">Total</dt><dd class="font-bold tabular-nums text-gray-900 dark:text-gray-100">$178.00</dd></div>
      </dl>
      <a href="#" class="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Proceed to checkout</a>
    </aside>
  </div>
</section>`,
      react: `function formatMoney(cents, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartFullPage({ items, currency = '$', shippingCents = 0, className = '' }) {
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);
  const total = subtotal + shippingCents;

  return (
    <section className={\`mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">Shopping cart</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.map((it) => (
            <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <div className={\`h-20 w-20 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{it.meta} - Qty {it.qty}</p>
              </div>
              <div className="text-sm font-semibold tabular-nums text-gray-900 sm:w-24 sm:text-right dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Shipping</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(shippingCents, currency)}</dd></div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base dark:border-gray-800"><dt className="font-semibold text-gray-900 dark:text-gray-100">Total</dt><dd className="font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(total, currency)}</dd></div>
          </dl>
          <a href="#" className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Proceed to checkout</a>
        </aside>
      </div>
    </section>
  );
}`,
      typescript: `export interface CartLine {
  id: string;
  name: string;
  meta?: string;
  priceCents: number;
  qty: number;
  tint: string;
}

export interface CartFullPageProps {
  items: CartLine[];
  currency?: string;
  shippingCents?: number;
  className?: string;
}

function formatMoney(cents: number, currency = '$'): string {
  return currency + (cents / 100).toFixed(2);
}

export function CartFullPage({
  items,
  currency = '$',
  shippingCents = 0,
  className = '',
}: CartFullPageProps): JSX.Element {
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);
  const total = subtotal + shippingCents;

  return (
    <section className={\`mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">Shopping cart</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.map((it) => (
            <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <div className={\`h-20 w-20 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p>
                {it.meta ? <p className="text-xs text-gray-500 dark:text-gray-400">{it.meta} - Qty {it.qty}</p> : <p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p>}
              </div>
              <div className="text-sm font-semibold tabular-nums text-gray-900 sm:w-24 sm:text-right dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Shipping</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(shippingCents, currency)}</dd></div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base dark:border-gray-800"><dt className="font-semibold text-gray-900 dark:text-gray-100">Total</dt><dd className="font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(total, currency)}</dd></div>
          </dl>
          <a href="#" className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Proceed to checkout</a>
        </aside>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'cart-line-items',
    category: 'cart',
    tags: ['cart', 'line-items', 'list', 'remove', 'ecommerce'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'items', type: 'CartLine[]', required: true, descriptionKey: 'items' },
      { name: 'currency', type: 'string', default: "'$'", descriptionKey: 'currency' },
      { name: 'onRemove', type: '(id: string) => void', descriptionKey: 'onRemove' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The reusable core: one accessible cart row. Each Remove is a real <button>
  with an aria-label naming the product, so the icon-only control is never a
  nameless "button" in the accessibility tree. The row stacks at 320px and only
  becomes horizontal from sm: up.
-->
<ul class="mx-auto w-full max-w-2xl divide-y divide-gray-100 dark:divide-gray-800">
  <li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
    <div class="h-16 w-16 flex-none rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500" aria-hidden="true"></div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">Field Notebook</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">Qty 1</p>
    </div>
    <div class="flex items-center justify-between gap-4 sm:justify-end">
      <span class="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">$18.00</span>
      <button type="button" class="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:hover:text-gray-200" aria-label="Remove Field Notebook from cart">
        <svg viewBox="0 0 20 20" fill="none" class="h-5 w-5" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </div>
  </li>
</ul>`,
      react: `function formatMoney(cents, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartLineItems({ items, currency = '$', onRemove, className = '' }) {
  return (
    <ul className={\`mx-auto w-full max-w-2xl divide-y divide-gray-100 dark:divide-gray-800 \${className}\`}>
      {items.map((it) => (
        <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
          <div className={\`h-16 w-16 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</span>
            <button type="button" onClick={() => onRemove && onRemove(it.id)} className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:hover:text-gray-200" aria-label={\`Remove \${it.name} from cart\`}>
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

export interface CartLineItemsProps {
  items: CartLine[];
  currency?: string;
  onRemove?: (id: string) => void;
  className?: string;
}

function formatMoney(cents: number, currency = '$'): string {
  return currency + (cents / 100).toFixed(2);
}

export function CartLineItems({
  items,
  currency = '$',
  onRemove,
  className = '',
}: CartLineItemsProps): JSX.Element {
  return (
    <ul className={\`mx-auto w-full max-w-2xl divide-y divide-gray-100 dark:divide-gray-800 \${className}\`}>
      {items.map((it) => (
        <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
          <div className={\`h-16 w-16 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</span>
            <button type="button" onClick={() => onRemove?.(it.id)} className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:hover:text-gray-200" aria-label={\`Remove \${it.name} from cart\`}>
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'cart-empty-state',
    category: 'cart',
    tags: ['cart', 'empty-state', 'placeholder', 'ecommerce', 'cta'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Your cart is empty'", descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Start shopping'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The icon is decorative and aria-hidden - the heading already says "empty", so
  announcing the glyph would just be noise. The CTA is the only actionable thing
  here, and it's a real link so it works with keyboard and middle-click.
-->
<div class="mx-auto flex w-full max-w-md flex-col items-center px-4 py-12 text-center">
  <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" class="h-8 w-8"><path d="M3 4h2l2.4 12h9.2l1.8-8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>
  </div>
  <h2 class="mt-5 text-lg font-semibold text-gray-900 dark:text-gray-100">Your cart is empty</h2>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Browse the catalogue and add something you love - it will show up right here.</p>
  <a href="#" class="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Start shopping</a>
</div>`,
      react: `export function CartEmptyState({
  title = 'Your cart is empty',
  copy = 'Browse the catalogue and add something you love - it will show up right here.',
  ctaLabel = 'Start shopping',
  ctaHref = '#',
  className = '',
}) {
  return (
    <div className={\`mx-auto flex w-full max-w-md flex-col items-center px-4 py-12 text-center \${className}\`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8"><path d="M3 4h2l2.4 12h9.2l1.8-8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="20" r="1.4" fill="currentColor" /><circle cx="17" cy="20" r="1.4" fill="currentColor" /></svg>
      </div>
      <h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      {copy ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{copy}</p> : null}
      <a href={ctaHref} className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
    </div>
  );
}`,
      typescript: `export interface CartEmptyStateProps {
  title?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function CartEmptyState({
  title = 'Your cart is empty',
  copy = 'Browse the catalogue and add something you love - it will show up right here.',
  ctaLabel = 'Start shopping',
  ctaHref = '#',
  className = '',
}: CartEmptyStateProps): JSX.Element {
  return (
    <div className={\`mx-auto flex w-full max-w-md flex-col items-center px-4 py-12 text-center \${className}\`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8"><path d="M3 4h2l2.4 12h9.2l1.8-8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="20" r="1.4" fill="currentColor" /><circle cx="17" cy="20" r="1.4" fill="currentColor" /></svg>
      </div>
      <h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      {copy ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{copy}</p> : null}
      <a href={ctaHref} className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
    </div>
  );
}`,
    },
  },
  {
    slug: 'cart-mini-dropdown',
    category: 'cart',
    tags: ['cart', 'dropdown', 'mini', 'header', 'ecommerce'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'items', type: 'CartLine[]', required: true, descriptionKey: 'items' },
      { name: 'open', type: 'boolean', default: 'true', descriptionKey: 'open' },
      { name: 'currency', type: 'string', default: "'$'", descriptionKey: 'currency' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A header cart popover. The trigger carries aria-haspopup + aria-expanded and
  the count badge is aria-hidden with the real count folded into the button's
  aria-label, so a screen reader hears "Cart, 3 items", not "Cart 3". The panel
  is right-anchored but capped to the viewport (w-80 max-w-[calc(100vw-2rem)])
  so it never bleeds off a 320px screen.
-->
<div class="relative inline-block text-left">
  <button type="button" class="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800" aria-haspopup="true" aria-expanded="true" aria-label="Cart, 3 items">
    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true"><path d="M3 4h2l2.4 12h9.2l1.8-8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>
    <span class="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white" aria-hidden="true">3</span>
  </button>

  <div class="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900" role="menu">
    <ul class="max-h-64 space-y-1 overflow-y-auto">
      <li class="flex items-center gap-3 rounded-lg p-2">
        <div class="h-10 w-10 flex-none rounded-md bg-gradient-to-br from-fuchsia-400 to-purple-500" aria-hidden="true"></div>
        <div class="min-w-0 flex-1"><p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">Studio Mug</p><p class="text-xs text-gray-500 dark:text-gray-400">Qty 3</p></div>
        <span class="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">$36.00</span>
      </li>
    </ul>
    <div class="mt-2 flex items-center justify-between border-t border-gray-100 px-2 pt-3 text-sm dark:border-gray-800">
      <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
      <span class="font-semibold tabular-nums text-gray-900 dark:text-gray-100">$36.00</span>
    </div>
    <a href="#" class="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">View cart</a>
  </div>
</div>`,
      react: `function formatMoney(cents, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartMiniDropdown({ items, open = true, currency = '$', className = '' }) {
  const count = items.reduce((n, it) => n + it.qty, 0);
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);

  return (
    <div className={\`relative inline-block text-left \${className}\`}>
      <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800" aria-haspopup="true" aria-expanded={open} aria-label={\`Cart, \${count} items\`}>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M3 4h2l2.4 12h9.2l1.8-8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="20" r="1.4" fill="currentColor" /><circle cx="17" cy="20" r="1.4" fill="currentColor" /></svg>
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white" aria-hidden="true">{count}</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900" role="menu">
          <ul className="max-h-64 space-y-1 overflow-y-auto">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-3 rounded-lg p-2">
                <div className={\`h-10 w-10 flex-none rounded-md bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p></div>
                <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-gray-100 px-2 pt-3 text-sm dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</span>
          </div>
          <a href="#" className="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">View cart</a>
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `export interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

export interface CartMiniDropdownProps {
  items: CartLine[];
  open?: boolean;
  currency?: string;
  className?: string;
}

function formatMoney(cents: number, currency = '$'): string {
  return currency + (cents / 100).toFixed(2);
}

export function CartMiniDropdown({
  items,
  open = true,
  currency = '$',
  className = '',
}: CartMiniDropdownProps): JSX.Element {
  const count = items.reduce((n, it) => n + it.qty, 0);
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);

  return (
    <div className={\`relative inline-block text-left \${className}\`}>
      <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800" aria-haspopup="true" aria-expanded={open} aria-label={\`Cart, \${count} items\`}>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M3 4h2l2.4 12h9.2l1.8-8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="20" r="1.4" fill="currentColor" /><circle cx="17" cy="20" r="1.4" fill="currentColor" /></svg>
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white" aria-hidden="true">{count}</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900" role="menu">
          <ul className="max-h-64 space-y-1 overflow-y-auto">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-3 rounded-lg p-2">
                <div className={\`h-10 w-10 flex-none rounded-md bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p></div>
                <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-gray-100 px-2 pt-3 text-sm dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</span>
          </div>
          <a href="#" className="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">View cart</a>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'cart-with-summary',
    category: 'cart',
    tags: ['cart', 'summary', 'sidebar', 'totals', 'ecommerce'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'with-tax', labelKey: 'withTax' },
    ],
    props: [
      { name: 'items', type: 'CartLine[]', required: true, descriptionKey: 'items' },
      { name: 'currency', type: 'string', default: "'$'", descriptionKey: 'currency' },
      { name: 'taxRate', type: 'number', default: '0', descriptionKey: 'taxRate' },
      { name: 'shippingCents', type: 'number', default: '0', descriptionKey: 'shippingCents' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Items and an order-summary sidebar. Every figure in the summary is derived
  from the items - subtotal, tax and total are computed, never a second set of
  hardcoded numbers that can drift out of sync with the list. The sidebar drops
  below the items on mobile and sits beside them from lg: up.
-->
<div class="mx-auto grid w-full max-w-5xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_18rem]">
  <ul class="divide-y divide-gray-100 dark:divide-gray-800">
    <li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
      <div class="h-16 w-16 flex-none rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500" aria-hidden="true"></div>
      <div class="min-w-0 flex-1"><p class="text-sm font-medium text-gray-900 dark:text-gray-100">Desk Lamp</p><p class="text-xs text-gray-500 dark:text-gray-400">Qty 1</p></div>
      <div class="text-sm font-semibold tabular-nums text-gray-900 sm:w-20 sm:text-right dark:text-gray-100">$64.00</div>
    </li>
  </ul>

  <aside class="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
    <dl class="mt-4 space-y-2 text-sm">
      <div class="flex justify-between"><dt class="text-gray-600 dark:text-gray-400">Subtotal</dt><dd class="font-medium tabular-nums text-gray-900 dark:text-gray-100">$64.00</dd></div>
      <div class="flex justify-between"><dt class="text-gray-600 dark:text-gray-400">Tax</dt><dd class="font-medium tabular-nums text-gray-900 dark:text-gray-100">$5.12</dd></div>
      <div class="flex justify-between"><dt class="text-gray-600 dark:text-gray-400">Shipping</dt><dd class="font-medium tabular-nums text-gray-900 dark:text-gray-100">$6.00</dd></div>
      <div class="flex justify-between border-t border-gray-200 pt-2 text-base dark:border-gray-800"><dt class="font-semibold text-gray-900 dark:text-gray-100">Total</dt><dd class="font-bold tabular-nums text-gray-900 dark:text-gray-100">$75.12</dd></div>
    </dl>
    <a href="#" class="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Checkout</a>
  </aside>
</div>`,
      react: `function formatMoney(cents, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartWithSummary({ items, currency = '$', taxRate = 0, shippingCents = 0, className = '' }) {
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax + shippingCents;

  return (
    <div className={\`mx-auto grid w-full max-w-5xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_18rem] \${className}\`}>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((it) => (
          <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
            <div className={\`h-16 w-16 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
            <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p></div>
            <div className="text-sm font-semibold tabular-nums text-gray-900 sm:w-20 sm:text-right dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</dd></div>
          {taxRate > 0 ? <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Tax</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(tax, currency)}</dd></div> : null}
          <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Shipping</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(shippingCents, currency)}</dd></div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base dark:border-gray-800"><dt className="font-semibold text-gray-900 dark:text-gray-100">Total</dt><dd className="font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(total, currency)}</dd></div>
        </dl>
        <a href="#" className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Checkout</a>
      </aside>
    </div>
  );
}`,
      typescript: `export interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

export interface CartWithSummaryProps {
  items: CartLine[];
  currency?: string;
  /** Fraction, e.g. 0.08 for 8%. The Tax row hides when this is 0. */
  taxRate?: number;
  shippingCents?: number;
  className?: string;
}

function formatMoney(cents: number, currency = '$'): string {
  return currency + (cents / 100).toFixed(2);
}

export function CartWithSummary({
  items,
  currency = '$',
  taxRate = 0,
  shippingCents = 0,
  className = '',
}: CartWithSummaryProps): JSX.Element {
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax + shippingCents;

  return (
    <div className={\`mx-auto grid w-full max-w-5xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_18rem] \${className}\`}>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((it) => (
          <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
            <div className={\`h-16 w-16 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
            <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p></div>
            <div className="text-sm font-semibold tabular-nums text-gray-900 sm:w-20 sm:text-right dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</dd></div>
          {taxRate > 0 ? <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Tax</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(tax, currency)}</dd></div> : null}
          <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Shipping</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(shippingCents, currency)}</dd></div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base dark:border-gray-800"><dt className="font-semibold text-gray-900 dark:text-gray-100">Total</dt><dd className="font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(total, currency)}</dd></div>
        </dl>
        <a href="#" className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Checkout</a>
      </aside>
    </div>
  );
}`,
    },
  },
  {
    slug: 'cart-quantity-steppers',
    category: 'cart',
    tags: ['cart', 'quantity', 'stepper', 'interactive', 'subtotal'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'interactive', labelKey: 'interactive' },
    ],
    props: [
      { name: 'items', type: 'CartLine[]', required: true, descriptionKey: 'items' },
      { name: 'currency', type: 'string', default: "'$'", descriptionKey: 'currency' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Static markup for one stepper row. The minus/plus are real <button>s with
  aria-labels; the live quantity is an aria-live="polite" span so a screen
  reader hears the new value after each press. Wire the state in the React tab -
  Tailwind alone cannot recompute the subtotal.
-->
<div class="mx-auto w-full max-w-2xl">
  <div class="flex flex-col gap-3 border-b border-gray-100 py-4 sm:flex-row sm:items-center dark:border-gray-800">
    <div class="h-16 w-16 flex-none rounded-lg bg-gradient-to-br from-amber-400 to-orange-500" aria-hidden="true"></div>
    <div class="min-w-0 flex-1"><p class="text-sm font-medium text-gray-900 dark:text-gray-100">Canvas Tote</p><p class="text-xs text-gray-500 dark:text-gray-400">$24.00 each</p></div>
    <div class="flex items-center justify-between gap-4 sm:justify-end">
      <div class="inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
        <button type="button" class="flex h-9 w-9 items-center justify-center rounded-l-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800" aria-label="Decrease quantity of Canvas Tote">-</button>
        <span class="w-10 text-center text-sm font-medium tabular-nums text-gray-900 dark:text-gray-100" aria-live="polite">2</span>
        <button type="button" class="flex h-9 w-9 items-center justify-center rounded-r-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800" aria-label="Increase quantity of Canvas Tote">+</button>
      </div>
      <span class="w-20 text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">$48.00</span>
    </div>
  </div>

  <div class="flex items-center justify-between px-1 pt-4 text-sm">
    <span class="font-medium text-gray-600 dark:text-gray-400">Subtotal</span>
    <span class="text-base font-bold tabular-nums text-gray-900 dark:text-gray-100">$48.00</span>
  </div>
</div>`,
      react: `import { useState } from 'react';

function formatMoney(cents, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartQuantitySteppers({ items, currency = '$', className = '' }) {
  const [qty, setQty] = useState(() => Object.fromEntries(items.map((it) => [it.id, it.qty])));
  const setQtyFor = (id, next) => setQty((prev) => ({ ...prev, [id]: Math.max(1, next) }));
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * (qty[it.id] ?? it.qty), 0);

  return (
    <div className={\`mx-auto w-full max-w-2xl \${className}\`}>
      {items.map((it) => {
        const q = qty[it.id] ?? it.qty;
        return (
          <div key={it.id} className="flex flex-col gap-3 border-b border-gray-100 py-4 sm:flex-row sm:items-center dark:border-gray-800">
            <div className={\`h-16 w-16 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
            <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{formatMoney(it.priceCents, currency)} each</p></div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
                <button type="button" onClick={() => setQtyFor(it.id, q - 1)} className="flex h-9 w-9 items-center justify-center rounded-l-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800" aria-label={\`Decrease quantity of \${it.name}\`}>-</button>
                <span className="w-10 text-center text-sm font-medium tabular-nums text-gray-900 dark:text-gray-100" aria-live="polite">{q}</span>
                <button type="button" onClick={() => setQtyFor(it.id, q + 1)} className="flex h-9 w-9 items-center justify-center rounded-r-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800" aria-label={\`Increase quantity of \${it.name}\`}>+</button>
              </div>
              <span className="w-20 text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(it.priceCents * q, currency)}</span>
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between px-1 pt-4 text-sm">
        <span className="font-medium text-gray-600 dark:text-gray-400">Subtotal</span>
        <span className="text-base font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</span>
      </div>
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

export interface CartQuantitySteppersProps {
  items: CartLine[];
  currency?: string;
  className?: string;
}

function formatMoney(cents: number, currency = '$'): string {
  return currency + (cents / 100).toFixed(2);
}

export function CartQuantitySteppers({
  items,
  currency = '$',
  className = '',
}: CartQuantitySteppersProps): JSX.Element {
  const [qty, setQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(items.map((it) => [it.id, it.qty])),
  );
  const setQtyFor = (id: string, next: number) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(1, next) }));
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * (qty[it.id] ?? it.qty), 0);

  return (
    <div className={\`mx-auto w-full max-w-2xl \${className}\`}>
      {items.map((it) => {
        const q = qty[it.id] ?? it.qty;
        return (
          <div key={it.id} className="flex flex-col gap-3 border-b border-gray-100 py-4 sm:flex-row sm:items-center dark:border-gray-800">
            <div className={\`h-16 w-16 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
            <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{formatMoney(it.priceCents, currency)} each</p></div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
                <button type="button" onClick={() => setQtyFor(it.id, q - 1)} className="flex h-9 w-9 items-center justify-center rounded-l-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800" aria-label={\`Decrease quantity of \${it.name}\`}>-</button>
                <span className="w-10 text-center text-sm font-medium tabular-nums text-gray-900 dark:text-gray-100" aria-live="polite">{q}</span>
                <button type="button" onClick={() => setQtyFor(it.id, q + 1)} className="flex h-9 w-9 items-center justify-center rounded-r-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800" aria-label={\`Increase quantity of \${it.name}\`}>+</button>
              </div>
              <span className="w-20 text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(it.priceCents * q, currency)}</span>
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between px-1 pt-4 text-sm">
        <span className="font-medium text-gray-600 dark:text-gray-400">Subtotal</span>
        <span className="text-base font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</span>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'cart-promo-code',
    category: 'cart',
    tags: ['cart', 'promo', 'coupon', 'discount', 'form'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'applied', labelKey: 'applied' },
    ],
    props: [
      { name: 'subtotalCents', type: 'number', required: true, descriptionKey: 'subtotalCents' },
      { name: 'currency', type: 'string', default: "'$'", descriptionKey: 'currency' },
      { name: 'codes', type: 'Record<string, number>', descriptionKey: 'codes' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A real <form> with a real <label> (sr-only, not absent - a placeholder is not
  a name). The field and Apply button stack below sm: because a 90px promo field
  is a rumour. The status line is aria-live so the accept/reject message is
  announced, not just shown. Wire the discount math in the React tab.
-->
<form class="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <label for="promo" class="sr-only">Promo code</label>
  <div class="flex flex-col gap-2 sm:flex-row">
    <input id="promo" name="promo" type="text" placeholder="Enter promo code" class="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
    <button type="submit" class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white dark:focus-visible:ring-offset-gray-900">Apply</button>
  </div>
  <p class="mt-3 text-sm text-emerald-600 dark:text-emerald-400" aria-live="polite">Code SAVE10 applied - you saved $12.00.</p>

  <dl class="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
    <div class="flex justify-between"><dt class="text-gray-600 dark:text-gray-400">Subtotal</dt><dd class="tabular-nums text-gray-900 dark:text-gray-100">$120.00</dd></div>
    <div class="flex justify-between"><dt class="text-gray-600 dark:text-gray-400">Discount</dt><dd class="tabular-nums text-emerald-600 dark:text-emerald-400">-$12.00</dd></div>
    <div class="flex justify-between border-t border-gray-100 pt-1.5 text-base font-semibold dark:border-gray-800"><dt class="text-gray-900 dark:text-gray-100">Total</dt><dd class="tabular-nums text-gray-900 dark:text-gray-100">$108.00</dd></div>
  </dl>
</form>`,
      react: `import { useState } from 'react';

function formatMoney(cents, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartPromoCode({ subtotalCents, currency = '$', codes = { SAVE10: 0.1 }, className = '' }) {
  const [value, setValue] = useState('');
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState('');

  const apply = (e) => {
    e.preventDefault();
    const key = value.trim().toUpperCase();
    const rate = codes[key];
    if (rate === undefined) {
      setApplied(null);
      setError('That code is not valid.');
      return;
    }
    setError('');
    setApplied({ code: key, amount: Math.round(subtotalCents * rate) });
  };

  const discount = applied ? applied.amount : 0;
  const total = subtotalCents - discount;

  return (
    <form onSubmit={apply} className={\`mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <label htmlFor="promo" className="sr-only">Promo code</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input id="promo" name="promo" type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter promo code" className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
        <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white dark:focus-visible:ring-offset-gray-900">Apply</button>
      </div>

      <p className="mt-3 text-sm" aria-live="polite">
        {applied ? <span className="text-emerald-600 dark:text-emerald-400">Code {applied.code} applied - you saved {formatMoney(applied.amount, currency)}.</span> : null}
        {error ? <span className="text-red-600 dark:text-red-400">{error}</span> : null}
      </p>

      <dl className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
        <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotalCents, currency)}</dd></div>
        {discount > 0 ? <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Discount</dt><dd className="tabular-nums text-emerald-600 dark:text-emerald-400">-{formatMoney(discount, currency)}</dd></div> : null}
        <div className="flex justify-between border-t border-gray-100 pt-1.5 text-base font-semibold dark:border-gray-800"><dt className="text-gray-900 dark:text-gray-100">Total</dt><dd className="tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(total, currency)}</dd></div>
      </dl>
    </form>
  );
}`,
      typescript: `import { useState } from 'react';

export interface CartPromoCodeProps {
  subtotalCents: number;
  currency?: string;
  /** Map of upper-case code to discount fraction, e.g. { SAVE10: 0.1 }. */
  codes?: Record<string, number>;
  className?: string;
}

interface AppliedCode {
  code: string;
  amount: number;
}

function formatMoney(cents: number, currency = '$'): string {
  return currency + (cents / 100).toFixed(2);
}

export function CartPromoCode({
  subtotalCents,
  currency = '$',
  codes = { SAVE10: 0.1 },
  className = '',
}: CartPromoCodeProps): JSX.Element {
  const [value, setValue] = useState('');
  const [applied, setApplied] = useState<AppliedCode | null>(null);
  const [error, setError] = useState('');

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    const key = value.trim().toUpperCase();
    const rate = codes[key];
    if (rate === undefined) {
      setApplied(null);
      setError('That code is not valid.');
      return;
    }
    setError('');
    setApplied({ code: key, amount: Math.round(subtotalCents * rate) });
  };

  const discount = applied ? applied.amount : 0;
  const total = subtotalCents - discount;

  return (
    <form onSubmit={apply} className={\`mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <label htmlFor="promo" className="sr-only">Promo code</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input id="promo" name="promo" type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter promo code" className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
        <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white dark:focus-visible:ring-offset-gray-900">Apply</button>
      </div>

      <p className="mt-3 text-sm" aria-live="polite">
        {applied ? <span className="text-emerald-600 dark:text-emerald-400">Code {applied.code} applied - you saved {formatMoney(applied.amount, currency)}.</span> : null}
        {error ? <span className="text-red-600 dark:text-red-400">{error}</span> : null}
      </p>

      <dl className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
        <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotalCents, currency)}</dd></div>
        {discount > 0 ? <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Discount</dt><dd className="tabular-nums text-emerald-600 dark:text-emerald-400">-{formatMoney(discount, currency)}</dd></div> : null}
        <div className="flex justify-between border-t border-gray-100 pt-1.5 text-base font-semibold dark:border-gray-800"><dt className="text-gray-900 dark:text-gray-100">Total</dt><dd className="tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(total, currency)}</dd></div>
      </dl>
    </form>
  );
}`,
    },
  },
  {
    slug: 'cart-saved-for-later',
    category: 'cart',
    tags: ['cart', 'saved', 'wishlist', 'move', 'ecommerce'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'interactive', labelKey: 'interactive' },
    ],
    props: [
      { name: 'cartItems', type: 'CartLine[]', required: true, descriptionKey: 'cartItems' },
      { name: 'savedItems', type: 'CartLine[]', required: true, descriptionKey: 'savedItems' },
      { name: 'currency', type: 'string', default: "'$'", descriptionKey: 'currency' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Two lists - in-cart and saved-for-later - each row moving to the other on a
  real <button> press. The move buttons carry aria-labels naming the product and
  direction, and each list has its own labelled heading so the two regions are
  distinct to a screen reader.
-->
<div class="mx-auto w-full max-w-2xl space-y-8">
  <section aria-labelledby="cart-h">
    <h2 id="cart-h" class="text-sm font-semibold text-gray-900 dark:text-gray-100">In your cart (1)</h2>
    <ul class="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
      <li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <div class="h-14 w-14 flex-none rounded-lg bg-gradient-to-br from-lime-400 to-emerald-500" aria-hidden="true"></div>
        <div class="min-w-0 flex-1"><p class="text-sm font-medium text-gray-900 dark:text-gray-100">Trail Bottle</p><p class="text-xs text-gray-500 dark:text-gray-400">$22.00</p></div>
        <button type="button" class="self-start rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:self-auto dark:text-blue-400 dark:hover:bg-blue-950" aria-label="Save Trail Bottle for later">Save for later</button>
      </li>
    </ul>
  </section>

  <section aria-labelledby="saved-h">
    <h2 id="saved-h" class="text-sm font-semibold text-gray-900 dark:text-gray-100">Saved for later (1)</h2>
    <ul class="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
      <li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <div class="h-14 w-14 flex-none rounded-lg bg-gradient-to-br from-violet-400 to-fuchsia-500" aria-hidden="true"></div>
        <div class="min-w-0 flex-1"><p class="text-sm font-medium text-gray-900 dark:text-gray-100">Wool Beanie</p><p class="text-xs text-gray-500 dark:text-gray-400">$28.00</p></div>
        <button type="button" class="self-start rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:self-auto dark:text-blue-400 dark:hover:bg-blue-950" aria-label="Move Wool Beanie to cart">Move to cart</button>
      </li>
    </ul>
  </section>
</div>`,
      react: `import { useState } from 'react';

function formatMoney(cents, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartSavedForLater({ cartItems, savedItems, currency = '$', className = '' }) {
  const [cart, setCart] = useState(cartItems);
  const [saved, setSaved] = useState(savedItems);

  const save = (id) => {
    const item = cart.find((it) => it.id === id);
    if (!item) return;
    setCart((c) => c.filter((it) => it.id !== id));
    setSaved((s) => [item, ...s]);
  };
  const restore = (id) => {
    const item = saved.find((it) => it.id === id);
    if (!item) return;
    setSaved((s) => s.filter((it) => it.id !== id));
    setCart((c) => [item, ...c]);
  };

  return (
    <div className={\`mx-auto w-full max-w-2xl space-y-8 \${className}\`}>
      <section aria-labelledby="cart-h">
        <h2 id="cart-h" className="text-sm font-semibold text-gray-900 dark:text-gray-100">In your cart ({cart.length})</h2>
        <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
          {cart.map((it) => (
            <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <div className={\`h-14 w-14 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{formatMoney(it.priceCents, currency)}</p></div>
              <button type="button" onClick={() => save(it.id)} className="self-start rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:self-auto dark:text-blue-400 dark:hover:bg-blue-950" aria-label={\`Save \${it.name} for later\`}>Save for later</button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="saved-h">
        <h2 id="saved-h" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Saved for later ({saved.length})</h2>
        <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
          {saved.map((it) => (
            <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <div className={\`h-14 w-14 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{formatMoney(it.priceCents, currency)}</p></div>
              <button type="button" onClick={() => restore(it.id)} className="self-start rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:self-auto dark:text-blue-400 dark:hover:bg-blue-950" aria-label={\`Move \${it.name} to cart\`}>Move to cart</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

export interface CartSavedForLaterProps {
  cartItems: CartLine[];
  savedItems: CartLine[];
  currency?: string;
  className?: string;
}

function formatMoney(cents: number, currency = '$'): string {
  return currency + (cents / 100).toFixed(2);
}

export function CartSavedForLater({
  cartItems,
  savedItems,
  currency = '$',
  className = '',
}: CartSavedForLaterProps): JSX.Element {
  const [cart, setCart] = useState<CartLine[]>(cartItems);
  const [saved, setSaved] = useState<CartLine[]>(savedItems);

  const save = (id: string) => {
    const item = cart.find((it) => it.id === id);
    if (!item) return;
    setCart((c) => c.filter((it) => it.id !== id));
    setSaved((s) => [item, ...s]);
  };
  const restore = (id: string) => {
    const item = saved.find((it) => it.id === id);
    if (!item) return;
    setSaved((s) => s.filter((it) => it.id !== id));
    setCart((c) => [item, ...c]);
  };

  return (
    <div className={\`mx-auto w-full max-w-2xl space-y-8 \${className}\`}>
      <section aria-labelledby="cart-h">
        <h2 id="cart-h" className="text-sm font-semibold text-gray-900 dark:text-gray-100">In your cart ({cart.length})</h2>
        <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
          {cart.map((it) => (
            <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <div className={\`h-14 w-14 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{formatMoney(it.priceCents, currency)}</p></div>
              <button type="button" onClick={() => save(it.id)} className="self-start rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:self-auto dark:text-blue-400 dark:hover:bg-blue-950" aria-label={\`Save \${it.name} for later\`}>Save for later</button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="saved-h">
        <h2 id="saved-h" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Saved for later ({saved.length})</h2>
        <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
          {saved.map((it) => (
            <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <div className={\`h-14 w-14 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{formatMoney(it.priceCents, currency)}</p></div>
              <button type="button" onClick={() => restore(it.id)} className="self-start rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:self-auto dark:text-blue-400 dark:hover:bg-blue-950" aria-label={\`Move \${it.name} to cart\`}>Move to cart</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}`,
    },
  },
  {
    slug: 'cart-sticky-summary',
    category: 'cart',
    tags: ['cart', 'sticky', 'summary', 'scroll', 'ecommerce'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'CartLine[]', required: true, descriptionKey: 'items' },
      { name: 'currency', type: 'string', default: "'$'", descriptionKey: 'currency' },
      { name: 'shippingCents', type: 'number', default: '0', descriptionKey: 'shippingCents' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The summary uses position: sticky (top-4) so it trails the items as a long list
  scrolls on desktop - but sticky only bites inside a scroll context taller than
  the sidebar, and only once the columns are side-by-side (lg:). On mobile the
  grid is one column and the summary is simply the last block, no stickiness.
-->
<div class="mx-auto grid w-full max-w-5xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_18rem]">
  <ul class="divide-y divide-gray-100 dark:divide-gray-800">
    <li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
      <div class="h-16 w-16 flex-none rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500" aria-hidden="true"></div>
      <div class="min-w-0 flex-1"><p class="text-sm font-medium text-gray-900 dark:text-gray-100">Merino Sweater</p><p class="text-xs text-gray-500 dark:text-gray-400">Qty 1</p></div>
      <div class="text-sm font-semibold tabular-nums text-gray-900 sm:w-20 sm:text-right dark:text-gray-100">$98.00</div>
    </li>
  </ul>

  <aside class="lg:sticky lg:top-4 h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Summary</h2>
    <dl class="mt-4 space-y-2 text-sm">
      <div class="flex justify-between"><dt class="text-gray-600 dark:text-gray-400">Subtotal</dt><dd class="font-medium tabular-nums text-gray-900 dark:text-gray-100">$98.00</dd></div>
      <div class="flex justify-between"><dt class="text-gray-600 dark:text-gray-400">Shipping</dt><dd class="font-medium tabular-nums text-gray-900 dark:text-gray-100">$0.00</dd></div>
      <div class="flex justify-between border-t border-gray-200 pt-2 text-base dark:border-gray-800"><dt class="font-semibold text-gray-900 dark:text-gray-100">Total</dt><dd class="font-bold tabular-nums text-gray-900 dark:text-gray-100">$98.00</dd></div>
    </dl>
    <a href="#" class="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Checkout</a>
  </aside>
</div>`,
      react: `function formatMoney(cents, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartStickySummary({ items, currency = '$', shippingCents = 0, className = '' }) {
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);
  const total = subtotal + shippingCents;

  return (
    <div className={\`mx-auto grid w-full max-w-5xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_18rem] \${className}\`}>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((it) => (
          <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
            <div className={\`h-16 w-16 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
            <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p></div>
            <div className="text-sm font-semibold tabular-nums text-gray-900 sm:w-20 sm:text-right dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 lg:sticky lg:top-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Shipping</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(shippingCents, currency)}</dd></div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base dark:border-gray-800"><dt className="font-semibold text-gray-900 dark:text-gray-100">Total</dt><dd className="font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(total, currency)}</dd></div>
        </dl>
        <a href="#" className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Checkout</a>
      </aside>
    </div>
  );
}`,
      typescript: `export interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

export interface CartStickySummaryProps {
  items: CartLine[];
  currency?: string;
  shippingCents?: number;
  className?: string;
}

function formatMoney(cents: number, currency = '$'): string {
  return currency + (cents / 100).toFixed(2);
}

export function CartStickySummary({
  items,
  currency = '$',
  shippingCents = 0,
  className = '',
}: CartStickySummaryProps): JSX.Element {
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);
  const total = subtotal + shippingCents;

  return (
    <div className={\`mx-auto grid w-full max-w-5xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_18rem] \${className}\`}>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((it) => (
          <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
            <div className={\`h-16 w-16 flex-none rounded-lg bg-gradient-to-br \${it.tint}\`} aria-hidden="true" />
            <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p></div>
            <div className="text-sm font-semibold tabular-nums text-gray-900 sm:w-20 sm:text-right dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 lg:sticky lg:top-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Shipping</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(shippingCents, currency)}</dd></div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base dark:border-gray-800"><dt className="font-semibold text-gray-900 dark:text-gray-100">Total</dt><dd className="font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(total, currency)}</dd></div>
        </dl>
        <a href="#" className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Checkout</a>
      </aside>
    </div>
  );
}`,
    },
  },
];
