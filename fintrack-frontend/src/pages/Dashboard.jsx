import React, { useState, useEffect } from 'react';
import '../index.css';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // In a real app, we'd fetch from our backend here
    const mockData = [
      { id: 1, type: 'INCOME', amount: 5000, category: 'Salary', description: 'Monthly Salary' },
      { id: 2, type: 'EXPENSE', amount: -600, category: 'Housing', description: 'Rent' },
      { id: 3, type: 'EXPENSE', amount: -150, category: 'Food', description: 'Groceries' }
    ];
    setTransactions(mockData);
  }, []);

  const totalBalance = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => Math.abs(acc) + Math.abs(curr.amount), 0);

  return (
    <div className="app-container">
      <header className="dashboard-header">
        <h1>Welcome back, Alex.</h1>
        <p>Here is your financial summary for the month.</p>
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

      <div style={{ marginTop: '40px' }} className="glass-panel">
        <div style={{ padding: '24px', borderBottom: 'var(--border-glass)' }}>
          <h3>Recent Transactions</h3>
        </div>
        <div style={{ padding: '24px' }}>
          {transactions.map(t => (
             <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
               <div>
                  <h4 style={{ margin: 0 }}>{t.category}</h4>
                  <small style={{ color: 'var(--color-text-muted)' }}>{t.description}</small>
               </div>
               <span style={{ fontWeight: '600', color: t.type === 'INCOME' ? 'var(--color-accent)' : '#ef4444' }}>
                 {t.type === 'INCOME' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
               </span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
