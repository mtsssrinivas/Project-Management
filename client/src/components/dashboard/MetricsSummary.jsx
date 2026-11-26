import React from 'react';
import { FolderGit2, CheckCircle2, Clock, Users } from 'lucide-react';
import { useWorkspace } from '@/contexts/WorkspaceContext';

export function MetricsSummary() {
  const { projects, tasks, activeWorkspace } = useWorkspace();

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const pendingTasks = totalTasks - completedTasks;

  const metrics = [
    {
      title: 'Active Projects',
      value: `${activeProjects} / ${totalProjects}`,
      icon: FolderGit2,
      trend: '68% completed',
    },
    {
      title: 'Completed Tasks',
      value: `${completedTasks} / ${totalTasks}`,
      icon: CheckCircle2,
      trend: `${Math.round((completedTasks / (totalTasks || 1)) * 100)}% progress`,
    },
    {
      title: 'Pending Work',
      value: `${pendingTasks} items`,
      icon: Clock,
      trend: 'Across 4 columns',
    },
    {
      title: 'Team Members',
      value: `${activeWorkspace?.memberCount || 5} active`,
      icon: Users,
      trend: activeWorkspace?.role || 'Member',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.title}
            className="rounded-lg border border-border-subtle bg-surface p-4 shadow-subtle hover:border-border-hover transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-500">
                {m.title}
              </span>
              <Icon className="w-4 h-4 text-charcoal-400" />
            </div>
            <div className="mt-2 text-xl font-semibold text-charcoal-950 tracking-tight">
              {m.value}
            </div>
            <div className="mt-1 text-2xs font-medium text-charcoal-400">
              {m.trend}
            </div>
          </div>
        );
      })}
    </div>
  );
}
