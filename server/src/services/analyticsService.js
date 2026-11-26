import prisma from '../config/database.js';

export async function getWorkspaceAnalytics(workspaceId, userId) {
  // 1. Projects
  const projects = await prisma.project.findMany({
    where: { workspaceId },
    select: { id: true, name: true, status: true },
  });

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length;
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length;

  const projectIds = projects.map((p) => p.id);

  // 2. Tasks
  const tasks = await prisma.task.findMany({
    where: { projectId: { in: projectIds } },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      dueDate: true,
      assigneeId: true,
      createdAt: true,
    },
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const pendingTasks = totalTasks - completedTasks;

  const now = new Date();
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) < now
  ).length;

  const myTasksCount = tasks.filter((t) => t.assigneeId === userId).length;

  // 3. Status Distribution
  const statusDistribution = [
    { name: 'To Do', count: tasks.filter((t) => t.status === 'TODO').length },
    { name: 'In Progress', count: tasks.filter((t) => t.status === 'IN_PROGRESS').length },
    { name: 'In Review', count: tasks.filter((t) => t.status === 'IN_REVIEW').length },
    { name: 'Done', count: tasks.filter((t) => t.status === 'DONE').length },
  ];

  // 4. Priority Distribution
  const priorityDistribution = [
    { name: 'Low', count: tasks.filter((t) => t.priority === 'LOW').length },
    { name: 'Medium', count: tasks.filter((t) => t.priority === 'MEDIUM').length },
    { name: 'High', count: tasks.filter((t) => t.priority === 'HIGH').length },
    { name: 'Urgent', count: tasks.filter((t) => t.priority === 'URGENT').length },
  ];

  return {
    overview: {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      myTasksCount,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    },
    statusDistribution,
    priorityDistribution,
  };
}
