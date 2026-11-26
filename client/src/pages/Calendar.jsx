import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { PriorityBadge } from '@/components/ui/Badge';
import { TaskDetailDrawer } from '@/components/tasks/TaskDetailDrawer';

export function CalendarPage() {
  const { tasks } = useWorkspace();
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentDate] = useState(new Date(2026, 10, 25)); // Nov 2026

  // Days in November 2026: 30 days. Nov 1, 2026 was a Sunday (day 0)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const getTasksForDay = (day) => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const targetDate = `2026-11-${dayStr}`;
    return tasks.filter((t) => t.dueDate === targetDate);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-charcoal-950">
            Calendar & Deadlines
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Visualize upcoming task deadlines and team milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-border-subtle bg-surface px-3 py-1 text-xs font-semibold text-charcoal-900 shadow-subtle">
            November 2026
          </div>
          <div className="flex items-center rounded-md border border-border-subtle bg-surface p-0.5">
            <button className="p-1 rounded text-charcoal-400 hover:text-charcoal-800">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded text-charcoal-400 hover:text-charcoal-800">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Month Calendar Grid */}
      <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden shadow-subtle">
        {/* Days of Week */}
        <div className="grid grid-cols-7 border-b border-border-subtle bg-surface-secondary text-center text-2xs font-semibold text-charcoal-500 uppercase tracking-wider py-2">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* 30 Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border-subtle">
          {daysInMonth.map((day) => {
            const dayTasks = getTasksForDay(day);
            const isToday = day === 25;

            return (
              <div
                key={day}
                className={`min-h-[110px] p-2 transition-colors ${
                  isToday ? 'bg-primary-50/20' : 'hover:bg-surface-secondary/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-2xs font-mono font-medium ${
                      isToday
                        ? 'bg-primary text-white font-bold'
                        : 'text-charcoal-700'
                    }`}
                  >
                    {day}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] text-charcoal-400 font-mono">
                      {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Tasks pills inside day */}
                <div className="space-y-1">
                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTask(t)}
                      className="truncate rounded border border-border-subtle bg-surface px-1.5 py-0.5 text-[10px] font-medium text-charcoal-800 shadow-subtle hover:border-primary hover:text-primary transition-all cursor-pointer"
                    >
                      <span className="font-mono text-charcoal-400 mr-1">
                        {t.key}
                      </span>
                      {t.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TaskDetailDrawer
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
