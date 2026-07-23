'use client';

/**
 * Live preview for `hero-search`.
 *
 * Mirrors the `typescript` code variant verbatim. Interactive - the field is
 * controlled and the tag chips fill it. Keep this in step with
 * `src/data/components/hero.ts`.
 */
import { useId, useState, type FormEvent, type ReactNode } from 'react';

interface HeroSearchProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  placeholder?: string;
  tags?: string[];
  onSearch?: (query: string) => void;
  className?: string;
}

const DEFAULT_TAGS = ['Pricing', 'Dashboards', 'Forms'];

export function HeroSearch({
  title,
  kicker,
  copy,
  placeholder = 'Search 20,000+ templates…',
  tags = DEFAULT_TAGS,
  onSearch,
  className = '',
}: HeroSearchProps) {
  const inputId = useId();
  const [query, setQuery] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSearch?.(query);
  }

  return (
    <section className={`mx-auto w-full max-w-2xl px-4 py-12 text-center sm:py-16 ${className}`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mx-auto mt-7 max-w-xl" role="search">
        <label htmlFor={inputId} className="sr-only">
          Search templates
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              id={inputId}
              name="q"
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-11 pr-3.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Search
          </button>
        </div>
      </form>

      {tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
          <li className="text-gray-500 dark:text-gray-400">Popular:</li>
          {tags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => {
                  setQuery(tag);
                  onSearch?.(tag);
                }}
                className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default function HeroSearchPreview() {
  return (
    <HeroSearch
      title="Find the right component in seconds"
      copy="Search a growing library of accessible, responsive building blocks."
    />
  );
}

export const minHeight = 300;
