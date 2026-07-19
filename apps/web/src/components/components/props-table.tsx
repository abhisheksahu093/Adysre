import { getTranslations } from 'next-intl/server';
import type { PropDoc } from '@/data/components';
import { humanizeKey } from '@/lib/humanize';

/**
 * Props documentation. Server Component - it's static text, so there's no
 * reason to ship it as JS.
 *
 * A real <table> rather than a grid of divs: screen readers announce the column
 * a cell belongs to, which is the whole point of a props table.
 */
export async function PropsTable({ props }: { props: PropDoc[] }) {
  const t = await getTranslations('components');

  return (
    // Wide tables scroll inside their own container; the page never does.
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {['name', 'type', 'default', 'description'].map((col) => (
              <th
                key={col}
                scope="col"
                className="whitespace-nowrap px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                {t(`propsTable.${col}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-border last:border-0">
              <td className="whitespace-nowrap px-4 py-2.5">
                <code className="font-mono text-xs text-foreground">{p.name}</code>
                {p.required && (
                  <span className="ml-1.5 text-[10px] font-medium text-danger">
                    {t('propsTable.required')}
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-2.5">
                <code className="font-mono text-xs text-primary">{p.type}</code>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5">
                <code className="font-mono text-xs text-muted-foreground">{p.default ?? '-'}</code>
              </td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">
                {/* Fall back to a humanized key when a component ships a prop
                    whose description hasn't been translated yet, rather than
                    throwing MISSING_MESSAGE and taking the page down. */}
                {t.has(`propDescriptions.${p.descriptionKey}`)
                  ? t(`propDescriptions.${p.descriptionKey}`)
                  : humanizeKey(p.descriptionKey)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
