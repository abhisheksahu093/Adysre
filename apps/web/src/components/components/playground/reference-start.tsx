'use client';

import { useCallback, useRef, useState, type DragEvent } from 'react';
import { useTranslations } from 'next-intl';
import { ImageUp, Sparkles, PencilRuler, AlertCircle } from 'lucide-react';
import { Button, cn } from 'adysre';
import { usePlaygroundStore } from '@/stores/playground-store';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/playground/template-generator';

/**
 * Start screen: the two ways into the playground - generate a template from a
 * reference image, or build from scratch. The dropzone accepts a drag-drop or
 * a click-to-browse; once a valid image lands, generation begins.
 */
export function ReferenceStart() {
  const t = useTranslations('components');
  const beginGeneration = usePlaygroundStore((s) => s.beginGeneration);
  const startFromScratch = usePlaygroundStore((s) => s.startFromScratch);
  const priorError = usePlaygroundStore((s) => s.generationError);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError(t('playground.upload.errorType'));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(t('playground.upload.errorSize'));
      return;
    }
    setError(null);
    beginGeneration(file, URL.createObjectURL(file));
  };

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) accept(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shownError = error ?? priorError;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-1 py-6 sm:py-10">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
          aria-hidden
        >
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            {t('playground.start.title')}
          </h2>
          <p className="text-sm text-muted-foreground">{t('playground.start.subtitle')}</p>
        </div>
      </div>

      <div
        data-tour="reference-upload"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'w-full rounded-2xl border-2 border-dashed p-6 text-center transition-colors sm:p-10',
          dragging ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) accept(file);
            e.target.value = '';
          }}
        />
        <span
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
          aria-hidden
        >
          <ImageUp className="h-6 w-6" />
        </span>
        <p className="text-sm font-medium">{t('playground.upload.title')}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
          {t('playground.upload.hint')}
        </p>
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 gap-1.5"
        >
          <ImageUp className="h-4 w-4" aria-hidden />
          {t('playground.upload.browse')}
        </Button>
        <p className="mt-3 text-[11px] text-muted-foreground/70">
          {t('playground.upload.formats')}
        </p>
      </div>

      {shownError && (
        <p
          role="alert"
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-danger"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {shownError}
        </p>
      )}

      <div className="my-6 flex w-full items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {t('playground.start.or')}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        data-tour="start-scratch"
        onClick={startFromScratch}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors',
          'hover:border-primary/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
          aria-hidden
        >
          <PencilRuler className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{t('playground.start.scratchTitle')}</span>
          <span className="block text-xs text-muted-foreground">
            {t('playground.start.scratchDescription')}
          </span>
        </span>
      </button>
    </div>
  );
}
