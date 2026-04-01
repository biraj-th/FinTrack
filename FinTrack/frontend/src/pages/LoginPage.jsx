import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/chat'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.email || !form.email.includes('@')) e.email = 'Enter a valid email address'
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error('Invalid email or password')
      setErrors({ general: 'Invalid email or password. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setForm({ email: 'demo@fintrack.app', password: 'demo123' })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06]">
        <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight">
          <span className="w-2 h-2 rounded-full bg-white inline-block" />
          FinTrack
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/40">No account?</span>
          <Link to="/register"
            className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 transition-all duration-200">
            Sign up free
          </Link>
        </div>
      </nav>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px] animate-slide-up">

          {/* Card */}
          <div className="border border-white/[0.08] rounded-2xl bg-white/[0.02] overflow-hidden">

            {/* Header */}
            <div className="px-8 pt-8 pb-0">
              <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xl mb-5">
                🔑
              </div>
              <h1 className="font-display text-xl font-bold tracking-tight mb-1">Welcome back</h1>
              <p className="text-sm text-white/40">Sign in to your FinTrack account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">

              {errors.general && (
                <div className="bg-red-500/[0.08] border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                  {errors.general}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 font-mono">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 bg-black border rounded-lg text-sm text-white placeholder-white/20
                    focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200
                    ${errors.email ? 'border-red-500/40' : 'border-white/[0.1]'}`}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 font-mono">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 pr-10 bg-black border rounded-lg text-sm text-white placeholder-white/20
                      focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200
                      ${errors.password ? 'border-red-500/40' : 'border-white/[0.1]'}`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="group w-full flex items-center justify-center gap-2 py-3 mt-2
                           bg-white text-black text-sm font-semibold rounded-lg
                           hover:bg-white/90 transition-all duration-200 active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> Signing in…</>
                  : <><span>Sign in</span><ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" /></>
                }
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-xs text-white/20">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Demo login */}
              <button type="button" onClick={fillDemo}
                className="w-full py-2.5 border border-white/[0.08] text-white/40 hover:text-white/70
                           hover:border-white/20 hover:bg-white/[0.03] text-sm rounded-lg transition-all duration-200">
                Continue with demo account
              </button>
            </form>

            {/* Footer */}
            <div className="px-8 pb-8 text-center">
              <p className="text-sm text-white/30">
                Don't have an account?{' '}
                <Link to="/register" className="text-white font-medium border-b border-white/30 hover:border-white transition-colors pb-0.5">
                  Create one free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
