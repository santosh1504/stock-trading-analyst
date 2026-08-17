import { motion } from 'framer-motion';
import { Database, Cpu, Shield, Zap, ExternalLink, Github } from 'lucide-react';

const TECH_STACK = [
  {
    category: 'Frontend',
    items: [
      { name: 'React 18 + TypeScript', desc: 'Component framework with strict typing' },
      { name: 'Vite',                  desc: 'Lightning-fast build tool and dev server' },
      { name: 'Tailwind CSS',          desc: 'Utility-first styling with custom design tokens' },
      { name: 'Framer Motion',         desc: 'Production-quality animations and transitions' },
      { name: 'Three.js + R3F + Drei', desc: '3D WebGL scene with lazy loading' },
      { name: 'Recharts',              desc: 'Responsive interactive price charts' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'FastAPI',                desc: 'High-performance Python REST API with Pydantic validation' },
      { name: 'LangChain',              desc: 'AI agent orchestration framework' },
      { name: 'Google Gemini 2.5 Flash', desc: 'State-of-the-art AI model for stock analysis' },
      { name: 'Twelve Data API',        desc: 'Real-time and historical stock market data' },
      { name: 'Pydantic v2',            desc: 'Request/response validation and serialization' },
    ],
  },
];

const LIMITATIONS = [
  'Free-tier Twelve Data: ~8 API calls/minute. Heavy usage may hit rate limits.',
  'AI analysis is educational — not a replacement for professional financial advice.',
  'RSI and SMA are lagging indicators. They do not predict future price movements.',
  'Market data has inherent delay (may be 15+ minutes behind real-time in free tier).',
  'Analysis quality depends on data availability for the queried ticker.',
];

const FUTURE = [
  'MACD and Bollinger Bands indicators',
  'News sentiment analysis',
  'Portfolio tracking and watchlists',
  'Price alert notifications',
  'Risk scoring and volatility metrics',
  'Candlestick pattern recognition',
  'Mobile app (React Native)',
  'User authentication and saved analyses',
  'Voice assistant integration',
];

const ITEM = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <main className="min-h-screen bg-radial-navy pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            About <span className="gradient-text-cyan">StockAI Analyst</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            An AI-powered educational tool for stock technical analysis, built with
            real market data, Google Gemini AI, and a premium 3D interface.
          </p>
        </motion.div>

        {/* Architecture */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          aria-label="Architecture overview"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Cpu size={20} className="text-cyan-400" aria-hidden="true" /> Architecture
          </h2>
          <motion.div variants={ITEM} className="glass rounded-2xl p-6">
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong className="text-cyan-400">User Request →</strong> React frontend sends
                ticker + question to FastAPI backend via <code className="font-mono text-xs bg-white/5 px-1 py-0.5 rounded">POST /api/analyze</code>.
              </p>
              <p>
                <strong className="text-cyan-400">Data Pipeline →</strong> Backend calls Twelve
                Data API for current price, 10-day history, 14-day RSI, 50/200-day SMA — all real,
                live market data.
              </p>
              <p>
                <strong className="text-cyan-400">AI Analysis →</strong> All indicators are passed
                to Google Gemini 2.5 Flash via LangChain. Gemini analyzes the full technical picture
                and returns a structured <code className="font-mono text-xs bg-white/5 px-1 py-0.5 rounded">BUY / SELL / HOLD</code> with
                confidence level and educational rationale.
              </p>
              <p>
                <strong className="text-cyan-400">Frontend →</strong> Structured response renders
                in the 3D glassmorphism UI: price chart, RSI gauge, SMA comparison, decision badge,
                and AI rationale.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
          aria-label="Technology stack"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Database size={20} className="text-cyan-400" aria-hidden="true" /> Technology Stack
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {TECH_STACK.map(({ category, items }) => (
              <motion.div key={category} variants={ITEM} className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-cyan-400 mb-4 text-sm uppercase tracking-wider">
                  {category}
                </h3>
                <ul className="space-y-3" role="list">
                  {items.map(({ name, desc }) => (
                    <li key={name}>
                      <p className="text-white text-sm font-medium">{name}</p>
                      <p className="text-slate-500 text-xs">{desc}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Security */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          aria-label="Security measures"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield size={20} className="text-cyan-400" aria-hidden="true" /> Security
          </h2>
          <motion.div variants={ITEM} className="glass rounded-2xl p-6">
            <ul className="space-y-2 text-sm text-slate-300" role="list">
              {[
                'API keys stored server-side only, never exposed to frontend.',
                'CORS configured to allowlist known origins.',
                'All inputs validated and sanitized via Pydantic v2.',
                'Errors return safe messages — no stack traces exposed.',
                'API timeouts prevent hanging requests.',
                '.env excluded from version control via .gitignore.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5" aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* Limitations */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          aria-label="Current limitations"
        >
          <h2 className="text-xl font-bold text-white mb-6">Current Limitations</h2>
          <motion.div variants={ITEM} className="glass rounded-2xl p-6">
            <ul className="space-y-2" role="list">
              {LIMITATIONS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-yellow-400 mt-0.5 shrink-0" aria-hidden="true">⚠</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* Future Features */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          aria-label="Future enhancements"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap size={20} className="text-cyan-400" aria-hidden="true" /> Future Enhancements
          </h2>
          <motion.div variants={ITEM} className="glass rounded-2xl p-6">
            <div className="flex flex-wrap gap-2">
              {FUTURE.map((item) => (
                <span
                  key={item}
                  className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/8 text-cyan-400/70
                    border border-cyan-500/15"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Disclaimer */}
        <div className="glass rounded-2xl p-5 border border-yellow-500/20 text-center">
          <p className="text-yellow-400/80 text-sm leading-relaxed">
            ⚠️ <strong>Financial Disclaimer:</strong> This is an educational and informational tool.
            It does not guarantee investment returns, execute trades, or constitute financial advice.
            Always consult a qualified financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </main>
  );
}
