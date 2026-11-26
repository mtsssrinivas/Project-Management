import * as projectService from '../services/projectService.js';
import { successResponse } from '../utils/response.js';

export async function create(req, res, next) {
  try {
    const project = await projectService.createProject({
      ...req.body,
      createdById: req.user.id,
    });
    return successResponse(res, project, 201, 'Project created');
  } catch (err) {
    next(err);
  }
}

export async function listByWorkspace(req, res, next) {
  try {
    const { status, search } = req.query;
    const projects = await projectService.getProjectsByWorkspace(req.params.workspaceId, {
      status,
      search,
    });
    return successResponse(res, projects);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const project = await projectService.getProjectById(req.params.id);
    return successResponse(res, project);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const updated = await projectService.updateProject(req.params.id, req.body, req.user.id);
    return successResponse(res, updated, 200, 'Project updated');
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await projectService.deleteProject(req.params.id);
    return successResponse(res, null, 200, 'Project deleted');
  } catch (err) {
    next(err);
  }
}
