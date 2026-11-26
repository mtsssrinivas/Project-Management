import React from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(({
  className,
  label,
  error,
  options = [],
  value,
  onChange,
  disabled,
  placeholder,
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-charcoal-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full appearance-none rounded-md border border-border-subtle bg-surface px-3 py-1.5 pr-8 text-sm text-charcoal-950',
            'transition-colors duration-150',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:opacity-60',
            error && 'border-status-danger focus:border-status-danger focus:ring-status-danger/20',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
      </div>
      {error && <p className="text-2xs text-status-danger font-medium">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
