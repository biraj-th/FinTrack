import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../api/client'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ft_user')) } catch { return null }
  })

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({ email, password })
    const userData = data.data
    localStorage.setItem('ft_token', userData.token)
    localStorage.setItem('ft_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (fullName, email, password, currency) => {
    const { data } = await authApi.register({ fullName, email, password, currency })
    const userData = data.data
    localStorage.setItem('ft_token', userData.token)
    localStorage.setItem('ft_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ft_token')
    localStorage.removeItem('ft_user')
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
