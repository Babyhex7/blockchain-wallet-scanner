/**
 * Health Check Route
 * Check system health status
 */

import { Router, Request, Response } from 'express';
import { isDatabaseConnected } from '../config/database';
import { config } from '../config';

const router = Router();

/**
 * GET /api/v1/health
 * Health check endpoint
 */
router.get('/', async (_req: Request, res: Response) => {
  const dbConnected = isDatabaseConnected();
  
  const health = {
    status: dbConnected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      database: dbConnected ? 'connected' : 'disconnected',
      blockchain: 'operational', // Simplified check
      ai: 'operational' // Simplified check
    },
    version: config.appVersion,
    environment: config.nodeEnv
  };
  
  const statusCode = health.status === 'ok' ? 200 : 503;
  
  res.status(statusCode).json(health);
});

export default router;
