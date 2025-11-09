import React, { useState } from 'react';
import { ticketAPI, userAPI } from '../../src/services/api';

function SuggestionPage({ goBack }) {
  const [suggestion, setSuggestion] = useState({
    category: '',
    title: '',
    description: '',
    benefits: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuggestion({
      ...suggestion,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = userAPI.getCurrentUser();
      if (!user) {
        throw new Error('You must be logged in to submit a suggestion');
      }

      const ticketPayload = {
        subject: `Suggestion: ${suggestion.title}`,
        description: `Category: ${suggestion.category}\n\n${suggestion.description}\n\nExpected Benefits:\n${suggestion.benefits || 'N/A'}`,
        issue_type: 'Other', // Suggestions are "Other" type
        location: {
          country: 'South Africa',
          suburb: 'N/A'
        }
      };

      const response = await ticketAPI.create(ticketPayload);
      
      if (response.success) {
        alert('Thank you for your suggestion! Our team will review it.');
        goBack();
      } else {
        throw new Error(response.message || 'Failed to submit suggestion');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <span className="back-icon">←</span>
          Back to Dashboard
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

          {error && (
            <div className="error-message" style={{color: '#ff8a8a', marginTop: '10px', textAlign: 'center'}}>
              {error}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={goBack} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-btn submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SuggestionPage;
