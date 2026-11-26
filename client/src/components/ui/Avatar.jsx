import React from 'react';
import { cn } from '@/utils/cn';

export function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  className,
}) {
  const sizes = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-6 h-6 text-2xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-12 h-12 text-base',
  };

  const getInitials = (str) => {
    if (!str) return '?';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-charcoal-100 font-medium text-charcoal-700 select-none border border-border-subtle shrink-0 overflow-hidden',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span>{getInitials(name || alt)}</span>
      )}
    </div>
  );
}

export function AvatarStack({ users = [], max = 4, size = 'sm', className }) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className={cn('flex items-center -space-x-1.5', className)}>
      {visible.map((user, i) => (
        <Avatar
          key={user.id || i}
          src={user.avatarUrl}
          name={user.name}
          size={size}
          className="ring-2 ring-surface"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-surface-secondary text-2xs font-medium text-charcoal-600 ring-2 ring-surface border border-border-subtle shrink-0',
            size === 'xs' ? 'w-5 h-5 text-[9px]' : 'w-6 h-6'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
