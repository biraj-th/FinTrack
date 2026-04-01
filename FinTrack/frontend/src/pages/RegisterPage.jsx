import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
  { code: 'GBP', flag: '🇬🇧', name: 'British Pound' },
  { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'NPR', flag: '🇳🇵', name: 'Nepali Rupee' },
  { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen' },
  { code: 'CAD', flag: '🇨🇦', name: 'Canadian Dollar' },
  { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar' },
  { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar' },
  { code: 'CHF', flag: '🇨🇭', name: 'Swiss Franc' },
]

function PasswordStrength({ password }) {
  const checks = [
    { label: '6+ characters', ok: password.length >= 6 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
    { label: 'Special character', ok: /[!@#$%^&*]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']

  if (!password) return null

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-1.5">
        {[0,1,2,3].map(i => (
          <div key={i} className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${i < score ? colors[score-1] : 'bg-white/10'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.slice(0,2).map(c => (
            <span key={c.label} className={`text-[11px] flex items-center gap-1 ${c.ok ? 'text-emerald-400' : 'text-white/30'}`}>
              <Check size={9} strokeWidth={3} /> {c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span className={`text-[11px] font-medium ${colors[score-1].replace('bg-','text-')}`}>{labels[score-1]}</span>}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', currency: 'USD'
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.email || !form.email.includes('@')) e.email = 'Enter a valid email'
    if (!form.password || form.password.length < 6) e.password = 'Minimum 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ')
      await register(fullName, form.email, form.password, form.currency)
      toast.success('Account created! Welcome to FinTrack 🎉')
      navigate('/chat')
    } catch (err) {
      const msg = err.response?.data?.message || ''
      if (msg.includes('Email already')) {
        setErrors({ email: 'This email is already registered.' })
        toast.error('Email already in use')
      } else {
        toast.error('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
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
          <span className="text-sm text-white/40">Have an account?</span>
          <Link to="/login"
            className="text-sm font-medium border border-white/[0.1] text-white/60 hover:text-white hover:border-white/25 px-4 py-2 rounded-lg transition-all duration-200">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] animate-slide-up">
          <div className="border border-white/[0.08] rounded-2xl bg-white/[0.02] overflow-hidden">

            {/* Header */}
            <div className="px-8 pt-8 pb-0">
              <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xl mb-5">
                ✨
              </div>
              <h1 className="font-display text-xl font-bold tracking-tight mb-1">Create your account</h1>
              <p className="text-sm text-white/40">Start tracking your finances in seconds</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 font-mono">
                    First name <span className="text-red-400">*</span>
                  </label>
                  <input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)}
                    placeholder="John"
                    className={`w-full px-3.5 py-2.5 bg-black border rounded-lg text-sm text-white placeholder-white/20
                      focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200
                      ${errors.firstName ? 'border-red-500/40' : 'border-white/[0.1]'}`} />
                  {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 font-mono">
                    Last name
                  </label>
                  <input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)}
                    placeholder="Smith"
                    className="w-full px-3.5 py-2.5 bg-black border border-white/[0.1] rounded-lg text-sm text-white placeholder-white/20
                      focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 font-mono">
                  Email address <span className="text-red-400">*</span>
                </label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 bg-black border rounded-lg text-sm text-white placeholder-white/20
                    focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200
                    ${errors.email ? 'border-red-500/40' : 'border-white/[0.1]'}`} />
                {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 font-mono">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="Min. 6 characters"
                    className={`w-full px-4 py-2.5 pr-10 bg-black border rounded-lg text-sm text-white placeholder-white/20
                      focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200
                      ${errors.password ? 'border-red-500/40' : 'border-white/[0.1]'}`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>}
                <PasswordStrength password={form.password} />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 font-mono">
                  Currency
                </label>
                <select value={form.currency} onChange={e => set('currency', e.target.value)}
                  className="w-full px-4 py-2.5 bg-black border border-white/[0.1] rounded-lg text-sm text-white
                    focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200 cursor-pointer"
                  style={{ WebkitAppearance: 'none' }}>
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="group w-full flex items-center justify-center gap-2 py-3 mt-2
                           bg-white text-black text-sm font-semibold rounded-lg
                           hover:bg-white/90 transition-all duration-200 active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> Creating account…</>
                  : <><span>Create account</span><ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" /></>
                }
              </button>

              <p className="text-[11px] text-white/20 text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>

            {/* Footer */}
            <div className="px-8 pb-8 text-center">
              <p className="text-sm text-white/30">
                Already have an account?{' '}
                <Link to="/login" className="text-white font-medium border-b border-white/30 hover:border-white transition-colors pb-0.5">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
