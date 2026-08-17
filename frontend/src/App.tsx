import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import Home      from './pages/Home';
import Dashboard from './pages/Dashboard';
import Compare   from './pages/Compare';
import AIAnalyst from './pages/AIAnalyst';
import About     from './pages/About';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"        element={<Home />} />
        <Route path="/analyze" element={<Dashboard />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/chat"    element={<AIAnalyst />} />
        <Route path="/about"   element={<About />} />
        {/* 404 fallback */}
        <Route path="*" element={
          <main className="min-h-screen bg-radial-navy flex flex-col items-center justify-center text-center px-4 pt-20">
            <h1 className="text-6xl font-bold gradient-text-cyan mb-4">404</h1>
            <p className="text-slate-400 mb-8">Page not found.</p>
            <a href="/" className="btn-primary">Go Home</a>
          </main>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-navy-950 text-white">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}
