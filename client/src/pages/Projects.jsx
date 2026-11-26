import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFormModal } from '@/components/projects/ProjectFormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { AvatarStack } from '@/components/ui/Avatar';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Projects() {
  const { projects } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const tabs = [
    { id: 'ALL', label: 'All Projects', count: projects.length },
    { id: 'ACTIVE', label: 'Active', count: projects.filter((p) => p.status === 'ACTIVE').length },
    { id: 'PLANNING', label: 'Planning', count: projects.filter((p) => p.status === 'PLANNING').length },
    { id: 'COMPLETED', label: 'Completed', count: projects.filter((p) => p.status === 'COMPLETED').length },
  ];

  const filtered = projects.filter((p) => {
    const matchesTab = activeTab === 'ALL' || p.status === activeTab;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-charcoal-950">
            Projects
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Organize teams, roadmaps, deliverables, and task boards.
          </p>
        </div>

        <Button size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
          New Project
        </Button>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pill"
        />

        <div className="flex items-center gap-2">
          <div className="w-56">
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="flex items-center rounded-md border border-border-subtle bg-surface p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid'
                  ? 'bg-surface-secondary text-charcoal-950 shadow-subtle'
                  : 'text-charcoal-400 hover:text-charcoal-700'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${
                viewMode === 'table'
                  ? 'bg-surface-secondary text-charcoal-950 shadow-subtle'
                  : 'text-charcoal-400 hover:text-charcoal-700'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Grid or Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Due Date</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {filtered.map((proj) => (
              <TableRow key={proj.id}>
                <TableCell>
                  <Link
                    to={`/projects/${proj.id}/board`}
                    className="font-medium text-charcoal-900 hover:text-primary transition-colors block"
                  >
                    {proj.name}
                  </Link>
                  <span className="text-2xs text-charcoal-400 line-clamp-1">
                    {proj.description}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={proj.status} />
                </TableCell>
                <TableCell>
                  <div className="w-24">
                    <span className="font-mono text-2xs text-charcoal-500 mb-1 block">
                      {proj.progress}%
                    </span>
                    <div className="h-1.5 w-full rounded-full bg-surface-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <AvatarStack users={proj.members} size="xs" max={3} />
                </TableCell>
                <TableCell>
                  <span className="font-mono text-2xs text-charcoal-500">
                    {proj.dueDate || '—'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
