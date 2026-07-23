'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Pencil, Star, Flame, Sparkles, Lock } from 'lucide-react';
import { Badge, Button } from 'adysre';
import { isNew, promptImage, type LocalizedPrompt } from '@/data/prompts';
import { CopyButton } from '@/components/ui/copy-button';
import type { GateAction } from './premium-gate-dialog';

interface PromptCardProps {
  prompt: LocalizedPrompt;
  onEdit: (prompt: LocalizedPrompt) => void;
  /** Called instead of copy/edit when the prompt is locked. */
  onLocked: (prompt: LocalizedPrompt, action: GateAction) => void;
  /** Clicking a tag searches for it. */
  onTagClick?: (tag: string) => void;
  /** Eager-load the first row so the grid doesn't pop in on first paint. */
  priority?: boolean;
}

export function PromptCard({
  prompt,
  onEdit,
  onLocked,
  onTagClick,
  priority = false,
}: PromptCardProps) {
  const t = useTranslations('promptLibrary');
  const tCommon = useTranslations('common');
  const fresh = isNew(prompt);
  const { locked } = prompt;

  return (
    <article className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-lg border border-border bg-card">
      <Image
        src={promptImage(prompt)}
        alt=""
        fill
        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        priority={priority}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Scrim: keeps text WCAG AA legible over an unknown photo. */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
        aria-hidden
      />

      <div className="absolute left-3 right-3 top-3 flex flex-wrap items-start justify-between gap-1">
        <div className="flex flex-wrap gap-1">
          {prompt.featured && (
            <Badge variant="primary" className="backdrop-blur">
              <Star className="h-2.5 w-2.5" aria-hidden />
              {t('collections.featured')}
            </Badge>
          )}
          {prompt.trending && (
            <Badge variant="accent" className="backdrop-blur">
              <Flame className="h-2.5 w-2.5" aria-hidden />
              {t('collections.trending')}
            </Badge>
          )}
          {fresh && (
            <Badge variant="success" className="backdrop-blur">
              <Sparkles className="h-2.5 w-2.5" aria-hidden />
              {t('collections.new')}
            </Badge>
          )}
        </div>
        {prompt.tier === 'premium' && (
          <Badge variant="warning" className="backdrop-blur">
            {/* The padlock is what separates "premium, yours" from "premium,
                locked" at a glance - the badge alone can't say that. */}
            {locked && <Lock className="h-2.5 w-2.5" aria-hidden />}
            {t('tiers.premium')}
          </Badge>
        )}
      </div>

      <div className="relative space-y-3 p-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">{prompt.title}</h3>
          <p className="line-clamp-2 text-xs text-white/70">{prompt.description}</p>
        </div>

        {/* Two tags only - the card is a summary, the dialog has the full set. */}
        <div className="flex flex-wrap gap-1">
          {prompt.tags.slice(0, 2).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick?.(tag)}
              aria-label={t('card.searchTag', { tag })}
              className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {locked ? (
            // Enabled, not disabled: a dead button explains nothing. These open
            // the gate, which says why and how to unlock. The body is already
            // gone - redacted server-side - so there's nothing to bypass.
            <>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onLocked(prompt, 'copy')}
                aria-label={t('card.lockedAria', { title: prompt.title })}
                className="flex-1 gap-1.5 bg-white/15 text-white hover:bg-white/25"
              >
                <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>{tCommon('copy')}</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onLocked(prompt, 'edit')}
                aria-label={t('card.lockedAria', { title: prompt.title })}
                className="flex-1 gap-1.5 bg-white/15 text-white hover:bg-white/25"
              >
                <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>{tCommon('edit')}</span>
              </Button>
            </>
          ) : (
            <>
              <CopyButton
                value={prompt.body}
                className="flex-1 bg-white/15 text-white hover:bg-white/25"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onEdit(prompt)}
                aria-label={t('card.editAria', { title: prompt.title })}
                className="flex-1 gap-1.5 bg-white/15 text-white hover:bg-white/25"
              >
                <Pencil className="h-3.5 w-3.5 shrink-0" />
                <span>{tCommon('edit')}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
