import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, PiggyBank, TrendingUp, Target,
  LogOut, Menu, X, Wallet, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { clsx } from '../../utils/helpers'

const NAV_ITEMS = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'Transactions' },
  { to: '/budgets',      icon: Wallet,          label: 'Budgets' },
  { to: '/investments',  icon: TrendingUp,      label: 'Investments' },
  { to: '/savings',      icon: PiggyBank,        label: 'Savings Goals' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const Sidebar = ({ mobile }) => (
    <aside className={clsx(
      'flex flex-col h-full w-64 bg-surface-card border-r border-surface-border',
      mobile ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-border">
        <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-lg font-bold shadow-lg shadow-brand-500/30">
          💰
        </div>
        <div>
          <div className="font-bold text-white text-base leading-tight">FinTrack</div>
          <div className="text-xs text-slate-500">Finance Tracker</div>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
              isActive
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-surface-hover'
            )}>
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-brand-400/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-3 pb-4 border-t border-surface-border pt-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
               style={{ background: user?.avatarColor || '#6366f1' }}>
            {user?.fullName?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user?.fullName}</div>
            <div className="text-xs text-slate-500 truncate">{user?.currency}</div>
          </div>
          <button onClick={handleLogout} title="Logout"
            className="text-slate-500 hover:text-red-400 transition-colors p-1">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <Sidebar mobile />
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-4 border-b border-surface-border bg-surface-card">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white p-1">
            <Menu size={20} />
          </button>
          <div className="font-bold text-white">FinTrack</div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
