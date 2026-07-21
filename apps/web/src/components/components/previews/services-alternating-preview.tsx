'use client';

/**
 * Live preview for `services-alternating`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant differs
 * only in swapping <img> for next/image and <a> for next/link). Two rows, so
 * the stage shows the flip; the pictures are a local SVG so it never hits the
 * network. Below `md` both rows stack copy-then-image, which is the point the
 * source order is making.
 * Keep this in step with `src/data/components/services.ts`.
 */
interface ServiceRow {
  id: string;
  kicker: string;
  title: string;
  copy: string;
  href: string;
  linkLabel: string;
  imageSrc: string;
  imageAlt?: string;
}

interface ServicesAlternatingProps {
  kicker?: string;
  title: string;
  rows: ServiceRow[];
  className?: string;
}

function ServicesAlternating({ kicker, title, rows, className = '' }: ServicesAlternatingProps) {
  return (
    <section
      aria-labelledby="svc-alt-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="svc-alt-title"
        className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      {rows.map((row: ServiceRow, index: number) => (
        <div key={row.id} className="mt-12 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{row.kicker}</p>
            <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">{row.title}</h3>
            <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">{row.copy}</p>
            <a
              href={row.href}
              className="mt-4 inline-block rounded font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {row.linkLabel}
            </a>
          </div>

          <div
            className={[
              'overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800',
              index % 2 === 1 ? 'md:order-first' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            { }
            <img
              src={row.imageSrc}
              alt={row.imageAlt ?? ''}
              width={560}
              height={420}
              className="block aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      ))}
    </section>
  );
}

const SAMPLE_ROWS: ServiceRow[] = [
  {
    id: 'discovery',
    kicker: 'Discovery',
    title: 'Understand before we build',
    copy: 'Two weeks of interviews, analytics and a hard look at what you already own.',
    href: '#',
    linkLabel: 'Explore discovery',
    imageSrc: '/promo/all-access.svg',
  },
  {
    id: 'delivery',
    kicker: 'Delivery',
    title: 'Ship in fortnightly slices',
    copy: 'Every increment is deployable, typed and behind a flag you control.',
    href: '#',
    linkLabel: 'Explore delivery',
    imageSrc: '/promo/all-access.svg',
  },
];

export default function ServicesAlternatingPreview() {
  return <ServicesAlternating title="How we work with you" rows={SAMPLE_ROWS} />;
}
