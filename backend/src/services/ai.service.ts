/**
 * AI Service - Groq & Google Gemini Integration
 * Service untuk AI analysis menggunakan Groq (primary) dan Gemini (backup)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AIServiceError } from '../utils/errors';
import type { AIAnalysis, Risk, ChainId } from '../types/scan.types';

/**
 * AI Input Data untuk analysis
 */
export interface AIInputData {
  scanType: 'contract' | 'token' | 'wallet';
  address: string;
  chainId: ChainId;
  baseRiskScore: number;
  detectedRisks: Risk[];
  contractData?: {
    verified: boolean;
    owner: string | null;
    isProxy: boolean;
    functions: string[];
  };
  tokenData?: {
    isHoneypot: boolean;
    buyTax: number;
    sellTax: number;
    lpLocked: boolean;
  };
  walletData?: {
    ageInDays: number;
    txCount: number;
  };
}

/**
 * AI Service Class
 */
export class AIService {
  private geminiClient: GoogleGenerativeAI | null;
  
  constructor() {
    // Initialize Gemini AI (only AI provider)
    if (config.ai.gemini.apiKey) {
      this.geminiClient = new GoogleGenerativeAI(config.ai.gemini.apiKey);
      logger.info('✅ Google Gemini AI initialized');
    } else {
      this.geminiClient = null;
      logger.warn('⚠️  Gemini API key not found, using rule-based analysis only');
    }
  }
  
  /**
   * Main analyze function dengan fallback
   */
  async analyze(data: AIInputData): Promise<AIAnalysis> {
    // Try Gemini AI
    if (this.geminiClient) {
      try {
        logger.info('🤖 Analyzing with Google Gemini AI...');
        return await this.analyzeWithGemini(data);
      } catch (geminiError: any) {
        logger.error('❌ Gemini AI failed, using rule-based analysis');
        logger.error('Error:', geminiError.message);
        return this.generateRuleBasedAnalysis(data);
      }
    }
    
    // No AI available, use rule-based
    logger.warn('⚠️  No AI configured, using rule-based analysis');
    return this.generateRuleBasedAnalysis(data);
  }
  
  /**
   * Analyze dengan Google Gemini
   */
  private async analyzeWithGemini(data: AIInputData): Promise<AIAnalysis> {
    try {
      if (!this.geminiClient) {
        throw new Error('Gemini client not initialized');
      }
      
      const model = this.geminiClient.getGenerativeModel({
        model: config.ai.gemini.model
      });
      
      const prompt = this.getSystemPrompt() + '\n\n' + this.buildPrompt(data);
      
      const startTime = Date.now();
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      const duration = Date.now() - startTime;
      logger.info(`✅ Gemini analysis completed in ${duration}ms`);
      
      // Extract JSON dari response (Gemini kadang include text tambahan)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return this.validateAndFormatAIResponse(parsed, data.baseRiskScore);
      
    } catch (error: any) {
      logger.error('Gemini analysis error:', error);
      throw new AIServiceError(`Gemini: ${error.message}`);
    }
  }
  
  /**
   * Rule-based analysis (fallback tanpa AI)
   */
  private generateRuleBasedAnalysis(data: AIInputData): AIAnalysis {
    logger.info('🔧 Using rule-based analysis (no AI)');
    
    const criticalCount = data.detectedRisks.filter(r => r.severity === 'CRITICAL').length;
    const highCount = data.detectedRisks.filter(r => r.severity === 'HIGH').length;
    const mediumCount = data.detectedRisks.filter(r => r.severity === 'MEDIUM').length;
    
    // Generate summary
    let summary = `Detected ${criticalCount} critical, ${highCount} high, and ${mediumCount} medium risk issues. `;
    
    if (data.scanType === 'contract') {
      if (!data.contractData?.verified) {
        summary += 'Contract is not verified. ';
      }
      if (data.contractData?.functions.length) {
        summary += `Found ${data.contractData.functions.length} dangerous functions. `;
      }
    } else if (data.scanType === 'token') {
      if (data.tokenData?.isHoneypot) {
        summary += 'Token appears to be a honeypot. ';
      }
      if (data.tokenData && data.tokenData.sellTax > 20) {
        summary += `High sell tax detected (${data.tokenData.sellTax}%). `;
      }
    }
    
    // Generate recommendation
    let recommendation: 'SAFE' | 'CAUTION' | 'AVOID' | 'BLOCK' = 'CAUTION';
    if (criticalCount > 0 || data.baseRiskScore > 75) {
      recommendation = 'AVOID';
    } else if (data.baseRiskScore > 50) {
      recommendation = 'CAUTION';
    } else if (data.baseRiskScore < 25) {
      recommendation = 'SAFE';
    }
    
    // Get top 3 risks
    const topRisks = data.detectedRisks
      .slice(0, 3)
      .map(r => r.description);
    
    return {
      summary: summary.trim(),
      topRisks,
      reasoning: 'Analysis based on rule-based detection without AI assistance.',
      recommendation,
      confidence: 0.6 // Lower confidence without AI
    };
  }
  
  /**
   * Build prompt untuk AI
   */
  private buildPrompt(data: AIInputData): string {
    let prompt = `Analyze this ${data.scanType} scan result and provide security assessment.\n\n`;
    
    prompt += `Address: ${data.address}\n`;
    prompt += `Chain ID: ${data.chainId}\n`;
    prompt += `Base Risk Score: ${data.baseRiskScore}/100\n\n`;
    
    // Add detected risks
    prompt += `Detected Risks:\n`;
    for (const risk of data.detectedRisks) {
      prompt += `- ${risk.title} (${risk.severity}): ${risk.description}\n`;
    }
    prompt += '\n';
    
    // Add type-specific data
    if (data.scanType === 'contract' && data.contractData) {
      prompt += `Contract Details:\n`;
      prompt += `- Verified: ${data.contractData.verified}\n`;
      prompt += `- Owner: ${data.contractData.owner || 'Not found'}\n`;
      prompt += `- Is Proxy: ${data.contractData.isProxy}\n`;
      prompt += `- Dangerous Functions: ${data.contractData.functions.join(', ') || 'None'}\n`;
    } else if (data.scanType === 'token' && data.tokenData) {
      prompt += `Token Details:\n`;
      prompt += `- Honeypot: ${data.tokenData.isHoneypot}\n`;
      prompt += `- Buy Tax: ${data.tokenData.buyTax}%\n`;
      prompt += `- Sell Tax: ${data.tokenData.sellTax}%\n`;
      prompt += `- LP Locked: ${data.tokenData.lpLocked}\n`;
    } else if (data.scanType === 'wallet' && data.walletData) {
      prompt += `Wallet Details:\n`;
      prompt += `- Age: ${data.walletData.ageInDays} days\n`;
      prompt += `- Transaction Count: ${data.walletData.txCount}\n`;
    }
    
    prompt += '\nProvide analysis in JSON format with fields: finalRiskScore, riskLevel, summary, topRisks (array of 3 strings), reasoning, recommendation, confidence.';
    
    return prompt;
  }
  
  /**
   * System prompt untuk AI
   */
  private getSystemPrompt(): string {
    return `You are SafeChain Guardian AI, an expert Web3 security analyst specializing in smart contract and token risk assessment.

Your role:
1. Analyze blockchain security data objectively
2. Identify potential risks and scam patterns
3. Provide clear, actionable explanations in simple language
4. Give risk-adjusted scores (0-100, lower is safer) and recommendations

Guidelines:
- Be direct and concise
- Focus on TOP 3 most critical risks
- Risk levels: SAFE (0-25), LOW (26-50), MEDIUM (51-75), HIGH (76-100)
- Recommendations: SAFE, CAUTION, AVOID, BLOCK
- Confidence: 0.0 to 1.0 (how confident you are)
- If uncertain, err on the side of caution

Output MUST be valid JSON only with these exact fields:
{
  "finalRiskScore": <number 0-100>,
  "riskLevel": "<SAFE|LOW|MEDIUM|HIGH|CRITICAL>",
  "summary": "<2-3 sentence analysis>",
  "topRisks": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "reasoning": "<why this score and recommendation>",
  "recommendation": "<SAFE|CAUTION|AVOID|BLOCK>",
  "confidence": <number 0.0-1.0>
}`;
  }
  
  /**
   * Validate dan format AI response
   */
  private validateAndFormatAIResponse(response: any, _baseRiskScore: number): AIAnalysis {
    // Ensure all required fields exist
    const summary = response.summary || 'Analysis completed';
    const topRisks = Array.isArray(response.topRisks) ? response.topRisks.slice(0, 3) : [];
    const reasoning = response.reasoning || 'Based on detected patterns';
    const recommendation = response.recommendation || 'CAUTION';
    const confidence = typeof response.confidence === 'number' ? response.confidence : 0.75;
    
    return {
      summary,
      topRisks,
      reasoning,
      recommendation,
      confidence
    };
  }
}
