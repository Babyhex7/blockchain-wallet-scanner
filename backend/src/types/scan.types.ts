/**
 * TypeScript Types - Scan Results & Risk Assessment
 * Definisi semua tipe data yang digunakan di aplikasi
 */

/**
 * Tipe chain yang didukung
 */
export type ChainId = 1 | 137 | 56; // Ethereum, Polygon, BSC

/**
 * Tipe scan
 */
export type ScanType = 'contract' | 'token' | 'wallet';

/**
 * Level risiko
 */
export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Severity untuk setiap parameter
 */
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Rekomendasi AI
 */
export type Recommendation = 'SAFE' | 'CAUTION' | 'AVOID' | 'BLOCK';

/**
 * Risk Detection Result
 */
export interface Risk {
  code: string;                   // Kode risk (e.g., "UNLIMITED_MINT")
  severity: Severity;             // Tingkat severity
  title: string;                  // Judul risk
  description: string;            // Penjelasan risk
  score: number;                  // Kontribusi ke total score (0-100)
}

/**
 * Contract-specific data
 */
export interface ContractData {
  verified: boolean;              // Apakah contract verified
  owner: string | null;           // Address owner (null jika renounced)
  isProxy: boolean;               // Apakah proxy contract
  proxyType?: string;             // Tipe proxy (EIP-1967, EIP-1822)
  implementation?: string;        // Address implementation (jika proxy)
  functions: string[];            // List fungsi berbahaya
  createdAt: Date;                // Tanggal contract dibuat
  creationTx?: string;            // Transaction hash pembuatan
}

/**
 * Token-specific data
 */
export interface TokenData {
  name: string;                   // Nama token
  symbol: string;                 // Symbol token
  decimals: number;               // Decimals
  totalSupply: string;            // Total supply (as string untuk big numbers)
  buyTax: number;                 // Buy tax percentage
  sellTax: number;                // Sell tax percentage
  isHoneypot: boolean;            // Apakah honeypot
  lpLocked: boolean;              // Apakah LP locked
  topHolders: {                   // Top 10 holders
    address: string;
    balance: string;
    percentage: number;
  }[];
}

/**
 * Wallet-specific data
 */
export interface WalletData {
  balance: string;                // Balance dalam ETH/MATIC/BNB
  txCount: number;                // Jumlah transaction
  firstTx: Date;                  // Transaction pertama
  lastTx: Date;                   // Transaction terakhir
  reputation: number;             // Reputation score (0-100)
  isScam: boolean;                // Apakah ada di scam database
  mixerConnections: string[];     // Connection ke mixer (Tornado Cash, dll)
}

/**
 * AI Analysis Result
 */
export interface AIAnalysis {
  summary: string;                // Ringkasan analisis
  topRisks: string[];             // Top 3 risks
  reasoning: string;              // Alasan scoring
  recommendation: Recommendation; // Rekomendasi action
  confidence: number;             // Confidence level (0-1)
}

/**
 * Complete Scan Result
 */
export interface ScanResult {
  scanId: string;                 // Unique scan ID
  type: ScanType;                 // Tipe scan
  address: string;                // Address yang di-scan
  chainId: ChainId;               // Network
  
  // Risk Assessment
  riskScore: number;              // 0-100 (lower = safer)
  riskLevel: RiskLevel;           // SAFE/LOW/MEDIUM/HIGH/CRITICAL
  risks: Risk[];                  // List semua risks
  
  // Type-specific data
  contractData?: ContractData;
  tokenData?: TokenData;
  walletData?: WalletData;
  
  // AI Analysis
  aiAnalysis: AIAnalysis;
  
  // Metadata
  scannedAt: Date;
  scanDuration: number;           // Durasi scan dalam ms
  cached: boolean;                // Apakah dari cache
}

/**
 * API Request untuk scan
 */
export interface ScanRequest {
  address: string;
  chainId: ChainId;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Chain configuration
 */
export interface ChainConfig {
  chainId: ChainId;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  explorerApiUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}
