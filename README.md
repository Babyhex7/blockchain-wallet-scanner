# 🛡️ SafeChain Guardian

## AI-Powered Web3 Risk Scanner (100% GRATIS! 🎉)

Platform web untuk menganalisis keamanan smart contract, token, dan wallet address di blockchain. Mendeteksi scam, rugpull, honeypot, dan transaksi berbahaya dengan bantuan AI **GRATIS dari Groq & Google Gemini**.

> 🚀 **Fully FREE Stack**: Groq AI + Alchemy + MongoDB + Redis + Railway  
> 💰 **Total Cost MVP**: $0/bulan (AI, RPC, Database semua gratis!)  
> ⚡ **AI Response**: < 1 detik (lebih cepat dari GPT-4!)  
> 📊 **Capacity**: 15,900 scans/hari (100% GRATIS!)

### 🆓 Checklist "Benar-Benar Gratis?"

✅ **Libraries** (React, Express, Ethers.js, dll) - GRATIS (open source)  
✅ **AI** (Groq 14.4k/day + Gemini 1.5k/day) - GRATIS (no credit card!)  
✅ **Blockchain RPC** (Alchemy 300M/month) - GRATIS  
✅ **APIs** (Etherscan, GoPlus) - GRATIS  
✅ **Database** (MongoDB 512MB + Redis 10k cmd/day) - GRATIS  
✅ **Hosting** (Vercel + Railway $5 credit) - GRATIS untuk MVP

**TOTAL: $0/bulan untuk 1,000-5,000 scans/hari!** 🎉

---

## 📋 Daftar Isi

- [Ringkasan Proyek](#-ringkasan-proyek)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Technology Stack](#-technology-stack)
- [Struktur Folder](#-struktur-folder)
- [Database Design](#-database-design)
- [API Endpoints](#-api-endpoints)
- [Parameter Deteksi Risiko](#-parameter-deteksi-risiko)
- [Alur Sistem](#-alur-sistem)
- [AI Engine](#-ai-engine)
- [External APIs](#-external-apis)
- [Instalasi & Setup](#-instalasi--setup)
- [Environment Variables](#-environment-variables)
- [Development Guidelines](#-development-guidelines)
- [Testing Strategy](#-testing-strategy)
- [Error Handling](#-error-handling)
- [Performance & Monitoring](#-performance--monitoring)
- [Troubleshooting](#-troubleshooting)
- [Security Best Practices](#-security-best-practices)
- [Deployment](#-deployment)

---

## 🎯 Ringkasan Proyek

### Tentang Proyek

- **Jenis**: Web Application (tanpa extension)
- **Autentikasi**: Tidak ada login, langsung pakai
- **Fungsi**: Scan keamanan smart contract, token, dan wallet
- **AI**: Analisis dan penjelasan risiko dalam bahasa manusia

### Masalah yang Diselesaikan

- User crypto sering kena scam (rugpull, honeypot, fake token)
- Sulit membedakan contract aman vs berbahaya
- Butuh waktu lama untuk audit manual
- Tidak ada tools dengan penjelasan yang mudah dipahami

### Solusi

- Scan contract/wallet dalam hitungan detik
- Deteksi 30+ parameter risiko
- **AI gratis (Groq/Gemini)** memberikan penjelasan natural language
- Risk score 0-100 yang mudah dipahami
- **100% gratis untuk dijalankan** (no hidden costs!)

### Keunggulan

- ✅ **Full Stack Gratis**: AI, Database, Hosting semua gratis
- ✅ **Super Cepat**: AI response < 1 detik (lebih cepat dari GPT-4)
- ✅ **Powerful AI**: Llama 3.1 70B + Gemini 1.5 Flash
- ✅ **No Credit Card**: Tidak perlu CC untuk development & MVP
- ✅ **Scalable**: Free tier cukup untuk 14,400 scans/hari

### Target User

- Crypto trader (pemula & advanced)
- DeFi users
- NFT collectors
- Investor crypto

### Blockchain yang Didukung

- Ethereum Mainnet (chainId: 1)
- Polygon (chainId: 137)
- BSC - Binance Smart Chain (chainId: 56)

### 🚀 Quick Start (Free AI Setup)

**Dapatkan API Key Gratis dalam 2 menit:**

1. **Groq** (Primary AI - Super Fast!)

   - Kunjungi: [console.groq.com](https://console.groq.com)
   - Sign up → Get API Key
   - Free: 30 req/min (14,400/hari)

2. **Google Gemini** (Backup)
   - Kunjungi: [ai.google.dev](https://ai.google.dev)
   - Get API key
   - Free: 15 req/min (1,500/hari)

**Bonus**: Kedua AI ini tidak perlu credit card! 🎉

---

## ⭐ Fitur Utama

### 1. Scan Smart Contract

| Input                     | Output                      |
| ------------------------- | --------------------------- |
| Alamat contract           | Risk score (0-100)          |
| Network (ETH/Polygon/BSC) | Status verified/unverified  |
|                           | Fungsi berbahaya terdeteksi |
|                           | Status ownership            |
|                           | Penjelasan AI               |
|                           | Rekomendasi                 |

### 2. Scan Token

| Input        | Output                      |
| ------------ | --------------------------- |
| Alamat token | Honeypot detection          |
| Network      | Buy/Sell tax                |
|              | LP locked status            |
|              | Top holders distribution    |
|              | Risk score + AI explanation |

### 3. Scan Wallet

| Input         | Output                   |
| ------------- | ------------------------ |
| Alamat wallet | Reputasi wallet          |
| Network       | Koneksi ke scam wallet   |
|               | Riwayat mencurigakan     |
|               | Risk score + AI analysis |

### 4. Cek Approval

| Input         | Output                     |
| ------------- | -------------------------- |
| Alamat wallet | List semua approvals       |
| Network       | Unlimited approval warning |
|               | Risky spender detection    |
|               | Rekomendasi revoke         |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
│                   (Tanpa Login/Akun)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Input Form  │  │ Risk Meter  │  │ AI Explanation      │  │
│  │ (Address)   │  │ (0-100)     │  │ Panel               │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND (Node.js + Express)                 │
│  ┌────────────────────────────────────────────────────┐     │
│  │              ORCHESTRATOR SERVICE                   │     │
│  │         (Koordinasi semua proses scan)             │     │
│  └────────────────────────────────────────────────────┘     │
│           │              │              │                    │
│           ▼              ▼              ▼                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  Scanner    │ │  External   │ │     AI      │            │
│  │  Services   │ │  API Client │ │   Service   │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└───────────┬─────────────┬─────────────┬─────────────────────┘
            │             │             │
            ▼             ▼             ▼
   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
   │ Blockchain  │ │  Etherscan  │ │   OpenAI    │
   │ RPC Node    │ │  GoPlus     │ │   GPT-4     │
   │ (Alchemy)   │ │  ScamDB     │ │             │
   └─────────────┘ └─────────────┘ └─────────────┘
            │             │
            ▼             ▼
   ┌─────────────────────────────┐
   │      DATABASE LAYER         │
   │  ┌─────────┐ ┌─────────┐   │
   │  │ MongoDB │ │  Redis  │   │
   │  │ (Data)  │ │ (Cache) │   │
   │  └─────────┘ └─────────┘   │
   └─────────────────────────────┘
```

### Penjelasan Komponen

| Komponen         | Teknologi         | Fungsi                             | Cost                  |
| ---------------- | ----------------- | ---------------------------------- | --------------------- |
| Frontend         | React + Vite      | UI input address & tampilkan hasil | FREE ✅               |
| Backend          | Node.js + Express | API server, koordinasi services    | FREE ✅               |
| Scanner Services | TypeScript        | Analisis contract, token, wallet   | FREE ✅               |
| Blockchain RPC   | Alchemy           | Ambil data on-chain                | FREE ✅ (300M/mo)     |
| External APIs    | Etherscan, GoPlus | Data off-chain, honeypot check     | FREE ✅               |
| AI Service       | Groq + Gemini     | Reasoning & explanation            | FREE ✅ (15.9k/day)   |
| MongoDB          | Atlas M0          | Simpan hasil scan, scam list       | FREE ✅ (512MB)       |
| Redis            | Upstash           | Cache hasil scan, rate limiting    | FREE ✅ (10k cmd/day) |
| Hosting          | Vercel + Railway  | Deploy frontend + backend          | FREE ✅               |

**TOTAL COST MVP: $0/bulan** 🎉

---

## 🛠️ Technology Stack

### Frontend

| Teknologi    | Versi  | Fungsi            |
| ------------ | ------ | ----------------- |
| React        | 18.x   | UI Framework      |
| Vite         | 5.x    | Build tool        |
| TypeScript   | 5.x    | Type safety       |
| TailwindCSS  | 3.x    | Styling           |
| Zustand      | 4.x    | State management  |
| Axios        | 1.x    | HTTP client       |
| React Router | 6.x    | Routing           |
| Recharts     | 2.x    | Visualisasi chart |
| Lucide React | latest | Icons             |

### Backend

| Teknologi  | Versi  | Fungsi                 |
| ---------- | ------ | ---------------------- |
| Node.js    | 20 LTS | Runtime                |
| Express.js | 4.x    | Web framework          |
| TypeScript | 5.x    | Type safety            |
| Ethers.js  | 6.x    | Blockchain interaction |
| Axios      | 1.x    | External API calls     |
| Mongoose   | 8.x    | MongoDB ODM            |
| ioredis    | 5.x    | Redis client           |
| Winston    | 3.x    | Logging                |
| Zod        | 3.x    | Validation             |
| Helmet     | 7.x    | Security headers       |
| CORS       | 2.x    | Cross-origin           |

### AI Engine (100% GRATIS!)

| Teknologi               | Fungsi                      | Pricing |
| ----------------------- | --------------------------- | ------- |
| **Groq** (Llama 3.1)    | Risk analysis & explanation | FREE ✅ |
| Google Gemini 1.5 Flash | Backup AI provider          | FREE ✅ |
| Ollama (Self-hosted)    | Alternative (local)         | FREE ✅ |

### Database

| Teknologi | Fungsi                |
| --------- | --------------------- |
| MongoDB   | Database utama        |
| Redis     | Cache & rate limiting |

### DevOps

| Teknologi      | Fungsi            |
| -------------- | ----------------- |
| Docker         | Containerization  |
| Docker Compose | Local development |
| GitHub Actions | CI/CD             |

---

## 📁 Struktur Folder

```
safechain-guardian/
│
├── frontend/                         # React Web App
│   ├── src/
│   │   ├── components/               # Komponen UI
│   │   │   ├── common/               # Button, Input, Modal, Card
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Loader.tsx
│   │   │   ├── scanner/              # Komponen scanner
│   │   │   │   ├── AddressInput.tsx
│   │   │   │   ├── NetworkSelector.tsx
│   │   │   │   └── ScanButton.tsx
│   │   │   ├── results/              # Komponen hasil
│   │   │   │   ├── RiskMeter.tsx
│   │   │   │   ├── RiskBreakdown.tsx
│   │   │   │   ├── IssueCard.tsx
│   │   │   │   ├── AIExplanation.tsx
│   │   │   │   └── Recommendation.tsx
│   │   │   └── layout/               # Layout
│   │   │       ├── Header.tsx
│   │   │       └── Footer.tsx
│   │   │
│   │   ├── pages/                    # Halaman
│   │   │   ├── HomePage.tsx
│   │   │   ├── ScanContractPage.tsx
│   │   │   ├── ScanTokenPage.tsx
│   │   │   ├── ScanWalletPage.tsx
│   │   │   └── ResultPage.tsx
│   │   │
│   │   ├── services/                 # API calls
│   │   │   ├── api.ts
│   │   │   └── scanner.service.ts
│   │   │
│   │   ├── store/                    # State management
│   │   │   └── scanStore.ts
│   │   │
│   │   ├── hooks/                    # Custom hooks
│   │   │   └── useScan.ts
│   │   │
│   │   ├── types/                    # TypeScript types
│   │   │   ├── scan.types.ts
│   │   │   └── risk.types.ts
│   │   │
│   │   ├── utils/                    # Utilities
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                          # Node.js API
│   ├── src/
│   │   ├── routes/                   # API routes
│   │   │   ├── index.ts
│   │   │   ├── scan.route.ts
│   │   │   └── health.route.ts
│   │   │
│   │   ├── controllers/              # Request handlers
│   │   │   └── scan.controller.ts
│   │   │
│   │   ├── services/                 # Business logic
│   │   │   ├── orchestrator.service.ts
│   │   │   ├── scanner/
│   │   │   │   ├── contract.scanner.ts
│   │   │   │   ├── token.scanner.ts
│   │   │   │   ├── wallet.scanner.ts
│   │   │   │   └── approval.scanner.ts
│   │   │   ├── blockchain.service.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── cache.service.ts
│   │   │   └── external/
│   │   │       ├── etherscan.client.ts
│   │   │       └── goplus.client.ts
│   │   │
│   │   ├── models/                   # MongoDB models
│   │   │   ├── ScanResult.model.ts
│   │   │   └── ScamAddress.model.ts
│   │   │
│   │   ├── middleware/               # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── validator.ts
│   │   │
│   │   ├── types/                    # TypeScript types
│   │   │   ├── scan.types.ts
│   │   │   ├── blockchain.types.ts
│   │   │   └── ai.types.ts
│   │   │
│   │   ├── utils/                    # Utilities
│   │   │   ├── logger.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── config/                   # Configurations
│   │   │   ├── database.config.ts
│   │   │   ├── redis.config.ts
│   │   │   └── blockchain.config.ts
│   │   │
│   │   ├── prompts/                  # AI Prompts
│   │   │   ├── system.prompt.txt
│   │   │   └── contract-analysis.prompt.txt
│   │   │
│   │   └── index.ts                  # Entry point
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
│
├── docs/
│   ├── API.md
│   └── SETUP.md
│
├── .gitignore
├── .env.example
├── LICENSE
└── README.md
```

---

## 💾 Database Design

### MongoDB Collections

#### 1. `scan_results` - Hasil Scan

```javascript
{
  _id: ObjectId,
  scanId: "scan_abc123",            // Unique ID
  type: "contract",                  // contract | token | wallet
  address: "0x1234...",
  chainId: 1,                        // 1=ETH, 137=Polygon, 56=BSC

  // Hasil
  riskScore: 78,                     // 0-100
  riskLevel: "HIGH",                 // LOW | MEDIUM | HIGH | CRITICAL

  // Detail risiko
  risks: [
    {
      code: "UNLIMITED_MINT",
      severity: "CRITICAL",
      title: "Unlimited Mint Function",
      description: "Owner dapat mint token tanpa batas"
    }
  ],

  // Data contract (jika type=contract)
  contractData: {
    verified: false,
    owner: "0xOwner...",
    isProxy: false,
    functions: ["mint", "blacklist"]
  },

  // Data token (jika type=token)
  tokenData: {
    name: "Token Name",
    symbol: "TKN",
    buyTax: 5,
    sellTax: 99,
    isHoneypot: true,
    lpLocked: false
  },

  // AI Analysis
  aiAnalysis: {
    summary: "Kontrak ini berbahaya...",
    recommendation: "AVOID",
    confidence: 0.92
  },

  // Metadata
  createdAt: ISODate,
  expiresAt: ISODate                 // Auto delete 30 hari
}
```

#### 2. `scam_addresses` - Database Scam

```javascript
{
  _id: ObjectId,
  address: "0xScam...",
  chainId: 1,
  scamType: "rugpull",               // rugpull | honeypot | phishing
  reportCount: 15,
  sources: ["cryptoscamdb", "chainabuse"],
  description: "Rugpull project XYZ",
  reportedAt: ISODate
}
```

### Redis Cache Keys

| Key Pattern                         | TTL      | Fungsi                    |
| ----------------------------------- | -------- | ------------------------- |
| `scan:contract:{chainId}:{address}` | 1 jam    | Cache hasil scan contract |
| `scan:token:{chainId}:{address}`    | 1 jam    | Cache hasil scan token    |
| `scan:wallet:{chainId}:{address}`   | 30 menit | Cache hasil scan wallet   |
| `abi:{chainId}:{address}`           | 24 jam   | Cache ABI contract        |
| `ratelimit:{ip}`                    | 1 menit  | Rate limiting             |

---

## 🔌 API Endpoints

### Base URL

```
Development: http://localhost:3001/api/v1
Production:  https://api.safechain.app/api/v1
```

### Endpoints

#### POST `/scan/contract` - Scan Smart Contract

**Request:**

```json
{
  "address": "0x1234567890abcdef...",
  "chainId": 1
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "scanId": "scan_abc123",
    "address": "0x1234...",
    "chainId": 1,
    "riskScore": 78,
    "riskLevel": "HIGH",
    "risks": [
      {
        "code": "UNVERIFIED",
        "severity": "MEDIUM",
        "title": "Contract Tidak Verified",
        "description": "Contract tidak verified di Etherscan"
      },
      {
        "code": "UNLIMITED_MINT",
        "severity": "CRITICAL",
        "title": "Unlimited Mint",
        "description": "Owner dapat mint token tanpa batas"
      }
    ],
    "contractInfo": {
      "verified": false,
      "owner": "0xOwner...",
      "isProxy": false,
      "functions": ["mint", "pause", "blacklist"]
    },
    "aiAnalysis": {
      "summary": "Kontrak ini memiliki risiko tinggi...",
      "recommendation": "AVOID",
      "confidence": 0.89
    }
  }
}
```

#### POST `/scan/token` - Scan Token

**Request:**

```json
{
  "address": "0xTokenAddress...",
  "chainId": 1
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "scanId": "scan_def456",
    "riskScore": 92,
    "riskLevel": "CRITICAL",
    "tokenInfo": {
      "name": "Suspicious Token",
      "symbol": "SUS",
      "totalSupply": "1000000000",
      "buyTax": 5,
      "sellTax": 99,
      "isHoneypot": true,
      "lpLocked": false
    },
    "risks": [...],
    "aiAnalysis": {...}
  }
}
```

#### POST `/scan/wallet` - Scan Wallet

**Request:**

```json
{
  "address": "0xWalletAddress...",
  "chainId": 1
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "scanId": "scan_ghi789",
    "riskScore": 45,
    "riskLevel": "MEDIUM",
    "walletInfo": {
      "balance": "2.5 ETH",
      "txCount": 156,
      "firstTx": "2022-03-15",
      "lastTx": "2024-12-28"
    },
    "reputation": {
      "isScamReported": false,
      "connectedToScam": true,
      "scamConnections": 2
    },
    "aiAnalysis": {...}
  }
}
```

#### POST `/scan/approval` - Scan Approval

**Request:**

```json
{
  "walletAddress": "0xWallet...",
  "chainId": 1
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "approvals": [
      {
        "token": { "name": "USDC", "address": "0x..." },
        "spender": { "name": "Uniswap V3", "address": "0x..." },
        "allowance": "unlimited",
        "riskLevel": "LOW"
      }
    ],
    "riskyApprovals": 2,
    "recommendation": "Revoke 2 approval berbahaya"
  }
}
```

#### GET `/health` - Health Check

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-12-29T10:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "blockchain": "connected"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ADDRESS",
    "message": "Format alamat tidak valid"
  }
}
```

### Rate Limiting

| Endpoint  | Limit      | Window    |
| --------- | ---------- | --------- |
| `/scan/*` | 10 request | per menit |
| `/health` | 60 request | per menit |

---

## 🔍 Parameter Deteksi Risiko

### Smart Contract Risks

| Parameter                  | Severity | Score | Cara Deteksi     |
| -------------------------- | -------- | ----- | ---------------- |
| Contract tidak verified    | MEDIUM   | +15   | Etherscan API    |
| Proxy contract             | MEDIUM   | +10   | Bytecode pattern |
| Hidden proxy (upgradeable) | HIGH     | +20   | EIP-1967 check   |
| Owner tidak renounced      | MEDIUM   | +12   | `owner()` call   |
| Fungsi `mint()` unlimited  | CRITICAL | +25   | ABI analysis     |
| Fungsi `setFee()`          | HIGH     | +20   | ABI analysis     |
| Fungsi `blacklist()`       | HIGH     | +20   | ABI analysis     |
| Fungsi `pause()`           | MEDIUM   | +15   | ABI analysis     |
| Transfer override          | CRITICAL | +30   | Bytecode pattern |

### Token Risks

| Parameter               | Severity | Score | Cara Deteksi    |
| ----------------------- | -------- | ----- | --------------- |
| Honeypot                | CRITICAL | +40   | GoPlus API      |
| Sell tax > 20%          | HIGH     | +25   | DEX simulation  |
| Buy tax > 10%           | MEDIUM   | +15   | DEX simulation  |
| LP tidak locked         | HIGH     | +20   | LP analysis     |
| Top holder > 50% supply | HIGH     | +20   | Holder analysis |

### Wallet Risks

| Parameter              | Severity | Score | Cara Deteksi       |
| ---------------------- | -------- | ----- | ------------------ |
| Ada di scam database   | CRITICAL | +40   | ScamDB lookup      |
| Wallet usia < 7 hari   | LOW      | +5    | First TX timestamp |
| Koneksi ke scam wallet | HIGH     | +25   | TX graph           |
| Pola mixer/tornado     | HIGH     | +20   | Pattern analysis   |

### Risk Level

| Score  | Level    | Warna     | Aksi            |
| ------ | -------- | --------- | --------------- |
| 0-25   | LOW      | 🟢 Hijau  | Aman            |
| 26-50  | MEDIUM   | 🟡 Kuning | Hati-hati       |
| 51-75  | HIGH     | 🟠 Orange | Risiko tinggi   |
| 76-100 | CRITICAL | 🔴 Merah  | Bahaya, hindari |

---

## 🔄 Alur Sistem

### Flow Scan Contract

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER INPUT                                               │
│    - Buka web app                                           │
│    - Pilih network (ETH/Polygon/BSC)                        │
│    - Paste alamat contract                                  │
│    - Klik "SCAN"                                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FRONTEND                                                 │
│    - Validasi format address                                │
│    - Kirim POST /api/v1/scan/contract                       │
│    - Tampilkan loading state                                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. BACKEND: CEK CACHE                                       │
│    - Cek Redis: scan:contract:{chainId}:{address}           │
│    - Jika ADA & belum expired → return cached result        │
│    - Jika TIDAK ADA → lanjut ke step 4                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. BACKEND: AMBIL DATA ON-CHAIN                             │
│    Via Ethers.js + Alchemy RPC:                             │
│    - eth_getCode() → bytecode contract                      │
│    - eth_call() → panggil fungsi owner(), name(), dll       │
│    - Check apakah contract atau EOA                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. BACKEND: AMBIL DATA OFF-CHAIN (Parallel)                 │
│    ┌─────────────────┐  ┌─────────────────┐                 │
│    │ Etherscan API   │  │ GoPlus API      │                 │
│    │ - Verified?     │  │ - Honeypot?     │                 │
│    │ - ABI           │  │ - Buy/Sell tax  │                 │
│    │ - Source code   │  │ - LP info       │                 │
│    └─────────────────┘  └─────────────────┘                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. BACKEND: RULE-BASED ANALYSIS                             │
│    - Parse ABI, deteksi fungsi berbahaya                    │
│    - Check ownership status                                 │
│    - Check proxy pattern                                    │
│    - Hitung base risk score dari semua faktor               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. BACKEND: KIRIM KE AI ENGINE                              │
│    Kirim data ke OpenAI GPT-4:                              │
│    {                                                        │
│      contractData: {...},                                   │
│      detectedRisks: [...],                                  │
│      baseRiskScore: 65                                      │
│    }                                                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. AI ENGINE: REASONING                                     │
│    AI melakukan:                                            │
│    - Analisis kombinasi risiko                              │
│    - Pattern matching dengan scam historis                  │
│    - Generate explanation bahasa manusia                    │
│    - Buat rekomendasi (SAFE/CAUTION/AVOID/BLOCK)           │
│                                                             │
│    Output:                                                  │
│    {                                                        │
│      finalScore: 78,                                        │
│      summary: "Kontrak ini berbahaya karena...",            │
│      recommendation: "AVOID"                                │
│    }                                                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. BACKEND: SIMPAN & CACHE                                  │
│    - Simpan hasil ke MongoDB                                │
│    - Simpan ke Redis cache (TTL: 1 jam)                     │
│    - Return response ke frontend                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. FRONTEND: TAMPILKAN HASIL                               │
│    ┌───────────────────────────────────────────────────┐    │
│    │         ⚠️ HIGH RISK DETECTED                     │    │
│    │                                                   │    │
│    │    Risk Score: 78/100  [████████░░]              │    │
│    │                                                   │    │
│    │    🔴 Contract tidak verified                     │    │
│    │    🔴 Owner dapat mint unlimited                  │    │
│    │    🟠 Fungsi blacklist ditemukan                  │    │
│    │                                                   │    │
│    │    🤖 AI Analysis:                                │    │
│    │    "Kontrak ini memiliki kontrol penuh oleh      │    │
│    │     owner dengan kemampuan mint tanpa batas.      │    │
│    │     Pola ini sering ditemukan pada rugpull."     │    │
│    │                                                   │    │
│    │    📌 Rekomendasi: HINDARI CONTRACT INI           │    │
│    └───────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Engine

### Peran AI dalam Sistem

| ❌ AI TIDAK              | ✅ AI MELAKUKAN              |
| ------------------------ | ---------------------------- |
| Fetch data blockchain    | Analisis kombinasi risiko    |
| Hitung risk score awal   | Reasoning & pattern matching |
| Deteksi fungsi berbahaya | Generate explanation         |
|                          | Buat rekomendasi akhir       |

**Intinya**: AI = Otak penalaran, BUKAN pengambil data

### AI Flow

```
Data dari Scanner Services
        │
        ▼
┌─────────────────────────────┐
│  BUILD PROMPT               │
│  - System prompt            │
│  - Contract data            │
│  - Detected risks           │
│  - Base risk score          │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  CALL GROQ API (FREE!)      │
│  - Model: llama-3.1-70b     │
│  - Format: JSON             │
│  - Temperature: 0.3         │
│  - Speed: Super fast!       │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  PARSE RESPONSE             │
│  - Final risk score         │
│  - Summary                  │
│  - Recommendation           │
│  - Confidence score         │
└─────────────────────────────┘
```

### AI Input Format

```json
{
  "scanType": "contract",
  "address": "0x1234...",
  "chainId": 1,
  "contractData": {
    "verified": false,
    "owner": "0xOwner...",
    "isProxy": false,
    "functions": ["mint", "blacklist", "pause"]
  },
  "detectedRisks": [
    { "code": "UNVERIFIED", "severity": "MEDIUM" },
    { "code": "UNLIMITED_MINT", "severity": "CRITICAL" }
  ],
  "baseRiskScore": 65,
  "externalData": {
    "isHoneypot": false,
    "goplusRisk": "high"
  }
}
```

### AI Output Format

```json
{
  "finalRiskScore": 78,
  "riskLevel": "HIGH",
  "summary": "Kontrak ini memiliki beberapa red flag. Owner masih memiliki kontrol penuh dengan kemampuan mint tanpa batas.",
  "topRisks": [
    "Owner dapat mint token unlimited",
    "Contract tidak verified",
    "Fungsi blacklist dapat blokir wallet"
  ],
  "reasoning": "Kombinasi unlimited mint + owner control + blacklist adalah pola umum rugpull.",
  "recommendation": "AVOID",
  "confidence": 0.89
}
```

### System Prompt

```
Lokasi: backend/src/prompts/system.prompt.txt

You are SafeChain Guardian AI, a Web3 security analyst.

Your role:
1. Analyze smart contract data
2. Identify potential risks
3. Provide clear explanations
4. Give actionable recommendations

Guidelines:
- Be direct and concise
- Focus on top 3 critical risks
- Use severity: LOW, MEDIUM, HIGH, CRITICAL
- Always give recommendation: SAFE, CAUTION, AVOID, BLOCK
- Explain in simple language
- If uncertain, err on caution

Output: Valid JSON only
```

### Error Handling AI

```
Jika Groq API gagal:
  → Fallback ke Google Gemini (juga gratis!)
  → Jika Gemini gagal → gunakan rule-based result saja
  → Tampilkan: "AI analysis unavailable"
  → Log error untuk monitoring
```

### Setup AI Gratis (Step by Step)

#### Option 1: Groq (Recommended - Paling Cepat!)

1. **Daftar Gratis**

   - Buka [console.groq.com](https://console.groq.com)
   - Sign up dengan Google/GitHub
   - Verifikasi email

2. **Dapatkan API Key**

   - Dashboard → API Keys → Create API Key
   - Copy key (mulai dengan `gsk_...`)
   - Paste di `.env` file

3. **Free Tier Limits**
   - ✅ 30 requests/minute
   - ✅ 14,400 requests/hari
   - ✅ Llama 3.1 70B (sangat powerful!)
   - ✅ Super fast response (< 1 detik)

#### Option 2: Google Gemini (Backup)

1. **Daftar Gratis**

   - Buka [ai.google.dev](https://ai.google.dev)
   - Sign in dengan Google Account
   - Setuju terms

2. **Dapatkan API Key**

   - Get API Key → Create API key
   - Copy key
   - Paste di `.env` file

3. **Free Tier Limits**
   - ✅ 15 requests/minute
   - ✅ 1,500 requests/hari
   - ✅ Gemini 1.5 Flash (bagus & cepat)

#### Option 3: Ollama (Self-Hosted - No Internet!)

1. **Install Ollama**

   ```bash
   # Windows (PowerShell)
   winget install Ollama.Ollama

   # Atau download dari ollama.com
   ```

2. **Pull Model**

   ```bash
   ollama pull llama3.1:8b
   ```

3. **Run Server**

   ```bash
   ollama serve
   # Server runs on http://localhost:11434
   ```

4. **No API Key Needed!**
   - 100% gratis
   - 100% private
   - No rate limits
   - Butuh GPU/RAM bagus (8GB+ recommended)

#### Implementasi di Code

```typescript
// backend/src/services/ai.service.ts
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

class AIService {
  private groq: Groq;
  private gemini: GoogleGenerativeAI;
  private provider: string;

  constructor() {
    this.provider = process.env.AI_PROVIDER || "groq";

    // Initialize Groq (primary)
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Initialize Gemini (backup)
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  async analyze(data: ScanData): Promise<AIAnalysis> {
    try {
      if (this.provider === "groq") {
        return await this.analyzeWithGroq(data);
      } else if (this.provider === "gemini") {
        return await this.analyzeWithGemini(data);
      }
    } catch (error) {
      logger.warn("Primary AI failed, trying backup...");

      // Fallback strategy
      if (this.provider === "groq") {
        return await this.analyzeWithGemini(data);
      } else {
        return await this.analyzeWithGroq(data);
      }
    }
  }

  private async analyzeWithGroq(data: ScanData): Promise<AIAnalysis> {
    const completion = await this.groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(data) },
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  private async analyzeWithGemini(data: ScanData): Promise<AIAnalysis> {
    const model = this.gemini.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      JSON.stringify(data),
    ]);

    return JSON.parse(result.response.text());
  }
}
```

#### Install Dependencies

```bash
# Backend
npm install groq-sdk @google/generative-ai
```

```json
// package.json
{
  "dependencies": {
    "groq-sdk": "^0.3.0",
    "@google/generative-ai": "^0.1.3"
  }
}
```

---

## 🔗 External APIs

### 💰 Cost Summary: SEMUA GRATIS!

| Category       | Service       | Free Tier   | Cost    | Cukup?     |
| -------------- | ------------- | ----------- | ------- | ---------- |
| **AI**         | Groq          | 30 req/min  | FREE ✅ | 14,400/day |
| **AI Backup**  | Gemini        | 15 req/min  | FREE ✅ | 1,500/day  |
| **Blockchain** | Alchemy       | 300M req/mo | FREE ✅ | 10M/day    |
| **Explorer**   | Etherscan     | 5 req/sec   | FREE ✅ | 18k/hour   |
| **Security**   | GoPlus        | Generous    | FREE ✅ | Yes        |
| **Database**   | MongoDB       | 512 MB      | FREE ✅ | 50k scans  |
| **Cache**      | Upstash Redis | 10k cmd/day | FREE ✅ | Yes        |
| **Hosting FE** | Vercel        | 100GB/mo    | FREE ✅ | 100k users |
| **Hosting BE** | Railway       | $5 credit   | FREE ✅ | MVP OK     |

**TOTAL MVP COST: $0/bulan** 🎉

### Wajib (Critical)

| Service       | Fungsi                     | Signup                                         | Pricing                       |
| ------------- | -------------------------- | ---------------------------------------------- | ----------------------------- |
| **Alchemy**   | RPC blockchain             | [alchemy.com](https://alchemy.com)             | Free tier 300M req/bulan      |
| **Etherscan** | Contract verification, ABI | [etherscan.io/apis](https://etherscan.io/apis) | Free 5 req/detik              |
| **Groq**      | AI analysis (GRATIS!)      | [console.groq.com](https://console.groq.com)   | FREE 30 req/min (14,400/hari) |

### Recommended

| Service            | Fungsi                | Signup                                     | Pricing               |
| ------------------ | --------------------- | ------------------------------------------ | --------------------- |
| **Google Gemini**  | Backup AI (GRATIS!)   | [ai.google.dev](https://ai.google.dev)     | FREE 15 req/min       |
| **GoPlus**         | Honeypot detection    | [gopluslabs.io](https://gopluslabs.io)     | Free tier             |
| **Polygonscan**    | Polygon contract data | [polygonscan.com](https://polygonscan.com) | Free                  |
| **BscScan**        | BSC contract data     | [bscscan.com](https://bscscan.com)         | Free                  |
| **Ollama** (Local) | Self-hosted AI        | [ollama.com](https://ollama.com)           | FREE (run on your PC) |

### Optional

| Service      | Fungsi                  |
| ------------ | ----------------------- |
| CryptoScamDB | Known scam addresses    |
| Chainabuse   | Reported scam addresses |
| 1inch API    | DEX price & liquidity   |

---

## 🚀 Instalasi & Setup

### Prerequisites

- Node.js 20 LTS
- MongoDB (local atau Atlas)
- Redis (local atau cloud)
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/username/safechain-guardian.git
cd safechain-guardian
```

### Step 2: Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### Step 3: Setup Environment Variables

```bash
# Copy env template
cp backend/.env.example backend/.env

# Edit dengan API keys
nano backend/.env
```

### Step 4: Start Database

```bash
# Option A: Docker
docker-compose -f docker/docker-compose.yml up -d mongo redis

# Option B: Local MongoDB & Redis
mongod --dbpath /data/db
redis-server
```

### Step 5: Run Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 6: Akses Aplikasi

```
Frontend: http://localhost:5173
Backend:  http://localhost:3001
API Docs: http://localhost:3001/api-docs
```

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Server
NODE_ENV=development
PORT=3001

# Database (100% FREE OPTIONS!)
# Option 1: Local (development)
MONGODB_URI=mongodb://localhost:27017/safechain
REDIS_URL=redis://localhost:6379

# Option 2: Cloud FREE (production recommended)
# MongoDB Atlas M0 (512MB free) - https://cloud.mongodb.com
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/safechain

# Redis Cloud Options (pilih salah satu):
# A. Upstash (RECOMMENDED - 10k commands/day) - https://upstash.com
REDIS_URL=rediss://default:<password>@<endpoint>.upstash.io:6379

# B. Redis Cloud (30MB, 30 ops/sec) - https://redis.com/cloud
# REDIS_URL=redis://default:<password>@<endpoint>.redislabs.com:12345

# C. Railway Redis (100MB free) - auto-provided by Railway
# REDIS_URL=redis://default:<password>@<endpoint>.railway.app:6379

# Blockchain RPC (Alchemy - 300M requests/month FREE!)
ALCHEMY_API_KEY=your_alchemy_api_key
ALCHEMY_ETH_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
ALCHEMY_POLYGON_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
ALCHEMY_BSC_URL=https://bsc-mainnet.g.alchemy.com/v2/YOUR_KEY

# Block Explorer APIs (ALL FREE!)
ETHERSCAN_API_KEY=your_etherscan_key
POLYGONSCAN_API_KEY=your_polygonscan_key
BSCSCAN_API_KEY=your_bscscan_key

# Security APIs
GOPLUS_API_KEY=your_goplus_key

# AI (GRATIS! 🎉)
AI_PROVIDER=groq                    # groq | gemini | ollama
GROQ_API_KEY=your_groq_key          # Get from console.groq.com (FREE!)
GROQ_MODEL=llama-3.1-70b-versatile  # Fast & smart
GEMINI_API_KEY=your_gemini_key      # Backup (also FREE!)
GEMINI_MODEL=gemini-1.5-flash       # Google's free model

# Security
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=10

# Cache TTL (seconds)
CACHE_CONTRACT_TTL=3600
CACHE_TOKEN_TTL=3600
CACHE_WALLET_TTL=1800
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:3001/api/v1
VITE_APP_NAME=SafeChain Guardian
```

---

## 💻 Development Guidelines

### Prinsip Modular Architecture

#### 1. **Separation of Concerns**

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER SEPARATION                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Presentation Layer (Frontend)                              │
│  ├─ Components (UI only)                                    │
│  ├─ Pages (routing & layout)                                │
│  └─ Services (API calls)                                    │
│                                                             │
│  Business Logic Layer (Backend)                             │
│  ├─ Controllers (request/response)                          │
│  ├─ Services (business logic)                               │
│  └─ Models (data structure)                                 │
│                                                             │
│  Data Access Layer                                          │
│  ├─ Database (MongoDB)                                      │
│  ├─ Cache (Redis)                                           │
│  └─ External APIs                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 2. **Single Responsibility Principle**

Setiap file/function punya 1 tanggung jawab:

```typescript
// ❌ BAD: Satu file terlalu banyak tanggung jawab
class ScanService {
  scanContract() {
    /* scan logic */
  }
  callBlockchain() {
    /* blockchain logic */
  }
  parseABI() {
    /* parsing logic */
  }
  callAI() {
    /* AI logic */
  }
  saveToDatabase() {
    /* database logic */
  }
}

// ✅ GOOD: Pisah per tanggung jawab
class ContractScanner {
  scan() {
    /* orchestrate */
  }
}

class BlockchainService {
  fetchData() {
    /* blockchain only */
  }
}

class ABIParser {
  parse() {
    /* parsing only */
  }
}

class AIService {
  analyze() {
    /* AI only */
  }
}

class ScanRepository {
  save() {
    /* database only */
  }
}
```

#### 3. **Dependency Injection**

```typescript
// ✅ GOOD: Easy to test & swap implementation
class OrchestratorService {
  constructor(
    private blockchainService: BlockchainService,
    private aiService: AIService,
    private cacheService: CacheService
  ) {}

  async scan(address: string) {
    const data = await this.blockchainService.getData(address);
    const analysis = await this.aiService.analyze(data);
    await this.cacheService.set(address, analysis);
    return analysis;
  }
}
```

#### 4. **Interface Segregation**

```typescript
// Define interfaces untuk setiap service
interface IScanner {
  scan(address: string, chainId: number): Promise<ScanResult>;
}

interface IBlockchainProvider {
  getCode(address: string): Promise<string>;
  call(address: string, method: string): Promise<any>;
}

interface IAIAnalyzer {
  analyze(data: ScanData): Promise<AIAnalysis>;
}

interface ICacheProvider {
  get(key: string): Promise<any | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
}
```

### Code Organization Best Practices

#### Backend Module Structure

```typescript
// backend/src/services/scanner/contract.scanner.ts
export class ContractScanner implements IScanner {
  constructor(
    private blockchain: IBlockchainProvider,
    private etherscan: IEtherscanClient,
    private goplus: IGoPlusClient,
    private parser: IABIParser,
    private calculator: IRiskCalculator
  ) {}

  async scan(address: string, chainId: number): Promise<ScanResult> {
    // Step 1: Fetch data (parallel)
    const [bytecode, contractInfo, securityInfo] = await Promise.all([
      this.blockchain.getCode(address),
      this.etherscan.getContractInfo(address),
      this.goplus.checkSecurity(address),
    ]);

    // Step 2: Parse & analyze
    const functions = this.parser.extractFunctions(contractInfo.abi);
    const risks = this.detectRisks(functions, securityInfo);

    // Step 3: Calculate score
    const riskScore = this.calculator.calculate(risks);

    return {
      address,
      chainId,
      riskScore,
      risks,
      contractInfo,
    };
  }

  private detectRisks(functions: Function[], security: SecurityInfo): Risk[] {
    // Risk detection logic
  }
}
```

#### Frontend Module Structure

```typescript
// frontend/src/services/scanner.service.ts
export class ScannerService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 30000,
    });
  }

  async scanContract(address: string, chainId: number): Promise<ScanResult> {
    const { data } = await this.api.post("/scan/contract", {
      address,
      chainId,
    });
    return data.data;
  }
}

// frontend/src/hooks/useScan.ts
export function useScan() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const scan = useCallback(async (address: string, chainId: number) => {
    setLoading(true);
    setError(null);

    try {
      const scanService = new ScannerService();
      const result = await scanService.scanContract(address, chainId);
      setResult(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { scan, loading, result, error };
}
```

### Naming Conventions

| Type       | Convention            | Example               |
| ---------- | --------------------- | --------------------- |
| Files      | kebab-case            | `contract-scanner.ts` |
| Classes    | PascalCase            | `ContractScanner`     |
| Interfaces | PascalCase + I prefix | `IBlockchainProvider` |
| Functions  | camelCase             | `scanContract()`      |
| Constants  | UPPER_SNAKE_CASE      | `MAX_RETRIES`         |
| Types      | PascalCase            | `ScanResult`          |
| Enums      | PascalCase            | `RiskLevel`           |

### File Size Guidelines

- Max 300 lines per file
- Max 50 lines per function
- Jika lebih → split into multiple files

---

## 🧪 Testing Strategy

### Test Pyramid

```
        /\
       /  \       E2E Tests (5%)
      /────\      Integration Tests (15%)
     /──────\     Unit Tests (80%)
    /────────\
```

### 1. Unit Tests

**Target**: 80% coverage minimum

```typescript
// backend/src/services/scanner/__tests__/contract.scanner.test.ts
import { ContractScanner } from "../contract.scanner";
import { MockBlockchainProvider } from "../../__mocks__/blockchain.provider";

describe("ContractScanner", () => {
  let scanner: ContractScanner;
  let mockBlockchain: MockBlockchainProvider;

  beforeEach(() => {
    mockBlockchain = new MockBlockchainProvider();
    scanner = new ContractScanner(mockBlockchain);
  });

  describe("scan()", () => {
    it("should return HIGH risk for unverified contract with mint function", async () => {
      // Arrange
      mockBlockchain.mockGetCode("0x...", "0x606060...");
      mockBlockchain.mockGetOwner("0x...", "0xOwner...");

      // Act
      const result = await scanner.scan("0x...", 1);

      // Assert
      expect(result.riskLevel).toBe("HIGH");
      expect(result.risks).toContainEqual(
        expect.objectContaining({
          code: "UNLIMITED_MINT",
          severity: "CRITICAL",
        })
      );
    });

    it("should cache result after first scan", async () => {
      // Test caching logic
    });

    it("should handle blockchain RPC failure gracefully", async () => {
      // Test error handling
      mockBlockchain.mockError(new Error("RPC timeout"));

      await expect(scanner.scan("0x...", 1)).rejects.toThrow(
        "Failed to fetch contract data"
      );
    });
  });
});
```

### 2. Integration Tests

```typescript
// backend/src/__tests__/integration/scan-flow.test.ts
import request from 'supertest';
import { app } from '../../index';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/db';

describe('POST /api/v1/scan/contract', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('should scan contract and return risk analysis', async () => {
    const response = await request(app)
      .post('/api/v1/scan/contract')
      .send({
        address: '0x1234567890abcdef1234567890abcdef12345678',
        chainId: 1
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('riskScore');
    expect(response.body.data).toHaveProperty('aiAnalysis');
  });

  it('should return 400 for invalid address', async () => {
    await request(app)
      .post('/api/v1/scan/contract')
      .send({ address: 'invalid', chainId: 1 })
      .expect(400);
  });

  it('should rate limit after 10 requests', async () => {
    // Make 10 requests
    for (let i = 0; i < 10; i++) {
      await request(app).post('/api/v1/scan/contract').send({...});
    }

    // 11th request should be rate limited
    await request(app)
      .post('/api/v1/scan/contract')
      .send({...})
      .expect(429);
  });
});
```

### 3. Frontend Tests

```typescript
// frontend/src/components/results/__tests__/RiskMeter.test.tsx
import { render, screen } from "@testing-library/react";
import { RiskMeter } from "../RiskMeter";

describe("RiskMeter", () => {
  it("should display green color for LOW risk", () => {
    render(<RiskMeter score={20} level="LOW" />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveClass("risk-meter--low");
  });

  it("should display red color for CRITICAL risk", () => {
    render(<RiskMeter score={85} level="CRITICAL" />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveClass("risk-meter--critical");
  });
});
```

### Test Commands

```bash
# Backend tests
cd backend
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only

# Frontend tests
cd frontend
npm run test
npm run test:ui           # With Vitest UI
npm run test:coverage
```

---

## ⚠️ Error Handling

### Error Hierarchy

```typescript
// backend/src/utils/errors.ts

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_ERROR",
    public isOperational: boolean = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class BlockchainError extends AppError {
  constructor(message: string) {
    super(message, 503, "BLOCKCHAIN_ERROR");
  }
}

export class AIServiceError extends AppError {
  constructor(message: string) {
    super(message, 503, "AI_SERVICE_ERROR");
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
  }
}
```

### Global Error Handler

```typescript
// backend/src/middleware/errorHandler.ts

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  logger.error("Error occurred:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle operational errors
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Handle non-operational errors
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
    },
  });
}
```

### Try-Catch Pattern

```typescript
// ✅ GOOD: Proper error handling
async function scanContract(address: string) {
  try {
    const result = await contractScanner.scan(address);
    return result;
  } catch (error) {
    if (error instanceof BlockchainError) {
      logger.warn("Blockchain unavailable, using cache");
      return await cache.get(address);
    }

    if (error instanceof AIServiceError) {
      logger.warn("AI unavailable, using rule-based only");
      return await ruleBasedAnalysis(address);
    }

    // Re-throw unknown errors
    throw error;
  }
}
```

### Retry Logic

```typescript
// backend/src/utils/retry.ts

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Attempt ${i + 1} failed, retrying...`);
      await sleep(delayMs * Math.pow(2, i)); // Exponential backoff
    }
  }

  throw lastError!;
}

// Usage
const data = await withRetry(() => blockchain.getCode(address));
```

---

## 📊 Performance & Monitoring

### Performance Optimization

#### 1. Caching Strategy

```typescript
// Multi-level caching
class CacheService {
  private memoryCache: Map<string, any> = new Map();
  private redis: Redis;

  async get(key: string): Promise<any | null> {
    // L1: Memory cache (fastest)
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }

    // L2: Redis cache
    const cached = await this.redis.get(key);
    if (cached) {
      this.memoryCache.set(key, cached); // Populate L1
      return cached;
    }

    return null;
  }
}
```

#### 2. Parallel Processing

```typescript
// ✅ GOOD: Parallel requests
async function fetchAllData(address: string) {
  const [onChain, offChain, security] = await Promise.all([
    blockchain.getCode(address),
    etherscan.getInfo(address),
    goplus.checkSecurity(address),
  ]);

  return { onChain, offChain, security };
}

// ❌ BAD: Sequential requests
async function fetchAllDataBad(address: string) {
  const onChain = await blockchain.getCode(address); // Wait 1s
  const offChain = await etherscan.getInfo(address); // Wait 1s
  const security = await goplus.checkSecurity(address); // Wait 1s
  // Total: 3s
}
```

#### 3. Database Indexing

```javascript
// MongoDB indexes
db.scan_results.createIndex({ address: 1, chainId: 1 }, { unique: true });
db.scan_results.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days
db.scam_addresses.createIndex({ address: 1 }, { unique: true });
```

### Monitoring & Logging

#### Logging Levels

```typescript
// backend/src/utils/logger.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Usage
logger.info("Contract scanned", { address, riskScore });
logger.warn("AI service slow", { responseTime: 5000 });
logger.error("Blockchain RPC failed", { error: err.message });
```

#### Metrics to Track

```typescript
// Key metrics
interface Metrics {
  // Performance
  scanDuration: number; // ms
  blockchainLatency: number; // ms
  aiLatency: number; // ms
  cacheHitRate: number; // percentage

  // Business
  totalScans: number;
  scansPerHour: number;
  highRiskDetected: number;

  // Errors
  errorRate: number; // percentage
  timeouts: number;
  rateLimitHits: number;
}
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. RPC Rate Limiting

**Problem**: `429 Too Many Requests` dari Alchemy

**Solution**:

```typescript
// Implement request queuing
class BlockchainService {
  private queue: PQueue;

  constructor() {
    this.queue = new PQueue({
      concurrency: 5, // Max 5 concurrent requests
      interval: 1000, // Per second
      intervalCap: 10, // Max 10 per second
    });
  }

  async getCode(address: string) {
    return this.queue.add(() => this.provider.getCode(address));
  }
}
```

#### 2. MongoDB Connection Lost

**Problem**: `MongoNetworkError: connection closed`

**Solution**:

```typescript
// Auto-reconnect
const mongoose = require("mongoose");

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

mongoose.connection.on("disconnected", () => {
  logger.error("MongoDB disconnected, attempting reconnect...");
});

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB reconnected");
});
```

#### 3. OpenAI Timeout

**Problem**: AI analysis takes >10 seconds

**Solution**:

```typescript
// Set timeout & fallback
async function getAIAnalysis(data: ScanData) {
  try {
    const analysis = await Promise.race([
      aiService.analyze(data),
      timeout(8000), // 8 second timeout
    ]);
    return analysis;
  } catch (error) {
    logger.warn("AI timeout, using rule-based");
    return generateRuleBasedAnalysis(data);
  }
}
```

#### 4. Memory Leak

**Problem**: Node.js memory usage terus naik

**Solution**:

```typescript
// Cleanup event listeners
class ScanService {
  private emitter: EventEmitter;

  async scan(address: string) {
    const listener = (data) => {
      /* handle */
    };
    this.emitter.on("data", listener);

    try {
      // Do scan
    } finally {
      // Always cleanup!
      this.emitter.off("data", listener);
    }
  }
}

// Limit cache size
class MemoryCache {
  private cache: Map<string, any>;
  private maxSize: number = 1000;

  set(key: string, value: any) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

### Debug Checklist

```bash
# 1. Check logs
tail -f backend/logs/error.log

# 2. Check database connection
mongo --eval "db.adminCommand('ping')"

# 3. Check Redis
redis-cli ping

# 4. Check API keys
env | grep API_KEY

# 5. Test blockchain connection
curl https://eth-mainnet.g.alchemy.com/v2/$ALCHEMY_KEY \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# 6. Check OpenAI API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_KEY"
```

---

## 🔒 Security Best Practices

### API Security

#### 1. Input Validation

```typescript
// ✅ ALWAYS validate & sanitize input
import { z } from "zod";

const ScanRequestSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  chainId: z
    .number()
    .int()
    .refine((val) => [1, 56, 137].includes(val), "Unsupported chain"),
});

app.post("/scan/contract", async (req, res) => {
  try {
    const validated = ScanRequestSchema.parse(req.body);
    // Continue with validated data
  } catch (error) {
    return res.status(400).json({ error: "Invalid input" });
  }
});
```

#### 2. Rate Limiting (Critical!)

```typescript
import rateLimit from "express-rate-limit";

// Per-IP rate limiting
const scanLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 requests per minute
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many scan requests, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/v1/scan", scanLimiter);
```

#### 3. API Key Protection

```bash
# ❌ NEVER commit API keys
# ❌ NEVER hardcode API keys
# ✅ ALWAYS use environment variables

# .gitignore
.env
.env.local
.env.production
*.key

# Use secrets management untuk production
```

```typescript
// ✅ Validate API keys on startup
function validateEnv() {
  const required = ["ALCHEMY_API_KEY", "ETHERSCAN_API_KEY", "OPENAI_API_KEY"];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env: ${key}`);
    }
  }
}

validateEnv();
```

#### 4. Prevent SQL/NoSQL Injection

```typescript
// ✅ GOOD: Use parameterized queries
await ScanResult.findOne({
  address: address.toLowerCase(),
  chainId: chainId,
});

// ❌ BAD: String concatenation
await ScanResult.findOne({
  $where: `this.address == '${address}'`, // VULNERABLE!
});
```

#### 5. CORS Configuration

```typescript
import cors from "cors";

// ✅ GOOD: Whitelist specific origins
const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = [
      "http://localhost:5173",
      "https://yourapp.com",
      "https://www.yourapp.com",
    ];

    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ❌ BAD: Allow all origins in production
app.use(cors({ origin: "*" })); // ONLY for development!
```

#### 6. Security Headers

```typescript
import helmet from "helmet";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);
```

### Blockchain Security

#### 1. Address Validation

```typescript
import { isAddress, getAddress } from "ethers";

function validateAddress(address: string): string {
  if (!isAddress(address)) {
    throw new ValidationError("Invalid Ethereum address");
  }

  // Return checksummed address
  return getAddress(address);
}
```

#### 2. Chain ID Verification

```typescript
// ✅ ALWAYS verify chain matches request
async function verifyChain(address: string, chainId: number) {
  const provider = getProvider(chainId);
  const code = await provider.getCode(address);

  if (code === "0x") {
    // Check if it's EOA vs non-existent on this chain
    const balance = await provider.getBalance(address);
    if (balance === 0n) {
      throw new Error("Address not found on this chain");
    }
  }
}
```

#### 3. RPC Provider Timeout

```typescript
// ✅ Set timeout to prevent hanging
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_ETH_URL, {
  staticNetwork: true,
  polling: false,
});

// Wrap calls with timeout
async function getCodeWithTimeout(address: string) {
  return Promise.race([
    provider.getCode(address),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("RPC timeout")), 5000)
    ),
  ]);
}
```

### AI Security

#### 1. Prompt Injection Prevention

```typescript
// ✅ GOOD: Sanitize input before sending to AI
function sanitizeForAI(data: any): any {
  // Remove potential prompt injection
  const sanitized = JSON.stringify(data)
    .replace(/[\r\n]/g, " ") // Remove newlines
    .replace(/["'`]/g, "") // Remove quotes
    .replace(/\{\{.*?\}\}/g, "") // Remove template strings
    .slice(0, 4000); // Limit length

  return JSON.parse(sanitized);
}

const prompt = `
Analyze this contract data:
${JSON.stringify(sanitizeForAI(contractData))}
`;
```

#### 2. AI Response Validation

```typescript
// ✅ ALWAYS validate AI output
const AIResponseSchema = z.object({
  finalRiskScore: z.number().min(0).max(100),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  summary: z.string().max(500),
  recommendation: z.enum(['SAFE', 'CAUTION', 'AVOID', 'BLOCK'])
});

const aiResponse = await openai.chat.completions.create({...});
const parsed = JSON.parse(aiResponse.choices[0].message.content);

// Validate before using
const validated = AIResponseSchema.parse(parsed);
```

#### 3. AI Rate Limiting (Groq gratis tapi ada limit)

```typescript
// ✅ Groq: 30 req/min (super generous untuk free tier!)
const completion = await groq.chat.completions.create({
  model: 'llama-3.1-70b-versatile',
  messages: [...],
  max_tokens: 500,           // Limit output
  temperature: 0.3,          // Lower = more deterministic
  timeout: 5000,             // Groq super fast!
});

// Note: Groq FREE tier = 30 req/menit = 43,200 scans/hari!
// Lebih dari cukup untuk MVP dan even production!
```

### Database Security

#### 1. MongoDB Connection Security

```typescript
// ✅ Use authentication & SSL
const MONGODB_URI = `mongodb+srv://${user}:${pass}@cluster.mongodb.net/safechain?retryWrites=true&w=majority&ssl=true`;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: "admin",
  ssl: true,
});
```

#### 2. Data Sanitization

```typescript
// ✅ Remove sensitive data before storing
function sanitizeScanResult(result: any) {
  return {
    ...result,
    // Remove PII or sensitive info
    userIp: undefined,
    internalMetadata: undefined,
  };
}
```

### Secret Management

```typescript
// For production, use secret management services:
// - AWS Secrets Manager
// - Google Cloud Secret Manager
// - HashiCorp Vault
// - Railway/Vercel environment variables

// Example with Railway:
// railway variables set OPENAI_API_KEY=sk-...
// railway variables set ALCHEMY_API_KEY=...
```

### Security Checklist

- [ ] All inputs validated with Zod/Joi
- [ ] Rate limiting enabled on all endpoints
- [ ] CORS configured with whitelist
- [ ] Helmet security headers enabled
- [ ] No API keys in code/git
- [ ] MongoDB authentication enabled
- [ ] Redis password set
- [ ] HTTPS enforced in production
- [ ] Error messages don't leak sensitive info
- [ ] Logs don't contain API keys/secrets
- [ ] Dependencies updated (npm audit)
- [ ] AI output validated before use
- [ ] Timeouts set on all external calls

---

## ☁️ Deployment

### Option A: Railway (Recommended untuk MVP)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Option B: Docker Compose

```yaml
# docker/docker-compose.yml
version: "3.8"

services:
  frontend:
    build:
      context: ../frontend
      dockerfile: ../docker/Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build:
      context: ../backend
      dockerfile: ../docker/Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  mongo_data:
  redis_data:
```

### Option C: Vercel + Railway

- **Frontend**: Deploy ke Vercel
- **Backend**: Deploy ke Railway
- **Database**: MongoDB Atlas + Redis Cloud

---

## 💰 Estimasi Biaya

### MVP / Testing (1,000 scans/bulan)

| Item                 | Biaya                    |
| -------------------- | ------------------------ |
| Railway (free tier)  | $0                       |
| MongoDB Atlas (free) | $0                       |
| Redis Cloud (free)   | $0                       |
| Groq API (llama-3.1) | $0 ✅                    |
| Gemini API (backup)  | $0 ✅                    |
| **TOTAL**            | **$0 (FULL GRATIS!)** 🎉 |

### Production (10,000 scans/bulan)

| Item                   | Biaya                               |
| ---------------------- | ----------------------------------- |
| Railway/Render         | $20/bulan                           |
| MongoDB Atlas (M10)    | $57/bulan                           |
| Redis Cloud            | $7/bulan                            |
| Groq API (llama-3.1)   | $0 ✅                               |
| Gemini API (backup)    | $0 ✅                               |
| Alchemy (free tier OK) | $0                                  |
| **TOTAL**              | **$84/bulan (AI TETAP GRATIS!)** 🎉 |

---

## 🆓 ANALISIS FREE TIER (Lengkap & Detail)

### ✅ 100% GRATIS - Libraries & Tools

#### Frontend Libraries (NPM - GRATIS SELAMANYA)

| Package              | License    | Cost    | Notes                 |
| -------------------- | ---------- | ------- | --------------------- |
| **react**            | MIT        | FREE ✅ | Open source           |
| **vite**             | MIT        | FREE ✅ | Open source           |
| **typescript**       | Apache 2.0 | FREE ✅ | Microsoft open source |
| **tailwindcss**      | MIT        | FREE ✅ | Open source           |
| **zustand**          | MIT        | FREE ✅ | Open source           |
| **axios**            | MIT        | FREE ✅ | Open source           |
| **react-router-dom** | MIT        | FREE ✅ | Open source           |
| **recharts**         | MIT        | FREE ✅ | Open source           |
| **lucide-react**     | ISC        | FREE ✅ | Open source           |

**Total Frontend Libraries: $0**

#### Backend Libraries (NPM - GRATIS SELAMANYA)

| Package                   | License    | Cost    | Notes               |
| ------------------------- | ---------- | ------- | ------------------- |
| **express**               | MIT        | FREE ✅ | Open source         |
| **ethers.js**             | MIT        | FREE ✅ | Open source         |
| **mongoose**              | MIT        | FREE ✅ | Open source         |
| **ioredis**               | MIT        | FREE ✅ | Open source         |
| **groq-sdk**              | MIT        | FREE ✅ | Official SDK gratis |
| **@google/generative-ai** | Apache 2.0 | FREE ✅ | Google official     |
| **winston**               | MIT        | FREE ✅ | Open source         |
| **zod**                   | MIT        | FREE ✅ | Open source         |
| **helmet**                | MIT        | FREE ✅ | Open source         |
| **cors**                  | MIT        | FREE ✅ | Open source         |

**Total Backend Libraries: $0**

**Kesimpulan**: Semua libraries 100% gratis & open source!

---

### ✅ AI Services - FREE TIER

#### 1. Groq (Primary AI) - GRATIS!

| Feature            | Free Tier            | Cukup untuk?        |
| ------------------ | -------------------- | ------------------- |
| **Rate Limit**     | 30 requests/minute   | ✅ 1,800 scans/jam  |
| **Daily Limit**    | 14,400 requests/hari | ✅ MVP + Production |
| **Model**          | Llama 3.1 70B        | ✅ Very powerful    |
| **Speed**          | < 1 second           | ✅ Super fast       |
| **No Credit Card** | YES                  | ✅ No CC required   |
| **Upgrade Need?**  | For 50k+ scans/day   | ✅ Unlikely         |

**Verdict**: ✅ GRATIS - Cukup untuk 1,800 users/jam!

#### 2. Google Gemini (Backup) - GRATIS!

| Feature            | Free Tier           | Cukup untuk?      |
| ------------------ | ------------------- | ----------------- |
| **Rate Limit**     | 15 requests/minute  | ✅ 900 scans/jam  |
| **Daily Limit**    | 1,500 requests/hari | ✅ Good backup    |
| **Model**          | Gemini 1.5 Flash    | ✅ Fast & good    |
| **No Credit Card** | YES                 | ✅ No CC required |

**Verdict**: ✅ GRATIS - Perfect backup!

**Combined AI Capacity**: 30+15 = **45 scans/menit** = **2,700 users/jam GRATIS!**

---

### ✅ Blockchain & Web3 APIs - FREE TIER

#### 1. Alchemy (RPC Provider) - GRATIS!

| Feature            | Free Tier         | Cukup untuk?         |
| ------------------ | ----------------- | -------------------- |
| **Requests/bulan** | 300 JUTA          | ✅ 10M requests/hari |
| **Networks**       | ETH, Polygon, BSC | ✅ All networks      |
| **WebSocket**      | YES               | ✅ Real-time data    |
| **No Credit Card** | YES               | ✅ Email only        |
| **Speed**          | Fast              | ✅ Production ready  |

**Verdict**: ✅ GRATIS - 300M requests = 10,000 scans/hari easy!

#### 2. Etherscan API - GRATIS!

| Feature            | Free Tier         | Cukup untuk?        |
| ------------------ | ----------------- | ------------------- |
| **Rate Limit**     | 5 requests/second | ✅ 18,000 req/jam   |
| **Contract Info**  | YES               | ✅ ABI, source code |
| **No Credit Card** | YES               | ✅ Just signup      |

**Verdict**: ✅ GRATIS - 5 req/s lebih dari cukup!

#### 3. GoPlus Security API - GRATIS!

| Feature            | Free Tier              | Cukup untuk?      |
| ------------------ | ---------------------- | ----------------- |
| **Rate Limit**     | Generous (undisclosed) | ✅ Enough for MVP |
| **Honeypot Check** | YES                    | ✅ Full access    |
| **Token Analysis** | YES                    | ✅ Full features  |
| **No Credit Card** | YES                    | ✅ Just API key   |

**Verdict**: ✅ GRATIS - Full features!

---

### ✅ Database - FREE TIER

#### 1. MongoDB Atlas - GRATIS!

| Feature            | Free Tier (M0) | Cukup untuk?            |
| ------------------ | -------------- | ----------------------- |
| **Storage**        | 512 MB         | ✅ ~50,000 scan results |
| **RAM**            | Shared         | ✅ Good for MVP         |
| **Backup**         | NO             | ⚠️ Manual backup only   |
| **Connection**     | 500 concurrent | ✅ More than enough     |
| **No Credit Card** | YES            | ✅ Email only           |
| **Uptime**         | 99.95%         | ✅ Reliable             |

**Estimasi Kapasitas**:

- 1 scan result ≈ 10 KB
- 512 MB = 51,200 scans
- TTL 30 hari = 1,700 scans/hari sustainable

**Verdict**: ✅ GRATIS - Cukup untuk MVP! Scale up later.

#### 2. Redis Cloud - GRATIS!

| Feature               | Free Tier  | Cukup untuk?             |
| --------------------- | ---------- | ------------------------ |
| **Memory**            | 30 MB      | ✅ ~10,000 cache entries |
| **Commands/sec**      | 30 ops/sec | ⚠️ Limited               |
| **High Availability** | NO         | ⚠️ Single instance       |
| **No Credit Card**    | YES        | ✅ Email only            |

**Estimasi Kapasitas**:

- 1 cache entry ≈ 3 KB
- 30 MB = 10,000 entries
- Cache hit rate 80% = save API calls

**Verdict**: ✅ GRATIS - Cukup! Tapi perlu smart caching.

**Alternative FREE**:

- **Upstash Redis** - 10k commands/day (better limit!)
- **Railway Redis** - 100 MB free

---

### ✅ Hosting & Deployment - FREE TIER

#### 1. Railway - GRATIS (dengan syarat)

| Feature          | Free Tier | Notes          |
| ---------------- | --------- | -------------- |
| **Credit/bulan** | $5        | ✅ Limited     |
| **CPU**          | Shared    | ✅ Enough      |
| **RAM**          | 512 MB    | ✅ Node.js OK  |
| **Uptime**       | 24/7      | ✅ Always on   |
| **Auto Deploy**  | YES       | ✅ GitHub sync |

**Verdict**: ✅ GRATIS - $5 credit cukup untuk backend ringan (MVP)

**Alternative FREE**: Render.com (750 jam/bulan free)

#### 2. Vercel - GRATIS!

| Feature         | Free Tier    | Notes            |
| --------------- | ------------ | ---------------- |
| **Bandwidth**   | 100 GB/bulan | ✅ 100k visitors |
| **Builds**      | Unlimited    | ✅ No limit      |
| **Domains**     | Unlimited    | ✅ Custom domain |
| **Auto Deploy** | YES          | ✅ GitHub sync   |
| **CDN**         | Global       | ✅ Super fast    |

**Verdict**: ✅ GRATIS - Perfect untuk React frontend!

---

### ⚠️ PERLU DIPERHATIKAN (Potential Limitations)

#### 1. **Redis Cloud (30 MB)** - Kecil!

**Problem**: Cache cepat penuh
**Solution**:

- Gunakan **Upstash Redis** (10k commands/day, better limit)
- Atau **Railway Redis** (100 MB free)
- Smart TTL: Contract = 1 jam, Token = 30 menit

#### 2. **Railway $5 Credit** - Terbatas

**Problem**: Bisa habis kalau traffic tinggi
**Solution**:

- Optimasi: Efficient code, minimize CPU
- Fallback: **Render.com** (750 jam/bulan)
- Scale: Upgrade Railway ($5-10/bulan) kalau traffic naik

#### 3. **MongoDB 512 MB** - Terbatas Storage

**Problem**: Cuma muat 50k scans
**Solution**:

- TTL 30 hari (auto delete old data)
- Store cuma essential data
- Upgrade ke M2 ($9/bulan) kalau perlu

#### 4. **Groq 14.4k/day + Gemini 1.5k/day = 15.9k scans/day**

**Problem**: Limit jika viral
**Solution**:

- Implement queue system
- Cache agresif (save 80% requests)
- Add "waiting list" for peak hours
- Upgrade Groq paid ($0.59/1M tokens - murah!)

---

### 💡 REKOMENDASI FINAL

#### Setup FREE Optimal (MVP):

```env
# AI (100% FREE)
AI_PROVIDER=groq
GROQ_API_KEY=xxx           # Primary - 30 req/min
GEMINI_API_KEY=xxx         # Backup - 15 req/min

# Blockchain (100% FREE)
ALCHEMY_API_KEY=xxx        # 300M req/month

# Explorer (100% FREE)
ETHERSCAN_API_KEY=xxx      # 5 req/sec
POLYGONSCAN_API_KEY=xxx
BSCSCAN_API_KEY=xxx

# Security (100% FREE)
GOPLUS_API_KEY=xxx

# Database (100% FREE)
MONGODB_URI=mongodb+srv://atlas-free...
REDIS_URL=redis://upstash-free...     # GUNAKAN UPSTASH!

# Hosting (100% FREE)
# Frontend: Vercel
# Backend: Railway ($5 credit)
```

#### Estimasi Kapasitas FULL FREE:

| Metric        | Free Capacity | Real Usage       | Status         |
| ------------- | ------------- | ---------------- | -------------- |
| **AI Scans**  | 15,900/hari   | 1,000/hari (MVP) | ✅ 15x buffer  |
| **RPC Calls** | 10M/hari      | 100k/hari        | ✅ 100x buffer |
| **Database**  | 50k records   | 1,700/hari       | ✅ 30 hari TTL |
| **Cache**     | 10k entries   | 5k active        | ✅ Good        |
| **Hosting**   | Always on     | 24/7             | ✅ OK          |

**Verdict**: 🎉 **100% GRATIS untuk MVP + Early Production (1-2k scans/day)**

---

### 📊 Kapan Perlu Upgrade?

| Traffic Level        | What to Upgrade            | Cost   |
| -------------------- | -------------------------- | ------ |
| **< 1k scans/day**   | NOTHING                    | $0     |
| **1-5k scans/day**   | NOTHING                    | $0     |
| **5-10k scans/day**  | Redis → Upstash paid ($10) | $10/mo |
| **10-15k scans/day** | MongoDB → M2 ($9)          | $19/mo |
| **15-30k scans/day** | Railway → $10 plan         | $29/mo |
| **30k+ scans/day**   | All upgrades               | $84/mo |

**Note**: AI tetap GRATIS sampai 50k scans/day! 🚀

---

## ✅ Checklist Development

## 🚀 Development Timeline (Backend-First Approach)

> **Strategi:** Backend dulu sampai stabil, baru Frontend. Ini memastikan API solid sebelum UI development.

### 📦 **Week 1: Environment Setup & Prerequisites**

**Goal:** Setup development environment & dapatkan semua API keys yang diperlukan

**Tasks:**

- [ ] **Repository Setup**
  - Clone/create repo
  - Setup `.gitignore` (node_modules, .env, dist)
  - Create folder structure (backend/, frontend/)
  
- [ ] **Get FREE API Keys** (CRITICAL!)
  - [ ] [Groq API](https://console.groq.com) - Sign up, get API key (30 req/min FREE)
  - [ ] [Google Gemini](https://makersuite.google.com/app/apikey) - Backup AI (15 req/min FREE)
  - [ ] [Alchemy](https://dashboard.alchemy.com) - Ethereum RPC (300M req/month FREE)
  - [ ] [Etherscan](https://etherscan.io/apis) - Contract data (5 req/sec FREE)
  - [ ] [GoPlus Security](https://gopluslabs.io) - Token security (FREE, no key needed)
  
- [ ] **Database Setup** (Cloud, FREE Tier)
  - [ ] [MongoDB Atlas](https://mongodb.com/atlas) - M0 cluster (512MB FREE)
  - [ ] [Upstash Redis](https://upstash.com) - Redis (10k commands/day FREE)
  
- [ ] **Development Tools**
  - [ ] Install Node.js 20+ LTS
  - [ ] Install VS Code + extensions (ESLint, Prettier)
  - [ ] Install Postman/Thunder Client (API testing)

**Success Criteria:**
- ✅ All API keys obtained & tested
- ✅ MongoDB & Redis connected successfully
- ✅ `.env` file configured properly

---

### ⚙️ **Week 2: Backend Foundation - Core Services**

**Goal:** Build blockchain interaction & external API clients

**Tasks:**

- [ ] **Backend Project Setup**
  ```bash
  cd backend
  npm init -y
  npm install express ethers axios mongoose ioredis groq-sdk @google/generative-ai
  npm install -D typescript @types/node @types/express ts-node nodemon
  npx tsc --init
  ```

- [ ] **Core Services Implementation**
  - [ ] `BlockchainService.ts` - Ethers.js provider, get contract ABI, read storage slots
  - [ ] `EtherscanClient.ts` - Fetch contract source code, verify status, creation tx
  - [ ] `AlchemyClient.ts` - Enhanced RPC calls, token balances, transaction history
  - [ ] `GoPlusClient.ts` - Token security check (honeypot, tax, LP locked)
  
- [ ] **Configuration & Utils**
  - [ ] `config.ts` - Load .env variables, validate API keys
  - [ ] `cache.ts` - Redis caching layer with TTL
  - [ ] `logger.ts` - Winston logger setup (console + file)
  - [ ] `errors.ts` - Custom error classes

**Success Criteria:**
- ✅ Can fetch contract bytecode from Etherscan
- ✅ Can read smart contract state using ethers.js
- ✅ GoPlus API returns token security data
- ✅ Redis caching works (set/get with TTL)

---

### 🔍 **Week 3: Backend - Scanner Services (18 Parameters)**

**Goal:** Implement 3 main scanner services with all 18 detection parameters

**Tasks:**

- [ ] **Contract Scanner** (`ContractScanner.ts`)
  - [ ] Check verified status (Etherscan API)
  - [ ] Detect proxy pattern (EIP-1967, EIP-1822)
  - [ ] Check owner privileges (Ownable pattern)
  - [ ] Detect dangerous functions (selfdestruct, delegatecall, mint)
  - [ ] Check pause mechanism (Pausable pattern)
  - [ ] Analyze upgrade mechanism (UUPS, Transparent Proxy)

- [ ] **Token Scanner** (`TokenScanner.ts`)
  - [ ] Honeypot detection (GoPlus API + DEX simulation)
  - [ ] Buy/sell tax check (GoPlus API)
  - [ ] LP locked check (GoPlus API + Unicrypt/Team.Finance)
  - [ ] Holder distribution analysis (Top 10 holders via Alchemy)
  - [ ] Check token renounced (owner = 0x0 address)

- [ ] **Wallet Scanner** (`WalletScanner.ts`)
  - [ ] Check against scam database (GoPlus API + Etherscan labels)
  - [ ] Wallet age analysis (first transaction timestamp)
  - [ ] Connection analysis (top 10 interacted addresses)
  - [ ] Mixer pattern detection (Tornado Cash, privacy protocols)

**Success Criteria:**
- ✅ Each scanner returns structured risk data
- ✅ All 18 parameters implemented & tested
- ✅ Proper error handling for API failures

---

### 🤖 **Week 4: Backend - AI Integration & Risk Scoring**

**Goal:** Integrate Groq AI for analysis & implement risk scoring system

**Tasks:**

- [ ] **AI Service** (`AIService.ts`)
  - [ ] Groq client setup (Llama 3.1 70B)
  - [ ] Google Gemini fallback client (if Groq fails)
  - [ ] Prompt engineering untuk contract analysis
  - [ ] Prompt engineering untuk risk assessment
  - [ ] Token usage tracking & rate limiting

- [ ] **Risk Scoring Engine** (`RiskScoringService.ts`)
  - [ ] Weight calculation per parameter (high/medium/low risk)
  - [ ] Aggregate score (0-100, lower = safer)
  - [ ] Risk category assignment (SAFE/LOW/MEDIUM/HIGH/CRITICAL)
  - [ ] Mitigation recommendations based on findings

- [ ] **Orchestrator** (`ScanOrchestrator.ts`)
  - [ ] Coordinate all scanners (contract, token, wallet)
  - [ ] Aggregate all detection results
  - [ ] Calculate final risk score
  - [ ] Generate AI summary & recommendations

**Success Criteria:**
- ✅ Groq AI returns human-readable analysis
- ✅ Risk score calculated correctly (0-100)
- ✅ Fallback to Gemini works when Groq fails
- ✅ Full scan completes in <5 seconds

---

### 🌐 **Week 5: Backend - API Endpoints & Database Models**

**Goal:** Expose REST API & persist scan results to MongoDB

**Tasks:**

- [ ] **Database Models** (`models/`)
  - [ ] `ScanResult.ts` - Schema untuk scan results
  - [ ] `ScanHistory.ts` - Schema untuk user scan history
  - [ ] Indexes for fast queries (address, timestamp)

- [ ] **API Endpoints** (`routes/`)
  - [ ] `POST /api/scan/contract` - Scan smart contract
  - [ ] `POST /api/scan/token` - Scan ERC20 token
  - [ ] `POST /api/scan/wallet` - Scan wallet address
  - [ ] `POST /api/scan/full` - Full scan (auto-detect type)
  - [ ] `GET /api/history/:address` - Get scan history
  - [ ] `GET /api/stats` - System statistics

- [ ] **Middleware**
  - [ ] `auth.ts` - Optional API key auth (future)
  - [ ] `rateLimiter.ts` - Express rate limit (10 req/min per IP)
  - [ ] `validator.ts` - Zod validation for requests
  - [ ] `errorHandler.ts` - Centralized error handling

- [ ] **Server Setup** (`server.ts`)
  - [ ] Express app configuration
  - [ ] CORS setup (allow frontend origin)
  - [ ] Helmet security headers
  - [ ] Health check endpoint (`GET /health`)

**Success Criteria:**
- ✅ All API endpoints working via Postman
- ✅ Scan results saved to MongoDB
- ✅ Redis cache reduces duplicate scans
- ✅ Rate limiting prevents abuse
- ✅ Backend ready for frontend integration!

---

### 🎨 **Week 6: Frontend Foundation - Setup & Components**

**Goal:** Setup React app & build reusable UI components

**Tasks:**

- [ ] **Frontend Project Setup**
  ```bash
  cd frontend
  npm create vite@latest . -- --template react-ts
  npm install tailwindcss postcss autoprefixer
  npm install zustand axios react-router-dom recharts lucide-react
  npx tailwindcss init -p
  ```

- [ ] **UI Components** (`components/`)
  - [ ] `SearchBar.tsx` - Address/contract input dengan validation
  - [ ] `RiskBadge.tsx` - Color-coded badge (SAFE/LOW/MEDIUM/HIGH/CRITICAL)
  - [ ] `RiskScore.tsx` - Circular progress bar (0-100)
  - [ ] `ParameterCard.tsx` - Individual parameter result card
  - [ ] `LoadingSpinner.tsx` - Loading indicator
  - [ ] `ErrorMessage.tsx` - Error display component

- [ ] **Layout Components**
  - [ ] `Header.tsx` - Navigation bar
  - [ ] `Footer.tsx` - Footer with links
  - [ ] `Layout.tsx` - Main layout wrapper

**Success Criteria:**
- ✅ TailwindCSS styling works
- ✅ Components are reusable & typed
- ✅ Responsive design (mobile-friendly)

---

### 🚀 **Week 7: Frontend - Pages & Backend Integration**

**Goal:** Build main pages & connect to backend API

**Tasks:**

- [ ] **State Management** (`store/`)
  - [ ] `scanStore.ts` - Zustand store untuk scan state
  - [ ] `historyStore.ts` - Zustand store untuk scan history
  - [ ] API client setup with axios instance

- [ ] **Pages** (`pages/`)
  - [ ] `HomePage.tsx` - Landing page dengan search bar
  - [ ] `ScanResultPage.tsx` - Display full scan results
  - [ ] `HistoryPage.tsx` - List of previous scans
  - [ ] `AboutPage.tsx` - Project info & methodology

- [ ] **API Integration**
  - [ ] `api/scanner.ts` - API functions (scanContract, scanToken, scanWallet)
  - [ ] Error handling for API failures
  - [ ] Loading states during API calls
  - [ ] Success/error notifications

- [ ] **Routing**
  - [ ] React Router setup
  - [ ] Route protection (if needed)
  - [ ] 404 page

**Success Criteria:**
- ✅ Can submit scan request from frontend
- ✅ Results display correctly with all parameters
- ✅ Error handling works (network errors, invalid addresses)
- ✅ Smooth user experience (loading states, transitions)

---

### 🧪 **Week 8: Testing, Polish & Deployment**

**Goal:** Test everything, fix bugs, deploy to production

**Tasks:**

- [ ] **Backend Testing**
  - [ ] Test all API endpoints with various addresses
  - [ ] Test error cases (invalid addresses, API failures)
  - [ ] Load testing (handle 100 concurrent requests)
  - [ ] Check Redis caching effectiveness

- [ ] **Frontend Testing**
  - [ ] Manual testing on Chrome, Firefox, Safari
  - [ ] Mobile testing (iOS, Android)
  - [ ] Test edge cases (long addresses, special characters)
  - [ ] Performance optimization (lazy loading, code splitting)

- [ ] **Deployment**
  - [ ] **Backend → Railway** ($5 credit FREE)
    - Create Railway project
    - Connect GitHub repo
    - Set environment variables
    - Deploy backend
  - [ ] **Frontend → Vercel** (FREE)
    - Connect GitHub repo
    - Set build command & output dir
    - Set environment variables (API URL)
    - Deploy frontend

- [ ] **Monitoring & Documentation**
  - [ ] Setup error tracking (Sentry FREE tier optional)
  - [ ] Create API documentation (Swagger optional)
  - [ ] Write deployment guide
  - [ ] Create user guide

**Success Criteria:**
- ✅ Backend live & accessible via Railway URL
- ✅ Frontend live & accessible via Vercel URL
- ✅ End-to-end testing passes
- ✅ No critical bugs
- ✅ Production-ready! 🎉

---

## 📊 **Development Progress Tracker**

| Week | Phase                    | Status | Start Date | End Date |
| ---- | ------------------------ | ------ | ---------- | -------- |
| 1    | Environment Setup        | ⏳     | -          | -        |
| 2    | Backend Foundation       | ⏳     | -          | -        |
| 3    | Scanner Services         | ⏳     | -          | -        |
| 4    | AI Integration           | ⏳     | -          | -        |
| 5    | API & Database           | ⏳     | -          | -        |
| 6    | Frontend Foundation      | ⏳     | -          | -        |
| 7    | Frontend Integration     | ⏳     | -          | -        |
| 8    | Testing & Deployment     | ⏳     | -          | -        |

**Legend:**
- ⏳ Not Started
- 🚧 In Progress
- ✅ Completed
- ⚠️ Blocked

---

## 💡 **Tips untuk Smooth Development**

1. **Week 1 Critical:** Pastikan SEMUA API keys sudah didapat & tested! Ini fondasi semua.

2. **Backend First:** Jangan sentuh frontend sampai backend stabil (Week 5 selesai).

3. **Test Per Week:** Setiap week harus ada success criteria yang dicek. Jangan skip!

4. **Git Commits:** Commit frequently dengan message yang jelas (per feature/fix).

5. **Environment Variables:** Jangan pernah commit `.env` file! Use `.env.example` as template.

6. **Error Handling:** Implement proper error handling dari awal, jangan tunggu production.

7. **Caching Strategy:** Redis cache SEMUA external API calls untuk avoid rate limits.

8. **Rate Limiting:** Protect API dari abuse sejak awal (express-rate-limit).

9. **Logging:** Log everything (requests, errors, AI responses) for debugging.

10. **Documentation:** Update README ini setiap ada perubahan penting.

---

## � Module Dependencies

### Backend Dependencies Explanation

| Package                   | Version | Why We Need It                                             | Alternatives          |
| ------------------------- | ------- | ---------------------------------------------------------- | --------------------- |
| **express**               | 4.x     | Web framework untuk handle HTTP requests                   | Fastify, Koa          |
| **ethers**                | 6.x     | Interact dengan blockchain (read contract, call functions) | web3.js               |
| **axios**                 | 1.x     | HTTP client untuk call external APIs (Etherscan, GoPlus)   | fetch, got            |
| **mongoose**              | 8.x     | MongoDB ODM, easier database operations                    | Native MongoDB driver |
| **ioredis**               | 5.x     | Redis client untuk caching                                 | node-redis            |
| **groq-sdk**              | 0.3.x   | Groq AI API (FREE & FAST!) untuk analysis                  | openai, anthropic     |
| **@google/generative-ai** | 0.1.x   | Google Gemini API (FREE backup AI)                         | -                     |
| **winston**               | 3.x     | Logging framework, log ke file & console                   | pino, bunyan          |
| **zod**                   | 3.x     | Runtime validation, validate API request/response          | joi, yup              |
| **helmet**                | 7.x     | Security headers (XSS, CSRF protection)                    | -                     |
| **cors**                  | 2.x     | Enable cross-origin requests dari frontend                 | -                     |
| **express-rate-limit**    | 7.x     | Prevent abuse, limit requests per IP                       | -                     |
| **dotenv**                | 16.x    | Load environment variables dari .env file                  | -                     |

### Frontend Dependencies Explanation

| Package              | Version | Why We Need It                             | Alternatives              |
| -------------------- | ------- | ------------------------------------------ | ------------------------- |
| **react**            | 18.x    | UI library                                 | Vue, Svelte               |
| **vite**             | 5.x     | Fast build tool, HMR untuk development     | Create React App, Next.js |
| **typescript**       | 5.x     | Type safety, catch errors saat development | -                         |
| **tailwindcss**      | 3.x     | Utility-first CSS, faster styling          | Bootstrap, Chakra UI      |
| **zustand**          | 4.x     | Simple state management                    | Redux, Recoil, Jotai      |
| **axios**            | 1.x     | HTTP client untuk call backend API         | fetch                     |
| **react-router-dom** | 6.x     | Client-side routing                        | TanStack Router           |
| **recharts**         | 2.x     | Charts untuk visualize risk score          | Chart.js, D3.js           |
| **lucide-react**     | latest  | Icon library                               | react-icons, heroicons    |

### Why These Specific Choices?

#### Ethers.js vs Web3.js

```typescript
// Ethers.js (✅ Dipilih)
- Modern, TypeScript-first
- Better error handling
- Smaller bundle size
- Active maintenance

// Web3.js
- Older, more established
- Larger community
- But slower updates
```

#### Zustand vs Redux

```typescript
// Zustand (✅ Dipilih)
- Minimal boilerplate
- Easy to learn
- No providers needed
- Perfect untuk simple state

// Redux
- More verbose
- Overkill untuk project kecil
- But better untuk large apps
```

#### MongoDB vs PostgreSQL

```
MongoDB (✅ Dipilih)
- Flexible schema (scan results bisa berbeda-beda)
- Fast untuk read-heavy operations
- Easy to scale horizontally
- JSON-like documents = easier frontend integration

PostgreSQL
- Relational, rigid schema
- Good untuk complex queries
- ACID compliance
- But slower untuk JSON operations
```

#### AI Provider: Groq vs Gemini vs OpenAI

```
Groq (✅ Primary AI - GRATIS!)
✅ FREE: 30 requests/menit = 14,400/hari
✅ SPEED: < 1 detik response (SUPER FAST!)
✅ MODEL: Llama 3.1 70B (very powerful)
✅ QUALITY: 90-95% sama baiknya dengan GPT-4
✅ NO CC: Tidak perlu credit card
✅ RELIABLE: Uptime 99.9%

Google Gemini (✅ Backup - GRATIS!)
✅ FREE: 15 requests/menit = 1,500/hari
✅ SPEED: 2-3 detik response (fast enough)
✅ MODEL: Gemini 1.5 Flash
✅ QUALITY: 85-90% kualitas GPT-4
✅ GOOGLE: Infrastruktur reliable

OpenAI GPT-4 (❌ Tidak dipilih)
❌ PAID: ~$0.01-0.03 per request
❌ COST: $300-500/bulan untuk 10k scans
❌ CC REQUIRED: Harus input kartu kredit
✅ QUALITY: 100% (terbaik)
✅ REASONING: Paling pintar

Kenapa Groq?
1. Performance: Response < 1 detik vs GPT-4 (3-5 detik)
2. Cost: $0 vs $300-500/bulan
3. Limits: 14,400 req/hari cukup untuk MVP & production
4. Quality: Llama 3.1 70B very good untuk security analysis
5. Backup: Gemini juga gratis kalau Groq down

Real World Test:
- Groq: 43,200 scans/hari (FREE!)
- GPT-4: Biaya $432-1,296/hari (10k scans @ $0.03)
- Saving: ~$13,000/bulan! 💰
```

---

## �📚 Resources

### Dokumentasi

- [Ethers.js Docs](https://docs.ethers.org)
- [Groq API Docs](https://console.groq.com/docs) - **AI Gratis & Super Cepat!** 🚀
- [Google Gemini Docs](https://ai.google.dev/docs) - **AI Gratis Backup!** ✨
- [Alchemy Docs](https://docs.alchemy.com)
- [Etherscan API Docs](https://docs.etherscan.io)

### Security Resources

- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices)
- [Web3 Security Library](https://github.com/immunefi-team/Web3-Security-Library)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Academic References

- [Detecting Ponzi Schemes on Ethereum (Chen et al., 2019)](https://arxiv.org/abs/1902.06568)
- [Smart Contract Vulnerabilities (Perez & Livshits, 2020)](https://arxiv.org/abs/1905.01467)

### Industry Tools (Reference)

- [GoPlus Security](https://gopluslabs.io/) - Honeypot detection
- [Token Sniffer](https://tokensniffer.com/) - Automated audit
- [Honeypot.is](https://honeypot.is/) - Scam detection
- [Etherscan](https://etherscan.io/) - Block explorer

---

## ❓ FAQ (Frequently Asked Questions)

### Tentang AI Gratis

**Q: Apakah Groq benar-benar gratis selamanya?**  
A: Ya! Groq free tier (30 req/min) sudah cukup untuk MVP dan production ringan. Bahkan untuk 10,000 scans/hari masih aman dalam limit.

**Q: Bagaimana kualitas Llama 3.1 dibanding GPT-4?**  
A: Untuk security analysis, Llama 3.1 70B ~90-95% akurat dibanding GPT-4. Lebih dari cukup untuk use case kita. Plus, response time jauh lebih cepat (< 1 detik).

**Q: Kalau Groq limit terlampaui gimana?**  
A: Ada 3 layer fallback:

1. Groq (primary) - 30 req/min
2. Gemini (backup) - 15 req/min
3. Rule-based analysis (no AI)

Dengan 2 AI gratis, total capacity = 45 scans/menit = 64,800 scans/hari!

**Q: Perlu credit card gak untuk Groq/Gemini?**  
A: TIDAK! Kedua service 100% gratis tanpa CC. Berbeda dengan OpenAI yang wajib CC.

**Q: Bisakah upgrade ke model berbayar nanti?**  
A: Bisa. Tapi kemungkinan besar tidak perlu. Groq free tier sudah sangat generous. Kecuali traffic > 50,000 scans/hari baru consider upgrade.

### Tentang Biaya

**Q: Berapa total biaya untuk MVP?**  
A: **$0/bulan** (semua gratis):

- Groq AI: Free ✅
- Gemini backup: Free ✅
- Alchemy RPC: Free (300M req/bulan) ✅
- MongoDB Atlas: Free (512MB) ✅
- Redis Cloud: Free (30MB) ✅
- Railway: Free tier ✅

**Q: Biaya production (10k scans/hari)?**  
A: **~$84/bulan** (AI tetap gratis!):

- Server: $20
- MongoDB: $57
- Redis: $7
- AI: **$0** ✅

Bandingkan dengan OpenAI: $84 vs $500+ 💰

### Tentang Performance

**Q: Seberapa cepat AI response?**  
A:

- Groq: < 1 detik ⚡
- Gemini: 2-3 detik
- GPT-4: 3-5 detik

Groq **3-5x lebih cepat** dari GPT-4!

**Q: Bisa handle berapa user concurrent?**  
A: Dengan Groq 30 req/min + Gemini 15 req/min = 45 scan/menit = **2,700 users/jam** (asumsi 1 user = 1 scan).

### Troubleshooting AI

**Q: Error "Rate limit exceeded" dari Groq?**  
A: Sistem otomatis fallback ke Gemini. Tapi kalau sering terjadi:

1. Tambah caching (reduce repeat scans)
2. Implement queue system
3. Consider Groq paid tier ($0.59/1M tokens - still murah!)

**Q: AI response tidak akurat?**  
A:

1. Cek system prompt - pastikan clear & specific
2. Validate input data - garbage in, garbage out
3. Adjust temperature (lower = more deterministic)
4. Consider fine-tuning (advanced)

**Q: Bisa pakai Ollama (local) instead?**  
A: Bisa! Benefit:

- 100% free & private
- No rate limits
- No internet dependency

Drawback:

- Perlu GPU/RAM kuat (16GB+ recommended)
- Slower inference (5-10 detik)
- Setup lebih ribet

---

## 📄 License

MIT License - lihat file [LICENSE](LICENSE)

---

## 🤝 Contributing

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

**Built with ❤️ for Web3 Security**

**Powered by FREE AI**: [Groq](https://groq.com) 🚀 | [Google Gemini](https://ai.google.dev) ✨

---

## 💡 Pro Tips

### Maksimalkan Free Tier

1. **Caching Agresif**: Cache hasil 1 jam → reduce 80% API calls
2. **Rate Limit Smart**: Queue requests instead of reject
3. **Parallel Processing**: Scan blockchain data parallel untuk speed
4. **CDN Frontend**: Deploy frontend di Vercel (free + fast)
5. **Monitor Usage**: Track API calls untuk avoid surprise limit

### Optimasi AI Cost (kalau mau upgrade)

Jika nanti mau upgrade AI berbayar:

- Groq paid: $0.59/1M tokens (10x lebih murah dari GPT-4!)
- Gemini paid: $0.075/1M tokens (super murah!)
- OpenAI: $10-30/1M tokens (mahal!)

**Rekomendasi**: Stick dengan Groq free tier → kalau perlu upgrade, Groq paid masih sangat murah!

### Skalabilitas

Free tier cukup untuk:

- ✅ 14,400 scans/hari (Groq)
- ✅ 1,500 scans/hari (Gemini backup)
- ✅ Total: **15,900 scans/hari GRATIS!**

Kalau traffic > 15k/hari:

1. Upgrade Groq to paid ($0.59/1M tokens)
2. Add rate limiting per user
3. Consider premium tier dengan subscription

---

**🎉 Start building dengan $0 budget sekarang!**
