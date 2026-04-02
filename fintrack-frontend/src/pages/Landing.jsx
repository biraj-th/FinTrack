import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="auth-container">
      <div className="glass-panel landing-panel">
        <div className="logo-container">
          <img src="/logo.png" alt="FinTrack Logo" className="app-logo" />
        </div>
        <h1 className="landing-title">Welcome to FinTrack</h1>
        <p className="landing-description">
          Take control of your personal finances with our comprehensive tracking system. 
          Monitor your income and expenses, and let our AI-driven insights predict your future financial health.
        </p>
        
        <div className="landing-actions">
          <Link to="/register" className="btn-primary w-100 text-center mb-10 text-decoration-none">
            Get Started
          </Link>
          <p className="text-center mt-20">
            Already have an account? <Link to="/login" className="text-link">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
