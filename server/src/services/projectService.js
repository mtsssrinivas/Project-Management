import prisma from '../config/database.js';
import { NotFoundError } from '../utils/AppError.js';

export async function createProject({ name, description, workspaceId, createdById, status, startDate, dueDate }) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        workspaceId,
        createdById,
        status: status || 'ACTIVE',
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    await tx.projectMember.create({
      data: {
        projectId: project.id,
        userId: createdById,
        role: 'LEAD',
      },
    });

    await tx.activityLog.create({
      data: {
        workspaceId,
        projectId: project.id,
        userId: createdById,
        action: 'PROJECT_CREATED',
        metadata: { projectName: project.name },
      },
    });

    return project;
  });
}

export async function getProjectsByWorkspace(workspaceId, { status, search } = {}) {
  const where = {
    workspaceId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const projects = await prisma.project.findMany({
    where,
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
      tasks: {
        select: { id: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return projects.map((p) => {
    const total = p.tasks.length;
    const done = p.tasks.filter((t) => t.status === 'DONE').length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      status: p.status,
      startDate: p.startDate,
      dueDate: p.dueDate,
      createdAt: p.createdAt,
      progress,
      members: p.members.map((m) => m.user),
      taskCounts: {
        total,
        done,
        inProgress: p.tasks.filter((t) => t.status === 'IN_PROGRESS').length,
        todo: p.tasks.filter((t) => t.status === 'TODO').length,
      },
    };
  });
}

export async function getProjectById(projectId) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
      tasks: {
        include: {
          assignee: {
            select: { id: true, name: true, avatarUrl: true },
          },
          _count: {
            select: { comments: true },
          },
        },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!project) throw new NotFoundError('Project');

  const total = project.tasks.length;
  const done = project.tasks.filter((t) => t.status === 'DONE').length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return {
    ...project,
    progress,
    members: project.members.map((m) => ({ ...m.user, role: m.role })),
  };
}

export async function updateProject(projectId, data, userId) {
  const updated = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: updated.workspaceId,
      projectId: updated.id,
      userId,
      action: 'PROJECT_UPDATED',
      metadata: { changes: Object.keys(data) },
    },
  });

  return updated;
}

export async function deleteProject(projectId) {
  return prisma.project.delete({ where: { id: projectId } });
}
