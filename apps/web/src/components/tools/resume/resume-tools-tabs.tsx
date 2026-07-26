'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileSearch, FileUser } from 'lucide-react';
import { cn } from 'adysre';
import { AtsScanner } from '@/components/tools/ats/ats-scanner';
import { ResumeBuilder } from './resume-builder';

/**
 * Resume tools tabs. One page, two tools: the ATS scanner (score a resume
 * against a job description) and the resume builder (compose a print-ready
 * resume). Only the active tool mounts, so each keeps its own print isolation
 * target.
 */

const TABS = [
  { id: 'scanner', icon: FileSearch },
  { id: 'builder', icon: FileUser },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function ResumeToolsTabs() {
  const t = useTranslations('tools.resume');
  const [active, setActive] = useState<TabId>('scanner');

  return (
    <div className="space-y-6">
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

      {active === 'scanner' ? <AtsScanner /> : <ResumeBuilder />}
    </div>
  );
}
