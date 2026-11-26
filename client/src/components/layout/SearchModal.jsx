import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Search, FolderGit2, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { PriorityBadge } from '@/components/ui/Badge';

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const { projects, tasks } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.key.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (url) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-xl rounded-lg border border-border-subtle bg-surface shadow-popover overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-border-subtle">
          <Search className="w-4 h-4 text-charcoal-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, project, or task..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent px-3 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-charcoal-400 hover:text-charcoal-700 p-1 rounded"
          >
            <kbd className="text-[10px] font-mono bg-surface-secondary border border-border-subtle px-1.5 py-0.5 rounded text-charcoal-500">
              ESC
            </kbd>
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-4">
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">
                Projects
              </div>
              <div className="space-y-0.5">
                {filteredProjects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => handleSelect(`/projects/${proj.id}/board`)}
                    className="flex w-full items-center justify-between px-2.5 py-2 rounded-md hover:bg-surface-secondary text-left transition-colors text-xs text-charcoal-800 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-primary" />
                      <span className="font-medium">{proj.name}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-charcoal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredTasks.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">
                Tasks
              </div>
              <div className="space-y-0.5">
                {filteredTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect(`/projects/${t.projectId}/board`)}
                    className="flex w-full items-center justify-between px-2.5 py-2 rounded-md hover:bg-surface-secondary text-left transition-colors text-xs text-charcoal-800 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-primary shrink-0" />
                      <span className="font-mono text-2xs text-charcoal-400">{t.key}</span>
                      <span className="truncate">{t.title}</span>
                    </div>
                    <PriorityBadge priority={t.priority} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredProjects.length === 0 && filteredTasks.length === 0 && (
            <div className="py-8 text-center text-xs text-charcoal-400">
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
