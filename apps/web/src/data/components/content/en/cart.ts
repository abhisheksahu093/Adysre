import type { ComponentContentMap } from '../types';

/** English prose for the cart category. Keys are component slugs. */
export const cartContent: ComponentContentMap = {
  'cart-drawer-side': {
    title: 'Slide-over Cart Drawer',
    description:
      'A right-anchored cart panel over a dimmed backdrop, with line items, a subtotal and a checkout button.',
    customization:
      'The panel is scoped to its own relative container in this demo rather than fixed to the viewport - swap the wrapper for a fixed overlay and move focus into the panel on open for production. Feed `items` and the count, subtotal and prices are all derived; the backdrop is a real `<button>` so a keypress closes it too.',
    seoTitle: 'Slide-over Shopping Cart Drawer - Free Tailwind Component',
    seoDescription:
      'A slide-over cart drawer with gradient thumbnails, a derived subtotal and an accessible close control, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['cart drawer', 'slide-over cart', 'off-canvas cart', 'mini cart panel'],
  },
  'cart-full-page': {
    title: 'Full-page Cart',
    description:
      'A two-column cart page with line items and an order summary that drops below the items on mobile.',
    customization:
      'The summary is second in the DOM, so on a phone it lands under the items with no `order-` override. Subtotal and total are computed from `items` and `shippingCents` - there is no second hardcoded number to drift. Rows stack below `sm:` because a thumbnail, name and price cannot share a 320px line.',
    seoTitle: 'Full-page Shopping Cart - Free Tailwind CSS Component',
    seoDescription:
      'A responsive full-page cart with line items and an order-summary sidebar, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['cart page', 'shopping cart page', 'cart with summary', 'ecommerce cart'],
  },
  'cart-line-items': {
    title: 'Cart Line Items',
    description:
      'The reusable core: an accessible list of cart rows with gradient thumbnails and per-row remove buttons.',
    customization:
      'This is the row every other cart in the set builds on. Each Remove is a real `<button>` whose `aria-label` names the product, so the icon-only control is never a nameless "button". Wire `onRemove` to your store; the row stacks at 320px and becomes horizontal from `sm:` up.',
    seoTitle: 'Cart Line Items List - Free Tailwind CSS Component',
    seoDescription:
      'An accessible cart line-item list with gradient thumbnails and labelled remove buttons, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['cart line items', 'cart list', 'cart rows', 'remove from cart'],
  },
  'cart-empty-state': {
    title: 'Empty Cart State',
    description:
      'A centred empty-cart placeholder with a decorative icon, a message and a start-shopping CTA.',
    customization:
      'The cart glyph is `aria-hidden` because the heading already says "empty" - announcing the icon would be noise. Everything but the title is a prop, and the CTA is a real link so it works with keyboard and middle-click. Show this when the item list is empty.',
    seoTitle: 'Empty Cart State - Free Tailwind CSS Component',
    seoDescription:
      'An accessible empty shopping-cart placeholder with an icon, message and CTA, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['empty cart', 'empty state', 'cart placeholder', 'no items cart'],
  },
  'cart-mini-dropdown': {
    title: 'Mini Cart Dropdown',
    description:
      'A header cart button with a count badge that opens a compact dropdown of items and a subtotal.',
    customization:
      'The trigger carries `aria-haspopup` and `aria-expanded`, and the count is folded into its `aria-label` so a reader hears "Cart, 3 items" rather than the bare badge number. The panel is capped to `calc(100vw-2rem)` so it never bleeds off a 320px screen; count and subtotal are derived from `items`.',
    seoTitle: 'Mini Cart Dropdown - Free Tailwind CSS Component',
    seoDescription:
      'A header mini-cart dropdown with a count badge and derived subtotal, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['mini cart', 'cart dropdown', 'header cart', 'cart popover'],
  },
  'cart-with-summary': {
    title: 'Cart With Order Summary',
    description:
      'Line items beside an order-summary sidebar whose subtotal, tax and total are all derived from the items.',
    customization:
      'Every figure in the summary is computed - subtotal from the items, tax from `taxRate`, total from both plus `shippingCents` - so nothing can drift out of sync with the list, and the Tax row hides itself when the rate is 0. The sidebar sits beside the items from `lg:` up and drops below them on smaller screens.',
    seoTitle: 'Cart With Order Summary - Free Tailwind CSS Component',
    seoDescription:
      'A cart with an order-summary sidebar computing subtotal, tax and total, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['cart summary', 'order summary', 'cart totals', 'cart sidebar'],
  },
  'cart-quantity-steppers': {
    title: 'Cart Quantity Steppers',
    description:
      'Cart rows with working minus/plus quantity steppers that recompute each line and the subtotal live.',
    customization:
      'The steppers are real `<button>`s with `aria-label`s and the quantity is an `aria-live` span, so a screen reader hears each new value; quantity is clamped to a minimum of 1. State lives in the component - the line total and the subtotal both recompute from it, so the numbers can never lie.',
    seoTitle: 'Cart Quantity Steppers - Free React Component',
    seoDescription:
      'Interactive cart rows with plus/minus quantity steppers and a live subtotal, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['quantity stepper', 'cart quantity', 'quantity selector', 'live subtotal'],
  },
  'cart-promo-code': {
    title: 'Cart Promo Code',
    description:
      'An apply-code form that validates against a code map and shows the discount and new total live.',
    customization:
      'A real `<form>` with an `sr-only` label - a placeholder is not a name. Pass a `codes` map of upper-case code to discount fraction; a valid entry shows the saved amount and recomputes the total, an invalid one shows an error, both through an `aria-live` status line. The field and Apply button stack below `sm:`.',
    seoTitle: 'Cart Promo Code Field - Free React Component',
    seoDescription:
      'An accessible promo-code form that validates a coupon and updates the total, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['promo code', 'coupon field', 'discount code', 'apply coupon'],
  },
  'cart-saved-for-later': {
    title: 'Saved For Later',
    description:
      'Two lists - in-cart and saved-for-later - with each row moving to the other on a labelled button press.',
    customization:
      'Feed `cartItems` and `savedItems`; the component holds both lists in state and moves an item between them on click. Each move button names the product and direction in its `aria-label`, and each list is its own labelled `<section>` so the two regions stay distinct to a screen reader.',
    seoTitle: 'Save For Later Cart - Free React Component',
    seoDescription:
      'A cart with a save-for-later shelf and items that move between the two lists, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['save for later', 'cart wishlist', 'move to cart', 'saved items'],
  },
  'cart-sticky-summary': {
    title: 'Cart Sticky Summary',
    description:
      'A cart whose order-summary sidebar sticks in view as a long list of items scrolls on desktop.',
    customization:
      'The sidebar uses `lg:sticky lg:top-4`, so it trails the items only once the columns are side by side and the list is tall enough to scroll; on mobile the grid is one column and the summary is simply the last block. Subtotal and total derive from `items` and `shippingCents`.',
    seoTitle: 'Cart Sticky Summary - Free Tailwind CSS Component',
    seoDescription:
      'A cart with a position-sticky order summary that follows a scrolling item list, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['sticky summary', 'sticky cart', 'sticky sidebar', 'cart totals'],
  },
};
