import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from '../services/api';

// Mock fetch globally using Vitest's stubGlobal
const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockFetch.mockClear();
});

describe('api.health', () => {
  it('calls /api/health endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'ok', message: 'Running' }),
    });
    const result = await api.health();
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/health',
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
    );
    expect(result.status).toBe('ok');
  });
});

describe('api.analyze', () => {
  it('posts to /api/analyze with ticker', async () => {
    const mockResponse = {
      ticker: 'AAPL',
      current_price: 175.5,
      historical_prices: [170, 172, 174, 175, 175.5, 174, 176, 175, 177, 175.5],
      historical_dates: ['2024-01-01'].concat(Array(9).fill('2024-01-02')),
      rsi: 55.5,
      rsi_status: 'Neutral',
      sma_50: 170,
      sma_200: 165,
      trend: 'Golden Cross / Bullish',
      decision: 'HOLD',
      confidence: 'Medium',
      rationale: 'Educational analysis only.',
    };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockResponse });
    const result = await api.analyze({ ticker: 'AAPL' });
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/analyze',
      expect.objectContaining({ method: 'POST' })
    );
    expect(result.ticker).toBe('AAPL');
    expect(result.decision).toBe('HOLD');
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: async () => ({ detail: 'Invalid ticker' }),
    });
    await expect(api.analyze({ ticker: 'INVALID' })).rejects.toThrow('Invalid ticker');
  });
});

describe('api.compare', () => {
  it('posts to /api/compare with both tickers', async () => {
    const stock = {
      ticker: 'AAPL', current_price: 175, historical_prices: [175], historical_dates: ['2024-01-01'],
      rsi: 55, rsi_status: 'Neutral', sma_50: 170, sma_200: 165,
      trend: 'Golden Cross / Bullish', decision: 'HOLD', confidence: 'Medium', rationale: 'Test.',
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        stock1: stock,
        stock2: { ...stock, ticker: 'MSFT' },
        stronger_stock: 'AAPL',
        comparison_rationale: 'AAPL leads.',
      }),
    });
    const result = await api.compare({ ticker1: 'AAPL', ticker2: 'MSFT' });
    expect(result.stronger_stock).toBe('AAPL');
  });
});

describe('api.chat', () => {
  it('posts to /api/chat', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'AAPL RSI is 55.', sources_used: ['Twelve Data'] }),
    });
    const result = await api.chat({ message: "What's AAPL RSI?" });
    expect(result.reply).toContain('RSI');
  });
});
