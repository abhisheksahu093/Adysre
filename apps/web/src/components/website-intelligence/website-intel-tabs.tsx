'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Radar, Search } from 'lucide-react';
import { cn } from 'adysre';

/**
 * Website Intelligence tabs: the working site scanner and the SEO audit. The
 * two panels are passed as slots (the scanner panel is a mix of server and
 * client sections, rendered on the server and toggled here), so this stays a
 * thin client shell around already-rendered content.
 */
const TABS = [
  { id: 'website', icon: Radar },
  { id: 'seo', icon: Search },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function WebsiteIntelTabs({ website, seo }: { website: ReactNode; seo: ReactNode }) {
  const t = useTranslations('websiteIntel.tabs');
  const [active, setActive] = useState<TabId>('website');

  return (
    <div className="space-y-8">
      <div role="tablist" aria-label={t('website')} className="flex gap-1 border-b border-border">
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active === id}
            onClick={() => setActive(id)}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              active === id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {t(id)}
          </button>
        ))}
      </div>

      <div>{active === 'website' ? website : seo}</div>
    </div>
  );
}
