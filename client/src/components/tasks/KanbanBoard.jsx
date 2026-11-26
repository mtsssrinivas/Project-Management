import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

const COLUMNS = [
  { id: 'TODO', title: 'To Do', color: 'bg-charcoal-400' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-status-info' },
  { id: 'IN_REVIEW', title: 'In Review', color: 'bg-status-warning' },
  { id: 'DONE', title: 'Done', color: 'bg-status-success' },
];

function SortableTaskCard({ task, onSelect }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={() => onSelect(task)} />
    </div>
  );
}

function KanbanColumn({ column, tasks, onSelectTask, onAddTask }) {
  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-canvas/60 min-w-[270px] p-2.5 max-h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1.5 mb-2 border-b border-border-subtle/70">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${column.color}`} />
          <span className="text-xs font-semibold text-charcoal-800">
            {column.title}
          </span>
          <span className="rounded-full bg-surface px-1.5 py-0.2 font-mono text-[10px] text-charcoal-500 border border-border-subtle">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddTask(column.id)}
          className="rounded p-1 text-charcoal-400 hover:text-charcoal-800 hover:bg-surface transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task List */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 min-h-[140px]">
          {tasks.map((t) => (
            <SortableTaskCard key={t.id} task={t} onSelect={onSelectTask} />
          ))}

          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-28 rounded border border-dashed border-border-subtle/60 text-center p-3">
              <span className="text-2xs text-charcoal-400">
                No tasks in {column.title.toLowerCase()}
              </span>
              <button
                type="button"
                onClick={() => onAddTask(column.id)}
                className="mt-1.5 text-[11px] font-medium text-primary hover:underline"
              >
                + Add task
              </button>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({ tasks, onMoveTask, onSelectTask, onAddTask }) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Check if dragging over another task or directly over a column
    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    // Determine target column
    let targetColumnId = null;
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      targetColumnId = overTask.status;
    } else if (COLUMNS.some((c) => c.id === overId)) {
      targetColumnId = overId;
    }

    if (targetColumnId && activeTaskItem.status !== targetColumnId) {
      onMoveTask(activeId, targetColumnId);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        onMoveTask(activeId, overTask.status);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={colTasks}
              onSelectTask={onSelectTask}
              onAddTask={onAddTask}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 scale-105 shadow-elevated">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
