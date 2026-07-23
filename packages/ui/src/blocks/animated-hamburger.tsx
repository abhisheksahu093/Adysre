'use client';

/**
 * Live preview for `animated-hamburger`. Mirrors the `typescript` code variant.
 * Bars morph into an X on toggle; state still flips under reduced motion, only
 * the transition is dropped.
 */
import { useState } from 'react';

interface AnimatedHamburgerProps {
  label?: string;
  className?: string;
  onToggle?: (open: boolean) => void;
}

export function AnimatedHamburger({ label = 'Toggle menu', className = '', onToggle }: AnimatedHamburgerProps) {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-label={label}
      className={`inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ${className}`}
    >
      <span className={`h-0.5 w-6 rounded-full bg-gray-900 transition-transform duration-300 ease-out motion-reduce:transition-none dark:bg-gray-100 ${open ? 'translate-y-2 rotate-45' : ''}`} />
      <span className={`h-0.5 w-6 rounded-full bg-gray-900 transition-opacity duration-300 ease-out motion-reduce:transition-none dark:bg-gray-100 ${open ? 'opacity-0' : 'opacity-100'}`} />
      <span className={`h-0.5 w-6 rounded-full bg-gray-900 transition-transform duration-300 ease-out motion-reduce:transition-none dark:bg-gray-100 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
    </button>
  );
}

export default function AnimatedHamburgerPreview() {
  return <AnimatedHamburger />;
}
