import { useEffect, useState, useCallback } from 'react'
import { transactionApi } from '../api/client'
import { fmt, CATEGORIES, TYPE_COLOR, clsx } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import { Modal, ConfirmDialog, EmptyState, PageHeader, Spinner, Badge, Field } from '../components/ui/index'
import { Plus, Pencil, Trash2, ArrowLeftRight, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const TYPES = ['INCOME','EXPENSE','TRANSFER','INVESTMENT']
const EMPTY_FORM = { title:'', description:'', amount:'', type:'EXPENSE', category:'', date: format(new Date(),'yyyy-MM-dd'), paymentMethod:'', reference:'', tags:'', recurring: false }

function TransactionForm({ initial = EMPTY_FORM, onSubmit, loading }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const cats = CATEGORIES[form.type] || []

  useEffect(() => { if (!cats.includes(form.category)) set('category', cats[0] || '') }, [form.type])

  const handleSubmit = e => { e.preventDefault(); onSubmit(form) }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Field label="Title" required>
            <input className="input" placeholder="e.g. Monthly Salary" value={form.title}
              onChange={e => set('title', e.target.value)} required />
          </Field>
        </div>
        <Field label="Type" required>
          <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Category" required>
          <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Amount" required>
          <input type="number" step="0.01" min="0.01" className="input" placeholder="0.00"
            value={form.amount} onChange={e => set('amount', e.target.value)} required />
        </Field>
        <Field label="Date" required>
          <input type="date" className="input" value={form.date} onChange={e => set('date', e.target.value)} required />
        </Field>
        <Field label="Payment Method">
          <input className="input" placeholder="Cash, Card, Bank…" value={form.paymentMethod}
            onChange={e => set('paymentMethod', e.target.value)} />
        </Field>
        <Field label="Reference">
          <input className="input" placeholder="Invoice, Receipt #" value={form.reference}
            onChange={e => set('reference', e.target.value)} />
        </Field>
        <div className="col-span-2">
          <Field label="Description">
            <textarea className="input resize-none h-16" placeholder="Optional note…"
              value={form.description} onChange={e => set('description', e.target.value)} />
          </Field>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" id="recurring" checked={form.recurring}
            onChange={e => set('recurring', e.target.checked)} className="rounded" />
          <label htmlFor="recurring" className="text-sm text-slate-300">Recurring transaction</label>
          {form.recurring && (
            <select className="input ml-2 py-1.5 text-xs w-32" value={form.recurringPeriod || 'MONTHLY'}
              onChange={e => set('recurringPeriod', e.target.value)}>
              {['DAILY','WEEKLY','MONTHLY','YEARLY'].map(p => <option key={p}>{p}</option>)}
            </select>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <><span className="animate-spin inline-block">⟳</span> Saving…</> : 'Save Transaction'}
        </button>
      </div>
    </form>
  )
}

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    transactionApi.getAll(page, 15)
      .then(res => {
        setTransactions(res.data.data.content || [])
        setTotalPages(res.data.data.totalPages || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { load() }, [load])

  const handleSave = async form => {
    setSaving(true)
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      if (editing) {
        await transactionApi.update(editing.id, payload)
        toast.success('Transaction updated')
      } else {
        await transactionApi.create(payload)
        toast.success('Transaction added')
      }
      setShowModal(false)
      setEditing(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await transactionApi.delete(deleteTarget)
      toast.success('Transaction deleted')
      setDeleteTarget(null)
      load()
    } catch { toast.error('Delete failed') }
    finally { setSaving(false) }
  }

  const filtered = transactions.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'ALL' || t.type === filterType
    return matchSearch && matchType
  })

  const currency = user?.currency || 'USD'

  return (
    <div className="space-y-5">
      <PageHeader
        title="Transactions"
        subtitle={`${transactions.length} records loaded`}
        action={
          <button className="btn-primary" onClick={() => { setEditing(null); setShowModal(true) }}>
            <Plus size={15} /> Add Transaction
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input pl-9" placeholder="Search transactions…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5">
          {['ALL', ...TYPES].map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                filterType === t ? 'bg-brand-500 text-white' : 'bg-surface-card text-slate-400 hover:text-white border border-surface-border')}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={ArrowLeftRight} title="No transactions yet"
            description="Add your first transaction to start tracking your finances."
            action={<button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={14}/> Add Transaction</button>} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-border">
                    {['Title','Category','Type','Amount','Date','Method',''].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx, i) => {
                    const tc = TYPE_COLOR[tx.type] || TYPE_COLOR.EXPENSE
                    return (
                      <tr key={tx.id} className={clsx('border-b border-surface-border/50 hover:bg-surface-hover transition-colors',
                        i % 2 === 0 ? '' : 'bg-surface/30')}>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-white truncate max-w-[180px]">{tx.title}</div>
                          {tx.description && <div className="text-xs text-slate-500 truncate max-w-[180px]">{tx.description}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-400">{tx.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={clsx('badge', tc.bg, tc.text)}>{tx.type}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={clsx('font-mono font-semibold text-sm',
                            tx.type === 'INCOME' ? 'text-emerald-400' : tx.type === 'EXPENSE' ? 'text-red-400' : 'text-slate-300')}>
                            {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : ''}
                            {fmt.currency(tx.amount, currency)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">{fmt.date(tx.date)}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{tx.paymentMethod || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button onClick={() => { setEditing(tx); setShowModal(true) }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors">
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => setDeleteTarget(tx.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border">
                <span className="text-xs text-slate-500">Page {page + 1} of {totalPages}</span>
                <div className="flex gap-1.5">
                  <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                    className="btn-ghost py-1.5 px-2 disabled:opacity-30"><ChevronLeft size={14}/></button>
                  <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                    className="btn-ghost py-1.5 px-2 disabled:opacity-30"><ChevronRight size={14}/></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setEditing(null) }}
        title={editing ? 'Edit Transaction' : 'Add Transaction'} size="lg">
        <TransactionForm
          initial={editing ? { ...editing, amount: editing.amount?.toString(), date: editing.date } : EMPTY_FORM}
          onSubmit={handleSave}
          loading={saving}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={saving}
        title="Delete Transaction" message="This action cannot be undone." />
    </div>
  )
}
