'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Barcode, QrCode } from 'lucide-react';
import { cn } from 'adysre';
import { QrGenerator } from '@/components/tools/qr/qr-generator';
import { SavedCodes } from '@/components/tools/qr/saved-codes';
import { BarcodeGenerator } from '@/components/tools/barcode/barcode-generator';

/**
 * Code Generator tabs. One page, two symbologies: the QR code generator (with
 * its saved codes) and the barcode generator, switched with a tab bar rather
 * than living on separate routes. Only the active generator mounts, so each
 * keeps its own heavy client rendering library scoped to when it is shown.
 */

const TABS = [
  { id: 'qr', icon: QrCode },
  { id: 'barcode', icon: Barcode },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function CodeTabs() {
  const t = useTranslations('tools.codes');
  const [active, setActive] = useState<TabId>('qr');

  return (
    <div className="space-y-8">
      <div role="tablist" aria-label={t('title')} className="flex gap-1 border-b border-border">
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active === id}
            onClick={() => setActive(id)}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              active === id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {t(`tabs.${id}`)}
          </button>
        ))}
      </div>

      {active === 'qr' ? (
        <div className="space-y-8">
          <QrGenerator />
          <SavedCodes />
        </div>
      ) : (
        <BarcodeGenerator />
      )}
    </div>
  );
}
