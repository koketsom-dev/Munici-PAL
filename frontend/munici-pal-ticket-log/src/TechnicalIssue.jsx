import React, { useState } from 'react';
import { ticketAPI, userAPI } from '../../src/services/api';

function TechnicalIssuePage({ goBack }) {
  const [issue, setIssue] = useState({
    type: '',
    description: '',
    urgency: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIssue({
      ...issue,
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
        throw new Error('You must be logged in to report an issue');
      }

      const ticketPayload = {
        subject: `Technical Issue: ${issue.type}`,
        description: `Urgency: ${issue.urgency}\n\n${issue.description}`,
        issue_type: 'Other', // Technical issues are "Other" type
        location: {
          country: 'South Africa',
          suburb: 'N/A'
        }
      };

      const response = await ticketAPI.create(ticketPayload);
      
      if (response.success) {
        alert('Technical issue reported successfully! Our team will contact you soon.');
        goBack();
      } else {
        throw new Error(response.message || 'Failed to report issue');
      }
    } catch (err) {
      setError(err.message || 'Failed to report technical issue. Please try again.');
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
        <h1>Report Technical Issue</h1>
        <p>Experiencing problems with the app? Let us know!</p>
      </div>
      
      <div className="ticket-form-container">
        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-section">
            <h3>Technical Issue Details</h3>
            
            <div className="form-group">
              <label htmlFor="type">Issue Type</label>
              <select
                id="type"
                name="type"
                value={issue.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select issue type</option>
                <option value="performance">App Performance</option>
                <option value="feature">Feature Not Working</option>
                <option value="notification">Notification Issues</option>
                <option value="other">Other Technical Issue</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="urgency">Urgency Level</label>
              <select
                id="urgency"
                name="urgency"
                value={issue.urgency}
                onChange={handleInputChange}
                required
              >
                <option value="low">Low - Minor inconvenience</option>
                <option value="medium">Medium - Affects functionality</option>
                <option value="high">High - Cannot use the app</option>
                <option value="critical">Critical - Urgent attention needed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Detailed Description</label>
              <textarea
                id="description"
                name="description"
                value={issue.description}
                onChange={handleInputChange}
                placeholder="Please describe the technical issue in detail. Include any error messages you see."
                rows="6"
                required
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
              {loading ? 'Submitting...' : 'Report Technical Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TechnicalIssuePage;
