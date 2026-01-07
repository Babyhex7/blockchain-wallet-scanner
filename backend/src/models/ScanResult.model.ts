/**
 * Scan Result Model - MongoDB Schema
 * Schema untuk menyimpan hasil scan ke database
 */

import mongoose, { Schema, Document } from 'mongoose';
import type { ScanType, RiskLevel, Risk, ContractData, TokenData, WalletData, AIAnalysis } from '../types/scan.types';

/**
 * ScanResult Document Interface
 */
export interface IScanResult extends Document {
  scanId: string;
  type: ScanType;
  address: string;
  chainId: number;
  
  riskScore: number;
  riskLevel: RiskLevel;
  risks: Risk[];
  
  contractData?: ContractData;
  tokenData?: TokenData;
  walletData?: WalletData;
  
  aiAnalysis: AIAnalysis;
  
  scannedAt: Date;
  scanDuration: number;
  expiresAt: Date; // TTL for auto-deletion
}

/**
 * Risk Sub-schema
 */
const RiskSchema = new Schema({
  code: { type: String, required: true },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  score: { type: Number, required: true }
}, { _id: false });

/**
 * AI Analysis Sub-schema
 */
const AIAnalysisSchema = new Schema({
  summary: { type: String, required: true },
  topRisks: [{ type: String }],
  reasoning: { type: String, required: true },
  recommendation: { type: String, enum: ['SAFE', 'CAUTION', 'AVOID', 'BLOCK'], required: true },
  confidence: { type: Number, required: true, min: 0, max: 1 }
}, { _id: false });

/**
 * Contract Data Sub-schema
 */
const ContractDataSchema = new Schema({
  verified: { type: Boolean, required: true },
  owner: { type: String, default: null },
  isProxy: { type: Boolean, required: true },
  proxyType: { type: String },
  implementation: { type: String },
  functions: [{ type: String }],
  createdAt: { type: Date, required: true },
  creationTx: { type: String }
}, { _id: false });

/**
 * Token Data Sub-schema
 */
const TokenDataSchema = new Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  decimals: { type: Number, required: true },
  totalSupply: { type: String, required: true },
  buyTax: { type: Number, required: true },
  sellTax: { type: Number, required: true },
  isHoneypot: { type: Boolean, required: true },
  lpLocked: { type: Boolean, required: true },
  topHolders: [{
    address: { type: String, required: true },
    balance: { type: String, required: true },
    percentage: { type: Number, required: true }
  }]
}, { _id: false });

/**
 * Wallet Data Sub-schema
 */
const WalletDataSchema = new Schema({
  balance: { type: String, required: true },
  txCount: { type: Number, required: true },
  firstTx: { type: Date, required: true },
  lastTx: { type: Date, required: true },
  reputation: { type: Number, required: true, min: 0, max: 100 },
  isScam: { type: Boolean, required: true },
  mixerConnections: [{ type: String }]
}, { _id: false });

/**
 * Main ScanResult Schema
 */
const ScanResultSchema = new Schema<IScanResult>({
  scanId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['contract', 'token', 'wallet'],
    required: true
  },
  address: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  chainId: {
    type: Number,
    required: true,
    index: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true,
    index: true
  },
  risks: {
    type: [RiskSchema],
    required: true
  },
  contractData: {
    type: ContractDataSchema,
    required: false
  },
  tokenData: {
    type: TokenDataSchema,
    required: false
  },
  walletData: {
    type: WalletDataSchema,
    required: false
  },
  aiAnalysis: {
    type: AIAnalysisSchema,
    required: true
  },
  scannedAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  scanDuration: {
    type: Number,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default: 30 days from now
  }
}, {
  timestamps: true,
  collection: 'scan_results'
});

// Compound index untuk query optimization
ScanResultSchema.index({ address: 1, chainId: 1, type: 1 });

// TTL index untuk auto-delete setelah expires (30 days default)
ScanResultSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Export model
 */
export const ScanResultModel = mongoose.model<IScanResult>('ScanResult', ScanResultSchema);
