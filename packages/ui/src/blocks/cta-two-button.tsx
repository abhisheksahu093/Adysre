/**
 * Live preview for `cta-two-button`.
 * Mirrors the `typescript` code variant in `src/data/components/cta.ts`.
 */
interface CtaTwoButtonProps {
  title: string;
  copy?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CtaTwoButton({
  title,
  copy,
  primaryLabel = 'Start free',
  primaryHref = '#',
  secondaryLabel = 'Book a demo',
  secondaryHref = '#',
}: CtaTwoButtonProps) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={primaryHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto sm:min-w-[11rem] dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {primaryLabel}
        </a>
        <a
          href={secondaryHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto sm:min-w-[11rem] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {secondaryLabel}
        </a>
      </div>
    </section>
  );
}

export const minHeight = 280;

export default function CtaTwoButtonPreview() {
  return (
    <CtaTwoButton
      title="Pick the path that fits your team"
      copy="Self-serve in minutes, or let us walk you through it - either way, no card up front."
      primaryLabel="Start free"
      secondaryLabel="Book a demo"
    />
  );
}
