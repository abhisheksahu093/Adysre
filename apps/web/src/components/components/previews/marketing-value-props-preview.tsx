/**
 * Live preview for `marketing-value-props`.
 *
 * Mirrors the `typescript` code variant verbatim. The grid is one column on
 * phones and grows to three, so nothing crowds at 320px. Icons are inline SVG.
 * The section itself is width-agnostic (`w-full`); the preview supplies the page
 * shell that centres it. Keep in step with `src/data/components/marketing.ts`.
 */
interface ValueProp {
  title: string;
  copy: string;
}

interface ValuePropsProps {
  heading?: string;
  items: ValueProp[];
  className?: string;
}

function ValueProps({ heading, items, className = '' }: ValuePropsProps) {
  return (
    <section className={`w-full px-4 py-8 ${className}`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {heading}
        </h2>
      ) : null}
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="flex flex-col">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">
              {item.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {item.copy}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function MarketingValuePropsPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ValueProps
          heading="Why teams switch"
          items={[
            { title: 'Set up in minutes', copy: 'Import your data and invite the team - no migration project required.' },
            { title: 'Priced for growth', copy: 'One flat seat price with every feature included, however large you get.' },
            { title: 'Secure by default', copy: 'SSO, audit logs and encryption at rest ship on every plan from day one.' },
          ]}
        />
      </div>
    </section>
  );
}

export const minHeight = 320;
