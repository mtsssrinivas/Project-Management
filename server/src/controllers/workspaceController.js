import * as workspaceService from '../services/workspaceService.js';
import { successResponse } from '../utils/response.js';

export async function create(req, res, next) {
  try {
    const ws = await workspaceService.createWorkspace({
      ...req.body,
      ownerId: req.user.id,
    });
    return successResponse(res, ws, 201, 'Workspace created');
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const workspaces = await workspaceService.getUserWorkspaces(req.user.id);
    return successResponse(res, workspaces);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const ws = await workspaceService.getWorkspaceById(req.params.id);
    return successResponse(res, ws);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const ws = await workspaceService.updateWorkspace(req.params.id, req.body);
    return successResponse(res, ws, 200, 'Workspace updated');
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await workspaceService.deleteWorkspace(req.params.id, req.user.id);
    return successResponse(res, null, 200, 'Workspace deleted');
  } catch (err) {
    next(err);
  }
}

export async function listMembers(req, res, next) {
  try {
    const members = await workspaceService.getWorkspaceMembers(req.params.id);
    return successResponse(res, members);
  } catch (err) {
    next(err);
  }
}

export async function invite(req, res, next) {
  try {
    const result = await workspaceService.inviteMember({
      workspaceId: req.params.id,
      email: req.body.email,
      role: req.body.role,
      invitedById: req.user.id,
    });
    return successResponse(res, result, 201, 'Invitation created');
  } catch (err) {
    next(err);
  }
}

export async function removeMember(req, res, next) {
  try {
    await workspaceService.removeMember(req.params.id, req.params.userId, req.user.id);
    return successResponse(res, null, 200, 'Member removed');
  } catch (err) {
    next(err);
  }
}
