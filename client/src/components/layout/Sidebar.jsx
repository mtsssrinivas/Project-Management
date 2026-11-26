import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  CheckCircle2,
  Calendar,
  Users,
  Settings,
  Building,
  Plus,
  Command,
  HelpCircle,
  Hash
} from 'lucide-react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';

export function Sidebar({ isOpen, onClose, onOpenSearch }) {
  const { projects, currentUser } = useWorkspace();

  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Workspaces', path: '/workspaces', icon: Building },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'My Tasks', path: '/my-tasks', icon: CheckCircle2, count: 3 },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Team', path: '/team', icon: Users },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top Header / Switcher */}
        <div className="p-3 border-b border-sidebar-border">
          <WorkspaceSwitcher />
        </div>

        {/* Quick Command Button */}
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex w-full items-center justify-between px-2.5 py-1.5 rounded-md bg-charcoal-800/80 border border-charcoal-700 text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-700/80 transition-colors text-xs"
          >
            <span className="flex items-center gap-2">
              <Command className="w-3.5 h-3.5" />
              <span>Search or jump to...</span>
            </span>
            <kbd className="text-[10px] font-mono bg-charcoal-900 border border-charcoal-700 px-1.5 py-0.5 rounded text-charcoal-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          <div>
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">
              Main
            </div>
            <nav className="space-y-0.5">
              {mainNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose?.()}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                        isActive
                          ? 'bg-charcoal-700 text-white font-semibold'
                          : 'text-charcoal-300 hover:text-white hover:bg-charcoal-800'
                      )
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0 text-charcoal-400 group-hover:text-current" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className="text-[10px] font-mono text-charcoal-400 bg-charcoal-800 px-1.5 py-0.2 rounded">
                        {item.count}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Projects Quick Links */}
          <div>
            <div className="flex items-center justify-between px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">
              <span>Active Projects</span>
              <NavLink to="/projects" className="text-charcoal-400 hover:text-white">
                <Plus className="w-3.5 h-3.5" />
              </NavLink>
            </div>
            <div className="space-y-0.5">
              {projects.slice(0, 4).map((p) => (
                <NavLink
                  key={p.id}
                  to={`/projects/${p.id}/board`}
                  onClick={() => onClose?.()}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors truncate',
                      isActive
                        ? 'bg-charcoal-700 text-white font-medium'
                        : 'text-charcoal-300 hover:text-white hover:bg-charcoal-800'
                    )
                  }
                >
                  <Hash className="w-3.5 h-3.5 text-charcoal-500 shrink-0" />
                  <span className="truncate">{p.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Footer User Info */}
        <div className="p-3 border-t border-sidebar-border">
          <NavLink
            to="/profile"
            onClick={() => onClose?.()}
            className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-sidebar-hover transition-colors text-left"
          >
            <Avatar
              src={currentUser?.avatarUrl}
              name={currentUser?.name}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white leading-tight">
                {currentUser?.name}
              </p>
              <p className="truncate text-[10px] text-charcoal-400 leading-tight">
                {currentUser?.email}
              </p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
