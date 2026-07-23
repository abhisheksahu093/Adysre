/**
 * Live preview for `marquee-gradient-mask-edges`.
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/marquees.ts`.
 */
const MASK_KEYFRAMES = `
  @keyframes marquee-mask-scroll {
    to { transform: translateX(-50%); }
  }
`;

const DEFAULT_ITEMS = ['Vertex', 'Lumen', 'Cobalt', 'Aurora', 'Nimbus', 'Quartz'];

interface MarqueeGradientMaskEdgesProps {
  items?: string[];
  durationSeconds?: number;
  className?: string;
}

export function MarqueeGradientMaskEdges({ items = DEFAULT_ITEMS, durationSeconds = 28, className = '' }: MarqueeGradientMaskEdgesProps) {
  const group = (hidden: boolean) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-12 pr-12 motion-reduce:hidden' : 'flex shrink-0 items-center gap-12 pr-12 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">{item}</li>
      ))}
    </ul>
  );

  return (
    <section
      className={`w-full overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] ${className}`}
      aria-label="Featured brands"
    >
      <style>{MASK_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-mask-scroll_28s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}

export default function MarqueeGradientMaskEdgesPreview() {
  return <MarqueeGradientMaskEdges />;
}
