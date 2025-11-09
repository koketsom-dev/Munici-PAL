import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConfigLoading() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasRedirected, setHasRedirected] = useState(false);

  const steps = [
    "Initializing system configuration...",
    "Checking user permissions...", 
    "Loading dashboard modules...",
    "Connecting to municipal services...",
    "Finalizing setup..."
  ];

  useEffect(() => {
    const totalDuration = 2500; // 2.5 seconds
    const progressInterval = 40;
    const totalUpdates = totalDuration / progressInterval;
    const progressIncrement = 100 / totalUpdates;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + progressIncrement;
      });
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, totalDuration / steps.length);

    // Set timeout for redirection - ALWAYS wait the full duration
    const redirectTimer = setTimeout(() => {
      if (!hasRedirected) {
        setHasRedirected(true);
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (user && token) {
          const userData = JSON.parse(user);
          if (userData.user_type === 'employee') {
            navigate('/dashboard');
          } else {
            navigate('/community');
          }
        }
      }
    }, totalDuration);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
      clearTimeout(redirectTimer);
    };
  }, [hasRedirected]); // Add hasRedirected to dependencies

  return (
    <div className="center-area">
      <div className="card-glass">
        <div className="card-header">
          <h1 className="welcome">System Initialization</h1>
        </div>
        
        <div className="fields">
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
            marginBottom: '30px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '3px',
              transition: 'width 0.3s ease',
              boxShadow: '0 0 10px rgba(79, 172, 254, 0.5)'
            }}></div>
          </div>

          {/* Current Step */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            minHeight: '40px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            {steps[currentStep]}
            <span style={{
              display: 'inline-block',
              marginLeft: '5px',
              animation: 'dots 1.5s infinite'
            }}>...</span>
          </div>

          {/* Progress Percentage */}
          <div style={{
            textAlign: 'center',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '10px'
          }}>
            {Math.round(progress)}% Complete
          </div>

          {/* Loading Animation */}
          <div style={{
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <div style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid #4facfe',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes dots {
            0%, 20% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}