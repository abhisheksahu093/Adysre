'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X, type LucideIcon } from 'lucide-react';
import { cn } from 'adysre';
import { useToastStore, type Toast, type ToastVariant } from '@/stores/toast-store';

/**
 * The toast viewport.
 *
 * Mounted once, for the whole app, and mounted ALWAYS - even with nothing to
 * show. That is the point: a live region has to exist before its contents
 * change, or the change is not announced. Rendering the region only when a
 * toast arrives is the classic way to build something that looks right and is
 * silent to a screen reader. Same rule the catalogue states in
 * `data/components/notifications.ts`.
 *
 * `role="status"` (polite), never `role="alert"`. These messages report what
 * just happened; interrupting whatever the user is reading to say "signed in"
 * is louder than the news deserves. Errors that genuinely block someone keep
 * their inline `FormAlert`, which stays on screen and sits next to the control
 * that failed.
 */

/** Matches the exit animation in globals.css, so the row is gone once it fades. */
const EXIT_MS = 160;

const VARIANT_ICONS: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

/**
 * Only the rail and the icon carry the variant; the card stays neutral so the
 * title keeps full contrast against `card` in both themes.
 */
const VARIANT_RAIL: Record<ToastVariant, string> = {
  success: 'bg-success',
  error: 'bg-danger',
  warning: 'bg-warning',
  info: 'bg-primary',
};

const VARIANT_ICON: Record<ToastVariant, string> = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-primary',
};

function ToastRow({ toast }: { toast: Toast }) {
  const t = useTranslations('toast');
  const dismiss = useToastStore((s) => s.dismiss);
  const [leaving, setLeaving] = useState(false);
  // Hovered or focused: the user is reading it, or reaching for the close
  // button. Taking it away mid-reach is the whole reason WCAG asks for this.
  const [held, setHeld] = useState(false);

  const Icon = VARIANT_ICONS[toast.variant];

  const close = useCallback(() => {
    setLeaving(true);
    window.setTimeout(() => dismiss(toast.id), EXIT_MS);
  }, [dismiss, toast.id]);

  useEffect(() => {
    // `duration: 0` pins the toast open until it is dismissed by hand.
    if (!toast.duration || held || leaving) return undefined;
    const timer = window.setTimeout(close, toast.duration);
    return () => window.clearTimeout(timer);
    // `toast.seq` restarts the countdown when a duplicate refreshes this row.
  }, [toast.duration, toast.seq, held, leaving, close]);

  return (
    <div
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
      className={cn(
        'pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg',
        'border border-border bg-card py-3 pl-4 pr-3 shadow-lg',
        leaving ? 'toast-leave' : 'toast-enter',
      )}
    >
      {/* Accent rail: the variant reads at a glance without tinting the text,
          which has to stay at full contrast in both themes. */}
      <span
        className={cn('absolute inset-y-0 left-0 w-1', VARIANT_RAIL[toast.variant])}
        aria-hidden
      />

      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', VARIANT_ICON[toast.variant])} aria-hidden />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{toast.description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={close}
        aria-label={t('dismiss')}
        className={cn(
          'shrink-0 rounded-md p-1 text-muted-foreground transition-colors',
          'hover:bg-muted hover:text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function Toaster() {
  const t = useTranslations('toast');
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      role="status"
      aria-live="polite"
      // Announce only what arrived, not the whole stack again.
      aria-atomic="false"
      aria-label={t('region')}
      className={cn(
        'pointer-events-none fixed z-[100] flex flex-col gap-2',
        // Below the sticky topbar (h-14) rather than over it: a toast that
        // covers the account menu and the upgrade button hides the two controls
        // its own message most often sends people to. Top rather than bottom
        // because the bottom corners are already taken by floating widgets.
        // Full width on phones, a fixed column from `sm` up.
        'inset-x-4 top-20 sm:inset-x-auto sm:right-6 sm:w-80',
      )}
    >
      {toasts.map((toast) => (
        <ToastRow key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
