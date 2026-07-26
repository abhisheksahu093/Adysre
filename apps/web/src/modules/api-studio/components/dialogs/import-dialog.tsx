'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import { Button, Dialog, Select, Textarea } from 'adysre';
import type { ImportedCollection } from '../../services/import/postman';
import type { RequestDefinition } from '../../types';
import { importCurl } from '../../services/import/curl';
import { importPostman } from '../../services/import/postman';

type Format = 'curl' | 'postman';

/**
 * Import.
 *
 * One textarea rather than a file picker AND a textarea, because both formats
 * arrive as text: a cURL command is pasted, and a collection file is opened and
 * pasted just as often as it is dropped. A file input is offered alongside for
 * the collection case, and reads into the same box, so what gets imported is
 * always what is visible.
 *
 * Warnings are shown BEFORE the import is committed. Everything the parsers
 * could not bring across (a file upload, an OAuth block, an unknown flag) is
 * listed, so the choice to proceed is made knowing what will be missing.
 */
export function ImportDialog({
  open,
  onClose,
  onCurl,
  onCollection,
}: {
  open: boolean;
  onClose: () => void;
  onCurl: (request: RequestDefinition) => void;
  onCollection: (collection: ImportedCollection) => void;
}) {
  const t = useTranslations('apiStudio');
  const [format, setFormat] = useState<Format>('curl');
  const [source, setSource] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  function reset(): void {
    setSource('');
    setError(null);
    setWarnings([]);
  }

  function submit(): void {
    setError(null);

    if (format === 'curl') {
      const result = importCurl(source);
      if (!result.ok) {
        setError(result.reason);
        return;
      }
      setWarnings(result.warnings);
      onCurl(result.request);
      reset();
      onClose();
      return;
    }

    const result = importPostman(source);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    setWarnings(result.warnings);
    onCollection(result.collection);
    reset();
    onClose();
  }

  async function readFile(file: File | undefined): Promise<void> {
    if (!file) return;
    setSource(await file.text());
    setFormat('postman');
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('import.title')}
      description={t('import.description')}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('import.cancel')}
          </Button>
          <Button size="sm" onClick={submit} disabled={source.trim() === ''}>
            {t('import.submit')}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-muted-foreground" htmlFor="import-format">
            {t('import.format')}
          </label>
          <Select
            id="import-format"
            value={format}
            onChange={(event) => setFormat(event.target.value as Format)}
            className="h-8 w-auto min-w-40 text-xs"
          >
            <option value="curl">{t('import.formats.curl')}</option>
            <option value="postman">{t('import.formats.postman')}</option>
          </Select>

          <input
            type="file"
            accept="application/json,.json"
            onChange={(event) => void readFile(event.target.files?.[0])}
            aria-label={t('import.chooseFile')}
            className="text-xs file:mr-2 file:rounded-md file:border file:border-border file:bg-transparent file:px-2 file:py-1 file:text-xs"
          />
        </div>

        <Textarea
          value={source}
          onChange={(event) => setSource(event.target.value)}
          spellCheck={false}
          aria-label={t('import.source')}
          placeholder={format === 'curl' ? "curl 'https://api.example.com/users'" : '{ "info": { … } }'}
          className="min-h-48 font-mono text-xs"
        />

        {error && (
          <p className="flex items-start gap-2 rounded-md bg-danger/10 px-3 py-2 text-xs text-danger">
            <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
            {error}
          </p>
        )}

        {warnings.length > 0 && (
          <div className="rounded-md bg-warning/10 px-3 py-2 text-xs text-warning">
            <p className="font-medium">{t('import.warnings')}</p>
            <ul className="mt-1 list-disc space-y-0.5 ps-4">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Dialog>
  );
}
