/**
 * Live preview for `marquee-dual-row-opposite`.
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/marquees.ts`.
 */
export const minHeight = 200;

const DUAL_KEYFRAMES = `
  @keyframes marquee-dual-scroll {
    to { transform: translateX(-50%); }
  }
`;

const DEFAULT_TOP = ['TypeScript', 'React', 'Next.js', 'Tailwind', 'Zod', 'Vite'];
const DEFAULT_BOTTOM = ['Postgres', 'Redis', 'Docker', 'GraphQL', 'Prisma', 'BullMQ'];

const CHIP = 'inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300';

interface MarqueeDualRowOppositeProps {
  topItems?: string[];
  bottomItems?: string[];
  durationSeconds?: number;
  className?: string;
}

export function MarqueeDualRowOpposite({ topItems = DEFAULT_TOP, bottomItems = DEFAULT_BOTTOM, durationSeconds = 30, className = '' }: MarqueeDualRowOppositeProps) {
  const group = (items: string[], hidden: boolean) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-3 pr-3 motion-reduce:hidden' : 'flex shrink-0 items-center gap-3 pr-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className={CHIP}>{item}</li>
      ))}
    </ul>
  );

  const row = (items: string[], reverse: boolean) => (
    <div className="w-full overflow-hidden">
      <div
        className={`flex w-max animate-[marquee-dual-scroll_30s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none ${reverse ? '[animation-direction:reverse]' : ''}`}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {group(items, false)}
        {group(items, true)}
      </div>
    </div>
  );

  return (
    <section className={`flex w-full flex-col gap-4 ${className}`} aria-label="Technologies we use">
      <style>{DUAL_KEYFRAMES}</style>
      {row(topItems, false)}
      {row(bottomItems, true)}
    </section>
  );
}

export default function MarqueeDualRowOppositePreview() {
  return <MarqueeDualRowOpposite />;
}
