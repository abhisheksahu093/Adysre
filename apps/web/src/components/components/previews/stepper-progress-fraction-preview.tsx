/**
 * Live preview for `stepper-progress-fraction`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/steppers.ts`.
 */
interface StepperProgressFractionProps {
  steps: string[];
  current?: number;
}

function StepperProgressFraction({ steps, current = 0 }: StepperProgressFractionProps) {
  const total = steps.length;
  const clamped = Math.min(Math.max(current, 0), Math.max(total - 1, 0));
  const active = steps[clamped];
  const pct = total > 0 ? Math.round(((clamped + 1) / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{active}</h3>
        <p className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
          Step {clamped + 1} of {total}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={clamped + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label="Progress"
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-all motion-reduce:transition-none"
          style={{ width: pct + '%' }}
        />
      </div>
    </div>
  );
}

export default function StepperProgressFractionPreview() {
  return (
    <StepperProgressFraction
      current={1}
      steps={['Contact', 'Shipping address', 'Payment', 'Review', 'Confirm']}
    />
  );
}
