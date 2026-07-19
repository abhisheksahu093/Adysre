/**
 * Live preview for `cta-app-download`.
 * Mirrors the `typescript` code variant in `src/data/components/cta.ts`.
 */
interface CtaAppDownloadProps {
  title: string;
  copy?: string;
  appStoreHref?: string;
  playStoreHref?: string;
}

function CtaAppDownload({
  title,
  copy,
  appStoreHref = '#',
  playStoreHref = '#',
}: CtaAppDownloadProps) {
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

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={appStoreHref}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-5 py-3 text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <svg className="h-7 w-7 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.06-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="text-left leading-none">
            <span className="block text-[0.625rem] font-medium opacity-80">Download on the</span>
            <span className="mt-0.5 block text-lg font-semibold">App Store</span>
          </span>
        </a>

        <a
          href={playStoreHref}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-5 py-3 text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <svg className="h-7 w-7 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 3.5v17a1 1 0 0 0 1.5.87l14-8.5a1 1 0 0 0 0-1.74l-14-8.5A1 1 0 0 0 4 3.5z" />
          </svg>
          <span className="text-left leading-none">
            <span className="block text-[0.625rem] font-medium opacity-80">Get it on</span>
            <span className="mt-0.5 block text-lg font-semibold">Google Play</span>
          </span>
        </a>
      </div>
    </section>
  );
}

export const minHeight = 320;

export default function CtaAppDownloadPreview() {
  return (
    <CtaAppDownload
      title="Take it with you"
      copy="The full workspace in your pocket - free on iOS and Android."
    />
  );
}
