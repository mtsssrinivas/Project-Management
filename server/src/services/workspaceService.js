import prisma from '../config/database.js';
import { NotFoundError, ForbiddenError, AppError } from '../utils/AppError.js';
import crypto from 'crypto';

export async function createWorkspace({ name, description, ownerId }) {
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  return prisma.$transaction(async (tx) => {
    const ws = await tx.workspace.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        slug,
        ownerId,
      },
    });

    await tx.workspaceMember.create({
      data: {
        workspaceId: ws.id,
        userId: ownerId,
        role: 'OWNER',
      },
    });

    await tx.activityLog.create({
      data: {
        workspaceId: ws.id,
        userId: ownerId,
        action: 'WORKSPACE_CREATED',
        metadata: { workspaceName: ws.name },
      },
    });

    return ws;
  });
}

export async function getUserWorkspaces(userId) {
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    include: {
      workspace: {
        include: {
          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
        },
      },
    },
    orderBy: { joinedAt: 'asc' },
  });

  return memberships.map((m) => ({
    id: m.workspace.id,
    name: m.workspace.name,
    description: m.workspace.description,
    slug: m.workspace.slug,
    role: m.role,
    memberCount: m.workspace._count.members,
    projectCount: m.workspace._count.projects,
    joinedAt: m.joinedAt,
  }));
}

export async function getWorkspaceById(workspaceId) {
  const ws = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { members: true, projects: true },
      },
    },
  });

  if (!ws) throw new NotFoundError('Workspace');
  return ws;
}

export async function updateWorkspace(workspaceId, data) {
  return prisma.workspace.update({
    where: { id: workspaceId },
    data,
  });
}

export async function deleteWorkspace(workspaceId, requestingUserId) {
  const ws = await prisma.workspace.findUnique({ where: { id: workspaceId } });
  if (!ws) throw new NotFoundError('Workspace');

  if (ws.ownerId !== requestingUserId) {
    throw new ForbiddenError('Only the workspace owner can delete this workspace');
  }

  return prisma.workspace.delete({ where: { id: workspaceId } });
}

export async function getWorkspaceMembers(workspaceId) {
  return prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { joinedAt: 'asc' },
  });
}

export async function inviteMember({ workspaceId, email, role, invitedById }) {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if already a member
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    const isMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: existingUser.id,
        },
      },
    });
    if (isMember) {
      throw new AppError('This user is already a member of this workspace', 400);
    }
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invitation = await prisma.invitation.create({
    data: {
      workspaceId,
      email: normalizedEmail,
      role,
      tokenHash,
      expiresAt,
      invitedById,
    },
  });

  return { invitation, inviteToken: rawToken };
}

export async function removeMember(workspaceId, userId, requestingUserId) {
  const ws = await prisma.workspace.findUnique({ where: { id: workspaceId } });
  if (ws.ownerId === userId) {
    throw new ForbiddenError('Cannot remove workspace owner');
  }

  return prisma.workspaceMember.delete({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });
}
