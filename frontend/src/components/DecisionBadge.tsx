import { motion } from 'framer-motion';
import type { Decision, Confidence } from '../types/stock';

interface DecisionBadgeProps {
  decision: Decision;
  confidence: Confidence;
  large?: boolean;
}

const DECISION_CONFIG: Record<Decision, { bg: string; text: string; border: string; glow: string; label: string }> = {
  BUY: {
    bg:     'rgba(0,255,136,0.12)',
    text:   '#00ff88',
    border: 'rgba(0,255,136,0.5)',
    glow:   '0 0 30px rgba(0,255,136,0.4)',
    label:  'Buy Signal',
  },
  SELL: {
    bg:     'rgba(239,68,68,0.12)',
    text:   '#f87171',
    border: 'rgba(239,68,68,0.5)',
    glow:   '0 0 30px rgba(239,68,68,0.4)',
    label:  'Sell Signal',
  },
  HOLD: {
    bg:     'rgba(251,191,36,0.12)',
    text:   '#fbbf24',
    border: 'rgba(251,191,36,0.5)',
    glow:   '0 0 30px rgba(251,191,36,0.4)',
    label:  'Hold Signal',
  },
};

const CONFIDENCE_CONFIG: Record<Confidence, { color: string; dots: number }> = {
  High:   { color: '#00ff88', dots: 3 },
  Medium: { color: '#fbbf24', dots: 2 },
  Low:    { color: '#f87171', dots: 1 },
};

export function DecisionBadge({ decision, confidence, large = false }: DecisionBadgeProps) {
  const dc = DECISION_CONFIG[decision];
  const cc = CONFIDENCE_CONFIG[confidence];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="flex flex-col items-center gap-3"
      role="status"
      aria-label={`AI decision: ${decision}, confidence: ${confidence}`}
    >
      {/* Main decision badge */}
      <motion.div
        style={{
          background: dc.bg,
          border: `2px solid ${dc.border}`,
          boxShadow: dc.glow,
          color: dc.text,
        }}
        className={`rounded-2xl font-bold tracking-widest uppercase ${
          large ? 'px-12 py-5 text-5xl' : 'px-8 py-4 text-3xl'
        }`}
        animate={{ boxShadow: [dc.glow, dc.glow.replace('0.4', '0.6'), dc.glow] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {decision}
      </motion.div>

      {/* Confidence indicator */}
      <div className="flex items-center gap-2">
        <span className="text-slate-400 text-sm">Confidence:</span>
        <div className="flex gap-1.5" aria-label={`${confidence} confidence`}>
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                background: dot <= cc.dots ? cc.color : '#1e293b',
                boxShadow: dot <= cc.dots ? `0 0 6px ${cc.color}` : 'none',
              }}
            />
          ))}
        </div>
        <span className="font-semibold text-sm" style={{ color: cc.color }}>
          {confidence}
        </span>
      </div>
    </motion.div>
  );
}
