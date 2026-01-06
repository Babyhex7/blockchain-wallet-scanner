/**
 * Configuration - Environment Variables
 * Centralized config untuk semua environment variables
 */

import dotenv from 'dotenv';
import { ChainConfig } from '../types/scan.types';

// Load environment variables
dotenv.config();

/**
 * Validasi environment variables yang required
 * Gemini API key optional (ada fallback rule-based)
 */
const requiredEnvVars = [
  'PORT',
  'ETHERSCAN_API_KEY',
  'MONGODB_URI'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`❌ Missing required environment variable: ${envVar}`);
  }
}

/**
 * App Configuration
 */
export const config = {
  // Server
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'SafeChain Guardian',
  appVersion: process.env.APP_VERSION || '1.0.0',
  
  // AI Service (Google Gemini only)
  ai: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
      model: 'gemini-1.5-flash',
      temperature: 0.3,
      maxTokens: 500,
      timeout: 15000 // 15 seconds
    }
  },
  
  // Blockchain RPC (Public RPC)
  blockchain: {
    rpc: {
      ethUrl: process.env.ALCHEMY_ETH_URL || 'https://eth.llamarpc.com',
      polygonUrl: process.env.ALCHEMY_POLYGON_URL || 'https://polygon.llamarpc.com',
      bscUrl: process.env.ALCHEMY_BSC_URL || 'https://bsc.llamarpc.com'
    }
  },
  
  // External APIs
  apis: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY!,
      baseUrl: 'https://api.etherscan.io/api'
    },
    polygonscan: {
      apiKey: process.env.POLYGONSCAN_API_KEY || process.env.ETHERSCAN_API_KEY!,
      baseUrl: 'https://api.polygonscan.com/api'
    },
    bscscan: {
      apiKey: process.env.BSCSCAN_API_KEY || process.env.ETHERSCAN_API_KEY!,
      baseUrl: 'https://api.bscscan.com/api'
    },
    goplus: {
      baseUrl: 'https://api.gopluslabs.io/api/v1'
    }
  },
  
  // Database
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI!,
      options: {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000
      }
    }
  },
  
  // Security
  security: {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
      credentials: true
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10')
    }
  }
};

/**
 * Chain Configurations
 */
export const chains: Record<number, ChainConfig> = {
  1: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: config.blockchain.rpc.ethUrl,
    explorerUrl: 'https://etherscan.io',
    explorerApiUrl: config.apis.etherscan.baseUrl,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    }
  },
  137: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: config.blockchain.rpc.polygonUrl,
    explorerUrl: 'https://polygonscan.com',
    explorerApiUrl: config.apis.polygonscan.baseUrl,
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    }
  },
  56: {
    chainId: 56,
    name: 'BNB Chain',
    rpcUrl: config.blockchain.rpc.bscUrl,
    explorerUrl: 'https://bscscan.com',
    explorerApiUrl: config.apis.bscscan.baseUrl,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    }
  }
};

/**
 * Get chain config by chainId
 */
export function getChainConfig(chainId: number): ChainConfig {
  const chain = chains[chainId];
  if (!chain) {
    throw new Error(`Unsupported chainId: ${chainId}`);
  }
  return chain;
}
