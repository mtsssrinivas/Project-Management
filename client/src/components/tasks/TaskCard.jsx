import React from 'react';
import { PriorityBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Calendar, MessageSquare } from 'lucide-react';
import { cn } from '@/utils/cn';

export function TaskCard({ task, onClick }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-md border border-border-subtle bg-surface p-3 shadow-subtle',
        'hover:border-border-hover hover:shadow-elevated transition-all duration-150 cursor-pointer select-none'
      )}
    >
      {/* Top Header: Key & Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-2xs font-semibold text-charcoal-400 group-hover:text-charcoal-700 transition-colors">
          {task.key}
        </span>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Task Title */}
      <h4 className="text-xs font-medium text-charcoal-900 leading-snug line-clamp-2">
        {task.title}
      </h4>

      {/* Bottom Row: Metadata (Assignee, Date, Comments) */}
      <div className="mt-3 flex items-center justify-between text-2xs text-charcoal-400 pt-2 border-t border-border-subtle/50">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-mono text-[10px]',
                isOverdue ? 'text-status-danger font-medium' : 'text-charcoal-400'
              )}
            >
              <Calendar className="w-3 h-3" />
              <span>{task.dueDate}</span>
            </span>
          )}

          {task.commentsCount > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-charcoal-400">
              <MessageSquare className="w-3 h-3" />
              <span>{task.commentsCount}</span>
            </span>
          )}
        </div>

        {task.assignee && (
          <Avatar
            src={task.assignee.avatarUrl}
            name={task.assignee.name}
            size="xs"
          />
        )}
      </div>
    </div>
  );
}
