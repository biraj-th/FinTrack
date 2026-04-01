import { X, Loader2, AlertTriangle } from 'lucide-react'
import { clsx } from '../../utils/helpers'

// ── Modal ─────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative card w-full animate-scale-in', sizes[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-surface-hover transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  )
}

// ── Confirm Dialog ────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-sm animate-scale-in p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="btn-danger">
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Loading Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return <Loader2 size={size} className="animate-spin text-brand-400" />
}

// ── Empty State ───────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
        <Icon size={28} className="text-slate-500" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
      {action}
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon: Icon, color = 'brand', trend }) {
  const colors = {
    brand:   { bg: 'bg-brand-500/10',   icon: 'text-brand-400',   ring: 'ring-brand-500/20' },
    green:   { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', ring: 'ring-emerald-500/20' },
    red:     { bg: 'bg-red-500/10',     icon: 'text-red-400',     ring: 'ring-red-500/20' },
    purple:  { bg: 'bg-purple-500/10',  icon: 'text-purple-400',  ring: 'ring-purple-500/20' },
    amber:   { bg: 'bg-amber-500/10',   icon: 'text-amber-400',   ring: 'ring-amber-500/20' },
    cyan:    { bg: 'bg-cyan-500/10',    icon: 'text-cyan-400',    ring: 'ring-cyan-500/20' },
  }
  const c = colors[color] || colors.brand
  return (
    <div className="stat-card hover:border-surface-hover transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center ring-1', c.bg, c.ring)}>
          <Icon size={16} className={c.icon} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-white tracking-tight font-mono">{value}</div>
        {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
      </div>
      {trend !== undefined && (
        <div className={clsx('text-xs font-medium', trend >= 0 ? 'text-emerald-400' : 'text-red-400')}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}% this month
        </div>
      )}
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color, showLabel = true, height = 'h-2' }) {
  const pct = Math.min((value / max) * 100, 100)
  const getColor = (p) => {
    if (color) return color
    if (p >= 90) return 'bg-red-500'
    if (p >= 70) return 'bg-amber-500'
    return 'bg-brand-500'
  }
  return (
    <div className="w-full">
      <div className={clsx('w-full bg-surface rounded-full overflow-hidden', height)}>
        <div
          className={clsx('h-full rounded-full transition-all duration-700', getColor(pct))}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────
export function Badge({ children, color = 'slate' }) {
  const colors = {
    slate:   'bg-slate-500/10 text-slate-400',
    green:   'bg-emerald-500/10 text-emerald-400',
    red:     'bg-red-500/10 text-red-400',
    blue:    'bg-blue-500/10 text-blue-400',
    purple:  'bg-purple-500/10 text-purple-400',
    amber:   'bg-amber-500/10 text-amber-400',
    brand:   'bg-brand-500/10 text-brand-400',
  }
  return (
    <span className={clsx('badge', colors[color] || colors.slate)}>
      {children}
    </span>
  )
}

// ── Form Field ────────────────────────────────────────────────────────
export function Field({ label, error, children, required }) {
  return (
    <div>
      {label && (
        <label className="label">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────────────
export function Select({ children, ...props }) {
  return (
    <select {...props} className={clsx('input', props.className)}>
      {children}
    </select>
  )
}

// ── Page Header ───────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
