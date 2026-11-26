import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Tabs } from '@/components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { TaskDetailDrawer } from '@/components/tasks/TaskDetailDrawer';
import { CheckCircle2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MyTasks() {
  const { tasks, currentUser, projects } = useWorkspace();
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedTask, setSelectedTask] = useState(null);

  // Filter tasks assigned to currentUser or where assignee name matches
  const myTasks = tasks.filter((t) => t.assignee?.id === currentUser?.id || t.assignee?.name === currentUser?.name);

  const tabs = [
    { id: 'ALL', label: 'All My Tasks', count: myTasks.length },
    { id: 'TODO', label: 'To Do', count: myTasks.filter((t) => t.status === 'TODO').length },
    { id: 'IN_PROGRESS', label: 'In Progress', count: myTasks.filter((t) => t.status === 'IN_PROGRESS').length },
    { id: 'DONE', label: 'Done', count: myTasks.filter((t) => t.status === 'DONE').length },
  ];

  const filtered = myTasks.filter((t) => activeTab === 'ALL' || t.status === activeTab);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-border-subtle">
        <h1 className="text-xl font-bold tracking-tight text-charcoal-950">
          My Tasks
        </h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          Action items specifically assigned to you across all projects.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      {/* Tasks Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Key</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filtered.map((t) => {
            const project = projects.find((p) => p.id === t.projectId);
            return (
              <TableRow
                key={t.id}
                onClick={() => setSelectedTask(t)}
              >
                <TableCell>
                  <span className="font-mono text-2xs font-semibold text-charcoal-500">
                    {t.key}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-charcoal-900">
                    {t.title}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-charcoal-600">
                    {project?.name || 'Project'}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={t.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={t.priority} />
                </TableCell>
                <TableCell>
                  <span className="font-mono text-2xs text-charcoal-500">
                    {t.dueDate || '—'}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TaskDetailDrawer
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
