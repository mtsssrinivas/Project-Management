import * as commentService from '../services/commentService.js';
import { successResponse } from '../utils/response.js';

export async function addComment(req, res, next) {
  try {
    const comment = await commentService.addComment({
      taskId: req.params.taskId,
      userId: req.user.id,
      content: req.body.content,
    });
    return successResponse(res, comment, 201, 'Comment added');
  } catch (err) {
    next(err);
  }
}

export async function updateComment(req, res, next) {
  try {
    const updated = await commentService.updateComment(
      req.params.id,
      req.body.content,
      req.user.id
    );
    return successResponse(res, updated, 200, 'Comment updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  try {
    await commentService.deleteComment(req.params.id, req.user.id);
    return successResponse(res, null, 200, 'Comment deleted');
  } catch (err) {
    next(err);
  }
}
