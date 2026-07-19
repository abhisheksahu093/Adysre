'use client';

/**
 * Live preview for `typewriter-text`.
 *
 * Mirrors the `typescript` code variant (minus the JSX.Element annotation, per
 * the preview convention). Keep in step with `src/data/components/animation.ts`.
 */
import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  loop?: boolean;
  showCursor?: boolean;
  className?: string;
}

function TypewriterText({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseMs = 1400,
  loop = true,
  showCursor = true,
  className = '',
}: TypewriterTextProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const current = words[index % words.length] ?? '';

  useEffect(() => {
    if (reduce || words.length === 0) return;

    if (!deleting && text === current) {
      if (!loop && index === words.length - 1) return;
      const hold = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(hold);
    }

    if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const tick = setTimeout(
      () => {
        setText((prev) => (deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)));
      },
      deleting ? deletingSpeed : typingSpeed,
    );
    return () => clearTimeout(tick);
  }, [text, deleting, current, index, loop, pauseMs, typingSpeed, deletingSpeed, reduce, words.length]);

  const display = reduce ? current : text;

  return (
    <span className={className}>
      <span aria-hidden="true">{display}</span>
      {showCursor && !reduce ? (
        <span
          className="ml-0.5 inline-block h-[1em] w-0.5 animate-pulse bg-current align-middle motion-reduce:animate-none"
          aria-hidden="true"
        />
      ) : null}
      <span className="sr-only">{current}</span>
    </span>
  );
}

export default function TypewriterTextPreview() {
  return (
    <div className="w-full max-w-xl px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Built for
      </p>
      <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
        <TypewriterText words={['fast teams', 'bold ideas', 'shipping daily']} />
      </h2>
    </div>
  );
}
