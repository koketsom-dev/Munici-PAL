import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginPage from '../../Global-login-page/src/pages/LoginPage';
import SignupPage from '../../Global-login-page/src/pages/SignupPage';
import ForgotPassword from '../../Global-login-page/src/pages/ForgotPassword';
import ConfigLoading from '../../Global-login-page/src/pages/ConfigLoading';
import '../../Global-login-page/src/App.css';

function LoginWrapper() {
  const [mode, setMode] = useState('community');
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = (checked) => setMode(checked ? 'employee' : 'community');
  const goToDashboard = () => {
    if (mode === 'employee') {
      navigate('/dashboard');
    } else {
      navigate('/community');
    }
  };

  // Determine which page to show based on route
  const renderPage = () => {
    if (location.pathname === '/signup') {
      return <SignupPage mode={mode} onSignupComplete={() => navigate('/')} />;
    }
    if (location.pathname === '/forgot') {
      return <ForgotPassword />;
    }
    if (location.pathname === '/loading') {
      return <ConfigLoading />;
    }
    return <LoginPage mode={mode} setMode={setMode} onLoginNavigate={goToDashboard} />;
  };

  return (
    <div className="app-bg" style={{ backgroundImage: 'url(/background.jpg)' }}>
      <div className="top-left">
        <img
          src="/municiPAL.svg"
          alt="Munici-PAL Logo"
          className="brand-logo"
          style={{ backgroundColor: 'white', borderRadius: '50%', padding: '6px', objectFit: 'contain' }}
        />
        <div className="brand-text">
          Welcome To<br /><strong>Munici-PAL</strong>
        </div>
        <div className="brand-slogan">Problem Action upLiftment</div>
      </div>

      {location.pathname !== '/signup' && (
        <div className="top-right">
          <label className="mode-toggle">
            <input type="checkbox" checked={mode === 'employee'} onChange={(e) => handleToggle(e.target.checked)} />
            <span className="toggle-label">Community / Employee</span>
          </label>
        </div>
      )}

      {renderPage()}
    </div>
  );
}

export default LoginWrapper;

