import { useEffect, useState } from 'react'
import { transactionApi } from '../api/client'
import { fmt } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import { StatCard, Spinner, ProgressBar } from '../components/ui/index'
import {
  TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowLeftRight, BarChart3
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-4 py-3 text-xs shadow-xl">
      <p className="text-slate-400 font-medium mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="font-mono font-semibold text-white">{fmt.compact(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    transactionApi.dashboard()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size={32} />
    </div>
  )

  const currency = user?.currency || 'USD'
  const netPositive = (data?.netBalance ?? 0) >= 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          <span className="text-brand-400">{user?.fullName?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here's your financial overview for this month</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Income"   value={fmt.compact(data?.totalIncome, currency)}   icon={TrendingUp}   color="green"  sub="This month" />
        <StatCard label="Total Expenses" value={fmt.compact(data?.totalExpenses, currency)} icon={TrendingDown} color="red"    sub="This month" />
        <StatCard label="Net Balance"    value={fmt.compact(data?.netBalance, currency)}     icon={Wallet}       color={netPositive ? 'brand' : 'red'} sub="Income − Expenses" />
        <StatCard label="Transactions"   value={fmt.number(data?.transactionCount)}          icon={ArrowLeftRight} color="purple" sub="All time" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Income vs Expenses</h2>
            <span className="text-xs text-slate-500">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data?.monthlyTrends || []} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3248" vertical={false} />
              <XAxis dataKey="month" tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}
                tickFormatter={v => fmt.compact(v)} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income"   stroke="#10b981" strokeWidth={2} fill="url(#gIncome)"  name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#gExpense)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Spending</h2>
            <span className="text-xs text-slate-500">By category</span>
          </div>
          {data?.topExpenseCategories?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={data.topExpenseCategories} dataKey="amount" nameKey="category"
                    cx="50%" cy="50%" outerRadius={65} innerRadius={38} paddingAngle={3}>
                    {data.topExpenseCategories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt.currency(v, currency)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {data.topExpenseCategories.slice(0, 4).map((cat, i) => (
                  <div key={cat.category} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-slate-400 flex-1 truncate">{cat.category}</span>
                    <span className="text-xs font-mono text-white">{fmt.compact(cat.amount, currency)}</span>
                    <span className="text-xs text-slate-500 w-10 text-right">{fmt.pct(cat.percentage)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-slate-500 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Bar chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Monthly Comparison</h2>
          <BarChart3 size={16} className="text-slate-500" />
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data?.monthlyTrends || []} margin={{ top: 5, right: 5, bottom: 0, left: 0 }} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3248" vertical={false} />
            <XAxis dataKey="month" tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}
              tickFormatter={v => fmt.compact(v)} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize:12, color:'#94a3b8' }} />
            <Bar dataKey="income"   name="Income"   fill="#10b981" radius={[4,4,0,0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
