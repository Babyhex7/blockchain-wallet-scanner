/**
 * Scan Orchestrator Service
 * Main coordinator untuk semua scanning process
 * Mengkoordinasi: Scanner → AI Analysis → Risk Scoring → Cache
 */

import { BlockchainService } from './blockchain.service';
import { ContractScanner } from './scanner/contract.scanner';
import { TokenScanner } from './scanner/token.scanner';
import { WalletScanner } from './scanner/wallet.scanner';
import { AIService, type AIInputData } from './ai.service';
import { logger, logScan } from '../utils/logger';
import { InvalidAddressError } from '../utils/errors';
import type { ChainId, ScanType, ScanResult, RiskLevel } from '../types/scan.types';

/**
 * Scan Orchestrator Class
 */
export class ScanOrchestrator {
  private blockchainService: BlockchainService;
  private contractScanner: ContractScanner;
  private tokenScanner: TokenScanner;
  private walletScanner: WalletScanner;
  private aiService: AIService;
  
  constructor() {
    this.blockchainService = new BlockchainService();
    this.contractScanner = new ContractScanner(this.blockchainService);
    this.tokenScanner = new TokenScanner(this.blockchainService);
    this.walletScanner = new WalletScanner(this.blockchainService);
    this.aiService = new AIService();
  }
  
  /**
   * Main scan function
   */
  async scan(address: string, chainId: ChainId, type?: ScanType): Promise<ScanResult> {
    const startTime = Date.now();
    const scanId = this.generateScanId();
    
    logger.info(`🔍 Starting scan ${scanId} for ${address} on chain ${chainId}`);
    
    // 1. Validate input
    if (!this.blockchainService.isValidAddress(address)) {
      throw new InvalidAddressError(address);
    }
    
    const normalizedAddress = this.blockchainService.normalizeAddress(address);
    
    logger.info(`🔍 Starting fresh scan for ${normalizedAddress}`);
    
    // 2. Auto-detect scan type jika tidak ditentukan
    if (!type) {
      type = await this.detectScanType(normalizedAddress, chainId);
      logger.info(`📌 Auto-detected scan type: ${type}`);
    }
    
    // 3. Execute scanner berdasarkan type
    let scanResult: ScanResult;
    
    if (type === 'contract') {
      scanResult = await this.scanContract(scanId, normalizedAddress, chainId, startTime);
    } else if (type === 'token') {
      scanResult = await this.scanToken(scanId, normalizedAddress, chainId, startTime);
    } else if (type === 'wallet') {
      scanResult = await this.scanWallet(scanId, normalizedAddress, chainId, startTime);
    } else {
      throw new Error(`Invalid scan type: ${type}`);
    }
    
    const duration = Date.now() - startTime;
    logScan(scanId, type, normalizedAddress, chainId, duration);
    
    return scanResult;
  }
  
  /**
   * Scan contract
   */
  private async scanContract(
    scanId: string,
    address: string,
    chainId: ChainId,
    startTime: number
  ): Promise<ScanResult> {
    // Run contract scanner
    const scannerResult = await this.contractScanner.scan(address, chainId);
    
    // Prepare AI input
    const aiInput: AIInputData = {
      scanType: 'contract',
      address,
      chainId,
      baseRiskScore: scannerResult.riskScore,
      detectedRisks: scannerResult.risks,
      contractData: {
        verified: scannerResult.contractData.verified,
        owner: scannerResult.contractData.owner,
        isProxy: scannerResult.contractData.isProxy,
        functions: scannerResult.contractData.functions
      }
    };
    
    // Get AI analysis
    const aiAnalysis = await this.aiService.analyze(aiInput);
    
    // Calculate final risk score & level
    const finalRiskScore = Math.min(100, scannerResult.riskScore);
    const riskLevel = this.scoreToLevel(finalRiskScore);
    
    return {
      scanId,
      type: 'contract',
      address,
      chainId,
      riskScore: finalRiskScore,
      riskLevel,
      risks: scannerResult.risks,
      contractData: scannerResult.contractData,
      aiAnalysis,
      scannedAt: new Date(),
      scanDuration: Date.now() - startTime,
      cached: false
    };
  }
  
  /**
   * Scan token
   */
  private async scanToken(
    scanId: string,
    address: string,
    chainId: ChainId,
    startTime: number
  ): Promise<ScanResult> {
    // Run token scanner
    const scannerResult = await this.tokenScanner.scan(address, chainId);
    
    // Prepare AI input
    const aiInput: AIInputData = {
      scanType: 'token',
      address,
      chainId,
      baseRiskScore: scannerResult.riskScore,
      detectedRisks: scannerResult.risks,
      tokenData: {
        isHoneypot: scannerResult.tokenData.isHoneypot,
        buyTax: scannerResult.tokenData.buyTax,
        sellTax: scannerResult.tokenData.sellTax,
        lpLocked: scannerResult.tokenData.lpLocked
      }
    };
    
    // Get AI analysis
    const aiAnalysis = await this.aiService.analyze(aiInput);
    
    // Calculate final risk score & level
    const finalRiskScore = Math.min(100, scannerResult.riskScore);
    const riskLevel = this.scoreToLevel(finalRiskScore);
    
    return {
      scanId,
      type: 'token',
      address,
      chainId,
      riskScore: finalRiskScore,
      riskLevel,
      risks: scannerResult.risks,
      tokenData: scannerResult.tokenData,
      aiAnalysis,
      scannedAt: new Date(),
      scanDuration: Date.now() - startTime,
      cached: false
    };
  }
  
  /**
   * Scan wallet
   */
  private async scanWallet(
    scanId: string,
    address: string,
    chainId: ChainId,
    startTime: number
  ): Promise<ScanResult> {
    // Run wallet scanner
    const scannerResult = await this.walletScanner.scan(address, chainId);
    
    // Prepare AI input
    const aiInput: AIInputData = {
      scanType: 'wallet',
      address,
      chainId,
      baseRiskScore: scannerResult.riskScore,
      detectedRisks: scannerResult.risks,
      walletData: {
        ageInDays: Math.floor(
          (Date.now() - scannerResult.walletData.firstTx.getTime()) / (1000 * 60 * 60 * 24)
        ),
        txCount: scannerResult.walletData.txCount
      }
    };
    
    // Get AI analysis
    const aiAnalysis = await this.aiService.analyze(aiInput);
    
    // Calculate final risk score & level
    const finalRiskScore = Math.min(100, scannerResult.riskScore);
    const riskLevel = this.scoreToLevel(finalRiskScore);
    
    return {
      scanId,
      type: 'wallet',
      address,
      chainId,
      riskScore: finalRiskScore,
      riskLevel,
      risks: scannerResult.risks,
      walletData: scannerResult.walletData,
      aiAnalysis,
      scannedAt: new Date(),
      scanDuration: Date.now() - startTime,
      cached: false
    };
  }
  
  /**
   * Auto-detect scan type berdasarkan address
   */
  private async detectScanType(address: string, chainId: ChainId): Promise<ScanType> {
    try {
      const isContract = await this.blockchainService.isContract(address, chainId);
      
      if (isContract) {
        // Untuk sederhanakan, anggap contract = token
        // Nanti bisa ditambah logic untuk detect pure contract vs token
        return 'token';
      } else {
        return 'wallet';
      }
    } catch (error) {
      logger.error('Error detecting scan type:', error);
      // Default to wallet jika gagal
      return 'wallet';
    }
  }
  
  /**
   * Convert score ke risk level
   */
  private scoreToLevel(score: number): RiskLevel {
    if (score <= 25) return 'SAFE';
    if (score <= 50) return 'LOW';
    if (score <= 75) return 'MEDIUM';
    if (score <= 90) return 'HIGH';
    return 'CRITICAL';
  }
  
  /**
   * Generate unique scan ID
   */
  private generateScanId(): string {
    return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
