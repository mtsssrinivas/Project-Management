import { Router } from 'express';
import * as workspaceController from '../controllers/workspaceController.js';
import * as projectController from '../controllers/projectController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireWorkspaceMember, requireWorkspaceRole } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  inviteMemberSchema,
} from '../validators/workspaceValidators.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createWorkspaceSchema), workspaceController.create);
router.get('/', workspaceController.list);

// Workspace specific routes
router.get('/:id', requireWorkspaceMember(), workspaceController.getById);
router.patch('/:id', requireWorkspaceMember(), requireWorkspaceRole(['OWNER', 'ADMIN']), validate(updateWorkspaceSchema), workspaceController.update);
router.delete('/:id', requireWorkspaceMember(), requireWorkspaceRole(['OWNER']), workspaceController.remove);

// Workspace members & invitations
router.get('/:id/members', requireWorkspaceMember(), workspaceController.listMembers);
router.post('/:id/invitations', requireWorkspaceMember(), requireWorkspaceRole(['OWNER', 'ADMIN']), validate(inviteMemberSchema), workspaceController.invite);
router.delete('/:id/members/:userId', requireWorkspaceMember(), requireWorkspaceRole(['OWNER', 'ADMIN']), workspaceController.removeMember);

// Projects in workspace
router.get('/:workspaceId/projects', requireWorkspaceMember(), projectController.listByWorkspace);

export default router;
