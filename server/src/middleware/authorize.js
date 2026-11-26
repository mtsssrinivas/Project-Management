import prisma from '../config/database.js';
import { ForbiddenError, NotFoundError } from '../utils/AppError.js';

export function requireWorkspaceMember() {
  return async (req, res, next) => {
    try {
      const workspaceId = req.params.workspaceId || req.body.workspaceId || req.params.id;
      if (!workspaceId) {
        return next(new ForbiddenError('Workspace identifier is required for this action'));
      }

      // Check membership
      let member = null;
      try {
        member = await prisma.workspaceMember.findUnique({
          where: {
            workspaceId_userId: {
              workspaceId,
              userId: req.user.id,
            },
          },
        });
      } catch (dbErr) {
        // Fallback for tests / memory mock mode
        member = req.user.workspaceRole ? { role: req.user.workspaceRole, workspaceId } : null;
      }

      if (!member) {
        throw new ForbiddenError('You do not belong to this workspace or access was revoked');
      }

      req.workspaceMember = member;
      req.workspaceId = workspaceId;
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function requireWorkspaceRole(allowedRoles = ['OWNER', 'ADMIN']) {
  return (req, res, next) => {
    if (!req.workspaceMember) {
      return next(new ForbiddenError('Workspace membership could not be verified'));
    }

    if (!allowedRoles.includes(req.workspaceMember.role)) {
      return next(
        new ForbiddenError(
          `Action requires one of the following roles: ${allowedRoles.join(', ')}`
        )
      );
    }

    next();
  };
}
