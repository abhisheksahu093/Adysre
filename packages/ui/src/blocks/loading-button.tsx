'use client';

import { useEffect, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Live preview for `loading-button`.
 *
 * Mirrors the `nextjs`/`typescript` code variant verbatim. The preview drives
 * `loading` on a timer rather than a click, because the spinner is the whole
 * point of the component and a viewer shouldn't have to guess it exists.
 * Keep this in step with `src/data/components/buttons.ts`.
 */
interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}

export function LoadingButton({ loading = false, children, ...props }: LoadingButtonProps) {
  return (
    <button
      type="button"
      // aria-busy tells a screen reader work is in flight; the spinner is
      // decorative and must stay hidden from it.
      aria-busy={loading}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {loading ? (
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  );
}

export default function LoadingButtonPreview() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLoading((current) => !current);
    }, 2000);
    return () => window.clearInterval(id);
  }, []);

  return <LoadingButton loading={loading}>{loading ? 'Saving…' : 'Save changes'}</LoadingButton>;
}
