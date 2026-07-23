/**
 * Live preview for `marketing-logos-social-proof`.
 *
 * Mirrors the `typescript` code variant verbatim. Logos are inline SVG marks +
 * a wordmark, never external images, and the row wraps rather than overflowing
 * at 320px. The section itself is width-agnostic (`w-full`); the preview supplies
 * the page shell that centres it. Keep in step with
 * `src/data/components/marketing.ts`.
 */
interface LogoItem {
  name: string;
}

interface LogosSocialProofProps {
  title?: string;
  logos: LogoItem[];
  className?: string;
}

export function LogosSocialProof({
  title = 'Trusted by teams at',
  logos,
  className = '',
}: LogosSocialProofProps) {
  return (
    <section
      className={`w-full px-4 py-8 text-center ${className}`}
      aria-label={title}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
        {logos.map((logo) => (
          <li
            key={logo.name}
            className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-gray-700 motion-reduce:transition-none dark:text-gray-500 dark:hover:text-gray-200"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 2 3 7v10l9 5 9-5V7z" strokeLinejoin="round" />
            </svg>
            <span className="text-base font-bold tracking-tight">{logo.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function MarketingLogosSocialProofPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <LogosSocialProof
          logos={[
            { name: 'Northwind' },
            { name: 'Acme' },
            { name: 'Globex' },
            { name: 'Umbra' },
            { name: 'Initech' },
          ]}
        />
      </div>
    </section>
  );
}

export const minHeight = 220;
