import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { StatusBadge } from '@/components/ui/Badge';
import { AvatarStack } from '@/components/ui/Avatar';
import { ArrowUpRight } from 'lucide-react';

export function RecentProjects() {
  const { projects } = useWorkspace();

  return (
    <div className="rounded-lg border border-border-subtle bg-surface p-5 shadow-subtle">
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <div>
          <h3 className="text-sm font-semibold text-charcoal-900">
            Active Projects
          </h3>
          <p className="text-2xs text-charcoal-500 mt-0.5">
            Overview of work underway in this workspace.
          </p>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-700 transition-colors"
        >
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-border-subtle">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 hover:bg-surface-secondary/40 -mx-5 px-5 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link
                  to={`/projects/${p.id}/board`}
                  className="text-xs font-semibold text-charcoal-900 hover:text-primary transition-colors truncate"
                >
                  {p.name}
                </Link>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-2xs text-charcoal-500 mt-1 line-clamp-1 max-w-md">
                {p.description}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {/* Progress bar */}
              <div className="w-24">
                <div className="flex items-center justify-between text-[10px] text-charcoal-500 mb-1">
                  <span>Progress</span>
                  <span className="font-mono">{p.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              {/* Members */}
              <AvatarStack users={p.members} size="xs" max={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
