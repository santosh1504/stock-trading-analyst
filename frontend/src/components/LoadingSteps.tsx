import { motion } from 'framer-motion';
import { Check, Loader2, AlertCircle, Clock } from 'lucide-react';
import type { LoadingStep } from '../types/stock';

interface LoadingStepsProps {
  steps: LoadingStep[];
}

const icons = {
  pending: Clock,
  loading: Loader2,
  done:    Check,
  error:   AlertCircle,
};

const colors = {
  pending: 'text-slate-500',
  loading: 'text-cyan-400 animate-spin',
  done:    'text-green-400',
  error:   'text-red-400',
};

const lineColors = {
  pending: 'bg-slate-700',
  loading: 'bg-cyan-400',
  done:    'bg-green-400',
  error:   'bg-red-400',
};

export function LoadingSteps({ steps }: LoadingStepsProps) {
  return (
    <div className="space-y-3" role="status" aria-live="polite" aria-label="Analysis progress">
      {steps.map((step, i) => {
        const Icon = icons[step.status];
        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3"
          >
            {/* Step line */}
            <div className="flex flex-col items-center">
              <div className={`w-1.5 h-1.5 rounded-full ${lineColors[step.status]}`} />
              {i < steps.length - 1 && (
                <div className={`w-px h-6 mt-1 ${lineColors[step.status]} opacity-40`} />
              )}
            </div>

            {/* Icon */}
            <Icon
              size={16}
              className={colors[step.status]}
              aria-hidden="true"
            />

            {/* Label */}
            <span
              className={`text-sm ${
                step.status === 'done'
                  ? 'text-green-400'
                  : step.status === 'loading'
                  ? 'text-cyan-300'
                  : step.status === 'error'
                  ? 'text-red-400'
                  : 'text-slate-500'
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
