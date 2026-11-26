import React, { useState } from 'react';
import { Menu, Search, Bell, Plus, Check } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { UserMenu } from './UserMenu';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { mockNotifications } from '@/data/mockData';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useToast } from '@/contexts/ToastContext';

export function TopNav({ onToggleSidebar, onOpenSearch }) {
  const { projects, createTask } = useWorkspace();
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProject, setTaskProject] = useState(projects[0]?.id || '');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    createTask({
      title: taskTitle.trim(),
      projectId: taskProject || projects[0]?.id,
      priority: taskPriority,
    });

    addToast({
      type: 'success',
      title: 'Task Created',
      message: `"${taskTitle}" added to project.`,
    });

    setTaskTitle('');
    setIsTaskModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border-subtle bg-surface px-4 lg:px-6">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded p-1.5 text-charcoal-500 hover:bg-surface-secondary hover:text-charcoal-900 lg:hidden"
          >
            <Menu className="w-4 h-4" />
          </button>
          <Breadcrumbs />
        </div>

        {/* Right: Actions, Search, Notifications, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 h-8 px-2.5 rounded-md border border-border-subtle bg-canvas text-charcoal-400 hover:text-charcoal-700 hover:border-border-hover text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
            <kbd className="text-[10px] font-mono bg-surface border border-border-subtle px-1 rounded text-charcoal-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick Create Button */}
          <Button
            size="sm"
            onClick={() => setIsTaskModalOpen(true)}
            icon={Plus}
          >
            <span className="hidden sm:inline">New Task</span>
          </Button>

          {/* Notifications Dropdown */}
          <Dropdown
            align="right"
            trigger={
              <button
                type="button"
                className="relative rounded-md p-2 text-charcoal-500 hover:text-charcoal-800 hover:bg-surface-secondary transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-status-danger ring-2 ring-surface" />
                )}
              </button>
            }
          >
            <div className="w-80">
              <div className="flex items-center justify-between p-3 border-b border-border-subtle">
                <span className="text-xs font-semibold text-charcoal-900">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border-subtle">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 hover:bg-surface-secondary transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-charcoal-900 leading-tight">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-charcoal-400 whitespace-nowrap">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-2xs text-charcoal-500 mt-1 leading-normal">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Dropdown>

          <div className="h-4 w-px bg-border-subtle" />

          {/* User Profile Menu */}
          <UserMenu />
        </div>
      </header>

      {/* Quick Task Creation Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Task"
        description="Add a task to a project board."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Implement command palette keyboard shortcuts"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Project"
              value={taskProject}
              onChange={(e) => setTaskProject(e.target.value)}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
            />
            <Select
              label="Priority"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'URGENT', label: 'Urgent' },
              ]}
            />
          </div>

          <ModalFooter>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsTaskModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!taskTitle.trim()}
            >
              Create Task
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
