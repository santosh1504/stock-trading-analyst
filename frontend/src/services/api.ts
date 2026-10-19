
import type {
  StockAnalysis,
  AnalyzeRequest,
  CompareResponse,
  CompareRequest,
  ChatResponse,
  ChatRequest,
  HealthResponse,
} from '../types/stock';

const API_BASE = 'https://stock-trading-analyst-s83a.vercel.app/api';

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMessage = `Request failed (${res.status})`;

      try {
        const errData = await res.json();
        errorMessage = errData.detail || errorMessage;
      } catch {
        // Use default error message
      }

      throw new Error(errorMessage);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    throw err;
  }
}

export const api = {
  health(): Promise<HealthResponse> {
    return request<HealthResponse>('/health');
  },

  analyze(payload: AnalyzeRequest): Promise<StockAnalysis> {
    return request<StockAnalysis>('/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  compare(payload: CompareRequest): Promise<CompareResponse> {
    return request<CompareResponse>('/compare', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  chat(payload: ChatRequest): Promise<ChatResponse> {
    return request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
