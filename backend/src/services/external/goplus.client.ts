/**
 * GoPlus Security Client - Token Security API
 * Client untuk check token security (honeypot, tax, LP locked, dll)
 */

import axios, { AxiosInstance } from 'axios';
import { config } from '../../config';
import { logger, logApiCall } from '../../utils/logger';
import type { ChainId } from '../../types/scan.types';

/**
 * GoPlus Token Security Response
 */
export interface GoPlusTokenSecurity {
  is_honeypot: string;              // '0' or '1'
  buy_tax: string;                  // e.g., '0.05' = 5%
  sell_tax: string;                 // e.g., '0.10' = 10%
  is_mintable: string;              // '0' or '1'
  can_take_back_ownership: string;  // '0' or '1'
  owner_address: string;            // Owner address
  creator_address: string;          // Creator address
  is_blacklisted: string;           // '0' or '1'
  is_whitelisted: string;           // '0' or '1'
  is_in_dex: string;                // '0' or '1'
  lp_holder_count: string;          // Number of LP holders
  lp_total_supply: string;          // Total LP supply
  holder_count: string;             // Total token holders
  total_supply: string;             // Total token supply
  holders: Array<{                  // Top holders
    address: string;
    balance: string;
    percent: string;
  }>;
}

/**
 * GoPlus Address Security Response
 */
export interface GoPlusAddressSecurity {
  is_contract: string;              // '0' or '1'
  contract_name?: string;           // Contract name jika ada
  tag?: string;                     // Tag (e.g., 'Scam', 'Phishing')
  is_open_source: string;           // '0' or '1'
  is_proxy: string;                 // '0' or '1'
  is_blacklisted: string;           // '0' or '1'
  blacklist_type?: string;          // Type of blacklist
  cybercrime?: string;              // '0' or '1'
  money_laundering?: string;        // '0' or '1'
  financial_crime?: string;         // '0' or '1'
  darkweb_transactions?: string;    // '0' or '1'
  reinit?: string;                  // '0' or '1'
  fake_token?: string;              // '0' or '1'
  data_source: string;              // Data source name
}

/**
 * GoPlus Client Class
 */
export class GoPlusClient {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = config.apis.goplus.baseUrl;
    
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  /**
   * Get chain ID untuk GoPlus API
   * GoPlus menggunakan format chain ID yang berbeda
   */
  private getGoPlusChainId(chainId: ChainId): string {
    const chainMap: Record<ChainId, string> = {
      1: '1',      // Ethereum
      137: '137',  // Polygon
      56: '56'     // BSC
    };
    
    return chainMap[chainId] || '1';
  }
  
  /**
   * Get token security data
   */
  async getTokenSecurity(
    tokenAddress: string,
    chainId: ChainId
  ): Promise<GoPlusTokenSecurity | null> {
    try {
      const startTime = Date.now();
      const goPlusChainId = this.getGoPlusChainId(chainId);
      
      const response = await this.axiosInstance.get('/token_security/' + goPlusChainId, {
        params: {
          contract_addresses: tokenAddress.toLowerCase()
        }
      });
      
      logApiCall('GoPlus', `getTokenSecurity(${tokenAddress})`, Date.now() - startTime, true);
      
      if (response.data.code === 1 && response.data.result) {
        const result = response.data.result[tokenAddress.toLowerCase()];
        
        if (result) {
          return result as GoPlusTokenSecurity;
        }
      }
      
      logger.warn(`GoPlus: No data found for token ${tokenAddress}`);
      return null;
    } catch (error: any) {
      logger.error('GoPlus getTokenSecurity error:', error);
      const duration = Date.now();
      logApiCall('GoPlus', `getTokenSecurity(${tokenAddress})`, duration, false);
      
      // Return null instead of throw untuk graceful degradation
      return null;
    }
  }
  
  /**
   * Get address security data (scam check)
   */
  async getAddressSecurity(
    address: string,
    chainId: ChainId
  ): Promise<GoPlusAddressSecurity | null> {
    try {
      const startTime = Date.now();
      const goPlusChainId = this.getGoPlusChainId(chainId);
      
      const response = await this.axiosInstance.get('/address_security/' + address.toLowerCase(), {
        params: {
          chain_id: goPlusChainId
        }
      });
      
      logApiCall('GoPlus', `getAddressSecurity(${address})`, Date.now() - startTime, true);
      
      if (response.data.code === 1 && response.data.result) {
        return response.data.result as GoPlusAddressSecurity;
      }
      
      logger.warn(`GoPlus: No data found for address ${address}`);
      return null;
    } catch (error: any) {
      logger.error('GoPlus getAddressSecurity error:', error);
      const duration = Date.now();
      logApiCall('GoPlus', `getAddressSecurity(${address})`, duration, false);
      
      // Return null instead of throw
      return null;
    }
  }
  
  /**
   * Parse boolean dari string '0' atau '1'
   */
  parseBoolean(value: string | undefined): boolean {
    return value === '1';
  }
  
  /**
   * Parse percentage dari string (e.g., '0.05' -> 5)
   */
  parsePercentage(value: string | undefined): number {
    if (!value) return 0;
    try {
      return parseFloat(value) * 100;
    } catch {
      return 0;
    }
  }
  
  /**
   * Check if token is honeypot
   */
  async isHoneypot(tokenAddress: string, chainId: ChainId): Promise<boolean> {
    try {
      const security = await this.getTokenSecurity(tokenAddress, chainId);
      
      if (!security) {
        logger.warn(`Cannot determine honeypot status for ${tokenAddress}`);
        return false;
      }
      
      return this.parseBoolean(security.is_honeypot);
    } catch (error) {
      logger.error('Error checking honeypot:', error);
      return false;
    }
  }
  
  /**
   * Get buy and sell tax
   */
  async getTaxes(tokenAddress: string, chainId: ChainId): Promise<{
    buyTax: number;
    sellTax: number;
  }> {
    try {
      const security = await this.getTokenSecurity(tokenAddress, chainId);
      
      if (!security) {
        return { buyTax: 0, sellTax: 0 };
      }
      
      return {
        buyTax: this.parsePercentage(security.buy_tax),
        sellTax: this.parsePercentage(security.sell_tax)
      };
    } catch (error) {
      logger.error('Error getting taxes:', error);
      return { buyTax: 0, sellTax: 0 };
    }
  }
  
  /**
   * Check if address is in scam database
   */
  async isScamAddress(address: string, chainId: ChainId): Promise<{
    isScam: boolean;
    reason?: string;
  }> {
    try {
      const security = await this.getAddressSecurity(address, chainId);
      
      if (!security) {
        return { isScam: false };
      }
      
      const isBlacklisted = this.parseBoolean(security.is_blacklisted);
      const isCybercrime = this.parseBoolean(security.cybercrime);
      const isMoneyLaundering = this.parseBoolean(security.money_laundering);
      const isFinancialCrime = this.parseBoolean(security.financial_crime);
      
      if (isBlacklisted || isCybercrime || isMoneyLaundering || isFinancialCrime) {
        const reasons = [];
        if (isBlacklisted) reasons.push('Blacklisted');
        if (isCybercrime) reasons.push('Cybercrime');
        if (isMoneyLaundering) reasons.push('Money Laundering');
        if (isFinancialCrime) reasons.push('Financial Crime');
        
        return {
          isScam: true,
          reason: reasons.join(', ')
        };
      }
      
      return { isScam: false };
    } catch (error) {
      logger.error('Error checking scam address:', error);
      return { isScam: false };
    }
  }
}
