import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Save user info to localStorage
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    console.log("Registering", name, email);
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-panel">
        <div className="text-center mb-30">
          <img src="/logo.png" alt="FinTrack Logo" className="app-logo-small" />
          <h2>Create an Account</h2>
          <p className="text-muted">Join FinTrack to manage your budget</p>
        </div>
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="input-glass"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="John Doe"
            />
          </div>
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
          <button type="submit" className="btn-primary w-100">Create Account</button>
        </form>
        
        <div className="text-center mt-20">
          <p>Already have an account? <Link to="/login" className="text-link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
