import React from 'react';
import { cn } from '@/utils/cn';

export function Badge({
  children,
  variant = 'neutral',
  size = 'default',
  className,
}) {
  const variants = {
    neutral: 'bg-surface-secondary text-charcoal-700 border-border-subtle',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded',
    default: 'text-2xs px-2 py-0.5 rounded-md',
    lg: 'text-xs px-2.5 py-1 rounded-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border leading-none shrink-0',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    TODO: { label: 'To Do', variant: 'neutral' },
    IN_PROGRESS: { label: 'In Progress', variant: 'info' },
    IN_REVIEW: { label: 'In Review', variant: 'warning' },
    DONE: { label: 'Done', variant: 'success' },
    PLANNING: { label: 'Planning', variant: 'neutral' },
    ACTIVE: { label: 'Active', variant: 'primary' },
    ON_HOLD: { label: 'On Hold', variant: 'warning' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    ARCHIVED: { label: 'Archived', variant: 'neutral' },
  };

  const conf = map[status] || { label: status, variant: 'neutral' };

  return <Badge variant={conf.variant}>{conf.label}</Badge>;
}

export function PriorityBadge({ priority }) {
  const map = {
    LOW: { label: 'Low', variant: 'neutral' },
    MEDIUM: { label: 'Medium', variant: 'info' },
    HIGH: { label: 'High', variant: 'warning' },
    URGENT: { label: 'Urgent', variant: 'danger' },
  };

  const conf = map[priority] || { label: priority, variant: 'neutral' };

  return <Badge variant={conf.variant}>{conf.label}</Badge>;
}
