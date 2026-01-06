/**
 * Database Configuration - MongoDB Connection
 * Setup MongoDB connection dengan Mongoose
 */

import mongoose from 'mongoose';
import { config } from './index';
import { logger } from '../utils/logger';

/**
 * Connect ke MongoDB Atlas
 */
export async function connectDatabase(): Promise<void> {
  try {
    logger.info('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(config.database.mongodb.uri, config.database.mongodb.options);
    
    logger.info('✅ MongoDB connected successfully');
    
    // Event listeners
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

/**
 * Disconnect dari MongoDB
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    throw error;
  }
}

/**
 * Check database connection status
 */
export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
