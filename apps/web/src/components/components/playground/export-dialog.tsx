'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Check, Copy, Download, FileArchive } from 'lucide-react';
import { Button, Dialog, cn } from 'adysre';
import type { Framework } from '@/data/components';
import type { PlaygroundSection } from '@/data/playground';
import type { Palette } from '@/data/palettes';
import {
  assembleExport,
  downloadText,
  exportableFrameworks,
} from '@/lib/playground-export';
import { buildProjectScaffold, type ScaffoldTarget } from '@/lib/project-scaffold';
import { createZip, downloadBlob } from '@/lib/zip';
import { readableText } from '@/lib/palettes/color';
import { pageSectionStylesCss, type SectionStyle } from '@/lib/playground/section-style';
import { useClipboard } from '@/hooks/use-clipboard';
import { highlightCode } from '@/app/[locale]/(app)/components/actions';
import { PaletteCode } from '@/components/palettes/palette-code';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  sections: PlaygroundSection[];
  /** The project palette, shipped alongside the section code when set. */
  palette: Palette | null;
  /** Per-slug text edits to bake into the exported source. */
  contentOverrides: Record<string, Record<string, string>>;
  /** Per-slot background / text / border styling, shipped as a stylesheet. */
  sectionStyles: Record<string, SectionStyle | undefined>;
}

/**
 * The assembled page as source: one combined file per framework, plus each
 * section individually. Highlighting is fetched from the server on demand
 * (Shiki never ships to the browser) and cached per assembled text - switching
 * back to a tab is instant.
 */
export function ExportDialog({
  open,
  onClose,
  sections,
  palette,
  contentOverrides,
  sectionStyles,
}: ExportDialogProps) {
  const t = useTranslations('components');
  const tCommon = useTranslations('common');
  const { copy, copied } = useClipboard();
  const { copy: copySection, copied: sectionCopied } = useClipboard();
  const { copy: copyStyles, copied: stylesCopied } = useClipboard();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [framework, setFramework] = useState<Framework | null>(null);

  /** Build the chosen project, zip it in the browser, and download it. */
  async function downloadProject(target: ScaffoldTarget) {
    // The section demos are ~0.5 MB of source strings; load them only when a
    // project is actually being downloaded rather than on every dialog open.
    const { SECTION_DEMOS } = await import('@/data/playground/section-demos');
    const files = buildProjectScaffold(
      target,
      sections,
      'adysre-page',
      contentOverrides,
      SECTION_DEMOS,
      sectionStyles,
    );
    const zip = createZip(files);
    downloadBlob(`adysre-${target}-project.zip`, zip);
  }

  // The per-section styling as one stylesheet - the same CSS the downloaded
  // project ships, offered here for anyone copying sections by hand.
  const stylesCss = useMemo(
    () =>
      pageSectionStylesCss(
        sections.map(({ slot, component }) => ({
          slotId: slot.id,
          title: component.title,
          style: sectionStyles[slot.id],
        })),
      ),
    [sections, sectionStyles],
  );

  const frameworks = useMemo(() => exportableFrameworks(sections), [sections]);
  const activeFramework =
    framework !== null && frameworks.some((f) => f.framework === framework)
      ? framework
      : frameworks[0]?.framework;

  const assembled = useMemo(
    () =>
      activeFramework
        ? assembleExport(
            sections,
            activeFramework,
            (title, frameworkLabel) =>
              t('playground.export.missingSection', { title, framework: frameworkLabel }),
            contentOverrides,
          )
        : undefined,
    [sections, activeFramework, t, contentOverrides],
  );

  const { data: highlighted } = useQuery({
    // The assembled text is the identity of the highlight - same selections,
    // same framework, same HTML - so cache on it rather than on selection state.
    queryKey: ['playground-highlight', assembled?.lang, assembled?.code],
    queryFn: () => highlightCode(assembled?.code ?? '', assembled?.lang ?? 'text'),
    enabled: open && assembled !== undefined,
    staleTime: Infinity,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('playground.export.title')}
      description={t('playground.export.description')}
      className="sm:max-w-3xl"
      footer={
        assembled && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => downloadText(assembled.fileName, assembled.code)}
              className="gap-1.5"
            >
              <Download className="h-4 w-4" aria-hidden />
              {t('playground.export.downloadAll', { file: assembled.fileName })}
            </Button>
            <Button type="button" onClick={() => void copy(assembled.code)} className="gap-1.5">
              {copied ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
              {copied ? tCommon('copied') : t('playground.export.copyAll')}
            </Button>
          </>
        )
      }
    >
      {sections.length > 0 && (
        <div className="mb-4 rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('playground.export.projectTitle')}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t('playground.export.projectHint')}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void downloadProject('nextjs')}
              className="gap-1.5"
            >
              <FileArchive className="h-4 w-4" aria-hidden />
              {t('playground.export.downloadProjectNext')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void downloadProject('react')}
              className="gap-1.5"
            >
              <FileArchive className="h-4 w-4" aria-hidden />
              {t('playground.export.downloadProjectReact')}
            </Button>
          </div>
        </div>
      )}

      {palette && (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('playground.export.paletteTitle')}
          </p>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex h-12">
              {palette.colors.map((c, i) => (
                <span
                  key={i}
                  className="flex flex-1 items-end justify-center pb-1 text-[10px] font-semibold uppercase"
                  style={{ backgroundColor: c, color: readableText(c) }}
                >
                  {c.replace('#', '')}
                </span>
              ))}
            </div>
          </div>
          <PaletteCode colors={palette.colors} name={palette.name} />
        </div>
      )}
      {stylesCss && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('playground.export.stylesTitle')}
            </p>
            <div className="ml-auto flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={tCommon('copy')}
                title={tCommon('copy')}
                onClick={() => void copyStyles(stylesCss)}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                {stylesCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t('playground.export.downloadSection', { file: 'section-styles.css' })}
                title={t('playground.export.downloadSection', { file: 'section-styles.css' })}
                onClick={() => downloadText('section-styles.css', stylesCss)}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t('playground.export.stylesHint')}</p>
          <pre className="max-h-44 overflow-auto rounded-lg border border-border p-3 font-mono text-[11px] leading-relaxed">
            <code>{stylesCss}</code>
          </pre>
        </div>
      )}

      {!assembled ? (
        <p className="text-sm text-muted-foreground">{t('playground.export.empty')}</p>
      ) : (
        <div className="space-y-4">
          <div
            role="tablist"
            aria-label={t('frameworks')}
            className="-mx-1 flex gap-1 overflow-x-auto px-1"
          >
            {frameworks.map((f) => (
              <button
                key={f.framework}
                type="button"
                role="tab"
                aria-selected={activeFramework === f.framework}
                onClick={() => setFramework(f.framework)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  activeFramework === f.framework
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {f.label}
                {f.available < f.total && (
                  <span className="text-[10px] opacity-60">
                    {t('playground.export.coverage', {
                      available: f.available,
                      total: f.total,
                    })}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            {highlighted ? (
              <div
                className="shiki-code max-h-80 overflow-auto text-xs"
                // Shiki output from our own registry code - <pre><code> and
                // spans, nothing attacker-supplied. Same trust as CodeViewer.
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            ) : (
              // Plain text while the highlight is in flight (or refused) - the
              // code is usable either way.
              <pre className="max-h-80 overflow-auto p-4 font-mono text-xs leading-relaxed">
                <code>{assembled.code}</code>
              </pre>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('playground.export.files')}
            </p>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {assembled.sections.map((file) => (
                <li key={file.slotId} className="flex items-center gap-2 px-3 py-1.5">
                  <span className="min-w-0 flex-1 truncate font-mono text-xs">
                    {file.fileName}
                  </span>
                  {file.code === null ? (
                    <span className="text-[11px] italic text-muted-foreground">
                      {t('playground.export.missingSection', {
                        title: file.title,
                        framework: assembled.label,
                      })}
                    </span>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={tCommon('copy')}
                        title={tCommon('copy')}
                        onClick={() => {
                          setCopiedSection(file.slotId);
                          void copySection(file.code ?? '');
                        }}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        {sectionCopied && copiedSection === file.slotId ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={t('playground.export.downloadSection', {
                          file: file.fileName,
                        })}
                        title={t('playground.export.downloadSection', { file: file.fileName })}
                        onClick={() => file.code !== null && downloadText(file.fileName, file.code)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Dialog>
  );
}
