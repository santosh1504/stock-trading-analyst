# AI Stock Trading Analyst

**Real-time stock analysis powered by Google Gemini 2.5 Flash + Twelve Data API, presented in a premium 3D fintech interface.**

![Tech Stack](https://img.shields.io/badge/Gemini-2.5%20Flash-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green) ![React](https://img.shields.io/badge/React-18-cyan) ![Three.js](https://img.shields.io/badge/Three.js-r167-orange)

> ⚠️ **Educational tool only.** This system does not guarantee investment returns, execute trades, or replace professional financial advice.

---

## Overview

An AI-powered educational stock analysis tool that helps beginners and general users analyze stocks using real market data, technical indicators, and Google Gemini AI.

### Problem
Most retail investors lack access to technical analysis tools or don't know how to interpret indicators like RSI and moving averages.

### Solution
A beginner-friendly AI analyst that fetches real market data, calculates technical indicators, and explains what they mean — delivering clear BUY / SELL / HOLD signals with educational rationale.

---

## Features

| Feature | Description |
|---------|-------------|
| Real-Time Price | Live stock prices via Twelve Data API |
| Price History Chart | Interactive 10-day area chart with Recharts |
| RSI Analysis | 14-day RSI with Overbought/Oversold/Neutral status |
| SMA Analysis | 50-day & 200-day SMA with Golden/Death Cross signals |
| AI Decision | BUY / SELL / HOLD with High/Medium/Low confidence |
| AI Rationale | Gemini 2.5 Flash explains each indicator |
| Stock Comparison | Side-by-side comparison of two stocks |
| AI Chat | Conversational analyst with real data context |
| 3D Interface | Three.js/R3F AI orb, floating graph, particle field |
| Responsive | Works on desktop, tablet, and mobile |
| Accessible | WCAG 2.1 AA — semantic HTML, keyboard nav, ARIA |

---

## Architecture

```
User → React Frontend → FastAPI Backend → Twelve Data API
                    ↓                 ↓
              3D/Charts UI      Gemini 2.5 Flash
                    ↑                 ↓
              JSON Response ← Structured Analysis
```

**Backend pipeline per analysis:**
1. Validate ticker
2. Fetch current price (`/price`)
3. Fetch 10-day price history (`/time_series`)
4. Fetch 14-day RSI (`/rsi`)
5. Fetch 50-day SMA + 200-day SMA (`/sma`)
6. Pass all data to Gemini → structured BUY/SELL/HOLD
7. Return `AnalyzeResponse` to frontend

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + custom glassmorphism CSS |
| Animation | Framer Motion |
| 3D | Three.js + React Three Fiber + Drei |
| Charts | Recharts |
| Backend | Python FastAPI |
| AI Agent | LangChain + Google Gemini 2.5 Flash |
| Market Data | Twelve Data REST API |
| Validation | Pydantic v2 |
| Backend Tests | Pytest |
| Frontend Tests | Vitest + Testing Library |

---

## Project Structure

```
stock-trading-analyst/
├── frontend/
│   ├── src/
│   │   ├── 3d/                  # Three.js components
│   │   │   ├── AIOrb.tsx
│   │   │   ├── FloatingGraph.tsx
│   │   │   ├── MarketGrid.tsx
│   │   │   ├── Particles.tsx
│   │   │   └── Scene3D.tsx
│   │   ├── components/          # UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── StockCard.tsx
│   │   │   ├── DecisionBadge.tsx
│   │   │   ├── RSIGauge.tsx
│   │   │   ├── PriceChart.tsx
│   │   │   ├── ComparisonTable.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── LoadingSteps.tsx
│   │   │   ├── ErrorBanner.tsx
│   │   │   └── Disclaimer.tsx
│   │   ├── pages/               # Route pages
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Compare.tsx
│   │   │   ├── AIAnalyst.tsx
│   │   │   └── About.tsx
│   │   ├── services/
│   │   │   └── api.ts           # Typed API client
│   │   ├── types/
│   │   │   └── stock.ts         # TypeScript interfaces
│   │   ├── __tests__/           # Frontend tests
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── vercel.json
├── backend/
│   ├── main.py                  # FastAPI app + routes
│   ├── models.py                # Pydantic models
│   ├── tools.py                 # Twelve Data API tools
│   ├── agent.py                 # Gemini AI agent
│   ├── services/
│   │   ├── analysis.py          # Full analysis pipeline
│   │   ├── comparison.py        # Two-stock comparison
│   │   └── chat.py              # Chat with market data
│   ├── utils/
│   │   ├── validators.py        # Ticker validation
│   │   └── errors.py            # Custom exceptions
│   ├── tests/                   # Pytest tests
│   ├── Procfile                 # Render/Railway deployment
│   └── .env                     # API keys (never commit)
├── .gitignore
├── .env.example
├── requirements.txt
└── README.md
```

---

## Environment Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Twelve Data API key](https://twelvedata.com/apikey) (free tier: 8 calls/min)
- [Google Gemini API key](https://aistudio.google.com/app/apikey) (free tier available)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/stock-trading-analyst.git
cd stock-trading-analyst
```

### 2. Configure environment variables
```bash
cp .env.example backend/.env
# Edit backend/.env and add your real API keys:
# GEMINI_API_KEY=your_key_here
# TWELVEDATA_API_KEY=your_key_here
```

---

## Installation & Running

### Backend

```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend (from project root)
cd backend
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (proxies /api to localhost:8000)
npm run dev
```

Frontend runs at: http://localhost:5173

---

## API Documentation

### `GET /api/health`
Health check.

**Response:**
```json
{ "status": "ok", "message": "AI Stock Trading Analyst API is running" }
```

---

### `POST /api/analyze`
Full stock analysis with AI decision.

**Request:**
```json
{
  "ticker": "AAPL",
  "question": "Should I buy Apple stock?"
}
```

**Response:**
```json
{
  "ticker": "AAPL",
  "current_price": 178.25,
  "historical_prices": [172.0, 173.5, ...],
  "historical_dates": ["2024-08-05", ...],
  "rsi": 58.4,
  "rsi_status": "Neutral",
  "sma_50": 175.30,
  "sma_200": 168.50,
  "trend": "Golden Cross / Bullish",
  "decision": "HOLD",
  "confidence": "Medium",
  "rationale": "AAPL's RSI of 58.4 indicates neutral momentum..."
}
```

---

### `POST /api/compare`
Side-by-side comparison of two stocks.

**Request:**
```json
{ "ticker1": "AAPL", "ticker2": "MSFT" }
```

**Response:**
```json
{
  "stock1": { ...AnalyzeResponse for AAPL... },
  "stock2": { ...AnalyzeResponse for MSFT... },
  "stronger_stock": "MSFT",
  "comparison_rationale": "RSI Analysis: AAPL RSI 58.4 (Neutral) vs MSFT RSI 52.1..."
}
```

---

### `POST /api/chat`
Conversational AI analyst. Fetches real market data for stock queries.

**Request:**
```json
{
  "message": "What is Apple's RSI?",
  "history": [
    { "role": "user", "content": "Tell me about AAPL" },
    { "role": "assistant", "content": "Apple Inc. is..." }
  ]
}
```

**Response:**
```json
{
  "reply": "Apple's current RSI is 58.4, indicating neutral momentum...",
  "sources_used": ["Twelve Data: AAPL live market data", "Google Gemini 2.5 Flash"]
}
```

---

## Testing

### Backend (Pytest)
```bash
cd backend
python -m pytest tests/ -v
```

Tests cover: health endpoint, analyze valid/invalid tickers, API errors, rate limits, compare, chat, Twelve Data tool mocking.

### Frontend (Vitest)
```bash
cd frontend
npm test
```

Tests cover: DecisionBadge rendering, all API endpoints with mocked fetch, error handling.

### TypeScript Check
```bash
cd frontend
npm run typecheck
```

### Python Linting
```bash
# From project root (with flake8 installed)
pip install flake8
flake8 backend/ --max-line-length=120
```

---

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Set **Root Directory**: `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`

Update `frontend/vercel.json` for production API URL and `backend/main.py` CORS `allowed_origins`.

### Backend → Render

1. Connect GitHub repo to [render.com](https://render.com)
2. Create **New Web Service**
3. Root directory: `backend`
4. Build command: `pip install -r ../requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables: `GEMINI_API_KEY`, `TWELVEDATA_API_KEY`, `FRONTEND_URL`

### Backend → Railway

```bash
npm install -g @railway/cli
railway login
cd backend
railway up
```

---

## Security

- API keys stored server-side only in `.env` (never in frontend bundle)
- `.env` is in `.gitignore` — never committed to Git
- CORS configured to allowlist only known origins
- All inputs validated with Pydantic v2 and custom validators
- Error messages sanitized — no stack traces exposed to clients
- 15-second API timeouts prevent hanging requests
- HTTP security headers set in `vercel.json`

---

## Limitations

- **Rate limits**: Free Twelve Data tier — 8 API calls/minute. Analysis uses 4 calls per stock. Heavy concurrent use may hit limits.
- **Market data delay**: Free tier data may be 15+ minutes behind real-time.
- **Educational only**: AI analysis is NOT financial advice.
- **Technical indicators are lagging**: RSI and SMA reflect historical data, not future price movements.
- **Ticker coverage**: Twelve Data free tier supports major US stocks. International/OTC stocks may not be available.

---

## Future Enhancements

*Not currently implemented — planned for future versions:*

- MACD and Bollinger Bands
- News sentiment analysis
- Portfolio tracking and watchlists
- Price alert notifications
- Risk scoring and volatility metrics
- Candlestick pattern recognition
- Mobile app (React Native)
- User authentication
- Voice assistant integration
- Backtesting framework

---

## Disclaimer

> This application is for **educational and informational purposes only**. It does not guarantee investment returns, execute trades, or constitute professional financial advice. Technical analysis is based on historical data and does not predict future price movements. Always consult a qualified financial advisor before making investment decisions. Past performance is not indicative of future results.

---

## License

MIT License — see [LICENSE](LICENSE) for details.
