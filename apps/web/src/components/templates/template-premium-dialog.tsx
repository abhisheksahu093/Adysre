'use client';

import { useTranslations } from 'next-intl';
import { Lock, Check } from 'lucide-react';
import { Button, Dialog, buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';

interface TemplatePremiumDialogProps {
  /** The locked template's name, or null when the gate is closed. */
  templateName: string | null;
  onClose: () => void;
}

/**
 * Shown when someone tries to unlock a premium template they haven't paid for.
 *
 * This is the *explanation*, not the enforcement: a locked template's prompt
 * and downloads are already withheld server-side (see `lib/access.ts`), so
 * there is nothing here to bypass. The dialog lays out what premium access adds
 * and sends the visitor to pricing.
 */
export function TemplatePremiumDialog({ templateName, onClose }: TemplatePremiumDialogProps) {
  const t = useTranslations('templates.premium');

  if (!templateName) return null;

  return (
    <Dialog
      open
      onClose={onClose}
      title={t('title')}
      description={t('description', { name: templateName })}
      className="sm:max-w-md"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('notNow')}
          </Button>
          <Link href="/pricing" className={cn(buttonVariants(), 'gap-1.5')}>
            {t('cta')}
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning"
            aria-hidden
          >
            <Lock className="h-5 w-5" />
          </div>
        </div>

        <ul className="mx-auto max-w-xs space-y-2">
          {['unlockAll', 'unlockDownload', 'unlockUpdates'].map((key) => (
            <li key={key} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="text-sm text-muted-foreground">{t(`benefits.${key}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </Dialog>
  );
}
