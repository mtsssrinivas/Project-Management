import prisma from '../config/database.js';
import { NotFoundError } from '../utils/AppError.js';

export async function createTask({ title, description, projectId, assigneeId, createdById, status, priority, dueDate }) {
  // Determine position at the end of the specified column
  const lastTask = await prisma.task.findFirst({
    where: { projectId, status: status || 'TODO' },
    orderBy: { position: 'desc' },
  });

  const position = lastTask ? lastTask.position + 1000.0 : 1000.0;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new NotFoundError('Project');

  return prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: {
        title: title.trim(),
        description: description?.trim(),
        projectId,
        assigneeId: assigneeId || null,
        createdById,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        position,
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    // Activity Log
    await tx.activityLog.create({
      data: {
        workspaceId: project.workspaceId,
        projectId: project.id,
        taskId: task.id,
        userId: createdById,
        action: 'TASK_CREATED',
        metadata: { taskTitle: task.title, status: task.status },
      },
    });

    // Notify assignee if assigned to someone else
    if (assigneeId && assigneeId !== createdById) {
      await tx.notification.create({
        data: {
          userId: assigneeId,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: `You were assigned to "${task.title}"`,
          linkUrl: `/projects/${project.id}/board`,
        },
      });
    }

    return task;
  });
}

export async function getTasksByProject(projectId, { status, priority, assigneeId, search } = {}) {
  const where = {
    projectId,
    ...(status && { status }),
    ...(priority && { priority }),
    ...(assigneeId && { assigneeId }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  return prisma.task.findMany({
    where,
    include: {
      assignee: {
        select: { id: true, name: true, avatarUrl: true },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { position: 'asc' },
  });
}

export async function getTaskById(taskId) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      createdBy: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      comments: {
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      project: {
        select: { id: true, name: true, workspaceId: true },
      },
    },
  });

  if (!task) throw new NotFoundError('Task');
  return task;
}

export async function updateTask(taskId, data, userId) {
  const existing = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });
  if (!existing) throw new NotFoundError('Task');

  const updated = await prisma.$transaction(async (tx) => {
    const res = await tx.task.update({
      where: { id: taskId },
      data: {
        ...data,
        dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    await tx.activityLog.create({
      data: {
        workspaceId: existing.project.workspaceId,
        projectId: existing.projectId,
        taskId: res.id,
        userId,
        action: 'TASK_UPDATED',
        metadata: { changes: Object.keys(data) },
      },
    });

    // Notify new assignee if changed
    if (data.assigneeId && data.assigneeId !== existing.assigneeId && data.assigneeId !== userId) {
      await tx.notification.create({
        data: {
          userId: data.assigneeId,
          type: 'TASK_ASSIGNED',
          title: 'Task Assigned',
          message: `You were assigned to "${res.title}"`,
          linkUrl: `/projects/${existing.projectId}/board`,
        },
      });
    }

    return res;
  });

  return updated;
}

export async function moveTask({ taskId, status, prevTaskId, nextTaskId, userId }) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });
  if (!task) throw new NotFoundError('Task');

  let newPosition = 1000.0;

  if (prevTaskId && nextTaskId) {
    const prev = await prisma.task.findUnique({ where: { id: prevTaskId } });
    const next = await prisma.task.findUnique({ where: { id: nextTaskId } });
    if (prev && next) {
      newPosition = (prev.position + next.position) / 2;
    }
  } else if (prevTaskId) {
    const prev = await prisma.task.findUnique({ where: { id: prevTaskId } });
    if (prev) {
      newPosition = prev.position + 1000.0;
    }
  } else if (nextTaskId) {
    const next = await prisma.task.findUnique({ where: { id: nextTaskId } });
    if (next) {
      newPosition = next.position / 2;
    }
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.task.update({
      where: { id: taskId },
      data: {
        status,
        position: newPosition,
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    await tx.activityLog.create({
      data: {
        workspaceId: task.project.workspaceId,
        projectId: task.projectId,
        taskId: task.id,
        userId,
        action: 'TASK_MOVED',
        metadata: {
          fromStatus: task.status,
          toStatus: status,
          newPosition,
        },
      },
    });

    return updated;
  });
}

export async function deleteTask(taskId, userId) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });
  if (!task) throw new NotFoundError('Task');

  return prisma.$transaction(async (tx) => {
    await tx.activityLog.create({
      data: {
        workspaceId: task.project.workspaceId,
        projectId: task.projectId,
        userId,
        action: 'TASK_DELETED',
        metadata: { taskTitle: task.title },
      },
    });

    return tx.task.delete({ where: { id: taskId } });
  });
}
