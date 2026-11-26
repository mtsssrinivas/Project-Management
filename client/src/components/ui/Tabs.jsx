import React from 'react';
import { cn } from '@/utils/cn';

export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className,
  variant = 'line',
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 border-b border-border-subtle overflow-x-auto no-scrollbar',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        if (variant === 'pill') {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-surface text-charcoal-950 shadow-subtle border border-border-subtle font-semibold'
                  : 'text-charcoal-500 hover:text-charcoal-800 hover:bg-surface-secondary'
              )}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'ml-1 px-1.5 py-0.2 rounded-full text-2xs',
                    isActive ? 'bg-primary-50 text-primary-700' : 'bg-surface-secondary text-charcoal-500'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        }

        // Line variant
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap',
              isActive
                ? 'text-primary font-semibold'
                : 'text-charcoal-500 hover:text-charcoal-900'
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-2xs font-mono text-charcoal-400 bg-surface-secondary px-1.5 py-0.5 rounded">
                {tab.count}
              </span>
            )}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
