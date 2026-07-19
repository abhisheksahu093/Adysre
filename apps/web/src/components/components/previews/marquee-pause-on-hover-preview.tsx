/**
 * Live preview for `marquee-pause-on-hover`.
 * Mirrors the `typescript` code variant verbatim. Hover or tab into the strip
 * to pause it. Keep this in step with `src/data/components/marquees.ts`.
 */
interface LinkItem {
  label: string;
  href: string;
}

const PAUSE_KEYFRAMES = `
  @keyframes marquee-pause-scroll {
    to { transform: translateX(-50%); }
  }
`;

const DEFAULT_ITEMS: LinkItem[] = [
  { label: 'Design', href: '#' },
  { label: 'Engineering', href: '#' },
  { label: 'Product', href: '#' },
  { label: 'Marketing', href: '#' },
  { label: 'Sales', href: '#' },
  { label: 'Support', href: '#' },
];

const CHIP = 'inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400';

interface MarqueePauseOnHoverProps {
  items?: LinkItem[];
  durationSeconds?: number;
  className?: string;
}

function MarqueePauseOnHover({ items = DEFAULT_ITEMS, durationSeconds = 30, className = '' }: MarqueePauseOnHoverProps) {
  const group = (hidden: boolean) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-3 pr-3 motion-reduce:hidden' : 'flex shrink-0 items-center gap-3 pr-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.label}>
          <a href={item.href} tabIndex={hidden ? -1 : undefined} className={CHIP}>{item.label}</a>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={`w-full overflow-hidden py-6 ${className}`} aria-label="Browse categories">
      <style>{PAUSE_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-pause-scroll_30s_linear_infinite] [animation-play-state:running] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}

export default function MarqueePauseOnHoverPreview() {
  return <MarqueePauseOnHover />;
}
