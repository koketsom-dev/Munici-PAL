import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  function validateEmail(e) {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Simulate sending link. In a real app you'd call your backend API here.
    setSent(true);
    setTimeout(() => {
      // After showing confirmation, navigate back to login
      navigate('/');
    }, 2500);
  }

  return (
    <div className="center-area">
      <div className="card-glass">
        <div className="card-header">
          <h1 className="welcome">Reset your password</h1>
          <p className="sub">Enter the email associated with your account and we'll send a link to reset your password.</p>
        </div>
        <form className="fields" onSubmit={handleSubmit} style={{ width: '100%' }}>
          <label className="input-label">Email address</label>
          <div className="input-row"><input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
          {error && <div className="error">{error}</div>}
          {sent ? (
            <div className="glass-support-link">A reset link was sent. Redirecting to login...</div>
          ) : (
            <div className="row-between" style={{ justifyContent: 'center', gap: 12 }}>
              <button type="submit" className="primary">Send reset link</button>
              <button type="button" className="secondary" onClick={() => navigate('/')}>Cancel</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
