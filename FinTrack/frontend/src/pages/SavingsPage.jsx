import { useEffect, useState, useCallback } from 'react'
import { savingsApi } from '../api/client'
import { fmt, clsx } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import { Modal, ConfirmDialog, EmptyState, PageHeader, Spinner, ProgressBar, Field } from '../components/ui/index'
import { Plus, Pencil, Trash2, PiggyBank, Target, CheckCircle2, Clock, PauseCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { format, addMonths } from 'date-fns'

const ICONS  = ['🏖️','🚗','🏠','💻','💍','✈️','🎓','🏥','📦','🎯','💰','🌍']
const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6']
const EMPTY  = { name:'', description:'', targetAmount:'', currentAmount:'0', targetDate: format(addMonths(new Date(), 6), 'yyyy-MM-dd'), status:'ACTIVE', icon:'🎯', color: COLORS[0] }

const STATUS_BADGE = {
  ACTIVE:    { label:'Active',    icon: Clock,         cls: 'bg-brand-500/10 text-brand-400' },
  COMPLETED: { label:'Completed', icon: CheckCircle2,  cls: 'bg-emerald-500/10 text-emerald-400' },
  PAUSED:    { label:'Paused',    icon: PauseCircle,   cls: 'bg-amber-500/10 text-amber-400' },
  CANCELLED: { label:'Cancelled', icon: Target,        cls: 'bg-slate-500/10 text-slate-400' },
}

function GoalForm({ initial = EMPTY, onSubmit, loading }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(p => ({...p, [k]: v}))
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Field label="Goal Name" required><input className="input" placeholder="e.g. Emergency Fund" value={form.name} onChange={e => set('name', e.target.value)} required /></Field></div>
        <Field label="Target Amount" required><input type="number" step="0.01" min="0.01" className="input" placeholder="0.00" value={form.targetAmount} onChange={e => set('targetAmount', e.target.value)} required /></Field>
        <Field label="Current Amount"><input type="number" step="0.01" min="0" className="input" placeholder="0.00" value={form.currentAmount} onChange={e => set('currentAmount', e.target.value)} /></Field>
        <Field label="Target Date" required><input type="date" className="input" value={form.targetDate} onChange={e => set('targetDate', e.target.value)} required /></Field>
        <Field label="Status">
          <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
            {['ACTIVE','PAUSED','CANCELLED'].map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Icon">
          <select className="input" value={form.icon} onChange={e => set('icon', e.target.value)}>
            {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
          </select>
        </Field>
        <div className="col-span-2"><Field label="Color">
          <div className="flex gap-2 flex-wrap mt-1">
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => set('color', c)}
                className={clsx('w-7 h-7 rounded-full transition-all', form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-surface scale-110' : '')}
                style={{ background: c }} />
            ))}
          </div>
        </Field></div>
        <div className="col-span-2"><Field label="Description"><textarea className="input resize-none h-14" placeholder="What are you saving for?" value={form.description || ''} onChange={e => set('description', e.target.value)} /></Field></div>
      </div>
      <div className="flex justify-end pt-1">
        <button type="submit" disabled={loading} className="btn-primary">{loading ? '⟳ Saving…' : 'Save Goal'}</button>
      </div>
    </form>
  )
}

function AddFundsModal({ goal, open, onClose, onAdd, currency }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async e => {
    e.preventDefault()
    const val = parseFloat(amount)
    if (!val || val <= 0) { toast.error('Enter a valid amount'); return }
    setLoading(true)
    try { await onAdd(goal.id, val); setAmount(''); onClose() }
    finally { setLoading(false) }
  }
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-sm animate-scale-in p-6">
        <h3 className="text-sm font-semibold text-white mb-1">Add Funds to "{goal?.name}"</h3>
        <p className="text-xs text-slate-500 mb-4">Current: {fmt.currency(goal?.currentAmount, currency)} / {fmt.currency(goal?.targetAmount, currency)}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="number" step="0.01" min="0.01" className="input" placeholder="Amount to add"
            value={amount} onChange={e => setAmount(e.target.value)} autoFocus required />
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? '⟳' : 'Add Funds'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function GoalCard({ goal, currency, onEdit, onDelete, onAddFunds }) {
  const sb = STATUS_BADGE[goal.status] || STATUS_BADGE.ACTIVE
  const StatusIcon = sb.icon
  const pct = goal.progressPercentage || 0

  return (
    <div className="card-hover p-5 space-y-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
               style={{ background: (goal.color || '#6366f1') + '20' }}>
            {goal.icon || '🎯'}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{goal.name}</div>
            {goal.description && <div className="text-xs text-slate-500 truncate max-w-[160px]">{goal.description}</div>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className={clsx('badge text-xs', sb.cls)}>
            <StatusIcon size={10} /> {sb.label}
          </span>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="font-mono font-semibold text-white">{fmt.currency(goal.currentAmount, currency)}</span>
          <span className="text-slate-500">of {fmt.currency(goal.targetAmount, currency)}</span>
        </div>
        <div className="bg-surface rounded-full h-2 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: `${Math.min(pct, 100)}%`, background: goal.color || '#6366f1' }} />
        </div>
        <div className="flex justify-between text-xs mt-1.5">
          <span className="text-slate-500">{pct.toFixed(1)}% saved</span>
          <span className="text-slate-500">{goal.daysRemaining}d remaining</span>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Target: <span className="text-slate-300">{fmt.date(goal.targetDate)}</span>
        {goal.status === 'ACTIVE' && (
          <span className="ml-2 text-slate-500">· Need {fmt.currency(goal.remainingAmount, currency)} more</span>
        )}
      </div>

      <div className="flex gap-2 pt-1 border-t border-surface-border">
        {goal.status === 'ACTIVE' && (
          <button onClick={() => onAddFunds(goal)}
            className="flex-1 btn-primary py-2 justify-center text-xs">
            <Plus size={12} /> Add Funds
          </button>
        )}
        <button onClick={() => onEdit(goal)} className="p-2 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"><Pencil size={13}/></button>
        <button onClick={() => onDelete(goal.id)} className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={13}/></button>
      </div>
    </div>
  )
}

export default function SavingsPage() {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [addFundsGoal, setAddFundsGoal] = useState(null)
  const currency = user?.currency || 'USD'

  const load = useCallback(() => {
    setLoading(true)
    savingsApi.getAll().then(r => setGoals(r.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async form => {
    setSaving(true)
    try {
      const p = { ...form, targetAmount: parseFloat(form.targetAmount), currentAmount: parseFloat(form.currentAmount || 0) }
      if (editing) { await savingsApi.update(editing.id, p); toast.success('Goal updated') }
      else { await savingsApi.create(p); toast.success('Goal created') }
      setShowModal(false); setEditing(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await savingsApi.delete(deleteTarget); toast.success('Goal deleted'); setDeleteTarget(null); load() }
    catch { toast.error('Delete failed') } finally { setSaving(false) }
  }

  const handleAddFunds = async (id, amount) => {
    try { await savingsApi.addFunds(id, amount); toast.success('Funds added!'); load() }
    catch { toast.error('Failed to add funds') }
  }

  const totalTarget  = goals.reduce((s, g) => s + (g.targetAmount || 0), 0)
  const totalSaved   = goals.reduce((s, g) => s + (g.currentAmount || 0), 0)
  const activeGoals  = goals.filter(g => g.status === 'ACTIVE').length
  const doneGoals    = goals.filter(g => g.status === 'COMPLETED').length

  return (
    <div className="space-y-5">
      <PageHeader title="Savings Goals" subtitle={`${activeGoals} active · ${doneGoals} completed`}
        action={<button className="btn-primary" onClick={() => { setEditing(null); setShowModal(true) }}><Plus size={15}/> New Goal</button>} />

      {goals.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:'Total Target', value: fmt.compact(totalTarget, currency)  },
            { label:'Total Saved',  value: fmt.compact(totalSaved, currency)   },
            { label:'Active Goals', value: activeGoals                          },
            { label:'Completed',    value: doneGoals                            },
          ].map(s => (
            <div key={s.label} className="card p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-2xl font-bold font-mono text-white">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28}/></div>
      ) : goals.length === 0 ? (
        <EmptyState icon={PiggyBank} title="No savings goals yet"
          description="Set goals and track your progress towards financial milestones."
          action={<button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={14}/> Create Goal</button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(g => (
            <GoalCard key={g.id} goal={g} currency={currency}
              onEdit={g => { setEditing(g); setShowModal(true) }}
              onDelete={setDeleteTarget}
              onAddFunds={setAddFundsGoal} />
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditing(null) }}
        title={editing ? 'Edit Goal' : 'New Savings Goal'} size="md">
        <GoalForm
          initial={editing ? { ...editing, targetAmount: editing.targetAmount?.toString(), currentAmount: editing.currentAmount?.toString() } : EMPTY}
          onSubmit={handleSave} loading={saving} />
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={saving}
        title="Delete Goal" message="This savings goal will be permanently deleted." />

      <AddFundsModal
        open={!!addFundsGoal} goal={addFundsGoal}
        onClose={() => setAddFundsGoal(null)}
        onAdd={handleAddFunds} currency={currency} />
    </div>
  )
}
