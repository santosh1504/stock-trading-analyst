import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Trophy } from 'lucide-react';
import type { CompareResponse } from '../types/stock';
import { DecisionBadge } from './DecisionBadge';

interface ComparisonTableProps {
  data: CompareResponse;
}

type RowKey = 'current_price' | 'rsi' | 'rsi_status' | 'sma_50' | 'sma_200' | 'trend' | 'decision' | 'confidence';

const ROWS: { key: RowKey; label: string; format?: (v: unknown) => string }[] = [
  { key: 'current_price', label: 'Current Price',    format: (v) => `$${(v as number).toFixed(2)}` },
  { key: 'rsi',           label: 'RSI (14-day)',     format: (v) => (v as number).toFixed(2) },
  { key: 'rsi_status',    label: 'RSI Status' },
  { key: 'sma_50',        label: '50-Day SMA',       format: (v) => `$${(v as number).toFixed(2)}` },
  { key: 'sma_200',       label: '200-Day SMA',      format: (v) => `$${(v as number).toFixed(2)}` },
  { key: 'trend',         label: 'Trend Signal' },
  { key: 'decision',      label: 'AI Decision' },
  { key: 'confidence',    label: 'Confidence' },
];

function cellStyle(key: RowKey, value: unknown): string {
  if (key === 'decision') {
    const v = value as string;
    return v === 'BUY' ? 'text-green-400' : v === 'SELL' ? 'text-red-400' : 'text-yellow-400';
  }
  if (key === 'rsi_status') {
    const v = value as string;
    return v === 'Overbought' ? 'text-red-400' : v === 'Oversold' ? 'text-yellow-400' : 'text-cyan-400';
  }
  if (key === 'trend') {
    const v = value as string;
    return v.includes('Golden') ? 'text-green-400' : 'text-red-400';
  }
  if (key === 'confidence') {
    const v = value as string;
    return v === 'High' ? 'text-green-400' : v === 'Medium' ? 'text-yellow-400' : 'text-red-400';
  }
  return 'text-white';
}

export function ComparisonTable({ data }: ComparisonTableProps) {
  const { stock1, stock2, stronger_stock, comparison_rationale } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Winner banner */}
      <div className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left border border-green-400/30 glow-green">
        <Trophy className="text-yellow-400 shrink-0" size={32} />
        <div>
          <p className="text-slate-400 text-sm">Technically Stronger Stock</p>
          <p className="text-2xl font-bold gradient-text-green">{stronger_stock}</p>
        </div>
      </div>

      {/* Comparison table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm" role="table" aria-label="Stock comparison table">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-4 text-left text-slate-400 font-medium uppercase tracking-wider text-xs w-1/3">
                Metric
              </th>
              <th className="px-5 py-4 text-center text-cyan-400 font-semibold">
                {stock1.ticker}
                {stronger_stock === stock1.ticker && (
                  <span className="ml-2 text-yellow-400 text-xs">★</span>
                )}
              </th>
              <th className="px-5 py-4 text-center text-cyan-400 font-semibold">
                {stock2.ticker}
                {stronger_stock === stock2.ticker && (
                  <span className="ml-2 text-yellow-400 text-xs">★</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => {
              const v1 = stock1[row.key];
              const v2 = stock2[row.key];
              const f = row.format ?? ((v: unknown) => String(v));
              return (
                <tr
                  key={row.key}
                  className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${
                    i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'
                  }`}
                >
                  <td className="px-5 py-3.5 text-slate-400">{row.label}</td>
                  <td className={`px-5 py-3.5 text-center font-mono ${cellStyle(row.key, v1)}`}>
                    {row.key === 'trend' ? (
                      <span className="flex items-center justify-center gap-1">
                        {(v1 as string).includes('Golden') ? (
                          <TrendingUp size={13} />
                        ) : (
                          <TrendingDown size={13} />
                        )}
                        <span className="text-xs">{f(v1)}</span>
                      </span>
                    ) : (
                      f(v1)
                    )}
                  </td>
                  <td className={`px-5 py-3.5 text-center font-mono ${cellStyle(row.key, v2)}`}>
                    {row.key === 'trend' ? (
                      <span className="flex items-center justify-center gap-1">
                        {(v2 as string).includes('Golden') ? (
                          <TrendingUp size={13} />
                        ) : (
                          <TrendingDown size={13} />
                        )}
                        <span className="text-xs">{f(v2)}</span>
                      </span>
                    ) : (
                      f(v2)
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Decision badges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-xl p-4 flex flex-col items-center gap-3">
          <p className="text-slate-400 text-sm font-medium">{stock1.ticker}</p>
          <DecisionBadge decision={stock1.decision} confidence={stock1.confidence} />
        </div>
        <div className="glass rounded-xl p-4 flex flex-col items-center gap-3">
          <p className="text-slate-400 text-sm font-medium">{stock2.ticker}</p>
          <DecisionBadge decision={stock2.decision} confidence={stock2.confidence} />
        </div>
      </div>

      {/* Rationale */}
      <div className="glass rounded-2xl p-5">
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Comparison Analysis</p>
        <p className="text-slate-300 text-sm leading-relaxed">{comparison_rationale}</p>
      </div>
    </motion.div>
  );
}
