/**
 * Error Handler Middleware
 * Centralized error handling untuk semua errors
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Error response interface
 */
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
}

/**
 * Error handler middleware
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error
  logger.error('Error occurred:', {
    method: req.method,
    url: req.url,
    error: err.message,
    stack: err.stack
  });
  
  // Check if it's operational error (AppError)
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message
      }
    };
    
    // Include stack trace di development
    if (config.nodeEnv === 'development') {
      response.error.stack = err.stack;
    }
    
    res.status(err.statusCode).json(response);
    return;
  }
  
  // Generic error (unexpected)
  const response: ErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.nodeEnv === 'production' 
        ? 'An unexpected error occurred' 
        : err.message
    }
  };
  
  if (config.nodeEnv === 'development') {
    response.error.stack = err.stack;
  }
  
  res.status(500).json(response);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.url} not found`
    }
  });
}

/**
 * Async handler wrapper untuk catch errors di async functions
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
