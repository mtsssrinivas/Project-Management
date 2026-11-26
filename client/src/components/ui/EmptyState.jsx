import React from 'react';
import { cn } from '@/utils/cn';
import { FolderPlus } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = FolderPlus,
  title = 'No items found',
  description = 'Get started by creating your first record.',
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border-subtle bg-surface/50 p-8 text-center',
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-secondary text-charcoal-400 mb-3 border border-border-subtle">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-charcoal-900">{title}</h3>
      <p className="mt-1 text-xs text-charcoal-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
