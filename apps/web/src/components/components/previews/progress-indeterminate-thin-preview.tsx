/**
 * Live preview for `progress-indeterminate-thin`.
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/progress.ts`.
 */
const INDETERMINATE_KEYFRAMES = `
  @keyframes progress-indeterminate {
    0%   { left: -40%; width: 40%; }
    50%  { left: 30%;  width: 55%; }
    100% { left: 100%; width: 40%; }
  }
`;

interface ProgressIndeterminateThinProps {
  label?: string;
  showLabel?: boolean;
  className?: string;
}

function ProgressIndeterminateThin({
  label = 'Loading…',
  showLabel = true,
  className = '',
}: ProgressIndeterminateThinProps) {
  return (
    <div className={`w-full ${className}`}>
      <style>{INDETERMINATE_KEYFRAMES}</style>
      <div
        role="progressbar"
        aria-label={label}
        aria-busy="true"
        className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-blue-600 animate-[progress-indeterminate_1.4s_ease-in-out_infinite] motion-reduce:hidden dark:bg-blue-500" />
        <div className="absolute inset-y-0 left-0 hidden w-1/3 rounded-full bg-blue-600 motion-reduce:block dark:bg-blue-500" aria-hidden="true" />
      </div>
      {showLabel ? <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{label}</p> : null}
    </div>
  );
}

export default function ProgressIndeterminateThinPreview() {
  return <ProgressIndeterminateThin label="Syncing your workspace…" />;
}
