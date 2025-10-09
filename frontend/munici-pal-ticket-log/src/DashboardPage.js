import React from 'react';

function DashboardPage({ setCurrentPage, bannerContent, currentBanner, commonIssues }) {
  return (
    <div className="dashboard">
      {/* Welcome banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>Welcome to Munici-PAL</h1>
          <p>Your community service delivery platform</p>
        </div>
        <div className="welcome-graphic">
          <span className="welcome-icon">🏠</span>
        </div>
      </div>

      {/* Create Ticket Section */}
      <div className="section create-ticket">
        <div className="create-ticket-content">
          <div className="create-ticket-text">
            <h2>Need Help with Munici-PAL Services?</h2>
            <p>Report issues in your area quickly and easily. Our team will address your concerns promptly.</p>
          </div>
          <div className="create-ticket-action">
            <button 
              className="primary-btn create-ticket-btn"
              onClick={() => setCurrentPage('create-ticket')}
            >
              <span className="btn-icon">➕</span>
              Create a Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Issue Categories */}
      <div className="section issue-categories">
        <h2>Common Issues</h2>
        <p className="section-subtitle">Select an issue category to learn more</p>
        <div className="category-grid">
          {commonIssues.map(issue => (
            <div 
              key={issue.id} 
              className="category-card"
              style={{borderLeft: `4px solid ${issue.color}`}}
            >
              <div className="category-header">
                <span className="category-icon">{issue.icon}</span>
                <h3 style={{color: issue.color}}>{issue.type}</h3>
              </div>
              <div className="category-body">
                <p className="category-description">{issue.description}</p>
                <div className="category-examples">
                  <strong>Examples:</strong> {issue.examples}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat/Forum Button */}
      <div className="section chat-section">
        <div className="chat-content">
          <div className="chat-text">
            <h3>Community Forum</h3>
            <p>Connect with neighbors and discuss local issues in organized threads</p>
          </div>
          <button 
            className="secondary-btn chat-btn"
            onClick={() => setCurrentPage('chat-forum')}
          >
            <span className="btn-icon">💬</span>
            Join Community Forum
          </button>
        </div>
      </div>

      {/* Rotating banner */}
      <div className="rotating-banner">
        <div className="banner-content">
          <span className="banner-icon">📢</span>
          <p>{bannerContent[currentBanner]}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;