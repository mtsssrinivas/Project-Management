import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import * as commentController from '../controllers/commentController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import {
  createTaskSchema,
  updateTaskSchema,
  moveTaskSchema,
} from '../validators/taskValidators.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createTaskSchema), taskController.create);
router.get('/:id', taskController.getById);
router.patch('/:id', validate(updateTaskSchema), taskController.update);
router.patch('/:id/move', validate(moveTaskSchema), taskController.move);
router.delete('/:id', taskController.remove);

// Comments on task
router.post('/:taskId/comments', commentController.addComment);

export default router;
