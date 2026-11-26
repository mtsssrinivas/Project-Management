import * as taskService from '../services/taskService.js';
import { successResponse } from '../utils/response.js';

export async function create(req, res, next) {
  try {
    const task = await taskService.createTask({
      ...req.body,
      createdById: req.user.id,
    });
    return successResponse(res, task, 201, 'Task created');
  } catch (err) {
    next(err);
  }
}

export async function listByProject(req, res, next) {
  try {
    const { status, priority, assigneeId, search } = req.query;
    const tasks = await taskService.getTasksByProject(req.params.projectId, {
      status,
      priority,
      assigneeId,
      search,
    });
    return successResponse(res, tasks);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.params.id);
    return successResponse(res, task);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const updated = await taskService.updateTask(req.params.id, req.body, req.user.id);
    return successResponse(res, updated, 200, 'Task updated');
  } catch (err) {
    next(err);
  }
}

export async function move(req, res, next) {
  try {
    const moved = await taskService.moveTask({
      taskId: req.params.id,
      status: req.body.status,
      prevTaskId: req.body.prevTaskId,
      nextTaskId: req.body.nextTaskId,
      userId: req.user.id,
    });
    return successResponse(res, moved, 200, 'Task position updated');
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id, req.user.id);
    return successResponse(res, null, 200, 'Task deleted');
  } catch (err) {
    next(err);
  }
}
