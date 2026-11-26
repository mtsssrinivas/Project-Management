import * as notificationService from '../services/notificationService.js';
import * as analyticsService from '../services/analyticsService.js';
import * as searchService from '../services/searchService.js';
import { successResponse } from '../utils/response.js';

export async function getNotifications(req, res, next) {
  try {
    const list = await notificationService.getUserNotifications(req.user.id);
    return successResponse(res, list);
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    await notificationService.markNotificationAsRead(req.params.id, req.user.id);
    return successResponse(res, null, 200, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    await notificationService.markAllNotificationsAsRead(req.user.id);
    return successResponse(res, null, 200, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const data = await analyticsService.getWorkspaceAnalytics(req.params.workspaceId, req.user.id);
    return successResponse(res, data);
  } catch (err) {
    next(err);
  }
}

export async function search(req, res, next) {
  try {
    const results = await searchService.globalSearch(req.user.id, req.query.q);
    return successResponse(res, results);
  } catch (err) {
    next(err);
  }
}
