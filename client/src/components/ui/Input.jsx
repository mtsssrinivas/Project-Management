import React from 'react';
import { cn } from '@/utils/cn';

export const Input = React.forwardRef(({
  className,
  type = 'text',
  label,
  error,
  helperText,
  icon: Icon,
  disabled,
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-charcoal-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-2.5 flex items-center pointer-events-none text-charcoal-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full rounded-md border border-border-subtle bg-surface px-3 py-1.5 text-sm text-charcoal-950 placeholder:text-charcoal-400',
            'transition-colors duration-150',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:opacity-60',
            Icon && 'pl-9',
            error && 'border-status-danger focus:border-status-danger focus:ring-status-danger/20',
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-2xs text-status-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-2xs text-charcoal-400">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
