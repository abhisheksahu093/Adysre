'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { Button, Dialog, Input, cn } from 'adysre';
import type { ApiEnvironment, ApiVariable } from '../../types';
import { createId } from '../../utils/ids';

/**
 * The environment editor.
 *
 * A secret is stored encrypted and comes back MASKED, so the value box for one
 * starts empty and says so. Leaving it empty keeps whatever is stored; typing
 * replaces it. That is the only way an editor can be honest about a value it is
 * not allowed to show: pretending to display the secret, or wiping it because
 * the box looked empty, are both worse.
 */
export function EnvironmentDialog({
  open,
  environment,
  onClose,
  onSave,
}: {
  open: boolean;
  environment: ApiEnvironment | null;
  onClose: () => void;
  onSave: (variables: ApiVariable[]) => void;
}) {
  const t = useTranslations('apiStudio');
  const [variables, setVariables] = useState<ApiVariable[]>([]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  // Reopening on a different environment must not show the previous one's rows.
  useEffect(() => {
    setVariables(environment ? structuredClone(environment.variables) : []);
    setRevealed(new Set());
  }, [environment]);

  function update(id: string, patch: Partial<ApiVariable>): void {
    setVariables((current) =>
      current.map((variable) => (variable.id === id ? { ...variable, ...patch } : variable)),
    );
  }

  function add(): void {
    setVariables((current) => [
      ...current,
      {
        id: createId(),
        key: '',
        value: '',
        initialValue: '',
        secret: false,
        enabled: true,
        description: '',
      },
    ]);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={environment ? t('environment.editTitle', { name: environment.name }) : t('environment.select')}
      description={t('environment.editDescription')}
      className="max-w-3xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('import.cancel')}
          </Button>
          <Button
            size="sm"
            onClick={() => onSave(variables.filter((variable) => variable.key.trim() !== ''))}
          >
            {t('environment.save')}
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="w-8 pb-1 font-medium">
                <span className="sr-only">{t('table.enabled')}</span>
              </th>
              <th scope="col" className="pb-1 font-medium">{t('table.key')}</th>
              <th scope="col" className="pb-1 font-medium">{t('table.value')}</th>
              <th scope="col" className="w-20 pb-1 font-medium">{t('environment.secret')}</th>
              <th scope="col" className="w-9 pb-1 font-medium">
                <span className="sr-only">{t('table.remove')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {variables.map((variable) => {
              const hidden = variable.secret && !revealed.has(variable.id);
              return (
                <tr key={variable.id}>
                  <td className="py-0.5 pe-1">
                    <input
                      type="checkbox"
                      checked={variable.enabled}
                      onChange={(event) => update(variable.id, { enabled: event.target.checked })}
                      aria-label={t('table.enableRow', { name: variable.key || t('table.newRow') })}
                      className="h-3.5 w-3.5 rounded border-input accent-primary"
                    />
                  </td>
                  <td className="py-0.5 pe-1">
                    <Input
                      value={variable.key}
                      onChange={(event) => update(variable.id, { key: event.target.value })}
                      aria-label={t('table.key')}
                      className={cn('h-8 font-mono text-xs', !variable.enabled && 'opacity-50')}
                    />
                  </td>
                  <td className="py-0.5 pe-1">
                    <div className="flex items-center gap-1">
                      <Input
                        value={variable.value}
                        type={hidden ? 'password' : 'text'}
                        onChange={(event) => update(variable.id, { value: event.target.value })}
                        aria-label={t('table.value')}
                        placeholder={variable.secret ? t('environment.secretPlaceholder') : ''}
                        className={cn('h-8 font-mono text-xs', !variable.enabled && 'opacity-50')}
                      />
                      {variable.secret && (
                        <button
                          type="button"
                          onClick={() =>
                            setRevealed((current) => {
                              const next = new Set(current);
                              if (next.has(variable.id)) next.delete(variable.id);
                              else next.add(variable.id);
                              return next;
                            })
                          }
                          aria-label={hidden ? t('environment.reveal') : t('environment.hide')}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {hidden ? <Eye className="h-3.5 w-3.5" aria-hidden /> : <EyeOff className="h-3.5 w-3.5" aria-hidden />}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-0.5 pe-1">
                    <input
                      type="checkbox"
                      checked={variable.secret}
                      onChange={(event) => update(variable.id, { secret: event.target.checked })}
                      aria-label={t('environment.markSecret', { name: variable.key || t('table.newRow') })}
                      className="h-3.5 w-3.5 rounded border-input accent-primary"
                    />
                  </td>
                  <td className="py-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        setVariables((current) => current.filter((entry) => entry.id !== variable.id))
                      }
                      aria-label={t('table.removeRow', { name: variable.key || t('table.newRow') })}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {variables.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">{t('environment.noVariables')}</p>
        )}

        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          {t('environment.addVariable')}
        </button>

        <p className="text-xs text-muted-foreground">{t('environment.secretHint')}</p>
      </div>
    </Dialog>
  );
}
