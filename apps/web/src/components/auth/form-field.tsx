import * as React from 'react';
import { Input, Label, cn, type InputProps } from 'adysre';

interface FormFieldProps extends InputProps {
  label: string;
  error?: string | undefined;
}

/**
 * Reusable label + input + inline error, wired for React Hook Form via
 * `{...register('field')}`. Keeps every auth form consistent and accessible.
 */
export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, name, className, ...props }, ref) => {
    const fieldId = id ?? name ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        <Label htmlFor={fieldId}>{label}</Label>
        <Input
          id={fieldId}
          name={name}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(error && 'border-danger focus-visible:ring-danger', className)}
          {...props}
        />
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
