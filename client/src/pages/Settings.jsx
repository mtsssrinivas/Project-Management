import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { Shield, AlertTriangle } from 'lucide-react';

export function Settings() {
  const { activeWorkspace } = useWorkspace();
  const { addToast } = useToast();
  const [name, setName] = useState(activeWorkspace?.name || 'Acme Product Team');
  const [description, setDescription] = useState('Primary product development workspace.');

  const handleSave = (e) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Workspace configurations updated.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-border-subtle">
        <h1 className="text-xl font-bold tracking-tight text-charcoal-950">
          Workspace Settings
        </h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          General settings and governance for {activeWorkspace?.name}.
        </p>
      </div>

      {/* General Settings Card */}
      <div className="rounded-lg border border-border-subtle bg-surface p-6 shadow-subtle space-y-4">
        <h3 className="text-sm font-semibold text-charcoal-900">
          General Information
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Workspace Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-charcoal-700">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-status-danger/30 bg-rose-50/20 p-6 shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-status-danger">
          <AlertTriangle className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Danger Zone</h3>
        </div>
        <p className="text-xs text-charcoal-600">
          Permanently delete this workspace and all associated projects, tasks, comments, and members.
        </p>
        <div className="pt-2">
          <Button variant="danger" size="sm">
            Delete Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
