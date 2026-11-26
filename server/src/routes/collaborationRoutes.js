import { Router } from 'express';
import * as commentController from '../controllers/commentController.js';
import * as collabController from '../controllers/collaborationController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

// Comments standalone
router.patch('/comments/:id', commentController.updateComment);
router.delete('/comments/:id', commentController.deleteComment);

// Notifications
router.get('/notifications', collabController.getNotifications);
router.patch('/notifications/:id/read', collabController.markAsRead);
router.patch('/notifications/read-all', collabController.markAllAsRead);

// Analytics
router.get('/analytics/:workspaceId', collabController.getAnalytics);

// Search
router.get('/search', collabController.search);

export default router;
