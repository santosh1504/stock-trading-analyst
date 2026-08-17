import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StockCard } from '../components/StockCard';
import type { StockAnalysis } from '../types/stock';

// Mock Three.js/R3F since Vitest runs in jsdom
vi.mock('../3d/Scene3D', () => ({ Scene3D: () => null }));

const MOCK_STOCK: StockAnalysis = {
  ticker: 'AAPL',
  current_price: 175.5,
  historical_prices: [170, 171, 172, 173, 174, 175, 174, 176, 175, 175.5],
  historical_dates: [
    '2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05',
    '2024-01-08', '2024-01-09', '2024-01-10', '2024-01-11', '2024-01-12',
  ],
  rsi: 55.5,
  rsi_status: 'Neutral',
  sma_50: 170.0,
  sma_200: 165.0,
  trend: 'Golden Cross / Bullish',
  decision: 'HOLD',
  confidence: 'Medium',
  rationale: 'AAPL shows neutral RSI and bullish crossover. Educational analysis only.',
};

describe('StockCard', () => {
  it('renders ticker symbol', () => {
    render(<StockCard data={MOCK_STOCK} />);
    expect(screen.getByText('AAPL')).toBeInTheDocument();
  });

  it('renders current price', () => {
    render(<StockCard data={MOCK_STOCK} />);
    expect(screen.getByText('$175.50')).toBeInTheDocument();
  });

  it('renders decision badge', () => {
    render(<StockCard data={MOCK_STOCK} />);
    expect(screen.getByText('HOLD')).toBeInTheDocument();
  });

  it('renders trend indicator', () => {
    render(<StockCard data={MOCK_STOCK} />);
    expect(screen.getByText('Golden Cross / Bullish')).toBeInTheDocument();
  });

  it('renders AI rationale', () => {
    render(<StockCard data={MOCK_STOCK} />);
    expect(screen.getByText(/neutral RSI/i)).toBeInTheDocument();
  });

  it('renders SMA values', () => {
    render(<StockCard data={MOCK_STOCK} />);
    expect(screen.getByText('$170.00')).toBeInTheDocument();
    expect(screen.getByText('$165.00')).toBeInTheDocument();
  });

  it('has accessible article role', () => {
    render(<StockCard data={MOCK_STOCK} />);
    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('aria-label', 'Stock analysis for AAPL');
  });
});
