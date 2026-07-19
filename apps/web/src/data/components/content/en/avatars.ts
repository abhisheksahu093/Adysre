import type { ComponentContentMap } from '../types';

/** English prose for the avatars category. Keys are component slugs. */
export const avatarsContent: ComponentContentMap = {
  'avatar-initials-basic': {
    title: 'Initials Avatar',
    description:
      'Initials on a colour computed from the name - the same person gets the same colour on every page, with no image involved.',
    customization:
      'The hash is for stability, not security: it only exists so "Ada Lovelace" lands on the same swatch everywhere she appears instead of a random one per render, which also means it is safe in Server Components - same input, same output, no hydration mismatch. Extend `FILLS` freely, but keep every entry one complete class string: Tailwind’s scanner only keeps classes it can read verbatim in the source, so `bg-…` assembled from fragments silently produces an unstyled avatar. The aria is the mirror image of an `<img>`: `role="img"` + `aria-label` on the wrapper make it announce as the person, and the initials are `aria-hidden` because "A L" spelled out is noise, not a name. If you add swatches, check the text colour against each fill - `amber-500` is the one in the default set that needs dark text to clear AA.',
    seoTitle: 'Initials Avatar with Deterministic Colors - Free Tailwind Component',
    seoDescription:
      'An initials avatar that derives a stable background colour from the user’s name. No images, accessible labelling, in Tailwind, React, Next.js and TypeScript.',
    keywords: [
      'initials avatar',
      'avatar without image',
      'deterministic avatar color',
      'tailwind avatar',
      'letter avatar',
    ],
  },
  'avatar-sizes-scale': {
    title: 'Avatar Size Scale',
    description:
      'One avatar, six sizes - xs through 2xl, with the type scaling in step with the box.',
    customization:
      'The whole point is that one prop drives both dimensions and the font. The two failure modes of an ad-hoc avatar scale are `text-sm` floating lost inside an `h-16` disc and `text-base` clipping out of an `h-6` one - keeping the pair welded in the `SIZES` record makes either impossible. Add sizes by adding entries, not by overriding `h-*` from outside; `className` is for margins and positioning, not for fighting the scale. The `xs` step uses a bracketed `text-[10px]` because Tailwind’s type scale simply stops above that ratio. In dense lists prefer `sm`, and treat `xl`/`2xl` as profile-page sizes - at 64px initials start wanting a real photograph.',
    seoTitle: 'Avatar Size Scale (xs to 2xl) - Free Tailwind CSS Component',
    seoDescription:
      'A six-step avatar sizing system from 24px to 64px with matched font sizes, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['avatar sizes', 'avatar scale', 'tailwind avatar sizes', 'avatar sizing system'],
  },
  'avatar-squared': {
    title: 'Squared Avatar',
    description:
      'A rounded-square avatar for teams, workspaces and projects, with a circle opt-out for people.',
    customization:
      'The shape is semantics, not taste: across most modern products circles read as *people* and rounded squares read as *things* - organisations, workspaces, bots. Keeping both behind one `shape` prop lets a member list show an org and its owner side by side and still be scannable. `rounded-xl` is the sweet spot at 40px; if you grow the avatar, grow the radius with it or the corners start looking sharp at 64px. The gradient fill is a single fixed pair here - if you want per-entity colour, lift the deterministic hash from `avatar-initials-basic`; the two compose cleanly.',
    seoTitle: 'Squared Avatar for Teams & Workspaces - Free Tailwind Component',
    seoDescription:
      'A rounded-square avatar with a circle variant, for distinguishing organisations from people. Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['squared avatar', 'rounded avatar', 'workspace avatar', 'team avatar shape'],
  },
  'avatar-status-dot': {
    title: 'Avatar with Status Dot',
    description:
      'An avatar with a presence dot - online, away or offline - that says its status in words as well as colour.',
    customization:
      'Colour alone is not information: a green and a grey dot are the same dot to plenty of eyes, so the `sr-only` text inside the dot is the accessible half of the indicator, and dot colour and label live in one `STATUS` record precisely so they cannot drift apart - a dot whose text says "Away" under green is worse than no dot. The `ring-2` around the dot must match the page surface (`ring-white dark:ring-gray-950`); it is what cuts the dot out of the avatar’s own pixels, so if your avatars sit on a card, retune the ring to the card colour. If presence updates live, consider announcing changes with a polite live region at the list level rather than per avatar - fifty dots flipping at once should not produce fifty announcements.',
    seoTitle: 'Avatar with Online Status Indicator - Free Tailwind Component',
    seoDescription:
      'An accessible presence avatar with online, away and offline dots plus screen-reader text, in HTML, CSS, Tailwind, React and TypeScript.',
    keywords: [
      'avatar status dot',
      'online indicator',
      'presence avatar',
      'status badge avatar',
      'online offline avatar',
    ],
  },
  'avatar-badge-count': {
    title: 'Avatar with Notification Badge',
    description:
      'An avatar with a corner count badge that caps visually at 9+ but tells screen readers the real number.',
    customization:
      'Two decisions carry the component. First, `min-w` plus horizontal padding instead of a fixed width: "3" renders as a circle, "9+" stretches into a pill, and nothing ever squeezes. Second, the cap is visual only - the visible number is `aria-hidden` and the `sr-only` sentence carries the uncapped count, because "9+" is a layout decision, not information. Zero renders no badge at all rather than an empty dot; if your design wants a mute-style indicator at zero, that is a different state, not this badge with no number. The `ring-2` must match whatever surface the avatar sits on, same as the status dot. Raise `max` to 99 for inbox-style counts, and keep the badge red only if red means "needs you" in your system - recolour via the class, not by stacking another meaning onto rose-600.',
    seoTitle: 'Avatar with Notification Count Badge - Free Tailwind Component',
    seoDescription:
      'An avatar with an accessible unread-count badge that caps at 9+ visually while exposing the true count to screen readers. Tailwind, React, TypeScript.',
    keywords: [
      'avatar badge',
      'notification count avatar',
      'unread badge',
      'avatar with counter',
    ],
  },
  'avatar-group-stack': {
    title: 'Avatar Group Stack',
    description:
      'Overlapping avatars with a +N chip for the remainder - the classic "who’s on this" cluster.',
    customization:
      'The `ring-2` is structural, not decorative: it renders in the page colour and is what cuts each face out of the one beneath - remove it and the overlap collapses into one blurry blob. That also means it must match the surface: on a gray-50 card, retune both `ring-white` and the dark variant or every avatar grows a visible halo. `-space-x-2` sets the overlap depth; deeper than `-space-x-3` at 40px and the initials start being eaten. The group is one announced unit (`role="group"` with a people count) and the +N chip renders the honest remainder with `sr-only` words. Keys are the names themselves, which assumes names are unique within one stack - pass IDs and key on those if yours are not. If the stack should expand on click, wrap it in a button and reuse the `aria-expanded` pattern from `avatar-menu-trigger`.',
    seoTitle: 'Overlapping Avatar Group with +N Overflow - Free Tailwind Component',
    seoDescription:
      'A stacked avatar group with deterministic colours, page-colour separation rings and an accessible +N overflow chip. Tailwind, React, Next.js, TypeScript.',
    keywords: [
      'avatar group',
      'avatar stack',
      'overlapping avatars',
      'facepile',
      'team avatars',
    ],
  },
  'avatar-ring-story': {
    title: 'Story Ring Avatar',
    description:
      'An avatar inside an Instagram-style gradient ring that greys out once the story is seen.',
    customization:
      'The construction is three nested circles: gradient ring, page-colour gap, face - and the gap is the part people skip. It is a padded span painted in the page background (`bg-white dark:bg-gray-950`), because a transparent border would let the gradient bleed to the avatar’s edge and the ring stops reading as a ring; on a non-page surface, repaint the gap to match. Ring thickness is the two `p-[2px]` values - scale them together with the avatar. Unseen-versus-seen is a colour difference only, so the state also rides the `aria-label` in words ("new story"); keep that in sync if you rename states. This renders as a `span` on purpose - stories are usually tappable, so wrap it in your own `<button>` or link with a real focus ring rather than baking a click handler into the display component.',
    seoTitle: 'Gradient Story Ring Avatar - Free Tailwind CSS Component',
    seoDescription:
      'An Instagram-style avatar with a gradient story ring, a seen state and accessible state labelling, in Tailwind, React and TypeScript.',
    keywords: [
      'story ring avatar',
      'gradient ring avatar',
      'instagram story circle',
      'avatar ring',
    ],
  },
  'avatar-with-name-role': {
    title: 'Avatar with Name & Role',
    description:
      'The avatar-plus-text block every user list is made of, built so long names truncate instead of breaking the row.',
    customization:
      '`min-w-0` on the text column is the whole trick and the first thing people delete: a flex child refuses to shrink below its content’s width by default, so without it a long name pushes the row wide and `truncate` silently does nothing - pair it with `shrink-0` on the avatar so the face never deflates instead. The avatar is `aria-hidden` here, deliberately the opposite of the standalone avatars: the visible name beside it already carries the identity, and labelling the picture too would announce every person in a fifty-row list twice. `max-w-xs` is a demo constraint - in a real table cell, drop it and let the column width do the constraining. If the block becomes a link to a profile, put the anchor around the whole row, not just the name, so the tap target is the full 40px-tall block.',
    seoTitle: 'Avatar with Name and Role - Free Tailwind CSS Component',
    seoDescription:
      'A truncation-safe avatar and text block for user lists and tables, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: [
      'avatar with name',
      'user list item',
      'avatar text block',
      'truncate flexbox',
      'profile row',
    ],
  },
  'avatar-menu-trigger': {
    title: 'Avatar Menu Trigger',
    description:
      'An avatar button that opens an account menu - open state, chevron and correct ARIA, with no dropdown library.',
    customization:
      'The contract with whatever menu you attach is exactly two attributes: `aria-haspopup="menu"` promises one, `aria-expanded` reports it - no "open"/"closed" text is needed because expanded state is announced natively, and the chevron’s rotation is pure decoration (`aria-hidden`, `motion-reduce`-safe). Render your menu adjacent and drive it from `onToggle`; the trigger deliberately does not own outside-click or Escape handling, because those belong to the menu - putting them here means fighting your menu library over who closes what. The visible name plus the `sr-only` "Account menu" compose the accessible name, so the button reads as "Sarah Chen, Account menu", not just a mystery name. `min-h-10` keeps the tap target at 40px even though the avatar inside is 32px, and the name is capped with `max-w` + `truncate` so a long display name cannot shove the navbar around at 320px.',
    seoTitle: 'Avatar Account Menu Trigger Button - Free React Component',
    seoDescription:
      'An accessible avatar dropdown trigger with aria-haspopup, aria-expanded and open-state styling, with no dropdown library. Tailwind, React, Next.js, TypeScript.',
    keywords: [
      'avatar menu',
      'account menu trigger',
      'avatar dropdown button',
      'user menu button',
      'aria-expanded',
    ],
  },
  'avatar-skeleton': {
    title: 'Avatar Skeleton & Placeholder',
    description:
      'The two states of "no face yet": a shimmering skeleton while loading, and an SVG glyph for the user with no photo.',
    customization:
      'The two states mean different things and carry different ARIA: while loading, the wrapper is `role="status"` so the wait itself is announced, and the shimmer is only its decoration - which is exactly why `motion-reduce:animate-none` can drop the sweep and lose nothing, the classic skeleton mistake being to make the animation the signal. Once loaded-but-anonymous, it flips to `role="img"` with a name, because "Unknown user" is content, not a wait state. The sweep animates `transform` on a translucent gradient overlay, which stays on the compositor; animating `background-position` would repaint every frame - and the dark theme drops the sweep from `white/60` to `white/10` because a bright flash over a near-black disc reads as a glitch, not a shimmer. The keyframes travel with the component in a `<style>` tag, so there is nothing to add to your Tailwind config. Match the `h-10 w-10` to whatever avatar the skeleton stands in for - a skeleton that is 2px off from its content causes the exact layout shift it exists to prevent.',
    seoTitle: 'Avatar Loading Skeleton with Shimmer - Free Tailwind Component',
    seoDescription:
      'An avatar skeleton with a compositor-friendly shimmer, reduced-motion fallback and an SVG placeholder glyph, in HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: [
      'avatar skeleton',
      'loading shimmer',
      'avatar placeholder',
      'skeleton loader',
      'placeholder avatar svg',
    ],
  },
};
