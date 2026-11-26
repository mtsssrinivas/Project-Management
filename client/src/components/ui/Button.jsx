import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'default',
  isLoading = false,
  disabled = false,
  children,
  type = 'button',
  icon: Icon,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none select-none';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 shadow-subtle border border-primary-700/20',
    secondary: 'bg-surface text-charcoal-900 border border-border-subtle hover:bg-surface-secondary active:bg-charcoal-100 shadow-subtle',
    ghost: 'text-charcoal-700 hover:text-charcoal-950 hover:bg-surface-secondary active:bg-charcoal-100',
    danger: 'bg-status-danger text-white hover:bg-red-600 active:bg-red-700 shadow-subtle',
    outline: 'bg-transparent border border-border-subtle text-charcoal-800 hover:bg-surface-secondary',
  };

  const sizes = {
    sm: 'h-8 px-2.5 text-xs gap-1.5',
    default: 'h-9 px-3.5 text-sm gap-2',
    lg: 'h-10 px-4 text-base gap-2.5',
    icon: 'h-8 w-8 p-0',
    'icon-sm': 'h-7 w-7 p-0',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current shrink-0" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
