'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog } from 'adysre';
import { PaletteCode } from './palette-code';

/**
 * The quick-view shell: a wide dialog holding the editable swatches (children)
 * with the copyable/downloadable code block pinned below.
 */
export function PaletteCodeDialog({
  open,
  onClose,
  title,
  colors,
  name,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  colors: string[];
  name: string;
  children: ReactNode;
}) {
  const t = useTranslations('palettes');
  return (
    <Dialog open={open} onClose={onClose} title={title} className="sm:max-w-2xl">
      <div className="space-y-5">
        {children}
        <div data-tour="quickview-code" className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('code.title')}
          </p>
          <PaletteCode colors={colors} name={name} />
        </div>
      </div>
    </Dialog>
  );
}
