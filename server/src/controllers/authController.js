import * as authService from '../services/authService.js';
import { successResponse } from '../utils/response.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function register(req, res, next) {
  try {
    const { user, defaultWorkspace, token } = await authService.registerUser(req.body);
    res.cookie('token', token, COOKIE_OPTIONS);
    return successResponse(res, { user, defaultWorkspace }, 201, 'User account registered successfully');
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { user, workspaces, token } = await authService.loginUser(req.body);
    res.cookie('token', token, COOKIE_OPTIONS);
    return successResponse(res, { user, workspaces }, 200, 'Signed in successfully');
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie('token', COOKIE_OPTIONS);
    return successResponse(res, null, 200, 'Signed out successfully');
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const data = await authService.getCurrentUser(req.user.id);
    return successResponse(res, data);
  } catch (err) {
    next(err);
  }
}
