import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ConfigLoading from './pages/ConfigLoading.jsx';

const BrandOnlyApp = () => (
  <div className="app-bg" style={{ backgroundImage: 'url(/background.jpg)' }}>
    <div className="top-left">
      <img src="/municiPAL.jpg" alt="Munici-PAL Logo" className="brand-logo" />
      <div className="brand-text">
        Welcome To<br /><strong>Munici-PAL</strong>
      </div>
      <div className="brand-slogan">Problem Action upLiftment</div>
    </div>
  </div>
);

function AppShell() {
  const [mode, setMode] = useState('community');
  const navigate = useNavigate();

  const handleToggle = (checked) => setMode(checked ? 'employee' : 'community');
  const goToDashboard = () => navigate('/dashboard');

  return (
    <div className="app-bg" style={{ backgroundImage: 'url(/background.jpg)' }}>
      <div className="top-left">
        <img src="/municiPAL.jpg" alt="Munici-PAL Logo" className="brand-logo" />
        <div className="brand-text">
          Welcome To<br /><strong>Munici-PAL</strong>
        </div>
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
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
