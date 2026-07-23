import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from 'adysre';

/** Inline form-level status message (token-based colors, WCAG AA). */
export function FormAlert({
  variant = 'error',
  children,
}: {
  variant?: 'error' | 'success';
  children: React.ReactNode;
}) {
  const Icon = variant === 'error' ? AlertCircle : CheckCircle2;
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-2 rounded-md border px-3 py-2 text-sm',
        variant === 'error'
          ? 'border-danger/30 bg-danger/10 text-danger'
          : 'border-success/30 bg-success/10 text-success',
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
