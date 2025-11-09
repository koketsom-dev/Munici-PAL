import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Wrapper Components
import LoginWrapper from './pages/LoginWrapper';
import CommunityWrapper from './pages/CommunityWrapper';
import DashboardWrapper from './pages/DashboardWrapper';

function App() {
  return (
    <Routes>
      {/* Login/Auth Routes */}
      <Route path="/" element={<LoginWrapper />} />
      <Route path="/signup" element={<LoginWrapper />} />
      <Route path="/forgot" element={<LoginWrapper />} />
      <Route path="/loading" element={<LoginWrapper />} />
      
      {/* Community Ticket Log Routes */}
      <Route path="/community/*" element={<CommunityWrapper />} />
      <Route path="/ticket-log/*" element={<CommunityWrapper />} />
      
      {/* Employee Dashboard Routes */}
      <Route path="/dashboard/*" element={<DashboardWrapper />} />
      
      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
