/**
 * Live preview for `bento-portfolio-masonry`.
 * Mirrors the `typescript` code variant. Keep in step with
 * `src/data/components/bento.ts`.
 */
interface Project {
  title: string;
  category: string;
  href: string;
  gradient: string;
  className?: string;
  minH?: string;
}

const PROJECTS: Project[] = [
  { title: 'Aurora - brand system', category: 'Identity', href: '#', gradient: 'bg-gradient-to-br from-purple-600 to-indigo-700', className: 'sm:col-span-2 sm:row-span-2', minH: 'min-h-56' },
  { title: 'Member app', category: 'Product', href: '#', gradient: 'bg-gradient-to-br from-rose-500 to-orange-500', minH: 'min-h-40' },
  { title: 'Field report', category: 'Editorial', href: '#', gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600', minH: 'min-h-40' },
];

function BentoPortfolioMasonry({ projects = PROJECTS, className = '' }: { projects?: Project[]; className?: string }) {
  return (
    <section className={`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 ${className}`}>
      {projects.map((p, i) => (
        <a
          key={i}
          href={p.href}
          className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-900 ${p.minH ?? 'min-h-40'} ${p.gradient} ${p.className ?? ''}`}
        >
          <span className="relative text-base font-semibold text-white">{p.title}</span>
          <span className="relative text-sm text-white/80">{p.category}</span>
        </a>
      ))}
    </section>
  );
}

export const minHeight = 600;

export default function BentoPortfolioMasonryPreview() {
  return <BentoPortfolioMasonry />;
}
