import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { TaskDetailDrawer } from '@/components/tasks/TaskDetailDrawer';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronRight } from 'lucide-react';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/contexts/ToastContext';

export function ProjectBoard() {
  const { projectId } = useParams();
  const { projects, tasks, createTask, updateTaskStatus } = useWorkspace();
  const { addToast } = useToast();

  const project = projects.find((p) => p.id === projectId) || projects[0];
  const projectTasks = tasks.filter((t) => t.projectId === project?.id);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('TODO');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM');

  const handleOpenAddTask = (columnId) => {
    setDefaultStatus(columnId);
    setIsNewTaskOpen(true);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createTask({
      title: newTitle.trim(),
      projectId: project.id,
      status: defaultStatus,
      priority: newPriority,
    });

    addToast({
      type: 'success',
      title: 'Task Created',
      message: `Added to board.`,
    });

    setNewTitle('');
    setIsNewTaskOpen(false);
  };

  const handleMoveTask = (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // 1. Optimistic Update
    updateTaskStatus(taskId, newStatus);

    // 2. Toast Feedback
    addToast({
      type: 'info',
      title: 'Task Moved',
      message: `${task.key} moved to ${newStatus.replace('_', ' ')}.`,
      duration: 2500,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Board Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-border-subtle shrink-0">
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${project?.id}`}
            className="text-xs text-charcoal-500 hover:text-charcoal-900 transition-colors"
          >
            {project?.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
          <h1 className="text-base font-bold text-charcoal-950 tracking-tight">
            Kanban Board
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            icon={Plus}
            onClick={() => handleOpenAddTask('TODO')}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Interactive dnd-kit Board */}
      <KanbanBoard
        tasks={projectTasks}
        onMoveTask={handleMoveTask}
        onSelectTask={setSelectedTask}
        onAddTask={handleOpenAddTask}
      />

      {/* Task Details Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      {/* Create Task Modal */}
      <Modal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        title="Add Task to Board"
        description="Create a task with status, priority, and due dates."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Implement fractional reordering algorithms"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Column / Status"
              value={defaultStatus}
              onChange={(e) => setDefaultStatus(e.target.value)}
              options={[
                { value: 'TODO', label: 'To Do' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'IN_REVIEW', label: 'In Review' },
                { value: 'DONE', label: 'Done' },
              ]}
            />
            <Select
              label="Priority"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'URGENT', label: 'Urgent' },
              ]}
            />
          </div>

          <ModalFooter>
            <Button variant="secondary" size="sm" onClick={() => setIsNewTaskOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!newTitle.trim()}>
              Add Task
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
