import React, { useState } from 'react';
import { MetricsSummary } from '@/components/dashboard/MetricsSummary';
import { RecentProjects } from '@/components/dashboard/RecentProjects';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { Button } from '@/components/ui/Button';
import { Plus, FolderGit2 } from 'lucide-react';
import { ProjectFormModal } from '@/components/projects/ProjectFormModal';
import { useWorkspace } from '@/contexts/WorkspaceContext';

export function Dashboard() {
  const { activeWorkspace } = useWorkspace();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-charcoal-950">
            {activeWorkspace?.name || 'Workspace Overview'}
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Real-time status of active deliverables, milestones, and team tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={FolderGit2}
            onClick={() => setIsProjectModalOpen(true)}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <MetricsSummary />

      {/* Analytics Charts */}
      <AnalyticsCharts />

      {/* Main Grid: Projects & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentProjects />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      <ProjectFormModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
}
