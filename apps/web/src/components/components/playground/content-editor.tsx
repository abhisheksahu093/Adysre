'use client';

import { useTranslations } from 'next-intl';
import { Pencil, RotateCcw, Type } from 'lucide-react';
import { Button, cn } from '@adysre/ui';
import type { LocalizedComponent } from '@/data/components';
import { usePlaygroundStore } from '@/stores/playground-store';
import { overrideCount, type EditableFieldKind } from '@/lib/playground/content';

interface ContentEditorProps {
  /** The component filling the active slot, or `null` when the slot is empty. */
  component: LocalizedComponent | null;
  /** Localised name of the active slot, e.g. "Header". */
  slotLabel: string;
  /**
   * Render to fill a height-constrained parent (the builder sidebar tab): drop
   * the card chrome and let the field list flex and scroll inside the tab panel
   * instead of the editor's own fixed max-height.
   */
  fill?: boolean;
}

/** Multi-line editing for anything longer than a label. */
const MULTILINE_OVER = 48;

/**
 * Edit the copy of the active section - its titles, labels, descriptions and
 * placeholders - and watch the live preview update.
 *
 * The fields aren't authored per component: each section's preview reports the
 * text it actually renders (see `preview-stage`), we list those strings here,
 * and edits flow back to the same preview and into the exported code. That's
 * why it works for every section from header to footer without a bespoke form.
 */
export function ContentEditor({ component, slotLabel, fill = false }: ContentEditorProps) {
  const t = useTranslations('components');
  const fields = usePlaygroundStore((s) =>
    component ? s.sectionFields[component.slug] : undefined,
  );
  const overrides = usePlaygroundStore((s) =>
    component ? s.contentOverrides[component.slug] : undefined,
  );
  const setContentOverride = usePlaygroundStore((s) => s.setContentOverride);
  const resetContent = usePlaygroundStore((s) => s.resetContent);

  const changed = overrideCount(overrides);

  const kindLabel = (kind: EditableFieldKind): string =>
    t.has(`playground.content.kind.${kind}`) ? t(`playground.content.kind.${kind}`) : kind;

  return (
    <div
      data-tour="content"
      className={cn(
        'bg-card',
        fill ? 'flex min-h-0 flex-1 flex-col' : 'rounded-lg border border-border',
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <Pencil className="h-4 w-4 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-tight">
            {t('playground.content.title')}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {component ? slotLabel : t('playground.content.noneSlot')}
          </p>
        </div>
        {changed > 0 && (
          <>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {t('playground.content.editedCount', { count: changed })}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t('playground.content.reset')}
              title={t('playground.content.reset')}
              onClick={() => component && resetContent(component.slug)}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>

      {!component ? (
        <Empty icon={<Type className="h-5 w-5" aria-hidden />} text={t('playground.content.empty')} />
      ) : !fields || fields.length === 0 ? (
        <Empty
          icon={<Type className="h-5 w-5 animate-pulse" aria-hidden />}
          text={t('playground.content.reading')}
        />
      ) : (
        <div
          className={cn(
            'space-y-3 overflow-y-auto p-3',
            fill ? 'min-h-0 flex-1' : 'max-h-[26rem]',
          )}
        >
          {fields.map((field) => {
            const value = overrides?.[field.text] ?? field.text;
            const dirty = value !== field.text;
            const multiline = field.text.length > MULTILINE_OVER || field.kind === 'text';
            const id = `content-${field.text.slice(0, 24)}`;
            return (
              <div key={field.text} className="space-y-1">
                <label
                  htmlFor={id}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground"
                >
                  <span className="rounded bg-muted px-1.5 py-0.5 uppercase tracking-wide">
                    {kindLabel(field.kind)}
                  </span>
                  {dirty && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                  )}
                </label>
                {multiline ? (
                  <textarea
                    id={id}
                    rows={Math.min(5, Math.ceil(value.length / 40) + 1)}
                    value={value}
                    onChange={(e) => setContentOverride(component.slug, field.text, e.target.value)}
                    className={cn(
                      'w-full resize-y rounded-md border bg-background px-2.5 py-1.5 text-sm text-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      dirty ? 'border-primary/50' : 'border-border',
                    )}
                  />
                ) : (
                  <input
                    id={id}
                    type="text"
                    value={value}
                    onChange={(e) => setContentOverride(component.slug, field.text, e.target.value)}
                    className={cn(
                      'w-full rounded-md border bg-background px-2.5 py-1.5 text-sm text-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      dirty ? 'border-primary/50' : 'border-border',
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-muted-foreground">
      {icon}
      <p className="text-xs">{text}</p>
    </div>
  );
}
