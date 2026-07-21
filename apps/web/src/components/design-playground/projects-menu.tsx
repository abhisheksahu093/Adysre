'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { ChevronDown, FilePlus2, Loader2, Pencil } from 'lucide-react';
import { cn } from '@adysre/ui';
import { listProjects, type ProjectSummary } from '@/lib/design-playground/project-client';
import { useDesignDocumentStore } from '@/stores/design-document-store';

/**
 * The project menu: what you are working on, and everything you worked on
 * before.
 *
 * Without this the editor had no answer to three obvious questions - how do I
 * start something new, what did I make last week, and what is this thing
 * called. Autosave means "new project" is safe: the current document has
 * already been written before the switch.
 */
export function ProjectsMenu() {
  const t = useTranslations('designPlayground');
  const format = useFormatter();

  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const name = useDesignDocumentStore((s) => s.document.name);
  const projectId = useDesignDocumentStore((s) => s.projectId);
  const newProject = useDesignDocumentStore((s) => s.newProject);
  const openProject = useDesignDocumentStore((s) => s.openProject);
  const renameProject = useDesignDocumentStore((s) => s.renameProject);

  // Load the list when the menu opens, not on mount: it is a click away, and a
  // list fetched at page load would be stale by the time it is read anyway.
  useEffect(() => {
    if (!open) return;
    let alive = true;
    void listProjects().then((result) => {
      if (!alive) return;
      setProjects(result.ok ? result.value : []);
      setUnavailable(!result.ok);
    });
    return () => {
      alive = false;
    };
  }, [open, projectId]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent): void => {
      if (!menuRef.current?.contains(event.target as globalThis.Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative min-w-0">
      {renaming ? (
        <input
          autoFocus
          defaultValue={name}
          aria-label={t('projects.nameLabel')}
          onBlur={(event) => {
            renameProject(event.target.value);
            setRenaming(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
            if (event.key === 'Escape') setRenaming(false);
          }}
          className="h-7 w-44 rounded-md border border-border bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ) : (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="menu"
          title={t('projects.menu')}
          className="flex h-7 min-w-0 items-center gap-1 rounded-md px-1.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="max-w-40 truncate">{name}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      )}

      {open && (
        <div
          role="menu"
          aria-label={t('projects.menu')}
          className="absolute left-0 top-9 z-50 max-h-96 w-72 overflow-y-auto rounded-lg border border-border bg-card p-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              newProject();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <FilePlus2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t('projects.new')}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setRenaming(true);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <Pencil className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t('projects.rename')}
          </button>

          <div className="my-1 h-px bg-border" aria-hidden />
          <h2 className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t('projects.recent')}
          </h2>

          {projects === null ? (
            <p className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
              {t('projects.loading')}
            </p>
          ) : unavailable ? (
            // Say why the list is empty. "No projects" would be a lie when the
            // truth is that storage is unreachable.
            <p className="px-2 py-1.5 text-[11px] leading-relaxed text-warning">
              {t('projects.unavailable')}
            </p>
          ) : projects.length === 0 ? (
            <p className="px-2 py-1.5 text-xs text-muted-foreground">{t('projects.empty')}</p>
          ) : (
            <ul>
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      void openProject(project.id);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex w-full flex-col items-start gap-0.5 rounded-md px-2 py-1.5 text-left transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                      project.id === projectId
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted',
                    )}
                  >
                    <span className="w-full truncate text-xs font-medium">{project.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {format.relativeTime(new Date(project.updatedAt))}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
