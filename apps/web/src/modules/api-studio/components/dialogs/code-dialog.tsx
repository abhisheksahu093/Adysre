'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy } from 'lucide-react';
import { Button, Dialog, Select } from 'adysre';
import type { ExecutionRequest } from '../../types';
import { CODE_TARGETS } from '../../services/export/code-gen';

/**
 * Generated client code for the request as it will actually be sent.
 *
 * Generated from the PREPARED request, so variables are resolved and auth is
 * applied: the snippet makes the same call the Send button does, rather than
 * carrying `{{token}}` for the reader to work out. That is also why this dialog
 * shows nothing when the request could not be prepared - a snippet built from a
 * request that cannot be sent would be a lie in twelve languages.
 */
export function CodeDialog({
  open,
  onClose,
  request,
  problem,
}: {
  open: boolean;
  onClose: () => void;
  /** The prepared request, or `null` when preparation failed. */
  request: ExecutionRequest | null;
  /** Why preparation failed, when it did. */
  problem: string | null;
}) {
  const t = useTranslations('apiStudio');
  const [targetId, setTargetId] = useState('curl');
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => {
    if (!request) return '';
    return CODE_TARGETS.find((target) => target.id === targetId)?.generate(request) ?? '';
  }, [request, targetId]);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1_500);
    } catch {
      // Clipboard permission denied. The snippet is selectable.
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('codegen.title')}
      description={t('codegen.description')}
      className="max-w-3xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('codegen.close')}
          </Button>
          <Button size="sm" onClick={() => void copy()} disabled={code === ''} className="gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            {copied ? t('response.copied') : t('response.copy')}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-muted-foreground" htmlFor="codegen-target">
            {t('codegen.target')}
          </label>
          <Select
            id="codegen-target"
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
            className="h-8 w-auto min-w-44 text-xs"
          >
            {CODE_TARGETS.map((target) => (
              <option key={target.id} value={target.id}>
                {t(`codegen.targets.${target.labelKey}`)}
              </option>
            ))}
          </Select>
        </div>

        {problem ? (
          <p className="rounded-md bg-warning/10 px-3 py-2 text-xs text-warning">{problem}</p>
        ) : (
          <pre className="max-h-96 overflow-auto rounded-md border border-border bg-muted/30 p-3 font-mono text-xs leading-relaxed">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </Dialog>
  );
}
