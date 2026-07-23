/** TAVOLA - the eyebrow + title pair every section opens with. */
export function TavolaSectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--tv-accent)]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-[30px] font-bold sm:text-[38px]">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--tv-ink-soft)]">{subtitle}</p>
      )}
    </div>
  );
}
