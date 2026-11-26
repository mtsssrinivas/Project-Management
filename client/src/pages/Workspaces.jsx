import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Building2, Users, FolderGit2, Check } from 'lucide-react';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/contexts/ToastContext';

export function Workspaces() {
  const { workspaces, activeWorkspace, switchWorkspace, createWorkspace } = useWorkspace();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    createWorkspace({ name: name.trim() });
    addToast({
      type: 'success',
      title: 'Workspace Created',
      message: `Switched to "${name}".`,
    });
    setName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-charcoal-950">
            Workspaces
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Manage your organizations and isolated team environments.
          </p>
        </div>
        <Button size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
          New Workspace
        </Button>
      </div>

      {/* Grid of Workspaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workspaces.map((ws) => {
          const isActive = ws.id === activeWorkspace?.id;
          return (
            <div
              key={ws.id}
              className={`rounded-lg border p-5 bg-surface transition-all ${
                isActive
                  ? 'border-primary ring-1 ring-primary/20 shadow-elevated'
                  : 'border-border-subtle hover:border-border-hover'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-900 font-mono font-bold text-white text-xs">
                    {ws.logoText}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal-900">
                      {ws.name}
                    </h3>
                    <span className="text-2xs text-charcoal-400 font-mono">
                      /{ws.slug}
                    </span>
                  </div>
                </div>

                <Badge variant={ws.role === 'OWNER' ? 'primary' : 'neutral'}>
                  {ws.role}
                </Badge>
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-charcoal-500 border-t border-border-subtle pt-3">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-charcoal-400" />
                  <span>{ws.memberCount} members</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-charcoal-400" />
                  <span>{ws.projectCount} projects</span>
                </span>
              </div>

              <div className="mt-4 flex justify-end">
                {isActive ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                    <Check className="w-3.5 h-3.5" />
                    Active Workspace
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      switchWorkspace(ws.id);
                      addToast({
                        type: 'info',
                        title: 'Workspace Switched',
                        message: `Now viewing ${ws.name}.`,
                      });
                    }}
                  >
                    Switch Workspace
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Workspace"
        description="Isolated multi-tenant container for team projects."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. Platform Engineering"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            icon={Building2}
          />
          <ModalFooter>
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!name.trim()}>
              Create Workspace
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
