import React, { useState } from 'react';
import '../index.css';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'INCOME', amount: 5000, category: 'Salary', description: 'Monthly Salary' },
    { id: 2, type: 'EXPENSE', amount: -600, category: 'Housing', description: 'Rent' },
    { id: 3, type: 'EXPENSE', amount: -150, category: 'Food', description: 'Groceries' }
  ]);

  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    amount: '',
    category: '',
    description: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    let parsedAmount = parseFloat(formData.amount);
    if (formData.type === 'EXPENSE' && parsedAmount > 0) {
      parsedAmount = -parsedAmount;
    } else if (formData.type === 'INCOME' && parsedAmount < 0) {
      parsedAmount = Math.abs(parsedAmount);
    }

    const newTransaction = {
      id: Date.now(),
      type: formData.type,
      amount: parsedAmount,
      category: formData.category,
      description: formData.description
    };

    setTransactions([newTransaction, ...transactions]);
    setFormData({ type: 'EXPENSE', amount: '', category: '', description: '' });
  };

  const totalBalance = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => Math.abs(acc) + Math.abs(curr.amount), 0);

  return (
    <div className="app-container">
      <header className="dashboard-header">
        <h1>Welcome back, Alex.</h1>
        <p>Here is your interactive financial summary.</p>
      </header>

      <div className="cards-grid">
        <div className="card glass-panel">
          <h3>Total Balance</h3>
          <span className="amount">${totalBalance.toFixed(2)}</span>
        </div>
        <div className="card glass-panel">
          <h3>Income</h3>
          <span className="amount" style={{ color: 'var(--color-accent)' }}>+${totalIncome.toFixed(2)}</span>
        </div>
        <div className="card glass-panel">
          <h3>Expenses</h3>
          <span className="amount" style={{ color: '#ef4444' }}>-${totalExpenses.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginTop: '40px' }}>
        {/* Input Form Column */}
        <div className="glass-panel">
          <div style={{ padding: '24px', borderBottom: 'var(--border-glass)' }}>
            <h3>Add New Record</h3>
          </div>
          <div style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Amount</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="e.g. 50.00" style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} required />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Utilities, Salary" style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} required />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Optional details..." style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                Save Transaction
              </button>
            </form>
          </div>
        </div>

        {/* Transactions List Column */}
        <div className="glass-panel">
          <div style={{ padding: '24px', borderBottom: 'var(--border-glass)' }}>
            <h3>Recent Transactions</h3>
          </div>
          <div style={{ padding: '24px', maxHeight: '500px', overflowY: 'auto' }}>
            {transactions.length === 0 ? <p style={{ color: 'var(--color-text-muted)' }}>No transactions yet.</p> : null}
            {transactions.map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{t.category}</h4>
                  <small style={{ color: 'var(--color-text-muted)' }}>{t.description}</small>
                </div>
                <span style={{ fontWeight: '700', fontSize: '1.2rem', color: t.type === 'INCOME' ? 'var(--color-accent)' : '#ef4444' }}>
                  {t.type === 'INCOME' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
