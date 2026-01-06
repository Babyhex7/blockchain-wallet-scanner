/**
 * Rate Limiter Middleware
 * Limit requests per IP untuk prevent abuse
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * Rate limiter untuk scan endpoints
 * 10 requests per minute per IP
 */
export const scanRateLimiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil(config.security.rateLimit.windowMs / 1000)
      }
    });
  },
  skip: (_req) => {
    // Skip rate limiting di development
    return config.nodeEnv === 'development';
  }
});

/**
 * Rate limiter untuk general API
 * 60 requests per minute per IP
 */
export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (_req) => {
    return config.nodeEnv === 'development';
  }
});
