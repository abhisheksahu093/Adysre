'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { cn } from 'adysre';
import { FAQ_KEYS } from '@/data/pricing';
import { SUPPORT_EMAIL } from '@/config/site';

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card/60">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-trigger`}
          className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
              open && 'rotate-180',
            )}
            aria-hidden
          />
          <span className="text-sm font-medium text-foreground">{question}</span>
        </button>
      </h3>

      {/* Unmounted rather than hidden: keeps collapsed answers out of the
          accessibility tree and out of in-page find. */}
      {open && (
        <div
          id={`${id}-panel`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          className="px-4 pb-4 pl-11"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">{answer}</p>
        </div>
      )}
    </div>
  );
}

/**
 * FAQ list. Items come from FAQ_KEYS and are resolved against the catalogue,
 * so adding a question is one key here plus copy in each locale.
 */
export function FaqAccordion() {
  const t = useTranslations('pricing.faq.items');
  // Accordion, not independent toggles: only one answer open at a time keeps
  // the list scannable. `null` = all collapsed.
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {FAQ_KEYS.map((key) => (
        <FaqItem
          key={key}
          question={t(`${key}.q`)}
          // Passed to every answer: only some reference {email}, but next-intl
          // throws on a missing param, and a translator may add it anywhere.
          answer={t(`${key}.a`, { email: SUPPORT_EMAIL })}
          open={openKey === key}
          onToggle={() => setOpenKey((cur) => (cur === key ? null : key))}
        />
      ))}
    </div>
  );
}
