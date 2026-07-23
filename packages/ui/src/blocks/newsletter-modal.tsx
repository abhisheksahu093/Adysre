'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from 'react';

/**
 * Live preview for `newsletter-modal`.
 *
 * `NewsletterModal` mirrors the `typescript` code variant verbatim. The preview
 * wraps it in the page section a modal like this is summoned from: a heading,
 * a line of copy and a Subscribe button. The dialog panel keeps its own
 * `w-[min(100%-2rem,26rem)]` measure - that width is the design, not a preview
 * cap - so nothing there is width-agnostic.
 *
 * It starts closed - a page must never open a modal on load - and the opener stays put
 * so it can be re-summoned after a dismiss. All three exits are real here: try
 * Escape, the close button, and a click on the backdrop.
 *
 * Keep this in step with `src/data/components/marketing.ts`.
 */
interface NewsletterModalProps {
  open: boolean;
  title: string;
  copy?: string;
  ctaLabel?: string;
  dismissLabel?: string;
  onDismiss: () => void;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function NewsletterModal({
  open,
  title,
  copy,
  ctaLabel = 'Subscribe',
  dismissLabel = 'Close',
  onDismiss,
  onSubmit,
  className = '',
}: NewsletterModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = (): void => onDismiss();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onDismiss]);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>): void {
    if (event.target === dialogRef.current) dialogRef.current?.close();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      className={`w-[min(100%-2rem,26rem)] rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl backdrop:bg-black/50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 ${className}`}
    >
      <div className="-mb-2 flex justify-end">
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={() => dialogRef.current?.close()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-2">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
      </form>
    </dialog>
  );
}

export default function NewsletterModalPreview() {
  const [open, setOpen] = useState(false);
  const handleDismiss = useCallback(() => setOpen(false), []);

  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          One good email a week
        </h2>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
          Join 14,000 engineers reading what shipped, what broke and what we learned.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Subscribe
        </button>

        <NewsletterModal
          open={open}
          title="One good email a week"
          copy="Join 14,000 engineers. No spam, and one click to leave."
          ctaLabel="Subscribe"
          dismissLabel="Close"
          onDismiss={handleDismiss}
        />
      </div>
    </section>
  );
}
