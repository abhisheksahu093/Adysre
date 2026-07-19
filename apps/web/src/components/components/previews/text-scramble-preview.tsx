'use client';

/**
 * Live preview for `text-scramble`. Mirrors the `typescript` code variant.
 * Resolves scrambled glyphs into the target text; reduced motion shows it whole.
 */
import { useEffect, useState } from 'react';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}-=+*^?#';

interface TextScrambleProps {
  text: string;
  speedMs?: number;
  className?: string;
}

function TextScramble({ text, speedMs = 40, className = '' }: TextScrambleProps) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }
    let revealed = 0;
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      if (frame % 3 === 0) revealed += 1;
      const out = text
        .split('')
        .map((ch, i) => {
          if (i < revealed || ch === ' ') return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? ch;
        })
        .join('');
      setDisplay(out);
      if (revealed >= text.length) window.clearInterval(id);
    }, speedMs);
    return () => window.clearInterval(id);
  }, [text, speedMs]);

  return (
    <span className={`font-mono ${className}`} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

export default function TextScramblePreview() {
  return (
    <div className="px-4 text-center">
      <TextScramble text="DECRYPTING SIGNAL" className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-gray-100" />
    </div>
  );
}
