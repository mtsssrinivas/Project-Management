import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { ChevronsUpDown, Check, Plus, Building2 } from 'lucide-react';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, switchWorkspace, createWorkspace } = useWorkspace();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    createWorkspace({ name: newWorkspaceName.trim() });
    addToast({
      type: 'success',
      title: 'Workspace Created',
      message: `Switched to "${newWorkspaceName}".`,
    });
    setNewWorkspaceName('');
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between gap-2 px-2.5 py-2 rounded-md hover:bg-sidebar-hover transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-charcoal-700 font-mono text-2xs font-semibold text-white">
              {activeWorkspace?.logoText || 'PF'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white leading-tight">
                {activeWorkspace?.name}
              </p>
              <p className="truncate text-[10px] text-charcoal-400 leading-tight">
                {activeWorkspace?.role}
              </p>
            </div>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-md border border-charcoal-700 bg-sidebar p-1 shadow-elevated">
              <div className="px-2 py-1 text-[10px] uppercase font-semibold tracking-wider text-charcoal-400">
                Workspaces
              </div>
              <div className="space-y-0.5 mt-1">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => {
                      switchWorkspace(ws.id);
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-2 py-1.5 rounded text-xs text-charcoal-200 hover:text-white hover:bg-charcoal-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-charcoal-800 text-[10px] font-mono font-medium">
                        {ws.logoText}
                      </div>
                      <span className="truncate">{ws.name}</span>
                    </div>
                    {ws.id === activeWorkspace?.id && (
                      <Check className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="my-1 h-px bg-charcoal-700" />

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="flex w-full items-center gap-2 px-2 py-1.5 rounded text-xs text-charcoal-300 hover:text-white hover:bg-charcoal-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Workspace</span>
              </button>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Workspace"
        description="Workspaces isolate projects, teams, tasks, and settings."
      >
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. Acme Engineering"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            autoFocus
            icon={Building2}
          />
          <ModalFooter>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!newWorkspaceName.trim()}
            >
              Create Workspace
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
