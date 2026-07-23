'use client';

import { useTranslations } from 'next-intl';
import { Lock, Check } from 'lucide-react';
import { Button, Dialog, buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';

/** Reasons the gate can be shown - drives the verb in the copy. */
export type GateAction = 'copy' | 'edit';

interface PremiumGateDialogProps {
  /** The locked prompt's title, or null when closed. */
  promptTitle: string | null;
  action: GateAction;
  onClose: () => void;
}

/**
 * Shown when someone tries to copy or edit a prompt they haven't paid for.
 *
 * This is the *explanation*, not the enforcement - the body was already
 * withheld server-side by `redactLockedPrompts`, so there is nothing here to
 * bypass. See `lib/access.ts`.
 */
export function PremiumGateDialog({ promptTitle, action, onClose }: PremiumGateDialogProps) {
  const t = useTranslations('premiumGate');

  if (!promptTitle) return null;

  return (
    <Dialog
      open
      onClose={onClose}
      title={t('title')}
      description={t(action === 'copy' ? 'descriptionCopy' : 'descriptionEdit', {
        title: promptTitle,
      })}
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
          {['unlockAll', 'unlockEdit', 'unlockUpdates'].map((key) => (
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
