'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from 'adysre';
import { useDesignDocumentStore } from '@/stores/design-document-store';
import { InlineRename } from './layers-panel';

/**
 * The pages panel: every page in the document, one of them active.
 *
 * Switching pages clears the selection in the store, so nothing here has to
 * reconcile a selection that points at another page's nodes.
 */
export function PagesPanel() {
  const t = useTranslations('designPlayground');
  const pages = useDesignDocumentStore((s) => s.document.pages);
  const pageId = useDesignDocumentStore((s) => s.pageId);
  const setPage = useDesignDocumentStore((s) => s.setPage);
  const addPage = useDesignDocumentStore((s) => s.addPage);
  const renamePage = useDesignDocumentStore((s) => s.renamePage);
  const removePage = useDesignDocumentStore((s) => s.removePage);

  const [renamingId, setRenamingId] = useState<string | null>(null);

  // The last page cannot go: the canvas would have nothing to render and no way
  // back. The store refuses too - this only keeps the button honest.
  const canRemove = pages.length > 1;

  return (
    <div className="flex min-h-0 flex-col">
      <ul className="-mx-1 space-y-0.5">
        {pages.map((page, index) => {
          const active = page.id === pageId;
          const renaming = renamingId === page.id;

          return (
            <li key={page.id}>
              <div
                className={cn(
                  'group flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-[13px]',
                  active ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted',
                )}
              >
                {renaming ? (
                  <InlineRename
                    value={page.name}
                    label={t('panels.pages.nameLabel')}
                    onCommit={(name) => {
                      setRenamingId(null);
                      if (name && name !== page.name) renamePage(page.id, name);
                    }}
                    onCancel={() => setRenamingId(null)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPage(page.id)}
                    onDoubleClick={() => setRenamingId(page.id)}
                    aria-current={active ? 'page' : undefined}
                    className="min-w-0 flex-1 truncate text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="mr-1.5 tabular-nums text-muted-foreground">{index + 1}</span>
                    {page.name}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removePage(page.id)}
                  disabled={!canRemove}
                  title={t('panels.pages.remove')}
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground',
                    'hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
                    'disabled:cursor-not-allowed disabled:opacity-0',
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">{t('panels.pages.remove')}</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        // Page names are user data, like layer names: they are not translated, so
        // a page does not rename itself when the interface language changes.
        onClick={() => addPage(`Page ${pages.length + 1}`)}
        className="mt-2 flex h-8 items-center justify-center gap-1.5 rounded-md border border-dashed border-border text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        {t('panels.pages.add')}
      </button>
    </div>
  );
}
