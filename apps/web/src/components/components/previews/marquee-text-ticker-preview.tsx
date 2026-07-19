/**
 * Live preview for `marquee-text-ticker`.
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/marquees.ts`.
 */
const TICKER_KEYFRAMES = `
  @keyframes marquee-ticker-scroll {
    to { transform: translateX(-50%); }
  }
`;

const DEFAULT_ITEMS = ['Ship in minutes', 'Zero config', 'Type-safe by default', 'Scales to zero', 'Edge-ready', 'Open source'];

interface MarqueeTextTickerProps {
  items?: string[];
  durationSeconds?: number;
  className?: string;
}

function MarqueeTextTicker({ items = DEFAULT_ITEMS, durationSeconds = 24, className = '' }: MarqueeTextTickerProps) {
  const group = (hidden: boolean) => (
    <div
      className={hidden ? 'flex shrink-0 items-center motion-reduce:hidden' : 'flex shrink-0 items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2'}
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <span key={item} className="inline-flex shrink-0 items-center gap-6 pr-6">
          <span className="whitespace-nowrap text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{item}</span>
          <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <section className={`w-full overflow-hidden py-4 ${className}`} aria-label="Product highlights">
      <style>{TICKER_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-ticker-scroll_24s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}

export default function MarqueeTextTickerPreview() {
  return <MarqueeTextTicker />;
}
