import React, { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useToast } from '@/contexts/ToastContext';

export function ProjectFormModal({ isOpen, onClose }) {
  const { createProject } = useWorkspace();
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    createProject({
      name: name.trim(),
      description: description.trim(),
      dueDate,
      status,
    });

    addToast({
      type: 'success',
      title: 'Project Created',
      message: `"${name}" has been created successfully.`,
    });

    setName('');
    setDescription('');
    setDueDate('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Set up an active workspace project for tracking team deliverables."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          placeholder="e.g. Mobile App v3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-charcoal-700">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Brief purpose, objectives, or scope..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Initial Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'PLANNING', label: 'Planning' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'ON_HOLD', label: 'On Hold' },
            ]}
          />
          <Input
            label="Target Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <ModalFooter>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!name.trim()}>
            Create Project
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
