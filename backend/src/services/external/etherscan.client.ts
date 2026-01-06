/**
 * Etherscan Client - Block Explorer API
 * Client untuk fetch contract data dari Etherscan/Polygonscan/BSCScan
 */

import axios, { AxiosInstance } from 'axios';
import { config } from '../../config';
import { logger, logApiCall } from '../../utils/logger';
import { ExternalApiError } from '../../utils/errors';
import type { ChainId } from '../../types/scan.types';

/**
 * Etherscan API Response Interface
 */
interface EtherscanResponse<T> {
  status: string;
  message: string;
  result: T;
}

/**
 * Contract Info dari Etherscan
 */
export interface ContractInfo {
  sourceCode: string;
  abi: string;
  contractName: string;
  compilerVersion: string;
  optimizationUsed: string;
  runs: string;
  constructorArguments: string;
  evmVersion: string;
  library: string;
  licenseType: string;
  proxy: string;
  implementation: string;
  swarmSource: string;
}

/**
 * Transaction Info
 */
export interface TransactionInfo {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: string;
  gasUsed: string;
  gasPrice: string;
  isError: string;
}

/**
 * Etherscan Client Class
 */
export class EtherscanClient {
  private axiosInstance: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;
  
  constructor(chainId: ChainId) {
    // Get API key berdasarkan chain
    if (chainId === 1) {
      this.apiKey = config.apis.etherscan.apiKey;
      this.baseUrl = config.apis.etherscan.baseUrl;
    } else if (chainId === 137) {
      this.apiKey = config.apis.polygonscan.apiKey;
      this.baseUrl = config.apis.polygonscan.baseUrl;
    } else if (chainId === 56) {
      this.apiKey = config.apis.bscscan.apiKey;
      this.baseUrl = config.apis.bscscan.baseUrl;
    } else {
      throw new Error(`Unsupported chainId: ${chainId}`);
    }
    
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      params: {
        apikey: this.apiKey
      }
    });
  }
  
  /**
   * Get contract source code & ABI
   */
  async getContractSource(address: string): Promise<ContractInfo | null> {
    try {
      const startTime = Date.now();
      
      const response = await this.axiosInstance.get<EtherscanResponse<ContractInfo[]>>('', {
        params: {
          module: 'contract',
          action: 'getsourcecode',
          address
        }
      });
      
      logApiCall('Etherscan', `getContractSource(${address})`, Date.now() - startTime, true);
      
      if (response.data.status === '1' && response.data.result.length > 0) {
        const result = response.data.result[0];
        
        // Check if contract verified
        if (result.sourceCode === '') {
          logger.debug(`Contract ${address} is not verified`);
          return null;
        }
        
        return result;
      }
      
      return null;
    } catch (error: any) {
      logger.error('Etherscan getContractSource error:', error);
      const duration = Date.now();
      logApiCall('Etherscan', `getContractSource(${address})`, duration, false);
      throw new ExternalApiError('Etherscan', error.message);
    }
  }
  
  /**
   * Check if contract is verified
   */
  async isContractVerified(address: string): Promise<boolean> {
    try {
      const contractInfo = await this.getContractSource(address);
      return contractInfo !== null;
    } catch (error) {
      logger.error('Error checking contract verification:', error);
      return false;
    }
  }
  
  /**
   * Get ABI dari verified contract
   */
  async getContractAbi(address: string): Promise<any[] | null> {
    try {
      const contractInfo = await this.getContractSource(address);
      
      if (!contractInfo || !contractInfo.abi) {
        return null;
      }
      
      // Parse ABI string to JSON
      try {
        const abi = JSON.parse(contractInfo.abi);
        return abi;
      } catch (parseError) {
        logger.error('Error parsing ABI:', parseError);
        return null;
      }
    } catch (error) {
      logger.error('Error getting contract ABI:', error);
      return null;
    }
  }
  
  /**
   * Get contract creation transaction
   */
  async getContractCreation(address: string): Promise<{
    txHash: string;
    creator: string;
    timestamp: number;
  } | null> {
    try {
      const startTime = Date.now();
      
      const response = await this.axiosInstance.get<EtherscanResponse<TransactionInfo[]>>('', {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 1,
          sort: 'asc'
        }
      });
      
      logApiCall('Etherscan', `getContractCreation(${address})`, Date.now() - startTime, true);
      
      if (response.data.status === '1' && response.data.result.length > 0) {
        const firstTx = response.data.result[0];
        
        return {
          txHash: firstTx.hash,
          creator: firstTx.from,
          timestamp: parseInt(firstTx.timeStamp)
        };
      }
      
      return null;
    } catch (error: any) {
      logger.error('Etherscan getContractCreation error:', error);
      throw new ExternalApiError('Etherscan', error.message);
    }
  }
  
  /**
   * Get normal transactions untuk address
   */
  async getTransactions(
    address: string,
    page: number = 1,
    offset: number = 100
  ): Promise<TransactionInfo[]> {
    try {
      const startTime = Date.now();
      
      const response = await this.axiosInstance.get<EtherscanResponse<TransactionInfo[]>>('', {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          page,
          offset,
          sort: 'desc'
        }
      });
      
      logApiCall('Etherscan', `getTransactions(${address})`, Date.now() - startTime, true);
      
      if (response.data.status === '1') {
        return response.data.result;
      }
      
      return [];
    } catch (error: any) {
      logger.error('Etherscan getTransactions error:', error);
      throw new ExternalApiError('Etherscan', error.message);
    }
  }
  
  /**
   * Get first and last transaction timestamps
   */
  async getWalletAge(address: string): Promise<{
    firstTx: Date;
    lastTx: Date;
    ageInDays: number;
  } | null> {
    try {
      // Get first tx
      const firstTxResponse = await this.axiosInstance.get<EtherscanResponse<TransactionInfo[]>>('', {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 1,
          sort: 'asc'
        }
      });
      
      if (firstTxResponse.data.status !== '1' || firstTxResponse.data.result.length === 0) {
        return null;
      }
      
      // Get last tx
      const lastTxResponse = await this.axiosInstance.get<EtherscanResponse<TransactionInfo[]>>('', {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 1,
          sort: 'desc'
        }
      });
      
      const firstTimestamp = parseInt(firstTxResponse.data.result[0].timeStamp);
      const lastTimestamp = parseInt(lastTxResponse.data.result[0].timeStamp);
      
      const firstTx = new Date(firstTimestamp * 1000);
      const lastTx = new Date(lastTimestamp * 1000);
      const ageInDays = Math.floor((Date.now() - firstTimestamp * 1000) / (1000 * 60 * 60 * 24));
      
      return {
        firstTx,
        lastTx,
        ageInDays
      };
    } catch (error: any) {
      logger.error('Etherscan getWalletAge error:', error);
      return null;
    }
  }
  
  /**
   * Get token balance untuk address
   */
  async getTokenBalance(contractAddress: string, walletAddress: string): Promise<string> {
    try {
      const startTime = Date.now();
      
      const response = await this.axiosInstance.get<EtherscanResponse<string>>('', {
        params: {
          module: 'account',
          action: 'tokenbalance',
          contractaddress: contractAddress,
          address: walletAddress,
          tag: 'latest'
        }
      });
      
      logApiCall('Etherscan', `getTokenBalance(${contractAddress})`, Date.now() - startTime, true);
      
      if (response.data.status === '1') {
        return response.data.result;
      }
      
      return '0';
    } catch (error: any) {
      logger.error('Etherscan getTokenBalance error:', error);
      throw new ExternalApiError('Etherscan', error.message);
    }
  }
}
