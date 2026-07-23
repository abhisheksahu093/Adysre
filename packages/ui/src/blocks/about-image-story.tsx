/**
 * Live preview for `about-image-story`.
 * Mirrors the `typescript` variant in `src/data/components/about.ts` verbatim.
 */
export const minHeight = 440;

interface AboutImageStoryProps {
  kicker?: string;
  title: string;
  paragraphs: string[];
  panelClassName?: string;
  monogram?: string;
  className?: string;
}

export function AboutImageStory({
  kicker,
  title,
  paragraphs,
  panelClassName = 'bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600',
  monogram = 'A',
  className = '',
}: AboutImageStoryProps) {
  return (
    <section
      aria-labelledby="abt-imgstory-title"
      className={['mx-auto grid w-full max-w-6xl items-center gap-10 bg-white px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2
          id="abt-imgstory-title"
          className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
        {paragraphs.map((paragraph: string) => (
          <p key={paragraph.slice(0, 32)} className="mt-4 max-w-prose leading-[1.75] text-gray-600 dark:text-gray-400">
            {paragraph}
          </p>
        ))}
      </div>

      <div
        aria-hidden="true"
        className={['relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl', panelClassName]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="text-7xl font-black tracking-tight text-white/90">{monogram}</span>
        <span className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15" />
        <span className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-black/10" />
      </div>
    </section>
  );
}

export default function AboutImageStoryPreview() {
  return (
    <AboutImageStory
      kicker="Where we came from"
      title="A studio, not a software factory"
      paragraphs={[
        'We began as two people who were tired of shipping things nobody asked for. That has not changed, only the number of us.',
        'Every engagement still starts the same way: in a room, with the hard question nobody wants to name first.',
      ]}
      monogram="A"
    />
  );
}
