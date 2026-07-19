/**
 * Live preview for `list-numbered-ranking`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/lists.ts`.
 */
interface RankItem {
  id: string;
  name: string;
  value: string;
  hint?: string;
}

interface ListNumberedRankingProps {
  items: RankItem[];
  ariaLabel?: string;
}

function ListNumberedRanking({ items, ariaLabel = 'Ranking' }: ListNumberedRankingProps) {
  return (
    <ol
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item, index) => {
        const rank = index + 1;
        const medal =
          rank === 1
            ? 'bg-amber-400 text-amber-950'
            : rank === 2
              ? 'bg-gray-300 text-gray-800'
              : rank === 3
                ? 'bg-orange-300 text-orange-950'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
        return (
          <li key={item.id} className="flex items-center gap-3 px-4 py-3">
            <span
              aria-hidden="true"
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${medal}`}
            >
              {rank}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.name}
              </span>
              {item.hint ? (
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                  {item.hint}
                </span>
              ) : null}
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
              {item.value}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const RANKS: RankItem[] = [
  { id: '1', name: 'Amara Okafor', value: '2,940', hint: 'Growth team' },
  { id: '2', name: 'Bhavesh Ramachandran', value: '2,410', hint: 'Sales team' },
  { id: '3', name: 'Dara Nakamura', value: '2,105', hint: 'Design team' },
  { id: '4', name: 'Chen Wei', value: '1,880', hint: 'Platform team' },
  { id: '5', name: 'Aisha Rahman', value: '1,642', hint: 'Support team' },
];

export const minHeight = 320;

export default function ListNumberedRankingPreview() {
  return (
    <div className="w-full max-w-sm">
      <ListNumberedRanking items={RANKS} ariaLabel="This month's leaderboard" />
    </div>
  );
}
