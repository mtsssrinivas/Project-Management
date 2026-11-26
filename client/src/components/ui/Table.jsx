import React from 'react';
import { cn } from '@/utils/cn';

export function Table({ children, className }) {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-border-subtle bg-surface">
      <table className={cn('w-full text-left text-xs text-charcoal-700', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className }) {
  return (
    <thead className={cn('bg-surface-secondary border-b border-border-subtle text-charcoal-500 font-medium', className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }) {
  return <tbody className={cn('divide-y divide-border-subtle', className)}>{children}</tbody>;
}

export function TableRow({ children, className, onClick }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'transition-colors hover:bg-surface-secondary/70',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className }) {
  return (
    <th className={cn('px-4 py-2.5 text-2xs font-semibold uppercase tracking-wider text-charcoal-500', className)}>
      {children}
    </th>
  );
}

export function TableCell({ children, className }) {
  return <td className={cn('px-4 py-3 text-xs text-charcoal-800 align-middle', className)}>{children}</td>;
}
