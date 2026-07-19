'use client';

/**
 * Live preview for `about-story`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant differs
 * only in swapping the <img> for next/image). The portrait is a local SVG so
 * the preview never hits the network. Below `md` the two columns stack, which
 * is the layout the narrow stage shows.
 * Keep this in step with `src/data/components/about.ts`.
 */
interface AboutStoryProps {
  kicker?: string;
  title: string;
  paragraphs: string[];
  foundingYear?: string;
  foundingLabel?: string;
  imageSrc: string;
  imageAlt?: string;
  caption?: string;
  className?: string;
}

function AboutStory({
  kicker,
  title,
  paragraphs,
  foundingYear,
  foundingLabel,
  imageSrc,
  imageAlt = '',
  caption,
  className = '',
}: AboutStoryProps) {
  return (
    <section
      aria-labelledby="abt-story-title"
      className={[
        'mx-auto grid w-full max-w-6xl items-start gap-10 bg-white px-4 py-12 md:grid-cols-[7fr_5fr] md:gap-16 md:px-6 md:py-16 dark:bg-gray-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2
          id="abt-story-title"
          className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>

        {paragraphs.map((paragraph: string) => (
          <p key={paragraph.slice(0, 32)} className="mt-4 max-w-prose leading-[1.75] text-gray-600 dark:text-gray-400">
            {paragraph}
          </p>
        ))}

        {foundingYear ? (
          <aside className="mt-8 border-l-[3px] border-blue-600 py-1 pl-5 dark:border-blue-400">
            <p className="text-4xl font-bold leading-none tracking-tight tabular-nums text-gray-900 dark:text-gray-100">
              {foundingYear}
            </p>
            {foundingLabel ? <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{foundingLabel}</p> : null}
          </aside>
        ) : null}
      </div>

      <figure className="m-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- the preview
            mirrors the framework-agnostic `typescript` variant, not next/image. */}
        <img
          src={imageSrc}
          alt={imageAlt}
          width={480}
          height={600}
          className="block aspect-[4/5] w-full rounded-2xl border border-gray-200 bg-gray-50 object-cover dark:border-gray-800 dark:bg-gray-800"
        />
        {caption ? (
          <figcaption className="mt-3 text-[0.8125rem] text-gray-500 dark:text-gray-400">{caption}</figcaption>
        ) : null}
      </figure>
    </section>
  );
}

const SAMPLE_PARAGRAPHS: string[] = [
  'Why does software that costs a fortune so often ship late and please nobody? We had both spent a decade inside teams that could not answer it, so in 2019 we left to find out.',
  'The answer turned out to be unglamorous. Teams were not short of talent or tools - they were short of a decision-making habit. So that is what we build with our clients now, and the software is what falls out of it.',
];

export default function AboutStoryPreview() {
  return (
    <AboutStory
      kicker="Our story"
      title="We started with one stubborn question"
      paragraphs={SAMPLE_PARAGRAPHS}
      foundingYear="2019"
      foundingLabel="Founded in Bristol, two people and one contract"
      imageSrc="/promo/all-access.svg"
      caption="Priya Raman and Tom Ashcroft, founders"
    />
  );
}
