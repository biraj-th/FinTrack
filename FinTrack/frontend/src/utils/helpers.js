import { format, parseISO } from 'date-fns'

export const fmt = {
  currency: (amount, currency = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 })
      .format(amount ?? 0),

  compact: (amount, currency = 'USD') => {
    const abs = Math.abs(amount ?? 0)
    if (abs >= 1_000_000) return fmt.currency((amount / 1_000_000), currency).replace(/\.?\d+$/, '') + 'M'
    if (abs >= 1_000)     return fmt.currency((amount / 1_000), currency).replace(/\.?\d+$/, '') + 'K'
    return fmt.currency(amount, currency)
  },

  date: (d) => {
    if (!d) return '—'
    try { return format(typeof d === 'string' ? parseISO(d) : new Date(d), 'MMM d, yyyy') }
    catch { return d }
  },

  pct: (v, decimals = 1) => `${(v ?? 0).toFixed(decimals)}%`,

  number: (v) => new Intl.NumberFormat('en-US').format(v ?? 0),
}

export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE', 'TRANSFER', 'INVESTMENT']

export const CATEGORIES = {
  INCOME:     ['Salary', 'Freelance', 'Business', 'Investment Returns', 'Rental', 'Gift', 'Other Income'],
  EXPENSE:    ['Food & Dining', 'Transportation', 'Shopping', 'Housing', 'Utilities', 'Healthcare',
               'Entertainment', 'Education', 'Travel', 'Subscriptions', 'Insurance', 'Other'],
  TRANSFER:   ['Savings Transfer', 'Account Transfer', 'Family Transfer'],
  INVESTMENT: ['Stocks', 'ETF', 'Crypto', 'Mutual Fund', 'Real Estate', 'Bonds'],
}

export const INVESTMENT_TYPES = ['STOCK','ETF','CRYPTO','MUTUAL_FUND','BOND','REAL_ESTATE','COMMODITY','OTHER']

export const CATEGORY_COLORS = {
  'Food & Dining':    '#f59e0b',
  'Transportation':   '#3b82f6',
  'Shopping':         '#ec4899',
  'Housing':          '#8b5cf6',
  'Utilities':        '#06b6d4',
  'Healthcare':       '#10b981',
  'Entertainment':    '#f97316',
  'Education':        '#6366f1',
  'Travel':           '#14b8a6',
  'Subscriptions':    '#a855f7',
  'Insurance':        '#64748b',
  'Other':            '#94a3b8',
  'Salary':           '#10b981',
  'Freelance':        '#34d399',
  'Business':         '#6ee7b7',
  'Investment Returns':'#3b82f6',
}

export const TYPE_COLOR = {
  INCOME:     { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  EXPENSE:    { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20' },
  TRANSFER:   { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/20' },
  INVESTMENT: { bg: 'bg-purple-500/10',  text: 'text-purple-400',  border: 'border-purple-500/20' },
}

export const clsx = (...classes) => classes.filter(Boolean).join(' ')
