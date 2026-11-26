import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/Badge';
import { AvatarStack } from '@/components/ui/Avatar';
import { Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

export function ProjectCard({ project }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border-subtle bg-surface p-5 shadow-subtle hover:border-border-hover hover:shadow-elevated transition-all group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="font-mono text-2xs font-semibold text-charcoal-400">
            {project.key}
          </span>
          <StatusBadge status={project.status} />
        </div>

        <Link
          to={`/projects/${project.id}/board`}
          className="text-sm font-semibold text-charcoal-900 group-hover:text-primary transition-colors block mb-1.5 leading-snug"
        >
          {project.name}
        </Link>

        <p className="text-2xs text-charcoal-500 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>
      </div>

      <div className="pt-4 border-t border-border-subtle space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-2xs text-charcoal-500 mb-1">
            <span>Completion</span>
            <span className="font-mono font-medium">{project.progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-surface-secondary overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between pt-1">
          <AvatarStack users={project.members} size="xs" max={3} />
          {project.dueDate && (
            <div className="flex items-center gap-1 font-mono text-[10px] text-charcoal-400">
              <Calendar className="w-3 h-3" />
              <span>{project.dueDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
