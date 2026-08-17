import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart2, MessageSquare, ArrowRight, Activity, Shield, Zap } from 'lucide-react';
import { Scene3D } from '../3d/Scene3D';
import { Disclaimer } from '../components/Disclaimer';

const FEATURES = [
  { icon: Activity,      title: 'Real-Time Data',    desc: 'Live stock prices and technical indicators via Twelve Data API.' },
  { icon: BarChart2,     title: 'RSI & SMA Analysis', desc: '14-day RSI, 50-day & 200-day SMAs, Golden/Death Cross signals.' },
  { icon: TrendingUp,    title: 'AI-Powered Decisions', desc: 'Google Gemini 2.5 Flash analyzes all indicators for BUY/SELL/HOLD.' },
  { icon: MessageSquare, title: 'AI Chat Analyst',   desc: 'Ask questions about any stock and get real data-backed answers.' },
  { icon: Shield,        title: 'Transparent & Honest', desc: 'No fake data, no guaranteed returns. Educational analysis only.' },
  { icon: Zap,           title: 'Side-by-Side Comparison', desc: 'Compare two stocks to find the technically stronger position.' },
];

const CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const ITEM = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-radial-navy">
      {/* ── Hero ── */}
      <section
        className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        aria-label="Hero section"
      >
        <Scene3D />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium
              bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Powered by Google Gemini 2.5 Flash + Twelve Data
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 gradient-text-hero">
              Understand the Market.{' '}
              <br className="hidden sm:block" />
              Let AI Do the Analysis.
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
              Analyze real-time stock data and technical indicators with an AI-powered stock analyst.
              Get BUY / SELL / HOLD signals backed by RSI, SMA, and Gemini AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analyze" className="btn-primary text-base px-8 py-3.5">
                <TrendingUp size={18} />
                Analyze a Stock
                <ArrowRight size={16} />
              </Link>
              <Link to="/compare" className="btn-secondary text-base px-8 py-3.5">
                <BarChart2 size={18} />
                Compare Stocks
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          aria-hidden="true"
        >
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-slate-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto" aria-label="Features">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to{' '}
            <span className="gradient-text-cyan">Analyze Stocks</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Real market data. Real AI analysis. No fake signals, no guaranteed returns.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={CONTAINER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={ITEM}
              className="glass glass-hover rounded-2xl p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Icon size={20} className="text-cyan-400" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center" aria-label="Call to action">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl max-w-2xl mx-auto p-12 border border-cyan-500/15"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Analyze Your First Stock?
          </h2>
          <p className="text-slate-400 mb-8">
            Enter any ticker symbol and get a full AI-powered technical analysis in seconds.
          </p>
          <Link to="/analyze" className="btn-primary text-base px-10 py-4">
            <TrendingUp size={18} />
            Get Started Free
            <ArrowRight size={16} />
          </Link>
        </motion.div>
        <div className="mt-10 max-w-2xl mx-auto">
          <Disclaimer />
        </div>
      </section>
    </main>
  );
}
