/**
 * Live preview for `hero-cards-collage`.
 *
 * Mirrors the `typescript` code variant verbatim. The cards stack on the narrow
 * stage, so `minHeight` gives them room. Keep this in step with
 * `src/data/components/hero.ts`.
 */
import type { ReactNode } from 'react';

interface HeroCollageCard {
  quote: string;
  name: string;
}

interface HeroCardsCollageProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  cards?: HeroCollageCard[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const AVATAR_STYLES = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
] as const;

const DEFAULT_CARDS: HeroCollageCard[] = [
  { quote: 'We cut our deploy time in half the first week.', name: 'Ada R.' },
  { quote: 'The one tool the whole team actually agreed on.', name: 'Jamal M.' },
  { quote: 'Onboarding took an afternoon, not a quarter.', name: 'Sofia K.' },
];

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function HeroCardsCollage({
  title,
  kicker,
  copy,
  cards = DEFAULT_CARDS,
  ctaLabel = 'Join them',
  ctaHref = '#',
  className = '',
}: HeroCardsCollageProps) {
  return (
    <section className={`mx-auto w-full max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-16 ${className}`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
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

      <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
        {cards.slice(0, 3).map((card, i) => (
          <figure
            key={card.name}
            className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${
              i % 2 === 0 ? 'sm:mt-6' : ''
            }`}
          >
            <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              &ldquo;{card.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_STYLES[i % AVATAR_STYLES.length]} text-xs font-bold text-white`}
              >
                {initials(card.name)}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{card.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default function HeroCardsCollagePreview() {
  return (
    <HeroCardsCollage
      title="Loved by the teams who ship"
      copy="Read why thousands of builders made the switch and never looked back."
      ctaLabel="Join them"
      ctaHref="#"
    />
  );
}

export const minHeight = 520;
