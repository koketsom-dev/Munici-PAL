import './App.css';
import React, { useState } from 'react';

let RouterLib = null;
try {
  RouterLib = require('react-router-dom');
} catch (e) {
  RouterLib = null;
}

const BrandOnlyApp = () => (
  <div className="app-bg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)` }}>
    <div className="top-left">
      <img src={process.env.PUBLIC_URL + '/municiPAL.jpg'} alt="Munici-PAL Logo" className="brand-logo" />
      <div className="brand-text">Welcome To<br /><strong>Munici-PAL</strong></div>
      <div className="brand-slogan">Problem Action upLiftment</div>
    </div>
  </div>
);

let App = BrandOnlyApp;

if (RouterLib) {
  const { BrowserRouter: Router, Routes, Route, useNavigate } = RouterLib;
  const LoginPage = require('./pages/LoginPage').default;
  const SignupPage = require('./pages/SignupPage').default;
  const ForgotPassword = require('./pages/ForgotPassword').default;
  const ConfigLoading = require('./pages/ConfigLoading').default; // Only ConfigLoading, no Dashboard

  function AppShell() {
    const [mode, setMode] = useState('community');
    const navigate = useNavigate();

    const handleToggle = (checked) => setMode(checked ? 'employee' : 'community');
    const goToDashboard = () => navigate('/dashboard');

    return (
      <div className="app-bg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)` }}>
        <div className="top-left">
          <img src={process.env.PUBLIC_URL + '/municiPAL.jpg'} alt="Munici-PAL Logo" className="brand-logo" />
          <div className="brand-text">Welcome To<br /><strong>Munici-PAL</strong></div>
          <div className="brand-slogan">Problem Action upLiftment</div>
        </div>

        <div className="top-right">
          <label className="mode-toggle">
            <input type="checkbox" checked={mode === 'employee'} onChange={(e) => handleToggle(e.target.checked)} />
            <span className="toggle-label">Community / Employee</span>
          </label>
        </div>

        <Routes>
          <Route path="/" element={<LoginPage mode={mode} setMode={setMode} onLoginNavigate={goToDashboard} />} />
          <Route path="/signup" element={<SignupPage onSignupComplete={() => navigate('/')} />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/loading" element={<ConfigLoading />} />
          {/* Removed /dashboard route since we don't have Dashboard component anymore */}
        </Routes>
      </div>
    );
  }

  App = function AppWrapper() {
    return (
      <Router>
        <AppShell />
      </Router>
    );
  };
}

export default App;