import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';

interface PriceChartProps {
  prices: number[];
  dates: string[];
  ticker: string;
}

interface TooltipPayload {
  value: number;
  payload: { date: string; price: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const { date, price } = payload[0].payload;
  return (
    <div className="glass px-3 py-2 text-xs">
      <p className="text-slate-400">{date}</p>
      <p className="font-mono font-bold text-cyan-400">${price.toFixed(2)}</p>
    </div>
  );
}

export function PriceChart({ prices, dates, ticker }: PriceChartProps) {
  const data = prices.map((price, i) => ({
    date: dates[i]?.slice(5) ?? `Day ${i + 1}`, // Show MM-DD
    price,
  }));

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const isUptrend = prices[prices.length - 1] >= prices[0];
  const color = isUptrend ? '#00ff88' : '#f87171';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      role="img"
      aria-label={`10-day price chart for ${ticker}`}
    >
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`grad-${ticker}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0}  />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[min * 0.995, max * 1.005]}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#grad-${ticker})`}
            dot={false}
            activeDot={{ r: 5, fill: color, stroke: '#0a0e1a', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
