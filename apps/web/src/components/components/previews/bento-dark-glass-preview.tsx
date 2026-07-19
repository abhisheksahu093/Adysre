/**
 * Live preview for `bento-dark-glass`.
 * Mirrors the `typescript` code variant. Keep in step with
 * `src/data/components/bento.ts`.
 */
interface GlassTile {
  title: string;
  description: string;
  className?: string;
}

const TILES: GlassTile[] = [
  { title: 'Built for scale', description: 'Multi-region by default, with automatic failover you never have to think about.', className: 'sm:col-span-2 sm:row-span-2' },
  { title: 'Zero config', description: 'Push to deploy.' },
  { title: 'Observability', description: 'Traces out of the box.' },
];

function BentoDarkGlass({ tiles = TILES, className = '' }: { tiles?: GlassTile[]; className?: string }) {
  return (
    <section className={`relative isolate w-full overflow-hidden rounded-3xl bg-gray-950 ${className}`}>
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/40 blur-3xl" aria-hidden="true" />
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6">
        {tiles.map((t, i) => (
          <article key={i} className={`rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur ${t.className ?? ''}`}>
            <h3 className="text-sm font-semibold text-white">{t.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-300">{t.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export const minHeight = 440;

export default function BentoDarkGlassPreview() {
  return <BentoDarkGlass />;
}
