'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Live preview for `gallery-lightbox`.
 *
 * Two deliberate departures from the shipped `typescript` variant, both forced
 * by the preview stage rather than by the component:
 *
 *  1. The overlay is `absolute` inside a `relative min-h-*` box, not `fixed`.
 *     The stage sizes its iframe from `document.body.scrollHeight`, and a fixed
 *     element contributes nothing to that - the real dialog would size the
 *     iframe to zero and then be clipped by it. The shipped code uses `fixed`,
 *     which is correct everywhere that is not this iframe.
 *  2. It is seeded OPEN so the dialog is what you see on load, and the
 *     open-time autofocus is skipped for that seeded state (see `open`). A
 *     preview that grabs focus on mount would scroll the detail page down to
 *     its own iframe before the reader has touched anything.
 *
 * Everything else is the real thing: role="dialog" + aria-modal, a Tab trap,
 * Escape to close, and focus handed back to the thumbnail that opened it.
 * The photos are inline SVG data URIs - the preview never touches the network.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface GalleryPhoto {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
}

interface GalleryLightboxProps {
  items: GalleryPhoto[];
  className?: string;
}

function GalleryLightbox({ items, className = '' }: GalleryLightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  /** Which thumb opened us. Null for the seeded-open state, which nobody clicked. */
  const openerIndex = useRef<number | null>(null);

  const open = (i: number): void => {
    openerIndex.current = i;
    setOpenIndex(i);
  };

  const close = (): void => {
    const back = openerIndex.current;
    setOpenIndex(null);
    openerIndex.current = null;
    if (back !== null) thumbRefs.current[back]?.focus();
  };

  const step = (delta: number): void => {
    setOpenIndex((current: number | null) =>
      current === null ? null : (current + delta + items.length) % items.length,
    );
  };

  useEffect(() => {
    if (openIndex === null) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    // Only pull focus in when a user actually opened the dialog. On the seeded
    // state openerIndex is null, so the preview renders open without hijacking
    // focus from the page hosting the iframe.
    if (openerIndex.current !== null) dialog.querySelector('button')?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      // aria-modal hides the page behind from a screen reader but leaves the
      // tab order untouched - without this loop Tab walks out of the dialog.
      const nodes: NodeListOf<HTMLButtonElement> = dialog.querySelectorAll('button');
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  const active: GalleryPhoto | null = openIndex === null ? null : (items[openIndex] ?? null);

  return (
    <div className={`relative min-h-[26rem] ${className}`}>
      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
        {items.map((item: GalleryPhoto, i: number) => (
          <li key={item.id}>
            <button
              ref={(node: HTMLButtonElement | null) => {
                thumbRefs.current[i] = node;
              }}
              type="button"
              aria-haspopup="dialog"
              onClick={() => open(i)}
              className="block w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
            >
              {/* alt="" - the sr-only span below is this button's name. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="block aspect-square w-full object-cover" src={item.imageSrc} alt="" />
              <span className="sr-only">{`Open ${item.title}`}</span>
            </button>
          </li>
        ))}
      </ul>

      {active !== null && openIndex !== null ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-gray-950/85 p-4"
          onClick={(event) => {
            // Only the backdrop closes; a click on the photo bubbles here too.
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="w-full max-w-sm rounded-xl bg-white p-3 dark:bg-gray-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="block h-48 w-full rounded-lg bg-gray-100 object-cover dark:bg-gray-800"
              src={active.imageSrc}
              alt={active.imageAlt}
            />
            <p className="mt-2.5 text-sm font-semibold text-gray-900 dark:text-gray-50">{active.title}</p>
            <div className="flex items-center gap-2 pt-2.5">
              <button
                type="button"
                onClick={() => step(-1)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                Previous
              </button>
              <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400" aria-hidden="true">
                {openIndex + 1} / {items.length}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                Next
              </button>
              <button
                type="button"
                onClick={close}
                className="ml-auto rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** A self-contained SVG swatch as a data URI - no network request, no asset. */
function swatch(index: number, width: number, height: number): string {
  const hue = (index * 47 + 205) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 60% 48%)"/>
      <stop offset="1" stop-color="hsl(${(hue + 38) % 360} 56% 30%)"/>
    </linearGradient></defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SAMPLE_PHOTOS: GalleryPhoto[] = [
  { id: 'harbour', title: 'Harbour at dawn', imageAlt: 'Fishing boats moored under an orange sky', imageSrc: swatch(0, 800, 600) },
  { id: 'ridge', title: 'Ridge trail', imageAlt: 'A footpath switching back through pine forest', imageSrc: swatch(1, 800, 600) },
  { id: 'stairwell', title: 'Stairwell study', imageAlt: 'Concrete stairwell seen from directly below', imageSrc: swatch(2, 800, 600) },
  { id: 'crossing', title: 'Night crossing', imageAlt: 'Long exposure of traffic crossing a bridge at night', imageSrc: swatch(3, 800, 600) },
];

export default function GalleryLightboxPreview() {
  return <GalleryLightbox items={SAMPLE_PHOTOS} className="w-full max-w-xl" />;
}
