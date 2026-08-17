import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../types/stock';

interface ChatMessageProps {
  message: ChatMessageType;
  sources?: string[];
}

export function ChatMessage({ message, sources }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      role="article"
      aria-label={`${isUser ? 'Your' : 'AI'} message`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-cyan-500/20 border border-cyan-500/30'
            : 'bg-green-500/20 border border-green-500/30'
        }`}
        aria-hidden="true"
      >
        {isUser ? (
          <User size={14} className="text-cyan-400" />
        ) : (
          <Bot size={14} className="text-green-400" />
        )}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1.5 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-cyan-500/15 border border-cyan-500/25 text-white rounded-tr-sm'
              : 'glass border border-white/5 text-slate-300 rounded-tl-sm'
          }`}
        >
          {message.content}
        </div>

        {/* Sources (AI only) */}
        {!isUser && sources && sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1">
            {sources.map((source, i) => (
              <span
                key={i}
                className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5"
              >
                {source}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
