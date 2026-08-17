import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3 glass rounded-xl p-4 border border-red-500/30 bg-red-500/8"
      role="alert"
      aria-live="assertive"
    >
      <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-red-300 text-sm flex-1 leading-relaxed">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400/60 hover:text-red-400 transition-colors p-0.5"
          aria-label="Dismiss error"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
}
