/**
 * Main Entry Point - Express Server
 * Setup Express app dengan all middleware dan routes
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalRateLimiter } from './middleware/rateLimiter';

// Import routes
import scanRoutes from './routes/scan.routes';
import healthRoutes from './routes/health.routes';

/**
 * Initialize Express app
 */
const app: Application = express();

/**
 * Security & Performance Middleware
 */
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(cors({
  origin: config.security.cors.origin,
  credentials: config.security.cors.credentials
}));

/**
 * Body Parser Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Logger Middleware
 */
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

/**
 * General Rate Limiter
 */
app.use(generalRateLimiter);

/**
 * Root Route
 */
app.get('/', (_req, res) => {
  res.json({
    name: config.appName,
    version: config.appVersion,
    status: 'running',
    environment: config.nodeEnv,
    endpoints: {
      health: '/api/v1/health',
      scan: '/api/v1/scan',
      docs: 'https://github.com/yourrepo/docs'
    }
  });
});

/**
 * API Routes
 */
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/scan', scanRoutes);

/**
 * 404 Handler
 */
app.use(notFoundHandler);

/**
 * Error Handler (must be last)
 */
app.use(errorHandler);

/**
 * Start Server
 */
async function startServer(): Promise<void> {
  try {
    // 1. Connect to MongoDB
    await connectDatabase();
    
    // 2. Start Express server
    const server = app.listen(config.port, () => {
      logger.info('='.repeat(50));
      logger.info(`🚀 ${config.appName} v${config.appVersion}`);
      logger.info(`📡 Server running on http://localhost:${config.port}`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
      logger.info(`📊 MongoDB: Connected`);
      logger.info(`🤖 AI: Google Gemini`);
      logger.info('='.repeat(50));
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
