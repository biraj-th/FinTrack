import { useEffect, useState, useCallback } from 'react'
import { investmentApi } from '../api/client'
import { fmt, INVESTMENT_TYPES, clsx } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import { Modal, ConfirmDialog, EmptyState, PageHeader, Spinner, Field, StatCard } from '../components/ui/index'
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6']
const EMPTY = { name:'', ticker:'', type:'STOCK', purchasePrice:'', currentPrice:'', quantity:'', purchaseDate: format(new Date(),'yyyy-MM-dd'), broker:'', notes:'', sector:'' }

function InvestmentForm({ initial = EMPTY, onSubmit, loading }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(p => ({...p, [k]: v}))
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Field label="Name" required><input className="input" placeholder="Apple Inc." value={form.name} onChange={e => set('name', e.target.value)} required /></Field></div>
        <Field label="Ticker / Symbol"><input className="input" placeholder="AAPL" value={form.ticker} onChange={e => set('ticker', e.target.value)} /></Field>
        <Field label="Type" required>
          <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
            {INVESTMENT_TYPES.map(t => <option key={t}>{t.replace('_',' ')}</option>)}
          </select>
        </Field>
        <Field label="Purchase Price" required><input type="number" step="0.000001" min="0" className="input" placeholder="0.00" value={form.purchasePrice} onChange={e => set('purchasePrice', e.target.value)} required /></Field>
        <Field label="Current Price" required><input type="number" step="0.000001" min="0" className="input" placeholder="0.00" value={form.currentPrice} onChange={e => set('currentPrice', e.target.value)} required /></Field>
        <Field label="Quantity" required><input type="number" step="0.000001" min="0" className="input" placeholder="0" value={form.quantity} onChange={e => set('quantity', e.target.value)} required /></Field>
        <Field label="Purchase Date" required><input type="date" className="input" value={form.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} required /></Field>
        <Field label="Broker / Exchange"><input className="input" placeholder="Robinhood, Fidelity…" value={form.broker} onChange={e => set('broker', e.target.value)} /></Field>
        <Field label="Sector"><input className="input" placeholder="Technology, Healthcare…" value={form.sector} onChange={e => set('sector', e.target.value)} /></Field>
        <div className="col-span-2"><Field label="Notes"><textarea className="input resize-none h-14" value={form.notes} onChange={e => set('notes', e.target.value)} /></Field></div>
      </div>
      <div className="flex justify-end pt-1">
        <button type="submit" disabled={loading} className="btn-primary">{loading ? '⟳ Saving…' : 'Save Investment'}</button>
      </div>
    </form>
  )
}

function InvestmentRow({ inv, currency, onEdit, onDelete }) {
  const pos = (inv.gainLoss || 0) >= 0
  return (
    <tr className="border-b border-surface-border/50 hover:bg-surface-hover transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-xs font-bold text-brand-400">
            {inv.ticker ? inv.ticker.slice(0,3) : inv.name.slice(0,2).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium text-white">{inv.name}</div>
            <div className="text-xs text-slate-500">{inv.type?.replace('_',' ')} · {inv.sector || '—'}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-slate-400 font-mono">{fmt.currency(inv.purchasePrice, currency)}</td>
      <td className="px-4 py-3 text-xs text-slate-300 font-mono">{fmt.currency(inv.currentPrice, currency)}</td>
      <td className="px-4 py-3 text-xs text-slate-400 font-mono">{inv.quantity}</td>
      <td className="px-4 py-3">
        <div className="text-sm font-mono font-semibold text-white">{fmt.currency(inv.currentValue, currency)}</div>
        <div className="text-xs text-slate-500">Cost: {fmt.currency(inv.totalCost, currency)}</div>
      </td>
      <td className="px-4 py-3">
        <div className={clsx('flex items-center gap-1 text-sm font-semibold font-mono', pos ? 'text-emerald-400' : 'text-red-400')}>
          {pos ? <TrendingUp size={13}/> : <TrendingDown size={13}/>}
          {pos ? '+' : ''}{fmt.currency(inv.gainLoss, currency)}
        </div>
        <div className={clsx('text-xs', pos ? 'text-emerald-500' : 'text-red-500')}>
          {pos ? '+' : ''}{fmt.pct(inv.gainLossPercent)}
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-slate-500">{fmt.date(inv.purchaseDate)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 justify-end">
          <button onClick={() => onEdit(inv)} className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"><Pencil size={13}/></button>
          <button onClick={() => onDelete(inv.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={13}/></button>
        </div>
      </td>
    </tr>
  )
}

export default function InvestmentsPage() {
  const { user } = useAuth()
  const [investments, setInvestments] = useState([])
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const currency = user?.currency || 'USD'

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([investmentApi.getAll(), investmentApi.portfolio()])
      .then(([inv, port]) => { setInvestments(inv.data.data || []); setPortfolio(port.data.data) })
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async form => {
    setSaving(true)
    try {
      const p = { ...form, purchasePrice: parseFloat(form.purchasePrice), currentPrice: parseFloat(form.currentPrice), quantity: parseFloat(form.quantity) }
      if (editing) { await investmentApi.update(editing.id, p); toast.success('Updated') }
      else { await investmentApi.create(p); toast.success('Investment added') }
      setShowModal(false); setEditing(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await investmentApi.delete(deleteTarget); toast.success('Removed'); setDeleteTarget(null); load() }
    catch { toast.error('Delete failed') } finally { setSaving(false) }
  }

  const isPositive = (portfolio?.totalGainLoss || 0) >= 0

  return (
    <div className="space-y-5">
      <PageHeader title="Investment Portfolio" subtitle={`${investments.length} holdings`}
        action={<button className="btn-primary" onClick={() => { setEditing(null); setShowModal(true) }}><Plus size={15}/> Add Holding</button>} />

      {portfolio && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Invested"  value={fmt.compact(portfolio.totalCost, currency)}          icon={DollarSign}  color="brand" />
          <StatCard label="Current Value"   value={fmt.compact(portfolio.totalValue, currency)}         icon={BarChart2}   color="purple" />
          <StatCard label="Total Gain/Loss" value={fmt.compact(portfolio.totalGainLoss, currency)}      icon={isPositive ? TrendingUp : TrendingDown} color={isPositive ? 'green' : 'red'} sub={fmt.pct(portfolio.gainLossPercent)} />
          <StatCard label="Holdings"        value={portfolio.holdingsCount}                              icon={TrendingUp}  color="cyan" />
        </div>
      )}

      {portfolio?.typeBreakdown?.length > 0 && (
        <div className="card p-5">
          <h2 className="section-title mb-4">Portfolio Allocation</h2>
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={portfolio.typeBreakdown} dataKey="currentValue" nameKey="type" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3}>
                  {portfolio.typeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => fmt.currency(v, currency)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3">
              {portfolio.typeBreakdown.map((item, i) => (
                <div key={item.type} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-slate-400">{item.type.replace('_',' ')}</span>
                  <span className="text-xs font-mono text-white">{fmt.compact(item.currentValue, currency)}</span>
                  <span className="text-xs text-slate-500">({fmt.pct(item.percentage)})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28}/></div>
        ) : investments.length === 0 ? (
          <EmptyState icon={TrendingUp} title="No investments yet"
            description="Track your stocks, ETFs, crypto, and more."
            action={<button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={14}/> Add Holding</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-surface-border">
                {['Asset','Buy Price','Curr Price','Qty','Value','Gain/Loss','Date',''].map((h,i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {investments.map(inv => (
                  <InvestmentRow key={inv.id} inv={inv} currency={currency}
                    onEdit={inv => { setEditing(inv); setShowModal(true) }}
                    onDelete={setDeleteTarget} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditing(null) }}
        title={editing ? 'Edit Investment' : 'Add Holding'} size="lg">
        <InvestmentForm
          initial={editing ? { ...editing, purchasePrice: editing.purchasePrice?.toString(), currentPrice: editing.currentPrice?.toString(), quantity: editing.quantity?.toString() } : EMPTY}
          onSubmit={handleSave} loading={saving} />
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={saving}
        title="Remove Investment" message="This holding will be permanently removed." />
    </div>
  )
}
