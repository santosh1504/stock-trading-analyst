import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Bot, Loader2, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import type { ChatMessage as ChatMessageType } from '../types/stock';
import { ChatMessage } from '../components/ChatMessage';
import { ErrorBanner } from '../components/ErrorBanner';
import { Disclaimer } from '../components/Disclaimer';

const SUGGESTIONS = [
  "What is Apple's RSI right now?",
  "Is Microsoft bullish or bearish?",
  "Compare AAPL and MSFT technical strength.",
  "What does a Golden Cross mean?",
  "Should I buy NVDA based on technicals?",
  "Explain the Death Cross signal.",
];

interface MessageWithSources extends ChatMessageType {
  sources?: string[];
}

export default function AIAnalyst() {
  const [messages, setMessages] = useState<MessageWithSources[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm your AI Stock Analyst powered by Google Gemini. Ask me about any stock's technical indicators, RSI, moving averages, or trading signals. I'll fetch real market data to answer your questions.",
    },
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: MessageWithSources = { role: 'user', content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);
      setError(null);

      try {
        const history = messages.map(({ role, content }) => ({ role, content }));
        const res = await api.chat({ message: text.trim(), history });

        const aiMsg: MessageWithSources = {
          role: 'assistant',
          content: res.reply,
          sources: res.sources_used,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Chat failed. Please try again.');
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [loading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared. What would you like to know about the stock market?",
      },
    ]);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-radial-navy pt-20 pb-0 flex flex-col">
      <div className="max-w-3xl mx-auto w-full px-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between py-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bot className="text-cyan-400" size={24} aria-hidden="true" />
              AI <span className="gradient-text-cyan">Stock Analyst</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Powered by Google Gemini 2.5 Flash + real Twelve Data
            </p>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors p-2 rounded-lg hover:bg-white/5"
            aria-label="Clear chat history"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto space-y-4 pb-4"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              message={{ role: msg.role, content: msg.content }}
              sources={msg.sources}
            />
          ))}

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
              aria-label="AI is typing"
            >
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-green-400" aria-hidden="true" />
              </div>
              <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                    transition={{ duration: 0.8, delay, repeat: Infinity }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <div className="mb-3">
              <ErrorBanner message={error} onDismiss={() => setError(null)} />
            </div>
          )}
        </AnimatePresence>

        {/* Suggestions */}
        {messages.length <= 1 && !loading && (
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full glass border border-white/5
                  text-slate-400 hover:text-cyan-400 hover:border-cyan-500/25 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="pb-4 pt-2 border-t border-white/5">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              id="chat-input"
              type="text"
              placeholder="Ask about a stock… (e.g. What is AAPL's RSI?)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input-field flex-1"
              maxLength={1000}
              disabled={loading}
              aria-label="Chat message input"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="btn-primary px-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              ) : (
                <Send size={18} aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="mt-3">
            <Disclaimer />
          </div>
        </div>
      </div>
    </main>
  );
}
