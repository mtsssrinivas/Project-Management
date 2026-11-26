import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

export function Dropdown({
  trigger,
  children,
  align = 'left',
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-[180px] rounded-md border border-border-subtle bg-surface p-1 shadow-elevated',
            'animate-in fade-in-50 zoom-in-95 duration-100',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  icon: Icon,
  danger = false,
  shortcut,
  className,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded transition-colors',
        danger
          ? 'text-status-danger hover:bg-red-50'
          : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-surface-secondary',
        className
      )}
    >
      <span className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-current" />}
        {children}
      </span>
      {shortcut && (
        <span className="text-2xs font-mono text-charcoal-400 group-hover:text-charcoal-600">
          {shortcut}
        </span>
      )}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-border-subtle" />;
}
