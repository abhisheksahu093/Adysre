'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Copy text to the clipboard and report a short-lived `copied` flag for UI
 * feedback. The async Clipboard API needs a secure context and permission, so
 * a `execCommand` path covers the cases where it isn't available.
 */
export function useClipboard(resetAfterMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Don't setState after unmount if the card disappears mid-timeout.
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      let ok = false;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          ok = true;
        } else {
          const el = document.createElement('textarea');
          el.value = text;
          el.setAttribute('readonly', '');
          el.style.position = 'fixed';
          el.style.opacity = '0';
          document.body.appendChild(el);
          el.select();
          ok = document.execCommand('copy');
          document.body.removeChild(el);
        }
      } catch {
        ok = false;
      }

      if (ok) {
        setCopied(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetAfterMs);
      }
      return ok;
    },
    [resetAfterMs],
  );

  return { copy, copied };
}
