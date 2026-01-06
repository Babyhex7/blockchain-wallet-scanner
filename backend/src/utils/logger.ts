/**
 * Logger Utility - Winston Logger
 * Centralized logging untuk development & production
 */

import winston from 'winston';
import { config } from '../config';

/**
 * Format log dengan timestamp dan colorize
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

/**
 * Console format untuk development
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

/**
 * Winston logger instance
 */
export const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat
    }),
    
    // File transport untuk errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // File transport untuk semua logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

/**
 * Log request middleware
 */
export function logRequest(method: string, url: string, duration: number) {
  logger.info('HTTP Request', {
    method,
    url,
    duration: `${duration}ms`
  });
}

/**
 * Log error dengan detail
 */
export function logError(error: Error, context?: any) {
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    context
  });
}

/**
 * Log API call ke external service
 */
export function logApiCall(service: string, endpoint: string, duration: number, success: boolean) {
  logger.debug('External API Call', {
    service,
    endpoint,
    duration: `${duration}ms`,
    success
  });
}

/**
 * Log scan activity
 */
export function logScan(scanId: string, type: string, address: string, chainId: number, duration: number) {
  logger.info('Scan completed', {
    scanId,
    type,
    address,
    chainId,
    duration: `${duration}ms`
  });
}
