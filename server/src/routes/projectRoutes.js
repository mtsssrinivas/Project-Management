import { Router } from 'express';
import * as projectController from '../controllers/projectController.js';
import * as taskController from '../controllers/taskController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema } from '../validators/projectValidators.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createProjectSchema), projectController.create);
router.get('/:id', projectController.getById);
router.patch('/:id', validate(updateProjectSchema), projectController.update);
router.delete('/:id', projectController.remove);

// Tasks belonging to this project
router.get('/:projectId/tasks', taskController.listByProject);

export default router;
