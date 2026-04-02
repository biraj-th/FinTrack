import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy login action
    console.log("Logging in with", email);
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-panel">
        <div className="text-center mb-30">
          <img src="/logo.png" alt="FinTrack Logo" className="app-logo-small" />
          <h2>Welcome Back</h2>
          <p className="text-muted">Sign in to your FinTrack account</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-glass"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group mb-30">
            <label>Password</label>
            <input 
              type="password" 
              className="input-glass"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-100">Sign In</button>
        </form>
        
        <div className="text-center mt-20">
          <p>Don't have an account? <Link to="/register" className="text-link">Create one</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
