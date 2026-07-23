/**
 * Live preview for `about-two-column-intro`.
 * Mirrors the `typescript` variant in `src/data/components/about.ts` verbatim.
 */
export const minHeight = 340;

interface AboutTwoColumnIntroProps {
  kicker?: string;
  title: string;
  paragraphs: string[];
  className?: string;
}

export function AboutTwoColumnIntro({ kicker, title, paragraphs, className = '' }: AboutTwoColumnIntroProps) {
  return (
    <section
      aria-labelledby="abt-intro-title"
      className={['mx-auto grid w-full max-w-6xl gap-8 bg-white px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2
          id="abt-intro-title"
          className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100"
        >
          {title}
        </h2>
      </div>
      <div className="space-y-4 leading-[1.75] text-gray-600 dark:text-gray-400 md:pt-2">
        {paragraphs.map((paragraph: string) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export default function AboutTwoColumnIntroPreview() {
  return (
    <AboutTwoColumnIntro
      kicker="About us"
      title="A small team with an unfashionable habit of finishing things"
      paragraphs={[
        'We are a product studio of twelve, spread across nine countries, working with teams who would rather ship one good thing than plan ten.',
        'The heading sits in its own column so it can run large without crowding the prose, and the two stack cleanly the moment the screen is too narrow to hold both.',
      ]}
    />
  );
}
