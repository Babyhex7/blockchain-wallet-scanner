/**
 * Blockchain Service - Ethers.js Wrapper
 * Service untuk interact dengan blockchain via RPC
 */

import { ethers } from 'ethers';
import { getChainConfig } from '../config';
import { logger, logApiCall } from '../utils/logger';
import { BlockchainRpcError, InvalidAddressError } from '../utils/errors';
import type { ChainId } from '../types/scan.types';

/**
 * EIP-1967 Storage Slots untuk Proxy Detection
 */
const EIP1967_IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
const EIP1967_ADMIN_SLOT = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103';

/**
 * Blockchain Service Class
 */
export class BlockchainService {
  private providers: Map<ChainId, ethers.JsonRpcProvider>;
  
  constructor() {
    this.providers = new Map();
  }
  
  /**
   * Get atau create provider untuk chain tertentu
   */
  private getProvider(chainId: ChainId): ethers.JsonRpcProvider {
    let provider = this.providers.get(chainId);
    
    if (!provider) {
      const chain = getChainConfig(chainId);
      provider = new ethers.JsonRpcProvider(chain.rpcUrl);
      this.providers.set(chainId, provider);
      logger.debug(`Created new provider for chain ${chainId}`);
    }
    
    return provider;
  }
  
  /**
   * Validasi format address Ethereum
   */
  isValidAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }
  
  /**
   * Normalize address (checksum format)
   */
  normalizeAddress(address: string): string {
    if (!this.isValidAddress(address)) {
      throw new InvalidAddressError(address);
    }
    return ethers.getAddress(address);
  }
  
  /**
   * Check apakah address adalah contract
   */
  async isContract(address: string, chainId: ChainId): Promise<boolean> {
    try {
      const provider = this.getProvider(chainId);
      const startTime = Date.now();
      
      const code = await provider.getCode(address);
      
      logApiCall('Blockchain RPC', `getCode(${address})`, Date.now() - startTime, true);
      
      // Contract jika bytecode bukan '0x'
      return code !== '0x';
    } catch (error: any) {
      logger.error('Error checking isContract:', error);
      throw new BlockchainRpcError(error.message);
    }
  }
  
  /**
   * Get bytecode dari contract
   */
  async getBytecode(address: string, chainId: ChainId): Promise<string> {
    try {
      const provider = this.getProvider(chainId);
      const startTime = Date.now();
      
      const code = await provider.getCode(address);
      
      logApiCall('Blockchain RPC', `getCode(${address})`, Date.now() - startTime, true);
      
      return code;
    } catch (error: any) {
      logger.error('Error getting bytecode:', error);
      throw new BlockchainRpcError(error.message);
    }
  }
  
  /**
   * Get balance dari address
   */
  async getBalance(address: string, chainId: ChainId): Promise<string> {
    try {
      const provider = this.getProvider(chainId);
      const startTime = Date.now();
      
      const balance = await provider.getBalance(address);
      
      logApiCall('Blockchain RPC', `getBalance(${address})`, Date.now() - startTime, true);
      
      // Convert dari Wei ke Ether
      return ethers.formatEther(balance);
    } catch (error: any) {
      logger.error('Error getting balance:', error);
      throw new BlockchainRpcError(error.message);
    }
  }
  
  /**
   * Get transaction count (nonce) dari address
   */
  async getTransactionCount(address: string, chainId: ChainId): Promise<number> {
    try {
      const provider = this.getProvider(chainId);
      const startTime = Date.now();
      
      const count = await provider.getTransactionCount(address);
      
      logApiCall('Blockchain RPC', `getTransactionCount(${address})`, Date.now() - startTime, true);
      
      return count;
    } catch (error: any) {
      logger.error('Error getting transaction count:', error);
      throw new BlockchainRpcError(error.message);
    }
  }
  
  /**
   * Read storage slot (untuk proxy detection)
   */
  async getStorageAt(address: string, slot: string, chainId: ChainId): Promise<string> {
    try {
      const provider = this.getProvider(chainId);
      const startTime = Date.now();
      
      const value = await provider.getStorage(address, slot);
      
      logApiCall('Blockchain RPC', `getStorageAt(${address}, ${slot})`, Date.now() - startTime, true);
      
      return value;
    } catch (error: any) {
      logger.error('Error reading storage slot:', error);
      throw new BlockchainRpcError(error.message);
    }
  }
  
  /**
   * Detect proxy pattern (EIP-1967)
   */
  async detectProxy(address: string, chainId: ChainId): Promise<{
    isProxy: boolean;
    implementation?: string;
    admin?: string;
  }> {
    try {
      // Read EIP-1967 implementation slot
      const implSlot = await this.getStorageAt(address, EIP1967_IMPLEMENTATION_SLOT, chainId);
      
      // Parse address dari storage slot (ambil last 40 characters)
      const implAddress = implSlot !== '0x' + '0'.repeat(64) 
        ? '0x' + implSlot.slice(-40) 
        : null;
      
      if (implAddress && implAddress !== '0x' + '0'.repeat(40)) {
        // Read admin slot
        const adminSlot = await this.getStorageAt(address, EIP1967_ADMIN_SLOT, chainId);
        const adminAddress = adminSlot !== '0x' + '0'.repeat(64)
          ? '0x' + adminSlot.slice(-40)
          : undefined;
        
        return {
          isProxy: true,
          implementation: ethers.getAddress(implAddress),
          admin: adminAddress && adminAddress !== '0x' + '0'.repeat(40) 
            ? ethers.getAddress(adminAddress) 
            : undefined
        };
      }
      
      return { isProxy: false };
    } catch (error: any) {
      logger.error('Error detecting proxy:', error);
      // Return false jika gagal detect (better safe than throw)
      return { isProxy: false };
    }
  }
  
  /**
   * Call contract function (read-only)
   */
  async callContract(
    address: string,
    abi: any[],
    functionName: string,
    args: any[],
    chainId: ChainId
  ): Promise<any> {
    try {
      const provider = this.getProvider(chainId);
      const contract = new ethers.Contract(address, abi, provider);
      const startTime = Date.now();
      
      const result = await contract[functionName](...args);
      
      logApiCall('Blockchain RPC', `call ${functionName}(${address})`, Date.now() - startTime, true);
      
      return result;
    } catch (error: any) {
      logger.error(`Error calling contract function ${functionName}:`, error);
      throw new BlockchainRpcError(error.message);
    }
  }
  
  /**
   * Get owner dari contract (jika ada function owner())
   */
  async getOwner(address: string, chainId: ChainId): Promise<string | null> {
    try {
      // ABI untuk function owner()
      const ownerAbi = ['function owner() view returns (address)'];
      
      const owner = await this.callContract(address, ownerAbi, 'owner', [], chainId);
      
      return owner;
    } catch (error) {
      // Jika tidak ada function owner(), return null
      logger.debug(`Contract ${address} doesn't have owner() function or call failed`);
      return null;
    }
  }
  
  /**
   * Check if owner is renounced (address = 0x0)
   */
  isOwnerRenounced(owner: string | null): boolean {
    if (!owner) return false;
    return owner === ethers.ZeroAddress;
  }
  
  /**
   * Get current block number
   */
  async getBlockNumber(chainId: ChainId): Promise<number> {
    try {
      const provider = this.getProvider(chainId);
      const startTime = Date.now();
      
      const blockNumber = await provider.getBlockNumber();
      
      logApiCall('Blockchain RPC', 'getBlockNumber', Date.now() - startTime, true);
      
      return blockNumber;
    } catch (error: any) {
      logger.error('Error getting block number:', error);
      throw new BlockchainRpcError(error.message);
    }
  }
  
  /**
   * Parse dangerous functions dari ABI
   */
  parseDangerousFunctions(abi: any[]): string[] {
    const dangerousFunctions = [
      'mint',
      'burn',
      'pause',
      'unpause',
      'blacklist',
      'whitelist',
      'setFee',
      'setTax',
      'excludeFromFee',
      'transferOwnership',
      'renounceOwnership',
      'selfdestruct',
      'delegatecall',
      'upgradeTo',
      'upgradeToAndCall'
    ];
    
    const found: string[] = [];
    
    for (const item of abi) {
      if (item.type === 'function') {
        const funcName = item.name?.toLowerCase() || '';
        
        for (const dangerous of dangerousFunctions) {
          if (funcName.includes(dangerous.toLowerCase())) {
            found.push(item.name);
            break;
          }
        }
      }
    }
    
    return found;
  }
}
