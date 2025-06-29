/**
 * Request validation middleware
 * Provides centralized validation for API requests
 */

import { ValidationError } from './error-handler.js';

/**
 * Validate UUID format
 */
export function validateUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate file upload request
 */
export function validateFileUpload(req, res, next) {
  if (!req.file) {
    throw new ValidationError('No file provided', 'file');
  }

  if (req.file.size === 0) {
    throw new ValidationError('File is empty', 'file');
  }

  // File size validation is handled by multer, but we can add additional checks here
  if (req.file.size > 100 * 1024 * 1024) { // 100MB
    throw new ValidationError('File too large', 'file');
  }

  next();
}

/**
 * Validate download token
 */
export function validateDownloadToken(req, res, next) {
  const { token } = req.params;
  
  if (!token || typeof token !== 'string') {
    throw new ValidationError('Token is required', 'token');
  }

  if (token.length < 10) {
    throw new ValidationError('Invalid token format', 'token');
  }

  // Optional: Validate UUID format if tokens are UUIDs
  if (!validateUUID(token)) {
    throw new ValidationError('Invalid token format', 'token');
  }

  next();
}

/**
 * Sanitize and validate request body
 */
export function sanitizeBody(req, res, next) {
  // Remove any undefined or null values
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (req.body[key] === undefined || req.body[key] === null) {
        delete req.body[key];
      }
    });
  }

  next();
}

/**
 * Validate content type for file uploads
 */
export function validateContentType(req, res, next) {
  const contentType = req.get('Content-Type');
  
  if (!contentType || !contentType.includes('multipart/form-data')) {
    throw new ValidationError('Content-Type must be multipart/form-data', 'Content-Type');
  }

  next();
}

/**
 * Rate limiting validation (additional to express-rate-limit)
 */
export function validateRateLimit(req, res, next) {
  // This can be extended with custom rate limiting logic
  // For now, we rely on express-rate-limit middleware
  next();
} 