/**
 * Centralized error handling middleware
 * Provides consistent error responses and logging
 */

import { config } from '../config.js';

/**
 * Custom error classes for better error handling
 */
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.field = field;
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  constructor(message = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

/**
 * Error handler middleware
 */
export function errorHandler(err, req, res, next) {
  // Log error with context
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Determine status code
  let statusCode = err.statusCode || 500;
  let message = err.message;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
      statusCode = 413;
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    }
  } else if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Resource already exists';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Resource not found';
    }
  } else if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid data provided';
  }

  // Don't expose internal errors in production
  if (config.nodeEnv === 'production' && statusCode === 500) {
    message = 'Internal server error';
  }

  // Build error response
  const errorResponse = {
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  // Add additional details in development
  if (config.nodeEnv === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.name = err.name;
  }

  // Add field information for validation errors
  if (err.field) {
    errorResponse.field = err.field;
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * 404 handler for unmatched routes
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Route not found',
    statusCode: 404,
    timestamp: new Date().toISOString(),
    path: req.path,
  });
}

/**
 * Async error wrapper for route handlers
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
} 