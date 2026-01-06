/**
 * Custom Error Classes
 * Definisi error classes untuk error handling yang lebih baik
 */

/**
 * Base AppError class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error (400)
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

/**
 * Invalid Address Error (400)
 */
export class InvalidAddressError extends AppError {
  constructor(address: string) {
    super(`Invalid address format: ${address}`, 400, 'INVALID_ADDRESS');
  }
}

/**
 * Unsupported Chain Error (400)
 */
export class UnsupportedChainError extends AppError {
  constructor(chainId: number) {
    super(`Unsupported chainId: ${chainId}`, 400, 'UNSUPPORTED_CHAIN');
  }
}

/**
 * External API Error (502)
 */
export class ExternalApiError extends AppError {
  constructor(service: string, message: string) {
    super(`${service} API error: ${message}`, 502, 'EXTERNAL_API_ERROR');
  }
}

/**
 * Blockchain RPC Error (502)
 */
export class BlockchainRpcError extends AppError {
  constructor(message: string) {
    super(`Blockchain RPC error: ${message}`, 502, 'BLOCKCHAIN_RPC_ERROR');
  }
}

/**
 * AI Service Error (503)
 */
export class AIServiceError extends AppError {
  constructor(message: string) {
    super(`AI service error: ${message}`, 503, 'AI_SERVICE_ERROR');
  }
}

/**
 * Database Error (500)
 */
export class DatabaseError extends AppError {
  constructor(message: string) {
    super(`Database error: ${message}`, 500, 'DATABASE_ERROR');
  }
}

/**
 * Cache Error (500)
 */
export class CacheError extends AppError {
  constructor(message: string) {
    super(`Cache error: ${message}`, 500, 'CACHE_ERROR');
  }
}

/**
 * Rate Limit Error (429)
 */
export class RateLimitError extends AppError {
  constructor() {
    super('Too many requests, please try again later', 429, 'RATE_LIMIT_EXCEEDED');
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

/**
 * Contract Not Verified Error (400)
 */
export class ContractNotVerifiedError extends AppError {
  constructor(address: string) {
    super(`Contract ${address} is not verified on block explorer`, 400, 'CONTRACT_NOT_VERIFIED');
  }
}

/**
 * Scan Timeout Error (504)
 */
export class ScanTimeoutError extends AppError {
  constructor() {
    super('Scan request timed out, please try again', 504, 'SCAN_TIMEOUT');
  }
}
