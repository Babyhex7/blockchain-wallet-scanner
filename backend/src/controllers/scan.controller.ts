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
    
    // Detect scan type dari path
    let scanType: ScanType | undefined;
    if (req.path.includes('/contract')) scanType = 'contract';
    else if (req.path.includes('/token')) scanType = 'token';
    else if (req.path.includes('/wallet')) scanType = 'wallet';
    // else undefined = auto-detect
    
    logger.info(`📨 Received scan request: ${address} on chain ${chainId}, type: ${scanType || 'auto'}`);
    
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
 * Get scan history (all atau filter by query params)
 */
export async function getScanHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { address, type } = req.query;
    const chainId = req.query.chainId ? parseInt(req.query.chainId as string) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? Math.min(parseInt(req.query.limit as string), 100) : 10;
    
    const query: any = {};
    
    if (address) {
      query.address = (address as string).toLowerCase();
    }
    
    if (chainId) {
      query.chainId = chainId;
    }
    
    if (type) {
      query.type = type;
    }
    
    const skip = (page - 1) * limit;
    
    const [history, total] = await Promise.all([
      ScanResultModel.find(query)
        .sort({ scannedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      ScanResultModel.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
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
