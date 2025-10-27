import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function LoginPage(props) {
  const { mode, setMode } = props;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.target;
    const email = form.querySelector('input[placeholder="Enter your username"]').value;
    const password = form.querySelector('input[type="password"]').value;

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(email, password, mode);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // First navigate to loading screen
      navigate('/loading', { replace: true });
      
      // Then after 2.5 seconds, redirect to the actual dashboard
      setTimeout(() => {
        // Redirect based on user type
        if (response.data.user.user_type === 'employee') {
          window.location.href = 'http://localhost:3000/dashboard';
        } else {
          window.location.href = 'http://localhost:3001/tickets';
        }
      }, 2500); // Match the loading animation duration
      
      if (onLoginNavigate) {
        onLoginNavigate(response.data.user);
      }
      
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="center-area">
      <div className="card-glass">
        <form className="card-form" onSubmit={handleSubmit}>
          <div className="card-header">
            <h1 className="welcome">{mode === 'employee' ? 'Administrator Login' : 'Welcome back!'}</h1>
          </div>
          <div className="fields">
            <label className="input-label">Username / Email</label>
            <div className="input-row"><FaUser className="icon" /><input placeholder="Enter your username" /></div>
            <label className="input-label">Password</label>
            <div className="input-row"><FaLock className="icon" /><input type="password" placeholder="Enter your password" /></div>

            {error && <div className="error-message" style={{color: 'red', textAlign: 'center', margin: '10px 0'}}>{error}</div>}

            <div className="row-between">
              <label className="small"><input type="checkbox" /> Keep me logged in</label>
              <Link to="/forgot" className="forgot">Forgot password</Link>
            </div>
            
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className="signup-line">Don't have an account? <Link to="/signup" className="linkish">SIGN UP </Link></div>
          </div>
        </form>
      </div>
    </div>
  );
}