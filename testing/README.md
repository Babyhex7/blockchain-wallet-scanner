# 🧪 SafeChain Guardian API Testing

Folder ini berisi file testing untuk semua API endpoints menggunakan REST Client (VS Code extension).

## 📦 Prerequisites

Install VS Code extension: **REST Client** by Huachao Mao

- Extension ID: `humao.rest-client`
- Install dari VS Code Extensions marketplace

## 🗂️ Struktur File Testing

```
testing/
├── README.md                    # Dokumentasi testing (file ini)
├── environment.http             # Environment variables (base URL, API keys)
├── 01-health.http              # Health check endpoint tests
├── 02-scan-contract.http       # Contract scanning tests
├── 03-scan-token.http          # Token scanning tests
├── 04-scan-wallet.http         # Wallet scanning tests
├── 05-scan-full.http           # Full comprehensive scan tests
├── 06-history.http             # Scan history & stats tests
└── test-addresses.md           # Daftar alamat untuk testing
```

## 🚀 Cara Menggunakan

### 1. Pastikan Server Running

```bash
cd backend
npm run dev
```

Server harus berjalan di `http://localhost:3001`

### 2. Check Environment Variables

Buka file `environment.http` dan pastikan:

- `@baseUrl` sesuai (default: http://localhost:3001)
- `@apiVersion` sesuai (default: v1)

### 3. Run Test Request

1. Buka file `.http` yang ingin ditest (contoh: `02-scan-contract.http`)
2. Klik **"Send Request"** di atas setiap request
3. Atau gunakan shortcut: `Ctrl+Alt+R` (Windows) atau `Cmd+Alt+R` (Mac)

### 4. Lihat Response

Response akan muncul di tab baru di sebelah kanan.

## 📝 Testing Checklist

### ✅ Basic Tests

- [ ] Health check endpoint (`/health`)
- [ ] Health check return correct status & services

### 🔍 Contract Scanning Tests

- [ ] Scan verified contract (Uniswap UNI)
- [ ] Scan unverified contract
- [ ] Scan proxy contract
- [ ] Scan contract dengan dangerous functions
- [ ] Invalid address handling
- [ ] Invalid chain ID handling

### 🪙 Token Scanning Tests

- [ ] Scan legitimate token (USDT)
- [ ] Scan high tax token
- [ ] Scan honeypot token
- [ ] Scan token tanpa liquidity
- [ ] Token ownership check
- [ ] LP lock check

### 👛 Wallet Scanning Tests

- [ ] Scan wallet lama (> 1 year)
- [ ] Scan wallet baru (< 30 days)
- [ ] Wallet dengan banyak transaksi
- [ ] Empty wallet
- [ ] Scam database check
- [ ] Phishing check

### 📊 History & Stats Tests

- [ ] Get recent scan history
- [ ] Get history dengan pagination
- [ ] Get scan statistics
- [ ] Get address-specific history

### 🎯 Full Scan Tests

- [ ] Full scan contract address
- [ ] Full scan token address
- [ ] Full scan wallet address
- [ ] Auto-detect type functionality

## 🐛 Common Issues

### Server Not Running

```
Error: connect ECONNREFUSED 127.0.0.1:3001
```

**Solution**: Start backend server dengan `npm run dev` di folder `backend/`

### MongoDB Not Connected

```json
{
  "error": "MongooseError: ..."
}
```

**Solution**: Check MongoDB URI di `.env` file

### Gemini API Key Missing

```json
{
  "riskAnalysis": {
    "summary": "Error: Gemini API key not configured"
  }
}
```

**Solution**: Tambahkan `GEMINI_API_KEY` di `.env` file

### Rate Limit Exceeded

```json
{
  "error": "Too many requests from this IP, please try again after 1 minute"
}
```

**Solution**: Tunggu 1 menit atau restart server untuk reset rate limiter

## 📊 Expected Response Times

- Health check: < 100ms
- Contract scan: 2-5 seconds
- Token scan: 3-7 seconds
- Wallet scan: 2-4 seconds
- Full scan: 5-10 seconds

## 🎯 Success Criteria

Backend dianggap **berfungsi dengan baik** jika:

1. ✅ Health endpoint return `"status": "healthy"`
2. ✅ Semua scan endpoints return HTTP 200
3. ✅ Response memiliki struktur yang benar (sesuai schema)
4. ✅ Risk score calculated (0-100)
5. ✅ AI analysis generated (jika Gemini API key configured)
6. ✅ Data tersimpan di MongoDB
7. ✅ Error handling works (invalid input return 400)
8. ✅ Rate limiting works (> 10 req/min return 429)

## 📚 Resources

- [REST Client Documentation](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [HTTP Request Syntax](https://github.com/Huachao/vscode-restclient#usage)
- SafeChain Guardian API Documentation: `backend/README.md`
