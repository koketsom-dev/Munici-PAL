import React, { useState } from 'react';

function SuggestionPage({ goBack }) {
  const [suggestion, setSuggestion] = useState({
    category: '',
    title: '',
    description: '',
    benefits: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuggestion({
      ...suggestion,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your suggestion! Our team will review it.');
    goBack();
  };

  return (
    <div className="create-ticket-page">
      <div className="page-header">
        <button onClick={goBack} style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#e5e7eb',
          color: '#1f2937',
          padding: '8px 12px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'inherit'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#d1d5db';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#e5e7eb';
          e.target.style.transform = 'translateY(0)';
          }}
          >
            <svg 
            style={{ 
              width: '20px', 
              height: '20px', 
              marginRight: '8px',
              flexShrink: 0
              }} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        <h1>Submit Suggestion</h1>
        <p>Share your ideas to improve Munici-PAL services</p>
      </div>
      
      <div className="ticket-form-container">
        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-section">
            <h3>Your Suggestion</h3>
            
            <div className="form-group">
              <label htmlFor="category">Suggestion Category</label>
              <select
                id="category"
                name="category"
                value={suggestion.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
                <option value="service-improvement">Service Improvement</option>
                <option value="new-feature">New Feature</option>
                <option value="process-optimization">Process Optimization</option>
                <option value="community-engagement">Community Engagement</option>
                <option value="sustainability">Sustainability</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="title">Suggestion Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={suggestion.title}
                onChange={handleInputChange}
                placeholder="Brief title for your suggestion"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Detailed Suggestion</label>
              <textarea
                id="description"
                name="description"
                value={suggestion.description}
                onChange={handleInputChange}
                placeholder="Please describe your suggestion in detail..."
                rows="5"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="benefits">Expected Benefits (Optional)</label>
              <textarea
                id="benefits"
                name="benefits"
                value={suggestion.benefits}
                onChange={handleInputChange}
                placeholder="How will this suggestion benefit the community or improve services?"
                rows="4"
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={goBack}>
              Cancel
            </button>
            <button type="submit" className="primary-btn submit-btn">
              Submit Suggestion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SuggestionPage;
