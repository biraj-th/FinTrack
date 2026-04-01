import { useEffect, useState, useCallback } from 'react'
import { budgetApi } from '../api/client'
import { fmt, clsx } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import { Modal, ConfirmDialog, EmptyState, PageHeader, Spinner, ProgressBar, Field } from '../components/ui/index'
import { Plus, Pencil, Trash2, Wallet, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { format, addMonths } from 'date-fns'

const BUDGET_CATEGORIES = [
  'Food & Dining','Transportation','Shopping','Housing','Utilities',
  'Healthcare','Entertainment','Education','Travel','Subscriptions','Insurance','Other'
]
const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6']
const ICONS  = ['🛒','🚗','🏠','💡','🏥','🎬','✈️','📚','🔔','🛡️','💰','📦']

const EMPTY = {
  category: 'Food & Dining', limitAmount: '', description: '',
  startDate: format(new Date(), 'yyyy-MM-dd'),
  endDate:   format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
  period: 'MONTHLY', color: COLORS[0], icon: '🛒'
}

function BudgetForm({ initial = EMPTY, onSubmit, loading }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(p => ({...p, [k]: v}))

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category" required>
          <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
            {BUDGET_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Limit Amount" required>
          <input type="number" step="0.01" min="0.01" className="input" placeholder="0.00"
            value={form.limitAmount} onChange={e => set('limitAmount', e.target.value)} required />
        </Field>
        <Field label="Start Date" required>
          <input type="date" className="input" value={form.startDate}
            onChange={e => set('startDate', e.target.value)} required />
        </Field>
        <Field label="End Date" required>
          <input type="date" className="input" value={form.endDate}
            onChange={e => set('endDate', e.target.value)} required />
        </Field>
        <Field label="Period">
          <select className="input" value={form.period} onChange={e => set('period', e.target.value)}>
            {['WEEKLY','MONTHLY','QUARTERLY','YEARLY'].map(p => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Icon">
          <select className="input" value={form.icon} onChange={e => set('icon', e.target.value)}>
            {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
          </select>
        </Field>
        <div className="col-span-2">
          <Field label="Color">
            <div className="flex gap-2 flex-wrap mt-1">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => set('color', c)}
                  className={clsx('w-7 h-7 rounded-full transition-all', form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-surface scale-110' : '')}
                  style={{ background: c }} />
              ))}
            </div>
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Description">
            <input className="input" placeholder="Optional note" value={form.description || ''}
              onChange={e => set('description', e.target.value)} />
          </Field>
        </div>
      </div>
      <div className="flex justify-end pt-1">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? '⟳ Saving…' : 'Save Budget'}
        </button>
      </div>
    </form>
  )
}

function BudgetCard({ budget, currency, onEdit, onDelete }) {
  const pct = budget.percentageUsed || 0
  const over = pct >= 100
  const warn = pct >= 80 && pct < 100

  return (
    <div className="card-hover p-5 space-y-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
               style={{ background: (budget.color || '#6366f1') + '20' }}>
            {budget.icon || '💰'}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{budget.category}</div>
            <div className="text-xs text-slate-500">{budget.period} · {fmt.date(budget.startDate)} – {fmt.date(budget.endDate)}</div>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(budget)} className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"><Pencil size={13}/></button>
          <button onClick={() => onDelete(budget.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={13}/></button>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-slate-400">
            Spent: <span className="font-mono font-semibold text-white">{fmt.currency(budget.spentAmount, currency)}</span>
          </span>
          <span className={clsx('font-semibold font-mono', over ? 'text-red-400' : warn ? 'text-amber-400' : 'text-slate-300')}>
            {over ? '⚠ Over budget' : `${fmt.currency(budget.remainingAmount, currency)} left`}
          </span>
        </div>
        <ProgressBar value={pct} />
        <div className="flex justify-between text-xs mt-1.5 text-slate-500">
          <span>{pct.toFixed(1)}% used</span>
          <span>Limit: <span className="font-mono">{fmt.currency(budget.limitAmount, currency)}</span></span>
        </div>
      </div>

      {over && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
          <AlertTriangle size={12} />
          Over by {fmt.currency(Math.abs(budget.remainingAmount), currency)}
        </div>
      )}
    </div>
  )
}

export default function BudgetsPage() {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    budgetApi.getAll().then(r => setBudgets(r.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async form => {
    setSaving(true)
    try {
      const payload = { ...form, limitAmount: parseFloat(form.limitAmount) }
      if (editing) { await budgetApi.update(editing.id, payload); toast.success('Budget updated') }
      else { await budgetApi.create(payload); toast.success('Budget created') }
      setShowModal(false); setEditing(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await budgetApi.delete(deleteTarget); toast.success('Budget deleted'); setDeleteTarget(null); load() }
    catch { toast.error('Delete failed') } finally { setSaving(false) }
  }

  const currency = user?.currency || 'USD'
  const totalBudgeted = budgets.reduce((s, b) => s + (b.limitAmount || 0), 0)
  const totalSpent    = budgets.reduce((s, b) => s + (b.spentAmount  || 0), 0)

  return (
    <div className="space-y-5">
      <PageHeader title="Budgets" subtitle={`${budgets.length} budget${budgets.length !== 1 ? 's' : ''} active`}
        action={<button className="btn-primary" onClick={() => { setEditing(null); setShowModal(true) }}><Plus size={15}/> New Budget</button>} />

      {budgets.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Budgeted</p>
            <p className="text-2xl font-bold font-mono text-white">{fmt.compact(totalBudgeted, currency)}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Spent</p>
            <p className={clsx('text-2xl font-bold font-mono', totalSpent > totalBudgeted ? 'text-red-400' : 'text-emerald-400')}>
              {fmt.compact(totalSpent, currency)}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28}/></div>
      ) : budgets.length === 0 ? (
        <EmptyState icon={Wallet} title="No budgets yet"
          description="Set spending limits per category to stay on track."
          action={<button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={14}/> Create Budget</button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(b => (
            <BudgetCard key={b.id} budget={b} currency={currency}
              onEdit={b => { setEditing(b); setShowModal(true) }}
              onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditing(null) }}
        title={editing ? 'Edit Budget' : 'New Budget'} size="md">
        <BudgetForm initial={editing ? { ...editing, limitAmount: editing.limitAmount?.toString() } : EMPTY}
          onSubmit={handleSave} loading={saving} />
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={saving}
        title="Delete Budget" message="This budget will be permanently removed." />
    </div>
  )
}
