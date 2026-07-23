'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw, Languages } from 'lucide-react';
import { Badge, Button, Dialog, Label, Textarea } from 'adysre';
import { ASPECT_RATIOS, PROMPT_MODELS, isNew, type LocalizedPrompt } from '@/data/prompts';
import { CopyButton } from '@/components/ui/copy-button';

interface PromptEditorDialogProps {
  /** The prompt being edited, or null when the dialog is closed. */
  prompt: LocalizedPrompt | null;
  onClose: () => void;
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

/**
 * Edit a prompt to taste, then copy the edited text.
 *
 * Edits are intentionally local and per-session: prompt content is static, so
 * this customises a copy rather than mutating the library.
 */
export function PromptEditorDialog({ prompt, onClose }: PromptEditorDialogProps) {
  const [draft, setDraft] = useState('');
  const t = useTranslations('promptLibrary');
  const tCommon = useTranslations('common');

  // Re-seed whenever a different prompt is opened.
  useEffect(() => {
    if (prompt) setDraft(prompt.body);
  }, [prompt]);

  if (!prompt) return null;

  const models = PROMPT_MODELS.filter((m) => (prompt.model ?? []).includes(m.id));
  const ratios = ASPECT_RATIOS.filter((r) => (prompt.aspectRatio ?? []).includes(r.id));
  const isDirty = draft.trim() !== prompt.body.trim();

  return (
    <Dialog
      open={prompt !== null}
      onClose={onClose}
      title={prompt.title}
      description={t('dialog.description')}
      className="sm:max-w-2xl"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            {tCommon('close')}
          </Button>
          <CopyButton value={draft} label={t('dialog.copyPrompt')} variant="primary" size="md" />
        </>
      }
    >
      <div className="space-y-4">
        {prompt.untranslated && (
          <p className="flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            <Languages className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {t('dialog.englishOriginal')}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">{t(`categories.${prompt.category}`)}</Badge>
          <Badge variant={prompt.tier === 'premium' ? 'warning' : 'outline'}>
            {t(`tiers.${prompt.tier}`)}
          </Badge>
          {prompt.style && <Badge variant="default">{t(`styles.${prompt.style}`)}</Badge>}
          {prompt.featured && <Badge variant="primary">{t('collections.featured')}</Badge>}
          {prompt.trending && <Badge variant="accent">{t('collections.trending')}</Badge>}
          {isNew(prompt) && <Badge variant="success">{t('collections.new')}</Badge>}
          {isDirty && <Badge variant="accent">{t('dialog.edited')}</Badge>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="prompt-body">{t('dialog.promptLabel')}</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDraft(prompt.body)}
              disabled={!isDirty}
              className="gap-1.5 text-xs"
            >
              <RotateCcw className="h-3 w-3" />
              {tCommon('reset')}
            </Button>
          </div>
          <Textarea
            id="prompt-body"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
            className="min-h-56 font-mono text-xs leading-relaxed"
          />
          <p className="text-right text-xs text-muted-foreground">
            {t('dialog.characters', { count: draft.length })}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-3">
          {models.length > 0 && (
            <Meta label={t('dialog.worksWellOn')}>
              {/* Model names are brands - never translated. */}
              {models.map((m) => (
                <Badge key={m.id} variant="outline">
                  {m.label}
                </Badge>
              ))}
            </Meta>
          )}
          {ratios.length > 0 && (
            <Meta label={t('dialog.aspectRatios')}>
              {ratios.map((r) => (
                <Badge key={r.id} variant="outline">
                  {r.id}
                </Badge>
              ))}
            </Meta>
          )}
          <Meta label={t('dialog.tags')}>
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="default">
                #{tag}
              </Badge>
            ))}
          </Meta>
        </div>
      </div>
    </Dialog>
  );
}
