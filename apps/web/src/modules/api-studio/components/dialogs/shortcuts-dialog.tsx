'use client';

import { useTranslations } from 'next-intl';
import { Dialog } from 'adysre';
import { SHORTCUTS } from '../../constants/shortcuts';

/**
 * The keyboard reference.
 *
 * Rendered from the same table the key handler reads, so a shortcut that
 * changed cannot be documented wrong here. `mod` is resolved per platform at
 * render time, which is why the table stores it that way rather than baking in
 * one platform's key.
 */
export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('apiStudio');

  // `navigator` is absent during server rendering, so the check is deferred to
  // render rather than module scope.
  const isApple =
    typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.userAgent);

  function render(chord: string): string[] {
    return chord.split('+').map((key) => {
      if (key === 'mod') return isApple ? '⌘' : 'Ctrl';
      if (key === 'alt') return isApple ? '⌥' : 'Alt';
      if (key === 'shift') return isApple ? '⇧' : 'Shift';
      if (key === 'enter') return isApple ? '⏎' : 'Enter';
      if (key === 'backspace') return isApple ? '⌫' : 'Backspace';
      if (key === 'left') return '←';
      if (key === 'right') return '→';
      return key.length === 1 ? key.toUpperCase() : key;
    });
  }

  return (
    <Dialog open={open} onClose={onClose} title={t('shortcuts.title')} className="max-w-lg">
      <dl className="divide-y divide-border text-xs">
        {SHORTCUTS.map((shortcut) => (
          <div key={shortcut.action} className="flex items-center justify-between gap-4 py-1.5">
            <dt>{t(`shortcuts.${shortcut.labelKey}`)}</dt>
            <dd className="flex shrink-0 items-center gap-1">
              {render(shortcut.keys).map((key, index) => (
                <kbd
                  key={index}
                  className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]"
                >
                  {key}
                </kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Dialog>
  );
}
