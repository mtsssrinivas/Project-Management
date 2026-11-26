export function successResponse(res, data, statusCode = 200, message = undefined) {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(message && { message }),
  });
}

export function errorResponse(res, message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  });
}
