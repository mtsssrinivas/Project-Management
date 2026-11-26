import prisma from '../config/database.js';

export async function globalSearch(userId, query) {
  if (!query || query.trim().length === 0) {
    return { projects: [], tasks: [] };
  }

  const cleanQuery = query.trim();

  // Find user's accessible workspaces
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    select: { workspaceId: true },
  });
  const workspaceIds = memberships.map((m) => m.workspaceId);

  // Search projects
  const projects = await prisma.project.findMany({
    where: {
      workspaceId: { in: workspaceIds },
      OR: [
        { name: { contains: cleanQuery, mode: 'insensitive' } },
        { description: { contains: cleanQuery, mode: 'insensitive' } },
      ],
    },
    take: 8,
    select: {
      id: true,
      name: true,
      status: true,
      workspaceId: true,
    },
  });

  // Search tasks
  const tasks = await prisma.task.findMany({
    where: {
      project: { workspaceId: { in: workspaceIds } },
      OR: [
        { title: { contains: cleanQuery, mode: 'insensitive' } },
        { description: { contains: cleanQuery, mode: 'insensitive' } },
      ],
    },
    take: 12,
    include: {
      project: {
        select: { id: true, name: true },
      },
    },
  });

  return { projects, tasks };
}
