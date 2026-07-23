/**
 * Live preview for `cta-with-email-capture`.
 * Mirrors the `typescript` code variant in `src/data/components/cta.ts`.
 */
interface CtaWithEmailCaptureProps {
  title: string;
  copy?: string;
  placeholder?: string;
  ctaLabel?: string;
  note?: string;
  loading?: boolean;
}

export function CtaWithEmailCapture({
  title,
  copy,
  placeholder = 'you@company.com',
  ctaLabel = 'Subscribe',
  note,
  loading = false,
}: CtaWithEmailCaptureProps) {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <form className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row" action="#" method="post">
        <label className="sr-only" htmlFor="cta-email">
          Email address
        </label>
        <input
          id="cta-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={placeholder}
          required
          className="w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {loading ? 'Subscribing…' : ctaLabel}
        </button>
      </form>

      {note ? <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{note}</p> : null}
    </section>
  );
}

export const minHeight = 300;

export default function CtaWithEmailCapturePreview() {
  return (
    <CtaWithEmailCapture
      title="Get the monthly changelog"
      copy="One email a month. New features, nothing else. Unsubscribe any time."
      ctaLabel="Subscribe"
      note="We only email once a month."
    />
  );
}
