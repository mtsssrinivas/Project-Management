import { errorResponse } from '../utils/response.js';

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected internal error occurred';
  let details = err.details || null;

  // Prisma duplicate key error
  if (err.code === 'P2002') {
    statusCode = 409;
    code = 'DUPLICATE_ENTRY';
    const target = err.meta?.target ? ` on field: ${err.meta.target}` : '';
    message = `A record with this unique identifier already exists${target}.`;
  }

  // Prisma record not found error
  if (err.code === 'P2025') {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = 'The requested resource was not found in database.';
  }

  if (process.env.NODE_ENV !== 'test' && statusCode >= 500) {
    console.error('[Unhandled Error]', err);
  }

  return errorResponse(res, message, statusCode, code, details);
}
