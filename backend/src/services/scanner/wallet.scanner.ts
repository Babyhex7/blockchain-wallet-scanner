/**
 * Wallet Scanner Service
 * Service untuk scan wallet/address risks
 * Implements 4 parameters dari wallet risk detection
 */

import { BlockchainService } from '../blockchain.service';
import { EtherscanClient } from '../external/etherscan.client';
import { GoPlusClient } from '../external/goplus.client';
import { logger } from '../../utils/logger';
import type { Risk, WalletData, ChainId } from '../../types/scan.types';

/**
 * Known mixer addresses (Tornado Cash, dll)
 */
const MIXER_ADDRESSES = [
  '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc', // Tornado Cash 0.1 ETH
  '0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936', // Tornado Cash 1 ETH
  '0x910cbd523d972eb0a6f4cae4618ad62622b39dbf', // Tornado Cash 10 ETH
  '0xa160cdab225685da1d56aa342ad8841c3b53f291', // Tornado Cash 100 ETH
];

/**
 * Wallet Scanner Class
 */
export class WalletScanner {
  private blockchainService: BlockchainService;
  private goPlusClient: GoPlusClient;
  
  constructor(blockchainService: BlockchainService) {
    this.blockchainService = blockchainService;
    this.goPlusClient = new GoPlusClient();
  }
  
  /**
   * Scan wallet dan return risks + wallet data
   */
  async scan(address: string, chainId: ChainId): Promise<{
    risks: Risk[];
    walletData: WalletData;
    riskScore: number;
  }> {
    logger.info(`👛 Scanning wallet: ${address}`);
    
    const risks: Risk[] = [];
    let riskScore = 0;
    
    // Initialize Etherscan client
    const etherscanClient = new EtherscanClient(chainId);
    
    // 1. Get wallet balance
    const balance = await this.blockchainService.getBalance(address, chainId);
    
    // 2. Get transaction count
    const txCount = await this.blockchainService.getTransactionCount(address, chainId);
    
    // 3. Get wallet age
    const ageInfo = await etherscanClient.getWalletAge(address);
    
    let firstTx = new Date();
    let lastTx = new Date();
    let ageInDays = 0;
    
    if (ageInfo) {
      firstTx = ageInfo.firstTx;
      lastTx = ageInfo.lastTx;
      ageInDays = ageInfo.ageInDays;
      
      // Check if wallet very new (< 7 days)
      if (ageInDays < 7) {
        const risk: Risk = {
          code: 'NEW_WALLET',
          severity: 'LOW',
          title: 'Very New Wallet',
          description: `Wallet baru dibuat ${ageInDays} hari yang lalu. Belum ada track record.`,
          score: 5
        };
        risks.push(risk);
        riskScore += risk.score;
      }
    } else {
      // Jika tidak ada transaction history
      const risk: Risk = {
        code: 'NO_HISTORY',
        severity: 'LOW',
        title: 'No Transaction History',
        description: 'Wallet tidak memiliki riwayat transaksi.',
        score: 5
      };
      risks.push(risk);
      riskScore += risk.score;
    }
    
    // 4. Check against scam database (GoPlus)
    const scamCheck = await this.goPlusClient.isScamAddress(address, chainId);
    
    let isScam = false;
    if (scamCheck.isScam) {
      isScam = true;
      const risk: Risk = {
        code: 'SCAM_DATABASE',
        severity: 'CRITICAL',
        title: 'Address In Scam Database',
        description: `Address ini terdaftar sebagai scam: ${scamCheck.reason}`,
        score: 40
      };
      risks.push(risk);
      riskScore += risk.score;
    }
    
    // 5. Check mixer connections
    const mixerConnections = await this.checkMixerConnections(address, etherscanClient);
    
    if (mixerConnections.length > 0) {
      const risk: Risk = {
        code: 'MIXER_CONNECTION',
        severity: 'HIGH',
        title: 'Mixer Connection Detected',
        description: `Wallet memiliki koneksi ke mixer (${mixerConnections.length} tx). Possibly money laundering.`,
        score: 25
      };
      risks.push(risk);
      riskScore += risk.score;
    }
    
    // 6. Check transaction patterns
    if (txCount > 1000) {
      // High volume trader, bisa jadi bot
      const risk: Risk = {
        code: 'HIGH_TX_VOLUME',
        severity: 'LOW',
        title: 'High Transaction Volume',
        description: `Wallet memiliki ${txCount} transactions. Kemungkinan bot atau high-frequency trader.`,
        score: 5
      };
      risks.push(risk);
      riskScore += risk.score;
    }
    
    // 7. Calculate reputation score (0-100, higher is better)
    let reputation = 50; // Start from neutral
    
    if (ageInDays > 365) reputation += 20; // Old wallet = more trusted
    else if (ageInDays > 180) reputation += 10;
    
    if (txCount > 100) reputation += 10; // Active wallet = more trusted
    else if (txCount < 10) reputation -= 10;
    
    if (isScam) reputation -= 40;
    if (mixerConnections.length > 0) reputation -= 20;
    
    reputation = Math.max(0, Math.min(100, reputation)); // Clamp 0-100
    
    // Build wallet data
    const walletData: WalletData = {
      balance,
      txCount,
      firstTx,
      lastTx,
      reputation,
      isScam,
      mixerConnections
    };
    
    logger.info(`✅ Wallet scan completed: ${risks.length} risks found, score: ${riskScore}`);
    
    return {
      risks,
      walletData,
      riskScore
    };
  }
  
  /**
   * Check connections ke known mixer addresses
   */
  private async checkMixerConnections(
    address: string,
    etherscanClient: EtherscanClient
  ): Promise<string[]> {
    try {
      // Get recent transactions
      const txs = await etherscanClient.getTransactions(address, 1, 100);
      
      const mixerTxs: string[] = [];
      
      for (const tx of txs) {
        // Check if to or from is a mixer address
        const toMixer = MIXER_ADDRESSES.includes(tx.to.toLowerCase());
        const fromMixer = MIXER_ADDRESSES.includes(tx.from.toLowerCase());
        
        if (toMixer || fromMixer) {
          mixerTxs.push(tx.hash);
        }
      }
      
      return mixerTxs;
    } catch (error) {
      logger.error('Error checking mixer connections:', error);
      return [];
    }
  }
}
