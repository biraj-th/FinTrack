import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, TrendingUp, Shield, Bot, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const heroRef = useRef(null)

  const handleStart = () => {
    navigate(isAuthenticated ? '/chat' : '/login')
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight">
          <span className="w-2 h-2 rounded-full bg-white inline-block" />
          FinTrack
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-white/50 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200">
            Sign in
          </button>
          <button
            onClick={() => navigate('/register')}
            className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 transition-all duration-200 active:scale-95">
            Get started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-16">

        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 100%)',
          }}
        />

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

        <div className="relative z-10 text-center max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 border border-white/10 rounded-full px-4 py-2 mb-8
                          font-mono text-xs text-white/50 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            v2.0 — AI-Powered Finance Tracking
          </div>

          {/* Headline */}
          <h1 className="font-display text-[clamp(40px,7vw,80px)] font-extrabold leading-[1.04] tracking-[-3px]
                         animate-slide-up mb-6">
            Master your money
            <span className="block text-white/30">with intelligence</span>
          </h1>

          {/* Subtext */}
          <p className="text-base text-white/50 leading-relaxed max-w-lg mx-auto mb-10 font-light
                        animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Track budgets, investments, and savings goals — all in one place.
            Ask our AI anything about your finances, in plain language.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4 mb-12
                          animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={handleStart}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-black
                         text-[15px] font-semibold rounded-xl hover:bg-white/90
                         transition-all duration-200 active:scale-95
                         shadow-[0_8px_32px_rgba(255,255,255,0.1)]">
              Let's start
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/10
                         text-white/50 hover:text-white hover:border-white/25 hover:bg-white/[0.04]
                         text-[15px] font-medium rounded-xl transition-all duration-200">
              Create free account
            </button>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5
                          animate-slide-up" style={{ animationDelay: '0.25s' }}>
            {[
              { icon: BarChart3, label: 'Budget tracking' },
              { icon: TrendingUp, label: 'Investments' },
              { icon: Bot, label: 'AI assistant' },
              { icon: Shield, label: 'Secure & private' },
            ].map(({ icon: Icon, label }) => (
              <div key={label}
                className="flex items-center gap-2 border border-white/[0.08] rounded-lg px-3.5 py-2
                           text-xs text-white/40">
                <Icon size={12} className="text-white/30" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 w-full max-w-2xl mx-auto mt-16 pt-10
                        border-t border-white/[0.06] animate-slide-up"
             style={{ animationDelay: '0.3s' }}>
          <div className="grid grid-cols-4 gap-8 text-center">
            {[
              { num: '50K+', label: 'Active users' },
              { num: '$2.4B', label: 'Assets tracked' },
              { num: '99.9%', label: 'Uptime' },
              { num: '4.9★', label: 'User rating' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-display text-2xl font-extrabold tracking-tight">{num}</div>
                <div className="text-xs text-white/30 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="px-6 py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight mb-3">
              Everything you need
            </h2>
            <p className="text-white/40 text-sm">Built for people who take their finances seriously</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: BarChart3,
                title: 'Smart budgeting',
                desc: 'Set spending limits per category and get real-time alerts when you\'re close to your limit.',
              },
              {
                icon: TrendingUp,
                title: 'Investment portfolio',
                desc: 'Track stocks, ETFs, crypto, and more. See your gain/loss and portfolio allocation at a glance.',
              },
              {
                icon: Bot,
                title: 'AI finance assistant',
                desc: 'Ask anything in plain English. Get personalized insights, tips, and answers about your money.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="border border-white/[0.08] rounded-2xl p-6 bg-white/[0.02]
                           hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mb-4
                                group-hover:bg-white/10 transition-all duration-200">
                  <Icon size={16} className="text-white/60" />
                </div>
                <h3 className="font-display font-bold text-base mb-2 tracking-tight">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="px-6 py-20 border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight mb-4">
            Ready to take control?
          </h2>
          <p className="text-white/40 text-sm mb-8">
            Join thousands already mastering their finances with FinTrack.
          </p>
          <button
            onClick={handleStart}
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-black
                       text-base font-semibold rounded-xl hover:bg-white/90
                       transition-all duration-200 active:scale-95">
            {isAuthenticated ? 'Go to dashboard' : 'Get started free'}
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display font-extrabold text-sm text-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          FinTrack
        </div>
        <p className="text-xs text-white/20">© 2025 FinTrack. All rights reserved.</p>
      </footer>

    </div>
  )
}
