'use client';

import { useId } from 'react';

/**
 * Live preview for `comparison-before-after-cards`.
 *
 * Mirrors the `typescript` code variant. The images are inline SVG data URIs so
 * the preview never touches the network - the shipped snippet points at real
 * `/images/*.jpg` paths instead. Keep this in step with
 * `src/data/components/comparisons.ts`.
 *
 * The default export adds a page-section shell - padding plus a centred
 * max-width - which is preview-only; the component itself is width-agnostic
 * and takes its width from the caller.
 */
interface BeforeAfterItem {
  id: string;
  /** The pill on the image. A real text node, not ARIA. */
  label: string;
  imageSrc: string;
  imageAlt: string;
  caption: string;
}

interface ComparisonBeforeAfterCardsProps {
  title: string;
  items: BeforeAfterItem[];
  className?: string;
}

function ComparisonBeforeAfterCards({ title, items, className = '' }: ComparisonBeforeAfterCardsProps) {
  const titleId = useId();

  return (
    <section className={`w-full ${className}`} aria-labelledby={titleId}>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100" id={titleId}>
        {title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item: BeforeAfterItem) => (
          <figure
            key={item.id}
            className="relative m-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <span className="absolute left-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white">
              {item.label}
            </span>
            { }
            <img className="block h-48 w-full object-cover" src={item.imageSrc} alt={item.imageAlt} />
            <figcaption className="px-4 py-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/**
 * A self-contained SVG mock dashboard as a data URI - no network request, no
 * asset. `tiles` draws the cluttered "before"; the false branch draws the one
 * headline metric the redesign kept.
 */
function dashboard(surface: string, accent: string, tiles: boolean): string {
  const grid = tiles
    ? // Six competing tiles, laid out deterministically from the index.
      Array.from({ length: 6 }, (_, i) => {
        const x = 16 + (i % 3) * 100;
        const y = 40 + Math.floor(i / 3) * 52;
        return `<rect x="${x}" y="${y}" width="88" height="40" rx="5" fill="#ffffff"/>
                <rect x="${x + 8}" y="${y + 9}" width="34" height="6" rx="3" fill="#9ca3af"/>
                <rect x="${x + 8}" y="${y + 22}" width="52" height="9" rx="4" fill="${accent}"/>`;
      }).join('')
    : `<rect x="16" y="40" width="288" height="52" rx="6" fill="#ffffff"/>
       <rect x="28" y="52" width="60" height="7" rx="3" fill="#9ca3af"/>
       <rect x="28" y="66" width="104" height="16" rx="4" fill="${accent}"/>
       <rect x="16" y="102" width="288" height="42" rx="6" fill="#ffffff"/>
       <rect x="28" y="112" width="180" height="5" rx="2" fill="#d1d5db"/>
       <rect x="28" y="124" width="216" height="5" rx="2" fill="#d1d5db"/>
       <rect x="28" y="136" width="148" height="5" rx="2" fill="#d1d5db"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="${surface}"/>
    <rect x="16" y="16" width="96" height="10" rx="5" fill="#6b7280"/>
    ${grid}
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SAMPLE_ITEMS: BeforeAfterItem[] = [
  {
    id: 'before',
    label: 'Before',
    imageSrc: dashboard('#e5e7eb', '#94a3b8', true),
    imageAlt: 'The old dashboard: six stat tiles of equal weight competing for attention',
    caption: 'Six tiles, no hierarchy. Every metric shouted, so none of them landed.',
  },
  {
    id: 'after',
    label: 'After',
    imageSrc: dashboard('#e0e7ff', '#4f46e5', false),
    imageAlt: 'The new dashboard: one headline metric above a compact table',
    caption: 'One headline metric, the rest demoted to a table. Task time fell by 40%.',
  },
];

export default function ComparisonBeforeAfterCardsPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ComparisonBeforeAfterCards title="Dashboard redesign" items={SAMPLE_ITEMS} />
      </div>
    </section>
  );
}
