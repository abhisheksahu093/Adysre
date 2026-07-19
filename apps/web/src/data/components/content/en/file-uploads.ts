import type { ComponentContentMap } from '../types';

/** English prose for the file uploads category. Keys are component slugs. */
export const fileUploadsContent: ComponentContentMap = {
  'file-upload-dropzone-basic': {
    title: 'Basic Dropzone',
    description:
      'A dashed drop area with a real file input that stays reachable by keyboard and screen reader.',
    customization:
      'Drag-and-drop is the enhancement; the `sr-only` (not `display:none`) input is the spine - it keeps its tab stop, and the zone shows focus with `focus-within`. A depth counter stops the highlight flickering as the cursor crosses child nodes, and picked names are announced via `aria-live`.',
    seoTitle: 'Basic File Upload Dropzone - Free Tailwind Component',
    seoDescription:
      'An accessible drag-and-drop file dropzone with a keyboard-reachable input, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['file dropzone', 'drag and drop upload', 'file input', 'upload component'],
  },
  'file-upload-button-compact': {
    title: 'Compact Upload Button',
    description:
      'A single labelled button that opens the file picker and reports the chosen file name inline.',
    customization:
      'The label IS the button - no scripted click on a hidden input. The real input sits underneath as a `peer` (`sr-only`, so it keeps its tab stop) and `peer-focus-visible` paints the ring from genuine input focus. The name summary is `aria-live`, since it is the component\'s entire feedback.',
    seoTitle: 'Compact File Upload Button - Free Tailwind Component',
    seoDescription:
      'A minimal file-picker button that shows the selected file name, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['upload button', 'file picker button', 'choose file', 'file input button'],
  },
  'file-upload-multi-list-progress': {
    title: 'Multi-File List With Progress',
    description:
      'A dropzone that lists each picked file with a simulated per-file progress bar and cancel control.',
    customization:
      'Progress is faked by one timer that advances every in-flight item - swap that effect for real XHR/fetch progress events and nothing else changes. The bar is `aria-hidden`; the percentage lives in the text so a screen reader hears it, and each row can be cancelled or removed.',
    seoTitle: 'Multi-File Upload With Progress - Free React Component',
    seoDescription:
      'A multi-file upload list with per-file progress bars and cancel buttons, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['upload progress', 'multiple file upload', 'progress bar', 'file list upload'],
  },
  'file-upload-image-grid-preview': {
    title: 'Image Grid Preview',
    description:
      'An image dropzone that renders picked files as a responsive thumbnail grid with per-tile remove.',
    customization:
      'Thumbnails are object URLs, which are a resource, not a string: each pins its file\'s bytes until revoked, so the component revokes on remove and on unmount via a mirror ref. The grid runs two columns on phones up to four on desktop, so tiles reflow instead of shrinking.',
    seoTitle: 'Image Upload Grid Preview - Free React Component',
    seoDescription:
      'An image upload with a responsive thumbnail grid and object-URL cleanup, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['image upload preview', 'thumbnail grid', 'image dropzone', 'photo upload grid'],
  },
  'file-upload-avatar': {
    title: 'Avatar Upload',
    description:
      'A round avatar picker with a live preview, a simulated upload state and change/remove controls.',
    customization:
      'The chosen image becomes an object URL that is revoked before every replacement and on unmount, so a chain of re-picks never leaks. The "upload" is a timeout that shows an overlay; the label triggers a `peer` `sr-only` input so it keeps a real tab stop.',
    seoTitle: 'Avatar Image Upload - Free React Component',
    seoDescription:
      'A round avatar upload with live preview, simulated upload state and object-URL cleanup, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['avatar upload', 'profile photo upload', 'image picker', 'avatar preview'],
  },
  'file-upload-drag-overlay': {
    title: 'Drag Overlay Card',
    description:
      'A content card that reveals a full-card drop overlay while a file is dragged over it.',
    customization:
      'The overlay is `aria-hidden` and `pointer-events-none` - a visual cue for the drag, never a control or focus trap - toggled by a depth-counted drag state. The always-present browse button is why the card still works with no pointer at all.',
    seoTitle: 'Drag-and-Drop Overlay Card - Free React Component',
    seoDescription:
      'A card with a full-surface drag-to-upload overlay and a keyboard-reachable browse button, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['drag overlay', 'drop overlay', 'drag and drop card', 'upload overlay'],
  },
  'file-upload-validation-hints': {
    title: 'Validation With Hints',
    description:
      'A file input that validates type, size and count on pick and splits results into accepted and rejected.',
    customization:
      'The rules are stated up front in the hint, not sprung only on failure; each rejected file carries the reason it bounced (wrong type, too large, over the limit). Accept tokens support `type/*`, exact MIME and `.ext` forms, and only the passing files reach `onFiles`.',
    seoTitle: 'File Upload Validation With Hints - Free React Component',
    seoDescription:
      'A file upload that validates type, size and count with clear per-file reasons, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['file validation', 'upload validation', 'accept types', 'max file size'],
  },
  'file-upload-paste': {
    title: 'Paste To Upload',
    description:
      'A focusable target that accepts an image pasted from the clipboard, with a browse fallback.',
    customization:
      'The paste target is a real focusable control (`tabIndex={0}`) whose Enter/Space forwards to the file input, so pasting is an enhancement and never a dead end. The pasted image previews via an object URL that is revoked on replace and unmount.',
    seoTitle: 'Paste Image To Upload - Free React Component',
    seoDescription:
      'A clipboard-paste image upload with a keyboard-reachable browse fallback and object-URL cleanup, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['paste upload', 'clipboard image', 'paste screenshot', 'paste to upload'],
  },
  'file-upload-queue-retry': {
    title: 'Upload Queue With Retry',
    description:
      'A queue of files with simulated uploads, per-item status and a Retry action on failures.',
    customization:
      'Transfers are simulated with a per-item countdown; failures are deterministic (an even-id file fails its first attempt) so the retry path is always demonstrable. Statuses are text-backed, not colour-only, and Retry re-runs the same simulation and succeeds.',
    seoTitle: 'Upload Queue With Retry - Free React Component',
    seoDescription:
      'An upload queue with per-file status, simulated failures and a retry action, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['upload queue', 'retry upload', 'upload status', 'failed upload retry'],
  },
  'file-upload-split-url-tab': {
    title: 'Upload Or URL Tabs',
    description:
      'A tabbed control offering a file picker on one tab and a validated URL field on the other.',
    customization:
      'Two real tabs with `role="tab"`/`tabpanel` wiring share one added-sources list. Both routes stay keyboard-reachable: a file input under a label, and a real `<form>` with a labelled URL field that validates for `http(s)` and reports errors via `aria-invalid`.',
    seoTitle: 'File Upload Or URL Tabs - Free React Component',
    seoDescription:
      'A tabbed uploader that accepts a device file or a remote URL, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['upload or url', 'file url tabs', 'tabbed upload', 'url input upload'],
  },
};
