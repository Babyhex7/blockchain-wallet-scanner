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
 * GET /api/v1/scan/history/:address
 * Get scan history untuk address
 */
router.get(
  '/history/:address',
  asyncHandler(scanController.getScanHistory)
);

/**
 * GET /api/v1/scan/:scanId
 * Get scan by ID
 */
router.get(
  '/:scanId',
  asyncHandler(scanController.getScanById)
);

/**
 * GET /api/v1/scan/stats
 * Get system statistics
 */
router.get(
  '/stats',
  asyncHandler(scanController.getStats)
);

export default router;
