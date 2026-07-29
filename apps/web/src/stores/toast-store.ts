import { create } from 'zustand';

/**
 * Transient messages: the queue behind `@/lib/toast`.
 *
 * Deliberately NOT persisted, unlike `notifications-store`. That store records
 * which product announcements you have read, and those must survive a reload.
 * A toast is the opposite kind of message: it reports what just happened, and
 * one that reappeared after a refresh would be reporting an event that is over.
 *
 * Timers do not live here. They belong to the view, which is the only layer that
 * can know a toast is hovered or focused and hold it open (WCAG 2.2.1: a message
 * that vanishes on a fixed timer is unusable to anyone who reads slowly, or who
 * is still moving toward the dismiss button).
 */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

/** Long enough to read a short sentence, short enough not to nag. */
export const DEFAULT_TOAST_DURATION = 4000;

/** Beyond this the stack covers content it is meant to comment on. */
const MAX_VISIBLE = 3;

/**
 * Optionals are written `?: T | undefined` throughout: the workspace runs with
 * `exactOptionalPropertyTypes`, where a bare `?:` means "may be absent" but not
 * "may be undefined", and every field here is forwarded straight from a caller
 * that may legitimately have nothing to say.
 */
export interface ToastInput {
  variant?: ToastVariant | undefined;
  title: string;
  description?: string | undefined;
  /** ms before auto-dismiss. `0` pins it until dismissed by hand. */
  duration?: number | undefined;
  /**
   * Collapses repeats. A second toast with the same key replaces the first and
   * restarts its timer rather than stacking, so a quota warning that fires on
   * every click says one thing once.
   */
  dedupeKey?: string | undefined;
}

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string | undefined;
  duration: number;
  dedupeKey?: string | undefined;
  /** Bumped when a duplicate lands, so the view restarts its dismiss timer. */
  seq: number;
}

interface ToastStore {
  toasts: Toast[];
  push: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

/**
 * Ids come from a counter, not from the clock or a random source: two toasts
 * pushed in the same tick would collide on `Date.now()`, and React would then
 * reuse one row's DOM (and its running timer) for the other.
 */
let nextId = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  push: (input) => {
    const existingKey = input.dedupeKey;
    let id = `toast-${(nextId += 1)}`;

    set((state) => {
      const duplicate = existingKey
        ? state.toasts.find((t) => t.dedupeKey === existingKey)
        : undefined;

      if (duplicate) {
        // Keep the original id so the row is updated in place rather than
        // unmounted and remounted, which would replay the enter animation.
        id = duplicate.id;
        return {
          toasts: state.toasts.map((t) =>
            t.id === duplicate.id
              ? {
                  ...t,
                  variant: input.variant ?? 'info',
                  title: input.title,
                  description: input.description,
                  duration: input.duration ?? DEFAULT_TOAST_DURATION,
                  seq: t.seq + 1,
                }
              : t,
          ),
        };
      }

      const toast: Toast = {
        id,
        variant: input.variant ?? 'info',
        title: input.title,
        description: input.description,
        duration: input.duration ?? DEFAULT_TOAST_DURATION,
        dedupeKey: input.dedupeKey,
        seq: 0,
      };

      // Oldest out first: the newest message is the one that describes what the
      // user just did.
      return { toasts: [...state.toasts, toast].slice(-MAX_VISIBLE) };
    });

    return id;
  },

  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  clear: () => set({ toasts: [] }),
}));
