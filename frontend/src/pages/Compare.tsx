import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, Loader2, BarChart2 } from 'lucide-react';
import { api } from '../services/api';
import type { CompareResponse } from '../types/stock';
import { ComparisonTable } from '../components/ComparisonTable';
import { ErrorBanner } from '../components/ErrorBanner';
import { Disclaimer } from '../components/Disclaimer';

const EXAMPLE_PAIRS = [
  ['AAPL', 'MSFT'],
  ['GOOGL', 'AMZN'],
  ['TSLA', 'F'],
  ['NVDA', 'AMD'],
];

export default function Compare() {
  const [ticker1, setTicker1] = useState('');
  const [ticker2, setTicker2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<CompareResponse | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const handleCompare = useCallback(async () => {
    if (!ticker1.trim() || !ticker2.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.compare({
        ticker1: ticker1.trim().toUpperCase(),
        ticker2: ticker2.trim().toUpperCase(),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [ticker1, ticker2]);

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
            Stock <span className="gradient-text-cyan">Comparison</span>
          </h1>
          <p className="text-slate-400">
            Compare two stocks side-by-side to find the technically stronger one.
          </p>
        </motion.div>

        {/* Input card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="flex-1">
              <label htmlFor="ticker1-input" className="text-slate-400 text-xs uppercase tracking-wider mb-1.5 block">
                Stock 1
              </label>
              <input
                id="ticker1-input"
                type="text"
                placeholder="e.g. AAPL"
                value={ticker1}
                onChange={(e) => setTicker1(e.target.value.toUpperCase())}
                className="input-field font-mono"
                maxLength={10}
                disabled={loading}
                aria-label="First stock ticker symbol"
              />
            </div>

            <div className="flex items-end pb-0.5 justify-center">
              <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <ArrowLeftRight size={16} className="text-cyan-400" aria-hidden="true" />
              </div>
            </div>

            <div className="flex-1">
              <label htmlFor="ticker2-input" className="text-slate-400 text-xs uppercase tracking-wider mb-1.5 block">
                Stock 2
              </label>
              <input
                id="ticker2-input"
                type="text"
                placeholder="e.g. MSFT"
                value={ticker2}
                onChange={(e) => setTicker2(e.target.value.toUpperCase())}
                className="input-field font-mono"
                maxLength={10}
                disabled={loading}
                aria-label="Second stock ticker symbol"
              />
            </div>
          </div>

          {/* Example pairs */}
          <div className="flex flex-wrap gap-2 mt-4" aria-label="Example stock pairs">
            <span className="text-slate-500 text-xs self-center">Examples:</span>
            {EXAMPLE_PAIRS.map(([t1, t2]) => (
              <button
                key={`${t1}-${t2}`}
                onClick={() => { setTicker1(t1); setTicker2(t2); }}
                className="px-3 py-1 text-xs font-mono rounded-lg bg-white/5 hover:bg-cyan-500/10
                  text-slate-400 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/25
                  transition-all duration-200"
                aria-label={`Compare ${t1} vs ${t2}`}
              >
                {t1} vs {t2}
              </button>
            ))}
          </div>

          <button
            onClick={handleCompare}
            disabled={loading || !ticker1.trim() || !ticker2.trim()}
            className="btn-primary w-full mt-4 justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Comparing…</>
            ) : (
              <><BarChart2 size={16} aria-hidden="true" /> Compare Stocks</>
            )}
          </button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <div className="mb-6">
              <ErrorBanner message={error} onDismiss={() => setError(null)} />
            </div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 size={36} className="mx-auto text-cyan-400 animate-spin mb-4" aria-hidden="true" />
            <p className="text-slate-400">
              Analyzing {ticker1} and {ticker2}… This may take a few seconds.
            </p>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ComparisonTable data={result} />
              <div className="mt-6">
                <Disclaimer />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && !result && !error && (
          <div className="text-center py-16 text-slate-600">
            <ArrowLeftRight size={48} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
            <p>Enter two ticker symbols above to compare them.</p>
          </div>
        )}
      </div>
    </main>
  );
}
