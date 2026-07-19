/**
 * Live preview for `hero-animated-words`.
 *
 * Mirrors the `typescript` code variant verbatim. The word rotator is CSS-only,
 * so no hooks and no 'use client'. Keep this in step with
 * `src/data/components/hero.ts`.
 */
import type { ReactNode } from 'react';

const ROTATE_KEYFRAMES = `
  @keyframes hero-word-rotate {
    0%, 16%   { transform: translateY(0); }
    25%, 41%  { transform: translateY(-100%); }
    50%, 66%  { transform: translateY(-200%); }
    75%, 91%  { transform: translateY(-300%); }
    100%      { transform: translateY(-400%); }
  }
`;

interface HeroAnimatedWordsProps {
  lead: ReactNode;
  words?: string[];
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const DEFAULT_WORDS = ['ships', 'scales', 'adapts', 'delights'];

function HeroAnimatedWords({
  lead,
  words = DEFAULT_WORDS,
  kicker,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}: HeroAnimatedWordsProps) {
  return (
    <section className={`mx-auto w-full max-w-3xl px-4 py-12 text-center sm:py-20 ${className}`}>
      <style>{ROTATE_KEYFRAMES}</style>

      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {lead}{' '}
        <span className="relative inline-flex h-[1.15em] overflow-hidden align-bottom text-blue-600 dark:text-blue-400">
          <span className="flex flex-col animate-[hero-word-rotate_9s_infinite] motion-reduce:animate-none">
            {[...words, words[0]].map((word, i) => (
              <span key={i} className="flex h-[1.15em] items-center leading-none">
                {word}
              </span>
            ))}
          </span>
        </span>
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </section>
  );
}

export default function HeroAnimatedWordsPreview() {
  return (
    <HeroAnimatedWords
      lead="Software that"
      words={['ships', 'scales', 'adapts', 'delights']}
      copy="One platform that keeps pace with your team, whatever you are building."
      ctaLabel="Get started"
      ctaHref="#"
    />
  );
}

export const minHeight = 260;
