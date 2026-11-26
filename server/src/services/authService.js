import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { UnauthorizedError, AppError } from '../utils/AppError.js';

export async function registerUser({ name, email, password }) {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw new AppError('An account with this email address already exists', 409, 'USER_EXISTS');
  }

  const passwordHash = await hashPassword(password);

  // Create user and default workspace in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}-workspace-${Date.now().toString().slice(-4)}`;

    const workspace = await tx.workspace.create({
      data: {
        name: `${name.trim()}'s Workspace`,
        slug,
        ownerId: user.id,
      },
    });

    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: 'OWNER',
      },
    });

    return { user, workspace };
  });

  const token = signToken({ id: result.user.id, email: result.user.email });
  return { user: result.user, defaultWorkspace: result.workspace, token };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      workspaceMembers: {
        include: { workspace: true },
      },
    },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password credentials');
  }

  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid email or password credentials');
  }

  const token = signToken({ id: user.id, email: user.email });

  const sanitizedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };

  const workspaces = user.workspaceMembers.map((wm) => ({
    id: wm.workspace.id,
    name: wm.workspace.name,
    slug: wm.workspace.slug,
    role: wm.role,
  }));

  return { user: sanitizedUser, workspaces, token };
}

export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      workspaceMembers: {
        include: {
          workspace: true,
        },
      },
    },
  });

  if (!user) {
    throw new UnauthorizedError('User account not found');
  }

  const workspaces = user.workspaceMembers.map((wm) => ({
    id: wm.workspace.id,
    name: wm.workspace.name,
    slug: wm.workspace.slug,
    role: wm.role,
  }));

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
    workspaces,
  };
}
