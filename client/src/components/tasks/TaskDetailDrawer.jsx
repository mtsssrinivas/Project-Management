import React, { useState } from 'react';
import { X, Calendar, User, Clock, MessageSquare, Send } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { mockTeamMembers } from '@/data/mockData';
import { useToast } from '@/contexts/ToastContext';

export function TaskDetailDrawer({ task, isOpen, onClose }) {
  const { updateTaskStatus } = useWorkspace();
  const { addToast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 'c1',
      author: mockTeamMembers[1],
      content: 'Checked the requirements; looks solid. Let me know when review is ready.',
      time: '3 hours ago',
    },
  ]);

  if (!isOpen || !task) return null;

  const handleStatusChange = (e) => {
    updateTaskStatus(task.id, e.target.value);
    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Task moved to ${e.target.value}.`,
    });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        author: mockTeamMembers[0],
        content: commentText.trim(),
        time: 'Just now',
      },
    ]);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/30 backdrop-blur-[2px] transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-surface border-l border-border-subtle shadow-popover animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-charcoal-500">
              {task.key}
            </span>
            <span className="text-charcoal-300">/</span>
            <span className="text-xs text-charcoal-500">Task Details</span>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-charcoal-400 hover:text-charcoal-700 hover:bg-surface-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-base font-semibold text-charcoal-950 tracking-tight leading-snug">
              {task.title}
            </h2>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-border-subtle bg-surface-secondary/40 p-4 text-xs">
            <div>
              <span className="text-2xs text-charcoal-400 block mb-1">Status</span>
              <select
                value={task.status}
                onChange={handleStatusChange}
                className="h-8 w-full rounded border border-border-subtle bg-surface px-2 text-xs font-medium text-charcoal-900 focus:outline-none focus:border-primary"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <span className="text-2xs text-charcoal-400 block mb-1">Priority</span>
              <PriorityBadge priority={task.priority} />
            </div>

            <div>
              <span className="text-2xs text-charcoal-400 block mb-1">Assignee</span>
              <div className="flex items-center gap-2">
                <Avatar
                  src={task.assignee?.avatarUrl}
                  name={task.assignee?.name}
                  size="xs"
                />
                <span className="font-medium text-charcoal-800">
                  {task.assignee?.name || 'Unassigned'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-2xs text-charcoal-400 block mb-1">Due Date</span>
              <div className="flex items-center gap-1.5 font-mono text-charcoal-700">
                <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                <span>{task.dueDate || 'No deadline'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-2">
              Description
            </h4>
            <div className="rounded-md border border-border-subtle bg-surface p-3 text-xs text-charcoal-800 leading-relaxed min-h-[90px]">
              {task.description || 'No description provided.'}
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h4 className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-3">
              Comments ({comments.length})
            </h4>

            <div className="space-y-3 mb-4">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5 text-xs">
                  <Avatar
                    src={c.author.avatarUrl}
                    name={c.author.name}
                    size="xs"
                  />
                  <div className="flex-1 rounded-md border border-border-subtle bg-surface-secondary/50 p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-charcoal-900">
                        {c.author.name}
                      </span>
                      <span className="text-[10px] text-charcoal-400">
                        {c.time}
                      </span>
                    </div>
                    <p className="text-charcoal-700 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 h-9 rounded-md border border-border-subtle bg-surface px-3 text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-primary"
              />
              <Button
                type="submit"
                size="sm"
                icon={Send}
                disabled={!commentText.trim()}
              >
                Post
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
