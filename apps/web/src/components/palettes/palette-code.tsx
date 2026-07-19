'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy, Download } from 'lucide-react';
import { Button, cn } from '@adysre/ui';
import { useClipboard } from '@/hooks/use-clipboard';
import { downloadText } from '@/lib/playground-export';
import {
  PALETTE_FORMATS,
  formatPalette,
  type PaletteFormatId,
} from '@/lib/palettes/export';

/** Format tabs (CSS / SCSS / Tailwind / Array / JSON) with copy and download. */
export function PaletteCode({ colors, name }: { colors: string[]; name: string }) {
  const t = useTranslations('palettes');
  const tCommon = useTranslations('common');
  const { copy, copied } = useClipboard();
  const [format, setFormat] = useState<PaletteFormatId>('css');

  const active = PALETTE_FORMATS.find((f) => f.id === format) ?? PALETTE_FORMATS[0];
  const code = useMemo(() => formatPalette(colors, name, active?.id ?? 'css'), [colors, name, active]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-2">
        <div role="tablist" aria-label={t('code.formats')} className="flex flex-1 gap-1 overflow-x-auto py-2">
          {PALETTE_FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={format === f.id}
              onClick={() => setFormat(f.id)}
              className={cn(
                'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                format === f.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('code.download', { ext: active?.ext ?? 'txt' })}
            title={t('code.download', { ext: active?.ext ?? 'txt' })}
            onClick={() => downloadText(`${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${active?.ext ?? 'txt'}`, code)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={copied ? tCommon('copied') : tCommon('copy')}
            onClick={() => void copy(code)}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="text-xs">{copied ? tCommon('copied') : tCommon('copy')}</span>
          </Button>
        </div>
      </div>
      <pre className="max-h-56 overflow-auto p-4 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
