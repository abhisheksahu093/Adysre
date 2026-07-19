/**
 * Live preview for `social-proof-strip`. Mirrors the `typescript` variant.
 * Keep in step with `src/data/components/social.ts`.
 */
type ProofPlatform = 'x' | 'youtube' | 'instagram';

interface FollowerStat {
  platform: ProofPlatform;
  count: string;
  label: string;
}

const ICONS: Record<ProofPlatform, string> = {
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  youtube:
    'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
};

interface SocialProofStripProps {
  proofLabel?: string;
  logos?: string[];
  followers?: FollowerStat[];
  className?: string;
}

function SocialProofStrip({
  proofLabel = 'As seen on',
  logos = [],
  followers = [],
  className = '',
}: SocialProofStripProps) {
  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {proofLabel}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {logos.map((logo) => (
          <span key={logo} className="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">
            {logo}
          </span>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {followers.map((f) => (
          <span key={f.label} className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
              <path d={ICONS[f.platform]} />
            </svg>
            <span>
              <strong className="font-bold text-gray-900 dark:text-gray-100">{f.count}</strong> {f.label}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

export default function SocialProofStripPreview() {
  return (
    <SocialProofStrip
      logos={['TechDaily', 'Wireframe', 'The Verge', 'Product Hunt']}
      followers={[
        { platform: 'x', count: '48K', label: 'followers on X' },
        { platform: 'youtube', count: '120K', label: 'subscribers' },
        { platform: 'instagram', count: '31K', label: 'followers' },
      ]}
    />
  );
}

export const minHeight = 260;
