import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import type { StockAnalysis, LoadingStep } from '../types/stock';
import { ANALYSIS_STEPS } from '../types/stock';
import { StockCard } from '../components/StockCard';
import { LoadingSteps } from '../components/LoadingSteps';
import { ErrorBanner } from '../components/ErrorBanner';
import { Disclaimer } from '../components/Disclaimer';

const EXAMPLE_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'];

function simulateSteps(setSteps: React.Dispatch<React.SetStateAction<LoadingStep[]>>) {
  const delays = [0, 800, 1600, 2800, 4000, 0]; // last one set on success
  ANALYSIS_STEPS.forEach((step, i) => {
    if (i < ANALYSIS_STEPS.length - 1) {
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, si) => ({
            ...s,
            status: si < i ? 'done' : si === i ? 'loading' : 'pending',
          }))
        );
      }, delays[i]);
    }
  });
}

export default function Dashboard() {
  const [ticker, setTicker]     = useState('');
  const [question, setQuestion] = useState('');
  const [steps, setSteps]       = useState<LoadingStep[]>(ANALYSIS_STEPS);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<StockAnalysis | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!ticker.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSteps(ANALYSIS_STEPS.map((s) => ({ ...s, status: 'pending' })));

    simulateSteps(setSteps);

    try {
      const data = await api.analyze({
        ticker: ticker.trim().toUpperCase(),
        question: question.trim() || undefined,
      });

      // Mark all done
      setSteps(ANALYSIS_STEPS.map((s) => ({ ...s, status: 'done' })));
      setResult(data);
    } catch (err) {
      setSteps((prev) =>
        prev.map((s) => ({
          ...s,
          status: s.status === 'loading' ? 'error' : s.status === 'pending' ? 'pending' : 'done',
        }))
      );
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [ticker, question]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  return (
    <main className="min-h-screen bg-radial-navy pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Stock <span className="gradient-text-cyan">Analysis Dashboard</span>
          </h1>
          <p className="text-slate-400">
            Enter a ticker symbol to get a full AI-powered technical analysis.
          </p>
        </motion.div>

        {/* Search card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="ticker-input"
                type="text"
                placeholder="Enter ticker (e.g. AAPL, MSFT)"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                className="input-field pl-10"
                maxLength={10}
                aria-label="Stock ticker symbol"
                autoComplete="off"
                spellCheck={false}
                disabled={loading}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !ticker.trim()}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              aria-label="Analyze stock"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <TrendingUp size={16} aria-hidden="true" />
              )}
              {loading ? 'Analyzing…' : 'Analyze'}
            </button>
          </div>

          {/* Optional question */}
          <input
            id="question-input"
            type="text"
            placeholder="Optional: Ask a specific question (e.g. Should I buy Apple?)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="input-field text-sm"
            maxLength={500}
            aria-label="Optional analysis question"
            disabled={loading}
          />

          {/* Example tickers */}
          <div className="flex flex-wrap gap-2 mt-3" aria-label="Example tickers">
            {EXAMPLE_TICKERS.map((t) => (
              <button
                key={t}
                onClick={() => setTicker(t)}
                className="px-3 py-1 text-xs font-mono rounded-lg bg-white/5 hover:bg-cyan-500/10
                  text-slate-400 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/25
                  transition-all duration-200"
                aria-label={`Use example ticker ${t}`}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <div className="mb-6">
              <ErrorBanner message={error} onDismiss={() => setError(null)} />
            </div>
          )}
        </AnimatePresence>

        {/* Loading steps */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-6 mb-8"
              role="status"
              aria-label="Analysis in progress"
            >
              <p className="text-slate-400 text-sm mb-4 font-medium">
                Analyzing {ticker}…
              </p>
              <LoadingSteps steps={steps} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StockCard data={result} />
              <div className="mt-6">
                <Disclaimer />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && !result && !error && (
          <div className="text-center py-16 text-slate-600">
            <TrendingUp size={48} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
            <p>Enter a ticker symbol above to start your analysis.</p>
          </div>
        )}
      </div>
    </main>
  );
}
