/**
 * Contract Scanner Service
 * Service untuk scan smart contract risks
 * Implements 9 parameters dari contract risk detection
 */

import { BlockchainService } from '../blockchain.service';
import { EtherscanClient } from '../external/etherscan.client';
import { logger } from '../../utils/logger';
import type { Risk, ContractData, ChainId } from '../../types/scan.types';

/**
 * Contract Scanner Class
 */
export class ContractScanner {
  private blockchainService: BlockchainService;
  
  constructor(blockchainService: BlockchainService) {
    this.blockchainService = blockchainService;
  }
  
  /**
   * Scan contract dan return risks + contract data
   */
  async scan(address: string, chainId: ChainId): Promise<{
    risks: Risk[];
    contractData: ContractData;
    riskScore: number;
  }> {
    logger.info(`📝 Scanning contract: ${address}`);
    
    const risks: Risk[] = [];
    let riskScore = 0;
    
    // Initialize Etherscan client untuk chain ini
    const etherscanClient = new EtherscanClient(chainId);
    
    // 1. Check if verified
    const contractInfo = await etherscanClient.getContractSource(address);
    const verified = contractInfo !== null;
    
    if (!verified) {
      const risk: Risk = {
        code: 'UNVERIFIED',
        severity: 'MEDIUM',
        title: 'Contract Not Verified',
        description: 'Source code tidak tersedia untuk audit. Sulit memvalidasi keamanan contract.',
        score: 15
      };
      risks.push(risk);
      riskScore += risk.score;
    }
    
    // 2. Get ABI dan parse functions
    let abi: any[] = [];
    let dangerousFunctions: string[] = [];
    
    if (contractInfo && contractInfo.abi) {
      try {
        abi = JSON.parse(contractInfo.abi);
        dangerousFunctions = this.blockchainService.parseDangerousFunctions(abi);
        
        // Check specific dangerous functions
        const functionChecks = this.checkDangerousFunctions(dangerousFunctions);
        risks.push(...functionChecks.risks);
        riskScore += functionChecks.score;
      } catch (error) {
        logger.error('Error parsing ABI:', error);
      }
    }
    
    // 3. Check proxy pattern
    const proxyInfo = await this.blockchainService.detectProxy(address, chainId);
    
    if (proxyInfo.isProxy) {
      const risk: Risk = {
        code: 'PROXY_CONTRACT',
        severity: 'MEDIUM',
        title: 'Proxy Contract Detected',
        description: 'Contract menggunakan proxy pattern. Logic bisa diubah oleh admin.',
        score: 10
      };
      risks.push(risk);
      riskScore += risk.score;
      
      // Check if implementation is also verified
      if (proxyInfo.implementation && verified) {
        const implInfo = await etherscanClient.getContractSource(proxyInfo.implementation);
        if (!implInfo) {
          const implRisk: Risk = {
            code: 'UNVERIFIED_IMPLEMENTATION',
            severity: 'HIGH',
            title: 'Unverified Implementation',
            description: 'Implementation contract tidak verified. Sangat berisiko!',
            score: 20
          };
          risks.push(implRisk);
          riskScore += implRisk.score;
        }
      }
    }
    
    // 4. Check owner
    const owner = await this.blockchainService.getOwner(address, chainId);
    const ownerRenounced = owner ? this.blockchainService.isOwnerRenounced(owner) : false;
    
    if (owner && !ownerRenounced) {
      const risk: Risk = {
        code: 'OWNER_NOT_RENOUNCED',
        severity: 'MEDIUM',
        title: 'Owner Not Renounced',
        description: 'Contract masih memiliki owner yang bisa mengubah parameter.',
        score: 12
      };
      risks.push(risk);
      riskScore += risk.score;
    }
    
    // 5. Get contract creation info
    const creationInfo = await etherscanClient.getContractCreation(address);
    const createdAt = creationInfo 
      ? new Date(creationInfo.timestamp * 1000)
      : new Date();
    
    // Check if contract is very new (< 7 days)
    const ageInDays = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    if (ageInDays < 7) {
      const risk: Risk = {
        code: 'NEW_CONTRACT',
        severity: 'LOW',
        title: 'Very New Contract',
        description: `Contract baru dibuat ${ageInDays} hari yang lalu. Belum teruji waktu.`,
        score: 5
      };
      risks.push(risk);
      riskScore += risk.score;
    }
    
    // Build contract data
    const contractData: ContractData = {
      verified,
      owner: owner || null,
      isProxy: proxyInfo.isProxy,
      proxyType: proxyInfo.isProxy ? 'EIP-1967' : undefined,
      implementation: proxyInfo.implementation,
      functions: dangerousFunctions,
      createdAt,
      creationTx: creationInfo?.txHash
    };
    
    logger.info(`✅ Contract scan completed: ${risks.length} risks found, score: ${riskScore}`);
    
    return {
      risks,
      contractData,
      riskScore
    };
  }
  
  /**
   * Check dangerous functions dan generate risks
   */
  private checkDangerousFunctions(functions: string[]): {
    risks: Risk[];
    score: number;
  } {
    const risks: Risk[] = [];
    let score = 0;
    
    // Check untuk mint function
    const hasMint = functions.some(f => f.toLowerCase().includes('mint'));
    if (hasMint) {
      const risk: Risk = {
        code: 'UNLIMITED_MINT',
        severity: 'CRITICAL',
        title: 'Unlimited Mint Function',
        description: 'Owner bisa mint token tanpa batas. Risiko supply inflation!',
        score: 25
      };
      risks.push(risk);
      score += risk.score;
    }
    
    // Check untuk blacklist function
    const hasBlacklist = functions.some(f => f.toLowerCase().includes('blacklist'));
    if (hasBlacklist) {
      const risk: Risk = {
        code: 'BLACKLIST_FUNCTION',
        severity: 'HIGH',
        title: 'Blacklist Function Detected',
        description: 'Owner bisa blacklist addresses dan freeze funds mereka.',
        score: 20
      };
      risks.push(risk);
      score += risk.score;
    }
    
    // Check untuk pause function
    const hasPause = functions.some(f => 
      f.toLowerCase().includes('pause') && !f.toLowerCase().includes('unpause')
    );
    if (hasPause) {
      const risk: Risk = {
        code: 'PAUSABLE',
        severity: 'MEDIUM',
        title: 'Pausable Contract',
        description: 'Contract bisa di-pause oleh owner, menghentikan semua transfer.',
        score: 15
      };
      risks.push(risk);
      score += risk.score;
    }
    
    // Check untuk setFee/setTax function
    const hasSetFee = functions.some(f => 
      f.toLowerCase().includes('setfee') || f.toLowerCase().includes('settax')
    );
    if (hasSetFee) {
      const risk: Risk = {
        code: 'ADJUSTABLE_FEE',
        severity: 'HIGH',
        title: 'Adjustable Fee/Tax',
        description: 'Owner bisa mengubah fee/tax kapan saja. Bisa jadi 100%!',
        score: 20
      };
      risks.push(risk);
      score += risk.score;
    }
    
    // Check untuk selfdestruct
    const hasSelfDestruct = functions.some(f => f.toLowerCase().includes('selfdestruct'));
    if (hasSelfDestruct) {
      const risk: Risk = {
        code: 'SELFDESTRUCT',
        severity: 'CRITICAL',
        title: 'Self-Destruct Function',
        description: 'Contract bisa dihancurkan, semua funds hilang!',
        score: 30
      };
      risks.push(risk);
      score += risk.score;
    }
    
    // Check untuk delegatecall
    const hasDelegateCall = functions.some(f => f.toLowerCase().includes('delegatecall'));
    if (hasDelegateCall) {
      const risk: Risk = {
        code: 'DELEGATECALL',
        severity: 'HIGH',
        title: 'Delegate Call Detected',
        description: 'Contract menggunakan delegatecall. Bisa execute arbitrary code!',
        score: 20
      };
      risks.push(risk);
      score += risk.score;
    }
    
    // Check untuk upgrade functions
    const hasUpgrade = functions.some(f => 
      f.toLowerCase().includes('upgrade') && 
      !f.toLowerCase().includes('upgradefee')
    );
    if (hasUpgrade) {
      const risk: Risk = {
        code: 'UPGRADEABLE',
        severity: 'HIGH',
        title: 'Upgradeable Contract',
        description: 'Contract logic bisa diubah melalui upgrade. Code bisa berubah!',
        score: 20
      };
      risks.push(risk);
      score += risk.score;
    }
    
    return { risks, score };
  }
}
