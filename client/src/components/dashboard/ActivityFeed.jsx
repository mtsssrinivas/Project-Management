import React from 'react';
import { mockActivity } from '@/data/mockData';
import { Avatar } from '@/components/ui/Avatar';

export function ActivityFeed() {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface p-5 shadow-subtle">
      <div className="pb-4 border-b border-border-subtle">
        <h3 className="text-sm font-semibold text-charcoal-900">
          Activity Stream
        </h3>
        <p className="text-2xs text-charcoal-500 mt-0.5">
          Recent modifications across team tasks.
        </p>
      </div>

      <div className="divide-y divide-border-subtle">
        {mockActivity.map((act) => (
          <div key={act.id} className="flex items-start gap-3 py-3">
            <Avatar
              src={act.user.avatarUrl}
              name={act.user.name}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-charcoal-800 leading-snug">
                <span className="font-semibold text-charcoal-900">
                  {act.user.name}
                </span>{' '}
                {act.action}{' '}
                <span className="font-medium text-charcoal-950">
                  {act.target}
                </span>{' '}
                <span className="text-charcoal-500">{act.detail}</span>
              </p>
              <span className="text-[10px] text-charcoal-400 mt-1 block">
                {act.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
