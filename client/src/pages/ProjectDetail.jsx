import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { StatusBadge } from '@/components/ui/Badge';
import { AvatarStack } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Calendar, CheckCircle2, Kanban, Users, Settings, Plus } from 'lucide-react';
import { TaskDetailDrawer } from '@/components/tasks/TaskDetailDrawer';

export function ProjectDetail() {
  const { projectId } = useParams();
  const { projects, tasks } = useWorkspace();
  const [selectedTask, setSelectedTask] = useState(null);

  const project = projects.find((p) => p.id === projectId) || projects[0];
  const projectTasks = tasks.filter((t) => t.projectId === project?.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Project Header */}
      <div className="rounded-lg border border-border-subtle bg-surface p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold text-charcoal-400">
                {project?.key}
              </span>
              <StatusBadge status={project?.status} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-charcoal-950">
              {project?.name}
            </h1>
            <p className="text-xs text-charcoal-500 mt-1 max-w-2xl leading-relaxed">
              {project?.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/projects/${project?.id}/board`}>
              <Button size="sm" icon={Kanban}>
                Open Kanban Board
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-2xs text-charcoal-400 block mb-0.5">Deadline</span>
            <span className="font-mono font-medium text-charcoal-800">
              {project?.dueDate || 'Not set'}
            </span>
          </div>

          <div>
            <span className="text-2xs text-charcoal-400 block mb-0.5">Total Tasks</span>
            <span className="font-semibold text-charcoal-900">
              {projectTasks.length} tasks
            </span>
          </div>

          <div>
            <span className="text-2xs text-charcoal-400 block mb-0.5">Completion</span>
            <span className="font-semibold text-primary">
              {project?.progress}%
            </span>
          </div>

          <div>
            <span className="text-2xs text-charcoal-400 block mb-0.5">Team</span>
            <AvatarStack users={project?.members || []} size="xs" max={4} />
          </div>
        </div>
      </div>

      {/* Recent Tasks in Project */}
      <div className="rounded-lg border border-border-subtle bg-surface p-5 shadow-subtle">
        <h3 className="text-sm font-semibold text-charcoal-900 mb-3">
          Project Tasks
        </h3>

        <div className="divide-y divide-border-subtle">
          {projectTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTask(t)}
              className="flex items-center justify-between py-3 hover:bg-surface-secondary/40 px-2 rounded cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xs text-charcoal-400">
                  {t.key}
                </span>
                <span className="text-xs font-medium text-charcoal-900">
                  {t.title}
                </span>
              </div>
              <StatusBadge status={t.status} />
            </div>
          ))}
        </div>
      </div>

      <TaskDetailDrawer
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
