/**
 * Token Scanner Service
 * Service untuk scan ERC20 token risks
 * Implements 5 parameters dari token risk detection
 */

import { BlockchainService } from '../blockchain.service';
import { GoPlusClient } from '../external/goplus.client';
import { logger } from '../../utils/logger';
import type { Risk, TokenData, ChainId } from '../../types/scan.types';

/**
 * ERC20 ABI untuk basic token info
 */
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)'
];

/**
 * Token Scanner Class
 */
export class TokenScanner {
  private blockchainService: BlockchainService;
  private goPlusClient: GoPlusClient;
  
  constructor(blockchainService: BlockchainService) {
    this.blockchainService = blockchainService;
    this.goPlusClient = new GoPlusClient();
  }
  
  /**
   * Scan token dan return risks + token data
   */
  async scan(address: string, chainId: ChainId): Promise<{
    risks: Risk[];
    tokenData: TokenData;
    riskScore: number;
  }> {
    logger.info(`🪙 Scanning token: ${address}`);
    
    const risks: Risk[] = [];
    let riskScore = 0;
    
    // 1. Get basic token info dari blockchain
    const tokenInfo = await this.getTokenInfo(address, chainId);
    
    // 2. Get security data dari GoPlus
    const securityData = await this.goPlusClient.getTokenSecurity(address, chainId);
    
    let isHoneypot = false;
    let buyTax = 0;
    let sellTax = 0;
    let lpLocked = false;
    let topHolders: TokenData['topHolders'] = [];
    
    if (securityData) {
      // Check honeypot
      isHoneypot = this.goPlusClient.parseBoolean(securityData.is_honeypot);
      if (isHoneypot) {
        const risk: Risk = {
          code: 'HONEYPOT',
          severity: 'CRITICAL',
          title: 'Honeypot Detected',
          description: 'Token ini adalah honeypot! Kamu bisa buy tapi tidak bisa sell.',
          score: 40
        };
        risks.push(risk);
        riskScore += risk.score;
      }
      
      // Check taxes
      buyTax = this.goPlusClient.parsePercentage(securityData.buy_tax);
      sellTax = this.goPlusClient.parsePercentage(securityData.sell_tax);
      
      if (sellTax > 20) {
        const risk: Risk = {
          code: 'HIGH_SELL_TAX',
          severity: 'HIGH',
          title: 'Very High Sell Tax',
          description: `Sell tax ${sellTax.toFixed(1)}% sangat tinggi! Sulit untuk jual.`,
          score: 25
        };
        risks.push(risk);
        riskScore += risk.score;
      } else if (sellTax > 10) {
        const risk: Risk = {
          code: 'MEDIUM_SELL_TAX',
          severity: 'MEDIUM',
          title: 'High Sell Tax',
          description: `Sell tax ${sellTax.toFixed(1)}% cukup tinggi.`,
          score: 15
        };
        risks.push(risk);
        riskScore += risk.score;
      }
      
      if (buyTax > 10) {
        const risk: Risk = {
          code: 'HIGH_BUY_TAX',
          severity: 'MEDIUM',
          title: 'High Buy Tax',
          description: `Buy tax ${buyTax.toFixed(1)}% cukup tinggi.`,
          score: 10
        };
        risks.push(risk);
        riskScore += risk.score;
      }
      
      // Check LP locked
      const lpHolderCount = parseInt(securityData.lp_holder_count || '0');
      lpLocked = lpHolderCount > 0; // Simplified check
      
      if (!lpLocked) {
        const risk: Risk = {
          code: 'LP_NOT_LOCKED',
          severity: 'HIGH',
          title: 'Liquidity Not Locked',
          description: 'Liquidity tidak terkunci. Owner bisa pull liquidity (rugpull)!',
          score: 20
        };
        risks.push(risk);
        riskScore += risk.score;
      }
      
      // Check holder distribution
      if (securityData.holders && securityData.holders.length > 0) {
        topHolders = securityData.holders.slice(0, 10).map(h => ({
          address: h.address,
          balance: h.balance,
          percentage: parseFloat(h.percent) * 100
        }));
        
        // Check if top holder has > 50%
        const topHolderPercent = parseFloat(securityData.holders[0].percent) * 100;
        if (topHolderPercent > 50) {
          const risk: Risk = {
            code: 'CONCENTRATED_HOLDINGS',
            severity: 'HIGH',
            title: 'Highly Concentrated Holdings',
            description: `Top holder memiliki ${topHolderPercent.toFixed(1)}% supply. Risiko dump!`,
            score: 20
          };
          risks.push(risk);
          riskScore += risk.score;
        } else if (topHolderPercent > 30) {
          const risk: Risk = {
            code: 'CONCENTRATED_HOLDINGS',
            severity: 'MEDIUM',
            title: 'Concentrated Holdings',
            description: `Top holder memiliki ${topHolderPercent.toFixed(1)}% supply.`,
            score: 12
          };
          risks.push(risk);
          riskScore += risk.score;
        }
      }
      
      // Check if mintable
      const isMintable = this.goPlusClient.parseBoolean(securityData.is_mintable);
      if (isMintable) {
        const risk: Risk = {
          code: 'MINTABLE_TOKEN',
          severity: 'HIGH',
          title: 'Token Can Be Minted',
          description: 'Token supply bisa ditambah oleh owner. Risiko inflation!',
          score: 18
        };
        risks.push(risk);
        riskScore += risk.score;
      }
      
      // Check if not in DEX
      const isInDex = this.goPlusClient.parseBoolean(securityData.is_in_dex);
      if (!isInDex) {
        const risk: Risk = {
          code: 'NOT_IN_DEX',
          severity: 'MEDIUM',
          title: 'Token Not In DEX',
          description: 'Token belum ada di DEX. Likuiditas rendah atau belum launched.',
          score: 10
        };
        risks.push(risk);
        riskScore += risk.score;
      }
    } else {
      // Jika GoPlus API fail, warning
      logger.warn('GoPlus API returned no data for token');
      const risk: Risk = {
        code: 'NO_SECURITY_DATA',
        severity: 'MEDIUM',
        title: 'No Security Data Available',
        description: 'Tidak bisa mendapatkan data security dari GoPlus API.',
        score: 15
      };
      risks.push(risk);
      riskScore += risk.score;
    }
    
    // Build token data
    const tokenData: TokenData = {
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      decimals: tokenInfo.decimals,
      totalSupply: tokenInfo.totalSupply,
      buyTax,
      sellTax,
      isHoneypot,
      lpLocked,
      topHolders
    };
    
    logger.info(`✅ Token scan completed: ${risks.length} risks found, score: ${riskScore}`);
    
    return {
      risks,
      tokenData,
      riskScore
    };
  }
  
  /**
   * Get basic token info dari blockchain
   */
  private async getTokenInfo(address: string, chainId: ChainId): Promise<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
  }> {
    try {
      const name = await this.blockchainService.callContract(
        address,
        ERC20_ABI,
        'name',
        [],
        chainId
      );
      
      const symbol = await this.blockchainService.callContract(
        address,
        ERC20_ABI,
        'symbol',
        [],
        chainId
      );
      
      const decimals = await this.blockchainService.callContract(
        address,
        ERC20_ABI,
        'decimals',
        [],
        chainId
      );
      
      const totalSupply = await this.blockchainService.callContract(
        address,
        ERC20_ABI,
        'totalSupply',
        [],
        chainId
      );
      
      return {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: totalSupply.toString()
      };
    } catch (error) {
      logger.error('Error getting token info:', error);
      // Return default values jika fail
      return {
        name: 'Unknown',
        symbol: 'UNKNOWN',
        decimals: 18,
        totalSupply: '0'
      };
    }
  }
}
