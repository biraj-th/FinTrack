import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// New pages
import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import ChatPage       from './pages/ChatPage'

// Existing dashboard pages
import Layout         from './components/layout/Layout'
import DashboardPage  from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import BudgetsPage    from './pages/BudgetsPage'
import InvestmentsPage from './pages/InvestmentsPage'
import SavingsPage    from './pages/SavingsPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return !isAuthenticated ? children : <Navigate to="/chat" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: 'DM Sans, sans-serif',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#111111' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#111111' } },
          }}
        />
        <Routes>
          {/* ── Public intro & auth pages ── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* ── Protected chat page ── */}
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

          {/* ── Protected dashboard app ── */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index          element={<DashboardPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="budgets"      element={<BudgetsPage />} />
            <Route path="investments"  element={<InvestmentsPage />} />
            <Route path="savings"      element={<SavingsPage />} />
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
