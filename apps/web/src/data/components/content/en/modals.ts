import type { ComponentContentMap } from '../types';

/** English prose for the modals category. Keys are component slugs. */
export const modalsContent: ComponentContentMap = {
  'modal-basic': {
    title: 'Basic Modal',
    description:
      'A titled dialog with a focus trap, Escape to close and focus returned to the trigger.',
    customization:
      'The box is the easy part; the seven lines that make it a dialog are the component. `role="dialog"` + `aria-modal="true"` tells a screen reader the page behind is inert - it does not MAKE it inert, which is why the Tab handler still has to wrap focus by hand. Escape closes, a backdrop click closes, `body` scroll is locked while it is up, and the effect cleanup restores focus to whatever opened it, so a dialog torn down by a route change still hands the keyboard back. Change the copy and the `max-w-md`; leave the `FOCUSABLE` selector alone unless you are adding a control type it does not list.',
    seoTitle: 'Accessible Modal Dialog - Free React Component',
    seoDescription:
      'A modal dialog with a real focus trap, Escape, scroll lock and focus restore, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA, MIT licensed.',
    keywords: ['modal', 'dialog', 'focus trap', 'accessible modal', 'react modal'],
  },
  'modal-confirm': {
    title: 'Confirm Modal',
    description:
      'A destructive confirmation that opens with focus on Cancel, not on Delete.',
    customization:
      'Two decisions carry this component. It is `role="alertdialog"`, not `dialog` - that is what says "this interrupted you with something consequential" - and `aria-describedby` points at the sentence naming what will be destroyed, so it announces its stakes and not just its title. Then: initial focus goes to Cancel, by ref, explicitly. Not `focusables()[0]`, which drifts the day someone reorders the markup. A dialog that steals focus onto "Delete" turns a reflexive Enter into data loss. Red is not the safeguard - it is invisible to a red-blind user and means nothing to a screen reader; focus order and the confirm step are the safeguard. Escape always resolves to Cancel.',
    seoTitle: 'Confirm Delete Modal - Free Accessible React Component',
    seoDescription:
      'A destructive confirm dialog using role="alertdialog" with focus on the safe action, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['confirm modal', 'alertdialog', 'delete confirmation', 'destructive dialog'],
  },
  'modal-form': {
    title: 'Form Modal',
    description: 'A dialog wrapped around a real form - Enter submits, submitting closes it.',
    customization:
      'The primary action is a `type="submit"` inside a real `<form>`. Wiring it as a `type="button"` with an onClick is the usual mistake and it costs you two things silently: Enter from a field stops submitting, and the browser stops enforcing `required` before your handler runs. Initial focus goes to the first FIELD rather than the close button - the user opened this to type. On submit it resets and closes, because a dialog reopened with the last submission still in it reads as a failure. Everything else - trap, Escape, scroll lock, focus restore - matches `modal-basic`.',
    seoTitle: 'Modal with Form - Free Accessible React Component',
    seoDescription:
      'A dialog containing a real form with native validation, Enter-to-submit and a focus trap, in HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['form modal', 'modal form', 'dialog form', 'react modal form'],
  },
  'modal-fullscreen': {
    title: 'Fullscreen Modal',
    description: 'Takes the whole viewport on a phone and collapses to a centred card from sm: up.',
    customization:
      'Every fullscreen trait is the mobile base and `sm:` undoes it - a centred card with 16px of dimmed backdrop around it wastes the only screen a phone has. Two details do the work: `h-[100dvh]` not `100vh`, because `vh` includes mobile Safari\'s collapsing URL bar and would push the footer under the browser chrome; and `min-h-0` on the scroll region, without which the flex child refuses to shrink and shoves the footer off the bottom instead of scrolling. The header and footer are `flex-none` so the title and the way out stay reachable however far down the body you are - a fullscreen dialog whose only exit has scrolled away is a trap with extra steps.',
    seoTitle: 'Fullscreen Modal on Mobile - Free Responsive React Component',
    seoDescription:
      'A responsive dialog that fills the viewport on mobile and becomes a centred card on larger screens, in HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['fullscreen modal', 'mobile modal', 'responsive dialog', 'full screen dialog'],
  },
  'modal-drawer-bottom': {
    title: 'Bottom Drawer Modal',
    description: 'A modal sheet that slides up from the bottom edge, with the full dialog contract.',
    customization:
      'A bottom sheet is a modal dialog that happens to arrive from below - same `role="dialog"`, same trap, same Escape, same restore. `items-end` on the overlay is the only line that makes it a sheet. The slide is a `transform`, never a height animation: height cannot be composited and janks on exactly the low-end phones this pattern targets. It needs two renders - paint at `translate-y-full`, then flip - or the browser has nothing to transition from and the sheet just appears. `motion-reduce` drops the travel entirely; a panel flying up the viewport is precisely the vestibular trigger that setting exists to switch off. Only the top corners are rounded, or you get two bright slivers of backdrop under the sheet.',
    seoTitle: 'Bottom Sheet Drawer Modal - Free React Component',
    seoDescription:
      'An accessible bottom drawer that slides up from the viewport edge, with a focus trap, Escape and reduced-motion support. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['bottom sheet', 'drawer modal', 'bottom drawer', 'mobile sheet', 'slide up modal'],
  },
  'modal-alert-warning': {
    title: 'Warning Alert Modal',
    description: 'A non-destructive alertdialog with a single acknowledge button that takes focus.',
    customization:
      'It is `role="alertdialog"`, not `dialog` - the warning interrupted the user with something they must act on - and `aria-describedby` points at the sentence that says what. There is one button and focus lands on it. Amber #b45309 on #fef3c7 clears AA; the lighter amber you reach for first does not, and the glyph is the only danger signal before the text is read.',
    seoTitle: 'Warning Alert Modal - Free Accessible React Component',
    seoDescription:
      'A non-destructive warning dialog using role="alertdialog" with a focus trap, Escape and a single acknowledge action, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['warning modal', 'alert modal', 'alertdialog', 'session warning'],
  },
  'modal-success': {
    title: 'Success Modal',
    description: 'A confirmation dialog with a check mark that scales in once, dropped under motion-reduce.',
    customization:
      'The check mark scales in with a one-shot keyframe that travels with the component, so nothing needs adding to a global stylesheet; `motion-reduce:animate-none` stops it and the glyph still reads. Green is the signal, never the message - the title and body carry the meaning for anyone who cannot see the colour. Focus opens on the single Done button and Escape closes.',
    seoTitle: 'Success Confirmation Modal - Free React Component',
    seoDescription:
      'A success dialog with an animated check mark, a focus trap, Escape and reduced-motion support, in Tailwind, React and TypeScript. WCAG AA, MIT licensed.',
    keywords: ['success modal', 'confirmation dialog', 'payment success', 'react modal'],
  },
  'modal-scrollable-terms': {
    title: 'Scrollable Terms Modal',
    description: 'A consent dialog whose long body scrolls between a fixed header and Accept/Decline footer.',
    customization:
      'The panel is a flex column: a `flex-none` header and footer bracket a `flex-1 min-h-0 overflow-y-auto` body. `min-h-0` is the load-bearing line - without it the flex child refuses to shrink and the body pushes the Accept/Decline row off the panel instead of scrolling under it. The way out stays reachable however far the reader scrolls, and focus opens on Decline, the safe choice.',
    seoTitle: 'Scrollable Terms & Conditions Modal - Free React Component',
    seoDescription:
      'A consent dialog with a scrollable body and pinned header and footer, plus a focus trap and Escape, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['terms modal', 'scrollable modal', 'consent dialog', 'terms and conditions'],
  },
  'modal-image-lightbox': {
    title: 'Image Lightbox Modal',
    description: 'A gallery lightbox over a dark scrim with Prev, Next and Close as real 40px buttons.',
    customization:
      'The media here is a CSS gradient rather than an `<img>` so the snippet stays self-contained - swap the gradient div for your image. Arrow keys page the slides and the index is clamped with a modulo wrap, so the guarded array access never reads past either end. The counter is `aria-live` so a screen reader hears the slide change, not just sees it.',
    seoTitle: 'Image Lightbox Modal - Free Accessible React Component',
    seoDescription:
      'An accessible image lightbox with keyboard paging, a focus trap and an aria-live counter, using CSS gradients as placeholders, in Tailwind, React and TypeScript.',
    keywords: ['lightbox', 'image modal', 'gallery lightbox', 'photo viewer'],
  },
  'modal-video': {
    title: 'Video Modal',
    description: 'A video dialog with a CSS play mockup - no real media - ready to drop your player into.',
    customization:
      'There is no real `<video>` here: the poster is a gradient and the play button toggles a CSS timeline, so the snippet ships no media. Drop your `<video>` into the `aspect-video` frame and wire the play button to its `.play()`/`.pause()`. The controls are real buttons at least 40px, the progress animation is dropped under `motion-reduce`, and the whole thing keeps a focus trap and Escape.',
    seoTitle: 'Video Player Modal - Free Accessible React Component',
    seoDescription:
      'A video dialog with a CSS play mockup, a focus trap, Escape and reduced-motion support, ready for your own player, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['video modal', 'video player', 'media dialog', 'lightbox video'],
  },
  'modal-command-palette': {
    title: 'Command Palette Modal',
    description: 'A Spotlight-style palette that opens top-aligned, filters as you type and runs on Enter.',
    customization:
      'It opens top-aligned, focuses the input and filters the list as you type. It is a real `listbox`/`option` pairing, so the active row is announced rather than only tinted. ArrowUp/Down move the highlighted row with a modulo wrap and Enter runs it; the chosen command is captured with a guarded index access before it is called. Keep the panel `w-full max-w-lg` so it never exceeds a 320px viewport.',
    seoTitle: 'Command Palette Modal - Free Accessible React Component',
    seoDescription:
      'A cmd+k style command palette with type-to-filter, keyboard navigation and a listbox pattern, in Tailwind, React and TypeScript. WCAG AA, MIT licensed.',
    keywords: ['command palette', 'cmdk', 'command menu', 'search modal', 'spotlight'],
  },
  'modal-cookie': {
    title: 'Cookie Consent Modal',
    description: 'A consent dialog with three real choices - Accept all, Reject non-essential and Manage.',
    customization:
      'Consent needs three real choices rather than a single "OK" that consents by exhaustion. Focus opens on Reject, the least committal option, and Escape resolves to `onDismiss` (a reject), never a silent accept. It is `items-end` on a phone - a bottom sheet - and centres from `sm:` up. The Manage link is padded to a 40px tap target so it is not a hairline on touch.',
    seoTitle: 'Cookie Consent Modal - Free Accessible React Component',
    seoDescription:
      'A GDPR-style cookie consent dialog with accept, reject and manage actions, a focus trap and a safe Escape, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['cookie modal', 'cookie consent', 'gdpr banner', 'privacy dialog'],
  },
  'modal-side-panel': {
    title: 'Side Panel Modal',
    description: 'A right-hand slide-over: full-width on a phone, capped at max-w-md from there up.',
    customization:
      'A slide-over is a modal dialog that arrives from the right. The slide is a `translate-x` transform - composited, unlike a width or `right` animation that janks on the low-end phones this pattern targets - and it needs a paint at `translate-x-full` before the flip, which the `entered` flag provides. `motion-reduce` drops the travel. Full-width on a phone and capped at `max-w-md` above, so it never exceeds the viewport; header and footer are `flex-none` so the body scrolls between them.',
    seoTitle: 'Side Panel Slide-Over Modal - Free React Component',
    seoDescription:
      'An accessible right-hand slide-over drawer with a transform-based slide, a focus trap, Escape and reduced-motion support, in Tailwind, React and TypeScript.',
    keywords: ['side panel', 'slide over', 'drawer modal', 'off canvas', 'side drawer'],
  },
  'modal-stacked': {
    title: 'Stacked Modals',
    description: 'A base dialog that raises a second dialog on top, peeled one layer at a time by Escape.',
    customization:
      'Two rules keep a stack honest: the second overlay sits at a higher z-index with its own backdrop, and Escape only ever closes the topmost layer - so the user peels the stack one at a time instead of being dumped straight back to the page. Closing the top layer returns focus to the control that raised it, captured on open, not to the base dialog\'s first field. The base trap is suppressed while the confirm is up so the two do not fight over Tab.',
    seoTitle: 'Stacked Nested Modals - Free Accessible React Component',
    seoDescription:
      'Two stacked dialogs with per-layer backdrops, top-layer Escape and focus handoff between levels, in Tailwind, React and TypeScript. WCAG AA, MIT licensed.',
    keywords: ['stacked modals', 'nested modal', 'modal on modal', 'layered dialog'],
  },
  'modal-onboarding-steps': {
    title: 'Onboarding Steps Modal',
    description: 'A multi-step wizard in one dialog with progress dots, Back/Next and a Finish on the last step.',
    customization:
      'The step count lives in state: Back is disabled on the first step and the primary button becomes Finish on the last. The step region is `aria-live` so each change is announced, and progress is not colour-only - the active dot is wider, and the current step is spelled out as "Step 2 of 3". The dialog keeps its focus trap and Escape throughout, and the guarded `steps[index]` access tolerates an empty array.',
    seoTitle: 'Onboarding Wizard Modal - Free Accessible React Component',
    seoDescription:
      'A multi-step onboarding wizard in a dialog with progress indicators, an aria-live step region and a focus trap, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['onboarding modal', 'wizard modal', 'multi step dialog', 'stepper modal'],
  },
};
