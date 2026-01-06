# 🎯 Test Addresses Reference

Daftar alamat yang bisa digunakan untuk testing berbagai scenarios.

## 📜 Verified Contracts (Low Risk)

### Ethereum Mainnet

- **Uniswap UNI Token**: `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984`

  - Type: ERC20 Token
  - Status: Verified
  - Expected Risk: LOW (10-20)

- **USDT (Tether)**: `0xdAC17F958D2ee523a2206206994597C13D831ec7`

  - Type: ERC20 Token (Stablecoin)
  - Status: Verified
  - Expected Risk: LOW (15-25)

- **USDC**: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`

  - Type: Proxy Contract
  - Status: Verified
  - Features: Upgradeable proxy
  - Expected Risk: LOW-MEDIUM (20-30)

- **Chainlink LINK**: `0x514910771AF9Ca656af840dff83E8264EcF986CA`

  - Type: ERC20 Token
  - Status: Verified
  - Expected Risk: LOW (10-20)

- **DAI Stablecoin**: `0x6B175474E89094C44Da98b954EedeAC495271d0F`

  - Type: ERC20 Token
  - Status: Verified
  - Expected Risk: LOW (10-15)

- **Wrapped ETH (WETH)**: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`

  - Type: ERC20 Token
  - Status: Verified
  - Expected Risk: VERY LOW (5-10)

- **Uniswap V2 Router**: `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`
  - Type: Smart Contract (DEX Router)
  - Status: Verified
  - Expected Risk: LOW (15-25)

### BSC (Binance Smart Chain)

- **PancakeSwap CAKE**: `0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82`

  - ChainId: 56
  - Type: BEP20 Token
  - Status: Verified
  - Expected Risk: LOW-MEDIUM (20-35)

- **BUSD**: `0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56`
  - ChainId: 56
  - Type: BEP20 Token (Stablecoin)
  - Status: Verified
  - Expected Risk: LOW (15-25)

### Polygon

- **MATIC (Native)**: `0x0000000000000000000000000000000000001010`

  - ChainId: 137
  - Type: Native Token Contract
  - Status: System Contract
  - Expected Risk: LOW (10-20)

- **USDC on Polygon**: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`
  - ChainId: 137
  - Type: ERC20 Token
  - Status: Verified
  - Expected Risk: LOW (15-25)

## 👛 Well-Known Wallets

- **Vitalik Buterin**: `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`

  - Type: EOA (Externally Owned Account)
  - Age: Very Old (> 5 years)
  - Activity: Very High
  - Expected Risk: VERY LOW (0-10)

- **Binance Hot Wallet**: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
  - Type: EOA
  - Age: Old
  - Activity: Extremely High
  - Expected Risk: LOW (10-20)

## 🚫 Invalid Test Cases

### Invalid Address Formats

- `invalid_address_123`
- `0x123` (too short)
- `wallet123`
- `` (empty string)
- `null`

### Invalid ChainIds

- `99999` (non-existent chain)
- `-1` (negative)
- `0` (invalid)

## ⚠️ High Risk Scenarios (Untuk testing detection)

### Unverified Contracts

Gunakan contract addresses yang tidak verified di Etherscan untuk test:

- Expected: `isVerified: false`
- Risk Score: Higher (40-60)

### New Wallets (< 30 days)

Untuk test wallet age check:

- Expected: Higher risk due to new account
- Warning flag untuk new wallet

### High Tax Tokens

Token dengan buy/sell tax > 10%:

- Expected: Tax warning di response
- Risk Score: Increased based on tax %

## 📊 Testing Strategy

### Phase 1: Positive Tests (Happy Path)

1. Test dengan verified contracts → Expect success
2. Test dengan legitimate tokens → Expect low risk
3. Test dengan old wallets → Expect low risk
4. Test di multiple chains → Expect consistent behavior

### Phase 2: Negative Tests (Error Handling)

1. Invalid address formats → Expect 400 error
2. Invalid chainIds → Expect 400 error
3. Missing required fields → Expect 400 error
4. Malformed JSON → Expect 400 error

### Phase 3: Edge Cases

1. Zero address → Expect rejection
2. Contract as wallet → Should detect correctly
3. Very new contracts → Higher risk score
4. Empty wallet (no transactions) → Special handling

### Phase 4: Performance Tests

1. Test response times untuk each scan type
2. Rate limiting (> 10 requests/minute) → Expect 429
3. Concurrent requests → Should handle gracefully
4. Large history queries → Pagination works

## 🎯 Expected Response Structure

```json
{
  "success": true,
  "data": {
    "address": "0x...",
    "chainId": 1,
    "type": "contract|token|wallet",
    "riskScore": 0-100,
    "riskLevel": "VERY_LOW|LOW|MEDIUM|HIGH|CRITICAL",
    "detections": {
      // 18 parameter checks
    },
    "riskAnalysis": {
      "summary": "AI-generated analysis",
      "keyRisks": [],
      "recommendations": []
    },
    "metadata": {
      "scannedAt": "timestamp",
      "scanDuration": "ms"
    }
  }
}
```

## 📝 Notes

- Semua alamat di atas adalah real addresses di blockchain
- Risk scores bisa vary tergantung kondisi real-time
- Gunakan chainId yang benar untuk setiap network
- Test addresses di-update berdasarkan ketersediaan
- Untuk production, jangan hardcode test addresses
