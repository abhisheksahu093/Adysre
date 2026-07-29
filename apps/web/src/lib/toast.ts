import { useToastStore, type ToastInput, type ToastVariant } from '@/stores/toast-store';

/**
 * Fire a toast from anywhere.
 *
 * Reads the store through `getState()` rather than a hook on purpose: most of
 * the places worth announcing are not render paths. They are submit handlers,
 * mutation callbacks and catch blocks, where a hook cannot be called at all.
 *
 * Copy is passed in already translated. This module never touches `next-intl`,
 * because the caller is the only layer that knows which namespace the message
 * belongs to, and a toast helper that owned its own strings would be a second
 * catalogue to keep in step with the first.
 */

type Options = Omit<ToastInput, 'variant' | 'title'>;

function fire(variant: ToastVariant, title: string, options?: Options): string {
  return useToastStore.getState().push({ ...options, variant, title });
}

export const toast = {
  success: (title: string, options?: Options) => fire('success', title, options),
  error: (title: string, options?: Options) => fire('error', title, options),
  warning: (title: string, options?: Options) => fire('warning', title, options),
  info: (title: string, options?: Options) => fire('info', title, options),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
  clear: () => useToastStore.getState().clear(),
};
