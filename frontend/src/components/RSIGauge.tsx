import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { RSIStatus } from '../types/stock';

interface RSIGaugeProps {
  value: number;
  status: RSIStatus;
}

const STATUS_COLORS: Record<RSIStatus, { stroke: string; text: string; glow: string }> = {
  Overbought: { stroke: '#f87171', text: 'text-red-400',   glow: 'rgba(248,113,113,0.3)' },
  Neutral:    { stroke: '#00d4ff', text: 'text-cyan-400',  glow: 'rgba(0,212,255,0.3)'   },
  Oversold:   { stroke: '#fbbf24', text: 'text-yellow-400', glow: 'rgba(251,191,36,0.3)' },
};

const STATUS_LABELS: Record<RSIStatus, string> = {
  Overbought: 'Overbought — Consider caution',
  Neutral:    'Neutral — Balanced momentum',
  Oversold:   'Oversold — Potential opportunity',
};

export function RSIGauge({ value, status }: RSIGaugeProps) {
  const colors = STATUS_COLORS[status];

  // SVG arc math
  const R = 70;
  const cx = 90, cy = 90;
  const startAngle = 180; // left
  const endAngle = 0;     // right (full = 180 degrees)

  const valueAngle = startAngle - (value / 100) * 180;

  const arcPath = useMemo(() => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const sx = cx + R * Math.cos(toRad(startAngle));
    const sy = cy + R * Math.sin(toRad(startAngle));
    const vx = cx + R * Math.cos(toRad(valueAngle));
    const vy = cy + R * Math.sin(toRad(valueAngle));
    return `M ${sx} ${sy} A ${R} ${R} 0 0 1 ${vx} ${vy}`;
  }, [value, valueAngle]);

  const bgArcPath = useMemo(() => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const sx = cx + R * Math.cos(toRad(startAngle));
    const sy = cy + R * Math.sin(toRad(startAngle));
    const ex = cx + R * Math.cos(toRad(endAngle));
    const ey = cy + R * Math.sin(toRad(endAngle));
    return `M ${sx} ${sy} A ${R} ${R} 0 0 1 ${ex} ${ey}`;
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width="180"
        height="120"
        viewBox="0 0 180 120"
        aria-label={`RSI gauge showing ${value.toFixed(1)}, status: ${status}`}
        role="img"
      >
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Zone labels */}
        <text x="10" y="112" fill="#94a3b8" fontSize="10" fontFamily="Inter">Oversold</text>
        <text x="90" y="12" fill="#94a3b8" fontSize="10" fontFamily="Inter" textAnchor="middle">
          50
        </text>
        <text x="170" y="112" fill="#94a3b8" fontSize="10" fontFamily="Inter" textAnchor="end">Overbought</text>

        {/* Zone markers */}
        <line x1="20" y1="90" x2="20" y2="100" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
        <line x1="90" y1="20" x2="90" y2="12" stroke="#64748b" strokeWidth="1" opacity="0.5" />
        <line x1="160" y1="90" x2="160" y2="100" stroke="#f87171" strokeWidth="1" opacity="0.5" />

        {/* Background arc */}
        <path d={bgArcPath} fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />

        {/* Colored value arc */}
        <motion.path
          d={arcPath}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Needle dot */}
        <motion.circle
          cx={cx + R * Math.cos((valueAngle * Math.PI) / 180)}
          cy={cy + R * Math.sin((valueAngle * Math.PI) / 180)}
          r={5}
          fill={colors.stroke}
          filter="url(#glow)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
        />
      </svg>

      {/* Value label */}
      <div className="text-center">
        <p className={`font-mono text-3xl font-bold ${colors.text}`}>{value.toFixed(1)}</p>
        <p className={`text-xs mt-1 ${colors.text} opacity-80`}>{STATUS_LABELS[status]}</p>
      </div>
    </div>
  );
}
