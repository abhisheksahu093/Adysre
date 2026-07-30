'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';
import { Input, Label, cn, type InputProps } from 'adysre';

interface FormFieldProps extends InputProps {
  label: string;
  error?: string | undefined;
}

/**
 * Reusable label + input + inline error, wired for React Hook Form via
 * `{...register('field')}`. Keeps every auth form consistent and accessible.
 *
 * A `type="password"` field grows a reveal toggle automatically. Doing it here
 * rather than at each call site is the point: there are four password inputs
 * across sign-in, registration and reset, and a toggle only some of them had
 * would be the kind of inconsistency nobody notices until a user does.
 *
 * A Client Component, explicitly, now that it owns state - so importing it from
 * a Server Component fails at the border with a clear message rather than at
 * runtime.
 */
export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, name, className, type, ...props }, ref) => {
    const t = useTranslations('auth.fields');
    const [revealed, setRevealed] = React.useState(false);

    const fieldId = id ?? name ?? label.toLowerCase().replace(/\s+/g, '-');
    const isPassword = type === 'password';
    // Only the RENDERED type changes. The caller still passes `type="password"`
    // and its own `autoComplete` token, so the browser's password manager keeps
    // treating the field as a password while its value is visible.
    const inputType = isPassword && revealed ? 'text' : type;

    return (
      <div className="space-y-1.5">
        <Label htmlFor={fieldId}>{label}</Label>
        <div className="relative">
          <Input
            id={fieldId}
            name={name}
            ref={ref}
            type={inputType}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn(
              error && 'border-danger focus-visible:ring-danger',
              // Room for the toggle, so a long password never runs under it.
              isPassword && 'pr-10',
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setRevealed((value) => !value)}
              // Left in the tab order on purpose. It is a real control, and
              // someone typing a password they cannot see is exactly the person
              // who needs to reach it without a mouse.
              aria-label={revealed ? t('hidePassword') : t('showPassword')}
              aria-pressed={revealed}
              aria-controls={fieldId}
              className={cn(
                'absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md',
                'text-muted-foreground transition-colors hover:text-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
              )}
            >
              {revealed ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          )}
        </div>
        {error && (
          <p id={`${fieldId}-error`} className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);
FormField.displayName = 'FormField';
