/**
 * Live preview for `marquee-logos-strip`.
 * Mirrors the `typescript` code variant verbatim, including the <style> tag -
 * the keyframes travel with the component. Keep this in step with
 * `src/data/components/marquees.ts`.
 */
const LOGOS_KEYFRAMES = `
  @keyframes marquee-logos-scroll {
    to { transform: translateX(-50%); }
  }
`;

const DEFAULT_LOGOS = ['Adysre Corp', 'Northwind', 'Globex', 'Initech', 'Umbrella', 'Stark Labs', 'Wayne Tech', 'Hooli'];

interface MarqueeLogosStripProps {
  logos?: string[];
  durationSeconds?: number;
  className?: string;
}

export function MarqueeLogosStrip({ logos = DEFAULT_LOGOS, durationSeconds = 32, className = '' }: MarqueeLogosStripProps) {
  const group = (hidden: boolean) => (
    <ul
      className={
        hidden
          ? 'flex shrink-0 items-center gap-12 pr-12 motion-reduce:hidden'
          : 'flex shrink-0 items-center gap-12 pr-12 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0'
      }
      aria-hidden={hidden || undefined}
    >
      {logos.map((logo) => (
        <li key={logo} className="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">
          {logo}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={`w-full overflow-hidden py-8 ${className}`} aria-label="Trusted by these companies">
      <style>{LOGOS_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-logos-scroll_32s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}

export default function MarqueeLogosStripPreview() {
  return <MarqueeLogosStrip />;
}
