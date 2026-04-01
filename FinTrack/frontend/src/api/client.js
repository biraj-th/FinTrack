import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ft_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ft_token')
      localStorage.removeItem('ft_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────
export const authApi = {
  register: data => api.post('/auth/register', data),
  login:    data => api.post('/auth/login', data),
}

// ── Transactions ──────────────────────────────────────────────────────
export const transactionApi = {
  getAll:     (page = 0, size = 20) => api.get(`/transactions?page=${page}&size=${size}`),
  getById:    id  => api.get(`/transactions/${id}`),
  create:     data => api.post('/transactions', data),
  update:     (id, data) => api.put(`/transactions/${id}`, data),
  delete:     id  => api.delete(`/transactions/${id}`),
  dashboard:  ()  => api.get('/transactions/dashboard'),
}

// ── Budgets ───────────────────────────────────────────────────────────
export const budgetApi = {
  getAll:  ()          => api.get('/budgets'),
  getById: id          => api.get(`/budgets/${id}`),
  create:  data        => api.post('/budgets', data),
  update:  (id, data)  => api.put(`/budgets/${id}`, data),
  delete:  id          => api.delete(`/budgets/${id}`),
}

// ── Investments ───────────────────────────────────────────────────────
export const investmentApi = {
  getAll:    ()         => api.get('/investments'),
  portfolio: ()         => api.get('/investments/portfolio'),
  getById:   id         => api.get(`/investments/${id}`),
  create:    data       => api.post('/investments', data),
  update:    (id, data) => api.put(`/investments/${id}`, data),
  delete:    id         => api.delete(`/investments/${id}`),
}

// ── Savings Goals ─────────────────────────────────────────────────────
export const savingsApi = {
  getAll:   ()              => api.get('/savings-goals'),
  getById:  id              => api.get(`/savings-goals/${id}`),
  create:   data            => api.post('/savings-goals', data),
  update:   (id, data)      => api.put(`/savings-goals/${id}`, data),
  addFunds: (id, amount)    => api.post(`/savings-goals/${id}/add-funds`, { amount }),
  delete:   id              => api.delete(`/savings-goals/${id}`),
}

export default api
