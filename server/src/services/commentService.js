import prisma from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../utils/AppError.js';

export async function addComment({ taskId, userId, content }) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });
  if (!task) throw new NotFoundError('Task');

  return prisma.$transaction(async (tx) => {
    const comment = await tx.taskComment.create({
      data: {
        taskId,
        userId,
        content: content.trim(),
      },
      include: {
        user: {
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
        action: 'COMMENT_ADDED',
        metadata: { snippet: content.slice(0, 50) },
      },
    });

    if (task.assigneeId && task.assigneeId !== userId) {
      await tx.notification.create({
        data: {
          userId: task.assigneeId,
          type: 'TASK_COMMENT',
          title: 'New Comment on Task',
          message: `Someone commented on "${task.title}"`,
          linkUrl: `/projects/${task.projectId}/board`,
        },
      });
    }

    return comment;
  });
}

export async function updateComment(commentId, content, userId) {
  const comment = await prisma.taskComment.findUnique({ where: { id: commentId } });
  if (!comment) throw new NotFoundError('Comment');

  if (comment.userId !== userId) {
    throw new ForbiddenError('You can only edit your own comments');
  }

  return prisma.taskComment.update({
    where: { id: commentId },
    data: { content: content.trim() },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });
}

export async function deleteComment(commentId, userId) {
  const comment = await prisma.taskComment.findUnique({ where: { id: commentId } });
  if (!comment) throw new NotFoundError('Comment');

  if (comment.userId !== userId) {
    throw new ForbiddenError('You can only delete your own comments');
  }

  return prisma.taskComment.delete({ where: { id: commentId } });
}
