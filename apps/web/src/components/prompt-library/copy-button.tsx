'use client';

import { useTranslations } from 'next-intl';
import { Copy, Check } from 'lucide-react';
import { Button, cn, type ButtonProps } from '@adysre/ui';
import { useClipboard } from '@/hooks/use-clipboard';

interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  /** Text placed on the clipboard. */
  value: string;
  /** Overrides the default 'Copy' label. */
  label?: string;
}

/** Copy-to-clipboard button with inline confirmation. */
export function CopyButton({
  value,
  label,
  variant = 'secondary',
  size = 'sm',
  className,
  ...props
}: CopyButtonProps) {
  const { copy, copied } = useClipboard();
  const t = useTranslations('common');
  const text = label ?? t('copy');

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      // Announce the state change to screen readers, which never see the icon swap.
      aria-label={copied ? `${text}: ${t('copied')}` : text}
      onClick={() => void copy(value)}
      className={cn('gap-1.5', className)}
      {...props}
    >
      {copied ? <Check className="h-3.5 w-3.5 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
      <span>{copied ? t('copied') : text}</span>
    </Button>
  );
}
