// TypeScript interfaces for all API responses and requests

export type Decision = 'BUY' | 'SELL' | 'HOLD';
export type Confidence = 'High' | 'Medium' | 'Low';
export type RSIStatus = 'Overbought' | 'Oversold' | 'Neutral';

export interface HealthResponse {
  status: string;
  message: string;
}

export interface AnalyzeRequest {
  ticker: string;
  question?: string;
}

export interface StockAnalysis {
  ticker: string;
  current_price: number;
  historical_prices: number[];
  historical_dates: string[];
  rsi: number;
  rsi_status: RSIStatus;
  sma_50: number;
  sma_200: number;
  trend: string;
  decision: Decision;
  confidence: Confidence;
  rationale: string;
}

export interface CompareRequest {
  ticker1: string;
  ticker2: string;
  question?: string;
}

export interface CompareResponse {
  stock1: StockAnalysis;
  stock2: StockAnalysis;
  stronger_stock: string;
  comparison_rationale: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  sources_used: string[];
}

export interface APIError {
  detail: string;
}

export type LoadingStep = {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'done' | 'error';
};

export const ANALYSIS_STEPS: LoadingStep[] = [
  { id: 'price',   label: 'Fetching current price',       status: 'pending' },
  { id: 'history', label: 'Loading price history',        status: 'pending' },
  { id: 'rsi',     label: 'Calculating RSI (14-day)',     status: 'pending' },
  { id: 'sma',     label: 'Checking SMA 50/200',          status: 'pending' },
  { id: 'ai',      label: 'AI analyzing indicators',      status: 'pending' },
  { id: 'done',    label: 'Analysis complete',            status: 'pending' },
];
