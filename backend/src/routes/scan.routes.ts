/**
 * Scan Routes
 * Define all scan-related routes
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validateRequest, ScanRequestSchema } from '../middleware/validator';
import { scanRateLimiter } from '../middleware/rateLimiter';
import * as scanController from '../controllers/scan.controller';

const router = Router();

/**
 * POST /api/v1/scan/contract
 * Scan smart contract
 */
router.post(
  '/contract',
  scanRateLimiter,
  validateRequest(ScanRequestSchema),
  asyncHandler(scanController.scanAddress)
);

/**
 * POST /api/v1/scan/token
 * Scan ERC20 token
 */
router.post(
  '/token',
  scanRateLimiter,
  validateRequest(ScanRequestSchema),
  asyncHandler(scanController.scanAddress)
);

/**
 * POST /api/v1/scan/wallet
 * Scan wallet address
 */
router.post(
  '/wallet',
  scanRateLimiter,
  validateRequest(ScanRequestSchema),
  asyncHandler(scanController.scanAddress)
);

/**
 * POST /api/v1/scan
 * Auto-detect dan scan (contract/token/wallet)
 */
router.post(
  '/',
  scanRateLimiter,
  validateRequest(ScanRequestSchema),
  asyncHandler(scanController.scanAddress)
);

/**
 * GET /api/v1/scan/history
 * Get scan history (semua atau filter by address via query)
 * MUST be before /:scanId to avoid route conflict
 */
router.get(
  '/history',
  asyncHandler(scanController.getScanHistory)
);

/**
 * GET /api/v1/scan/stats
 * Get system statistics
 * MUST be before /:scanId to avoid route conflict
 */
router.get(
  '/stats',
  asyncHandler(scanController.getStats)
);

/**
 * GET /api/v1/scan/:scanId
 * Get scan by ID
 * MUST be last to avoid catching /history and /stats
 */
router.get(
  '/:scanId',
  asyncHandler(scanController.getScanById)
);

export default router;
