/**
 * Live preview for `about-founder-note`.
 * Mirrors the `typescript` variant in `src/data/components/about.ts` verbatim.
 */
export const minHeight = 420;

interface AboutFounderNoteProps {
  kicker?: string;
  title: string;
  paragraphs: string[];
  signatureName: string;
  signatureRole?: string;
  initials?: string;
  className?: string;
}

function AboutFounderNote({
  kicker,
  title,
  paragraphs,
  signatureName,
  signatureRole,
  initials,
  className = '',
}: AboutFounderNoteProps) {
  return (
    <section
      aria-labelledby="abt-founder-title"
      className={['mx-auto w-full max-w-2xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="abt-founder-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <div className="mt-6 space-y-4 leading-[1.75] text-gray-600 dark:text-gray-400">
        {paragraphs.map((paragraph: string) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <figcaption className="mt-8 flex items-center gap-3 not-italic">
        {initials ? (
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            aria-hidden="true"
          >
            {initials}
          </span>
        ) : null}
        <span>
          <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{signatureName}</span>
          {signatureRole ? <span className="block text-sm text-gray-500 dark:text-gray-400">{signatureRole}</span> : null}
        </span>
      </figcaption>
    </section>
  );
}

export default function AboutFounderNotePreview() {
  return (
    <AboutFounderNote
      kicker="A note from our founder"
      title="Why we still answer the phone"
      paragraphs={[
        'When we started, I promised myself we would never grow past the point of knowing every client by name. Six years on, that promise is the hardest and most useful constraint we have.',
        'It is why we turn work down, why we ship slower than some, and why the people who build your software are the people you actually talk to.',
      ]}
      signatureName="Priya Raman"
      signatureRole="Co-founder & CEO"
      initials="PR"
    />
  );
}
