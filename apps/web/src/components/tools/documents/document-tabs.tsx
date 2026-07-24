'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileText, ReceiptText } from 'lucide-react';
import { cn } from 'adysre';
import { InvoiceGenerator } from '@/components/tools/invoice/invoice-generator';
import { SalaryGenerator } from '@/components/tools/salary/salary-generator';

/**
 * Document Generator tabs. One page, two document tools: the invoice/quote/
 * receipt generator and the salary slip generator, switched with a tab bar
 * rather than living on separate routes. Only the active generator is mounted,
 * so each keeps its own print isolation target and there is no cross-talk.
 */

const TABS = [
  { id: 'invoice', icon: FileText },
  { id: 'salary', icon: ReceiptText },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function DocumentTabs() {
  const t = useTranslations('tools.documents');
  const [active, setActive] = useState<TabId>('invoice');

  return (
    <div className="flex flex-col gap-5 lg:grid lg:min-h-0 lg:grid-rows-[auto_minmax(0,1fr)]">
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

      <div className="lg:min-h-0">
        {active === 'invoice' ? <InvoiceGenerator /> : <SalaryGenerator />}
      </div>
    </div>
  );
}
