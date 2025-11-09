import React, { useState } from 'react';
import { ticketAPI, userAPI } from '../../src/services/api';

function OperationalIssuePage({ goBack }) {
  const [issue, setIssue] = useState({
    department: '',
    description: '',
    impact: ''
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

      // Map department to issue type
      const departmentMap = {
        'road-management': 'Roads',
        'water-sewer': 'Water',
        'electrical': 'Electricity',
        'waste-management': 'Refuse',
        'other': 'Roads'
      };

      const issueType = departmentMap[issue.department] || 'Roads';

      const ticketPayload = {
        subject: `Operational Issue: ${issue.department}`,
        description: `Impact: ${issue.impact}\n\n${issue.description}`,
        issue_type: issueType,
        location: {
          country: 'South Africa',
          suburb: 'N/A'
        }
      };

      const response = await ticketAPI.create(ticketPayload);
      
      if (response.success) {
        alert('Operational issue reported successfully! The relevant department has been notified.');
        goBack();
      } else {
        throw new Error(response.message || 'Failed to report issue');
      }
    } catch (err) {
      setError(err.message || 'Failed to report operational issue. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <h1>Report Operational Issue</h1>
        <p>Report issues with Munici-PAL operations and services</p>
      </div>
      
      <div className="ticket-form-container">
        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-section">
            <h3>Operational Issue Details</h3>
            
            <div className="form-group">
              <label htmlFor="department">Affected Department</label>
              <select
                id="department"
                name="department"
                value={issue.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select department</option>
                <option value="road-management">Road Management</option>
                <option value="water-sewer">Water & Sewer</option>
                <option value="electrical">Electrical Department</option>
                <option value="waste-management">Refuse Management</option>
                <option value="other">Other Department</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="impact">Impact Level</label>
              <select
                id="impact"
                name="impact"
                value={issue.impact}
                onChange={handleInputChange}
                required
              >
                <option value="">Select impact level</option>
                <option value="individual">Individual - Affects only me</option>
                <option value="neighborhood">Neighborhood - Affects my neighborhood</option>
                <option value="community">Community - Affects the wider community</option>
                <option value="city-wide">City-wide - Affects the entire city</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Issue Description</label>
              <textarea
                id="description"
                name="description"
                value={issue.description}
                onChange={handleInputChange}
                placeholder="Describe the operational issue and how it's affecting municipal services..."
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
              {loading ? 'Submitting...' : 'Report Operational Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OperationalIssuePage;
