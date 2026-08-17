import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart2 } from 'lucide-react';
import type { StockAnalysis } from '../types/stock';
import { DecisionBadge } from './DecisionBadge';
import { RSIGauge } from './RSIGauge';
import { PriceChart } from './PriceChart';

interface StockCardProps {
  data: StockAnalysis;
  compact?: boolean;
}

export function StockCard({ data, compact = false }: StockCardProps) {
  const isBullish = data.trend.includes('Golden Cross') || data.trend.includes('Bullish');
  const priceChange =
    data.historical_prices.length >= 2
      ? data.historical_prices[data.historical_prices.length - 1] - data.historical_prices[0]
      : 0;
  const pctChange =
    data.historical_prices.length >= 2
      ? (priceChange / data.historical_prices[0]) * 100
      : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass glass-hover rounded-2xl p-6 space-y-6"
      aria-label={`Stock analysis for ${data.ticker}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold gradient-text-cyan">{data.ticker}</h2>
          <p className="text-slate-400 text-sm mt-0.5">Technical Analysis Summary</p>
        </div>
        <DecisionBadge decision={data.decision} confidence={data.confidence} />
      </div>

      {/* Price row */}
      <div className="flex items-center gap-6 flex-wrap">
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign size={12} /> Current Price
          </p>
          <p className="font-mono text-3xl font-bold text-white mt-1">
            ${data.current_price.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider">10-Day Change</p>
          <p
            className={`font-mono text-lg font-semibold mt-1 flex items-center gap-1 ${
              priceChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {priceChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {priceChange >= 0 ? '+' : ''}
            {priceChange.toFixed(2)} ({pctChange >= 0 ? '+' : ''}
            {pctChange.toFixed(1)}%)
          </p>
        </div>
      </div>

      {/* Chart */}
      {!compact && (
        <section aria-label="Price history chart">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <BarChart2 size={12} /> 10-Day Price History
          </p>
          <PriceChart prices={data.historical_prices} dates={data.historical_dates} ticker={data.ticker} />
        </section>
      )}

      {/* Indicators grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* RSI */}
        <div className="glass rounded-xl p-4 flex flex-col items-center">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Activity size={12} /> RSI (14-day)
          </p>
          <RSIGauge value={data.rsi} status={data.rsi_status} />
        </div>

        {/* SMA */}
        <div className="glass rounded-xl p-4 space-y-3">
          <p className="text-slate-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp size={12} /> Moving Averages
          </p>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">50-Day SMA</span>
              <span className="font-mono font-semibold text-cyan-400">
                ${data.sma_50.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">200-Day SMA</span>
              <span className="font-mono font-semibold text-cyan-400">
                ${data.sma_200.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Trend badge */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
              isBullish
                ? 'bg-green-400/10 text-green-400 border border-green-400/30'
                : 'bg-red-400/10 text-red-400 border border-red-400/30'
            }`}
          >
            {isBullish ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {data.trend}
          </div>
        </div>
      </div>

      {/* AI Rationale */}
      <div className="glass rounded-xl p-4">
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">AI Analysis Rationale</p>
        <p className="text-slate-300 text-sm leading-relaxed">{data.rationale}</p>
      </div>
    </motion.article>
  );
}
