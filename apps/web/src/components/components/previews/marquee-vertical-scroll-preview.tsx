/**
 * Live preview for `marquee-vertical-scroll`.
 * Mirrors the `typescript` code variant verbatim. The viewport is a fixed
 * h-64, so the stage needs the extra room. Keep this in step with
 * `src/data/components/marquees.ts`.
 */
export const minHeight = 280;

const VERTICAL_KEYFRAMES = `
  @keyframes marquee-vertical-scroll {
    to { transform: translateY(-50%); }
  }
`;

const DEFAULT_ITEMS = ['Maya deployed to production', 'New signup from Berlin', 'Invoice #4021 paid', 'Nightly backup completed', 'API latency down 12%', 'Weekly report is ready'];

interface MarqueeVerticalScrollProps {
  items?: string[];
  durationSeconds?: number;
  className?: string;
}

function MarqueeVerticalScroll({ items = DEFAULT_ITEMS, durationSeconds = 22, className = '' }: MarqueeVerticalScrollProps) {
  const group = (hidden: boolean) => (
    <ul className={hidden ? 'flex flex-col gap-3 pb-3 motion-reduce:hidden' : 'flex flex-col gap-3 pb-3 motion-reduce:pb-0'} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={`h-64 w-full overflow-hidden motion-reduce:overflow-y-auto ${className}`} aria-label="Latest activity">
      <style>{VERTICAL_KEYFRAMES}</style>
      <div
        className="flex flex-col animate-[marquee-vertical-scroll_22s_linear_infinite] motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}

export default function MarqueeVerticalScrollPreview() {
  return <MarqueeVerticalScroll />;
}
