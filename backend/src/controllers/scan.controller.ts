/**
 * Scan Controller
 * Handle HTTP requests untuk scanning
 */

import { Request, Response, NextFunction } from 'express';
import { ScanOrchestrator } from '../services/scan-orchestrator.service';
import { ScanResultModel } from '../models/ScanResult.model';
import { logger } from '../utils/logger';
import type { ScanRequest } from '../middleware/validator';
import type { ChainId, ScanType } from '../types/scan.types';

// Initialize orchestrator
const orchestrator = new ScanOrchestrator();

/**
 * Scan endpoint handler
 */
export async function scanAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { address, chainId } = req.body as ScanRequest;
    const scanType = req.params.type as ScanType | undefined;
    
    logger.info(`📨 Received scan request: ${address} on chain ${chainId}`);
    
    // Execute scan (cast chainId untuk TypeScript)
    const result = await orchestrator.scan(address, chainId as ChainId, scanType);
    
    // Save to database
    try {
      const scanDoc = new ScanResultModel(result);
      await scanDoc.save();
      logger.debug(`💾 Scan result saved to database: ${result.scanId}`);
    } catch (dbError) {
      // Log error but don't fail request
      logger.error('Error saving to database:', dbError);
    }
    
    // Return response
    res.status(200).json({
      success: true,
      data: result
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Get scan history untuk address
 */
export async function getScanHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { address } = req.params;
    const chainId = req.query.chainId ? parseInt(req.query.chainId as string) : undefined;
    
    const query: any = {
      address: address.toLowerCase()
    };
    
    if (chainId) {
      query.chainId = chainId;
    }
    
    const history = await ScanResultModel.find(query)
      .sort({ scannedAt: -1 })
      .limit(10)
      .select('-__v')
      .lean();
    
    res.status(200).json({
      success: true,
      data: history
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Get scan by ID
 */
export async function getScanById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { scanId } = req.params;
    
    const scan = await ScanResultModel.findOne({ scanId })
      .select('-__v')
      .lean();
    
    if (!scan) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Scan ${scanId} not found`
        }
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: scan
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Get system statistics
 */
export async function getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [totalScans, scansToday, riskDistribution] = await Promise.all([
      // Total scans
      ScanResultModel.countDocuments(),
      
      // Scans today
      ScanResultModel.countDocuments({
        scannedAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }),
      
      // Risk distribution
      ScanResultModel.aggregate([
        {
          $group: {
            _id: '$riskLevel',
            count: { $sum: 1 }
          }
        }
      ])
    ]);
    
    const stats = {
      totalScans,
      scansToday,
      riskDistribution: riskDistribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>)
    };
    
    res.status(200).json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    next(error);
  }
}
