import type { ComponentContentMap } from '../types';

/**
 * English prose for the text-entry half of the forms category. Keys are
 * component slugs, matching `src/data/components/forms-text.ts`.
 */
export const formsTextContent: ComponentContentMap = {
  'input-basic': {
    title: 'Basic Input',
    description: 'A labelled text input with helper text wired to it via aria-describedby.',
    customization:
      'The three parts are not decoration - the label names the field, the input is the field, and the helper explains it. The helper is linked with `aria-describedby` rather than left floating beside the box; unlinked, it is announced to nobody, which is the one audience that cannot see it sitting there. The TypeScript variant omits `id` from the inherited attributes and generates one with `useId`, so the label and the input cannot be wired to different ids - the most common way a "labelled" field turns out not to be. Note `placeholder-gray-500` lightens to `gray-400` in dark: keeping the same grey would drop it to 4.0:1 and fail AA.',
    seoTitle: 'Accessible Text Input - Free Tailwind Form Component',
    seoDescription:
      'A labelled text input with helper text and aria-describedby, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['tailwind input', 'text input', 'form input', 'accessible input', 'react input'],
  },
  'input-with-icon': {
    title: 'Input with Icon',
    description: 'A search field with a leading icon and a clear button that appears once filled.',
    customization:
      'The label renders `sr-only`, not omitted: the icon is `aria-hidden` decoration and the placeholder vanishes on the first keystroke, so without a real label the field has no accessible name at exactly the moment it matters. Swap the magnifier for any 24×24 stroke icon - it is drawn with `currentColor`, so it follows the field into dark mode. The clear button is a real `<button>` with its own name, reachable by Tab, and it only exists when there is something to clear; an always-visible X on an empty field is a control that does nothing. Use `px-9` on the input to keep the value from sliding under either affordance.',
    seoTitle: 'Search Input with Icon and Clear Button - Free React Component',
    seoDescription:
      'A search input with a leading icon, a clear button and a screen-reader label, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['search input', 'input with icon', 'clearable input', 'tailwind search field'],
  },
  'input-floating-label': {
    title: 'Floating Label Input',
    description: 'A label that sits inside the field and floats above the value on focus or fill.',
    customization:
      '`placeholder=" "` - a single space, never empty - is load-bearing. It makes `:placeholder-shown` mean exactly "the user has typed nothing", which is what drives the float, and it is why the TypeScript variant omits `placeholder` from the inherited attributes: a caller-supplied one would silently pin the label in its floated position forever. This is still a real `<label for>` that lives in the accessibility tree the whole time; it only moves. `pointer-events-none` lets clicks pass through to the input underneath, and the asymmetric `pt-5` reserves the strip the label lands in so the value never shares a row with it.',
    seoTitle: 'Floating Label Input - Free Tailwind CSS Component',
    seoDescription:
      'A CSS-only floating label input built on :placeholder-shown, with a real label element. HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: [
      'floating label input',
      'material input',
      'animated label',
      'tailwind floating label',
    ],
  },
  'input-with-error': {
    title: 'Input with Error',
    description: 'An invalid field whose error message is wired to it with aria-describedby.',
    customization:
      'Red is not the error state. A red border is invisible to a red-blind user and completely silent to a screen reader - `aria-invalid="true"` is what makes the field announce as invalid, and `aria-describedby` is what makes the announcement include why. Colour is the third channel, alongside the icon and the message text. The styling hangs off `[aria-invalid]` rather than an `.is-error` class, so the attribute screen readers act on and the attribute that paints the border are the same one and cannot drift apart. The TypeScript variant derives both from `error`, making a red-but-valid field unrepresentable. Write the message as a fix ("Enter a complete email address, like jane@example.com"), not a diagnosis ("Invalid input").',
    seoTitle: 'Input Error State with aria-invalid - Free React Component',
    seoDescription:
      'An accessible invalid input with aria-invalid and aria-describedby wired to the message, in HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['input error', 'form validation', 'aria-invalid', 'error message', 'invalid input'],
  },
  'input-with-addon': {
    title: 'Input with Addon',
    description: 'A field with attached prefix and suffix addons - https:// … .com.',
    customization:
      'The addons are `aria-hidden`, and that is the point: `https://` and `.com` are scaffolding the user cannot edit, not part of the field name. Left audible they turn the announcement into "https:// Site domain .com edit text". The label says what to type; the addons show where it lands. The wrapper owns the border, the radius and - via `focus-within` - the focus ring, because the group is what the user perceives they are focusing; a ring on the borderless input would draw inside the group and look like a bug. Pass either `prefix` or `suffix` alone for a one-sided field.',
    seoTitle: 'Input with Prefix and Suffix Addon - Free Tailwind Component',
    seoDescription:
      'A grouped input with attached prefix and suffix addons and a focus-within ring, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['input addon', 'input group', 'prefix input', 'url input', 'tailwind input group'],
  },
  'textarea-basic': {
    title: 'Basic Textarea',
    description: 'A labelled multi-line field with helper text and a vertical resize handle.',
    customization:
      'Same three parts as a text input, plus one decision: `rows` is the initial height and a promise about how much you expect someone to write - `rows="4"` invites a paragraph, `rows="2"` invites a sentence. Set it to the answer you actually want. `font-family: inherit` (`font-sans` in the Tailwind variant) is not optional: a textarea does not inherit the page font, and without it the field renders in the browser monospace default and looks like a bug.',
    seoTitle: 'Accessible Textarea - Free Tailwind Form Component',
    seoDescription:
      'A labelled textarea with helper text and aria-describedby, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['tailwind textarea', 'textarea component', 'multiline input', 'react textarea'],
  },
  'textarea-autosize': {
    title: 'Autosize Textarea',
    description: 'A textarea that grows to fit its content, with no scrollbar and no drag handle.',
    customization:
      'A textarea cannot measure itself while it has a height, so the two-line dance is the whole technique and the order is not negotiable: set `height = "auto"` to collapse the box, then `height = scrollHeight` to grow it to the content. Skip the collapse and `scrollHeight` reports the current height back at you - the box grows but never shrinks. `resize-none` because the box sizes itself and a handle would fight the script; `overflow-y-hidden` because the height always equals the content, so a scrollbar could only ever be a phantom stealing horizontal space. The React variants use `useLayoutEffect`, not `useEffect`: the resize must land before paint or the box visibly snaps on every keystroke.',
    seoTitle: 'Auto-growing Textarea - Free React Component',
    seoDescription:
      'A textarea that autosizes to its content using scrollHeight, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['autosize textarea', 'auto grow textarea', 'react textarea autosize', 'chat input'],
  },
  'textarea-with-counter': {
    title: 'Textarea with Counter',
    description: 'A character counter that warns near the limit and announces only when it matters.',
    customization:
      'Two things worth stealing. First, `aria-live` is `off` until the last 20 characters and only then becomes `polite` - a live region that fires on every keystroke is a machine gun, and this is information, never an interruption, so never `assertive`. Second, the counter sits inside `aria-describedby`, so a screen reader user is told the limit exists when they *enter* the field rather than discovering it by hitting it. The warning changes colour *and* weight, because colour alone is no signal for a red-blind user. `tabular-nums` stops the readout jittering as digits change. The amber inverts in dark mode - `amber-700` is 2.6:1 on `gray-900` and would vanish.',
    seoTitle: 'Textarea with Character Counter - Free React Component',
    seoDescription:
      'A textarea with a live character counter, a near-limit warning and a polite aria-live region. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['character counter', 'textarea maxlength', 'character limit', 'aria-live counter'],
  },
  'textarea-with-toolbar': {
    title: 'Textarea with Toolbar',
    description: 'A markdown field with bold, italic and link buttons that wrap the selection.',
    customization:
      'A markdown toolbar, not a rich-text editor: every button wraps the selection in plain syntax a textarea can hold. That ceiling is deliberate - the moment you want real bold you need `contenteditable` and a different component. Three details make it a toolbar rather than three loose buttons: `role="toolbar"` with `aria-controls` so it announces as belonging to the field, an `aria-label` on every button with the glyphs `aria-hidden`, and `setSelectionRange` after the edit so focus returns to the field with the wrapped text still selected. The React variants restore that selection inside `requestAnimationFrame` because the DOM value only updates on the next render - without the wait the caret jumps to the end. Add tools by extending `TOOLS`.',
    seoTitle: 'Markdown Textarea with Toolbar - Free React Component',
    seoDescription:
      'A textarea with a bold, italic and link markdown toolbar that wraps the selection, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['markdown editor', 'textarea toolbar', 'rich text input', 'comment editor'],
  },
  'textarea-resizable': {
    title: 'Resizable Textarea',
    description: 'A textarea with a bounded drag handle - vertical only, between a min and a max.',
    customization:
      'The opposite trade to the autosize field: the user drags, not the script, so the browser\'s own handle does all the work and the component needs no JavaScript at all. `min-h` and `max-h` are the real design decisions - unbounded `resize-y` lets someone drag the box to 4px or to 9000, and both are layouts you never designed. Keep it `resize-y`, never `resize` (both): horizontal dragging escapes the form column and there is no reason to allow it. Disabling the field also disables the handle, since resizing something you cannot edit is a control that lies about being live.',
    seoTitle: 'Resizable Textarea with Min and Max Height - Free Component',
    seoDescription:
      'A vertically resizable textarea bounded by min-height and max-height, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['resizable textarea', 'textarea resize', 'drag handle textarea', 'min max height'],
  },
};
