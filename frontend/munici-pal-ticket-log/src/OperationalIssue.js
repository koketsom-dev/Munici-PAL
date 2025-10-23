import React, { useState } from 'react';

function OperationalIssuePage({ goBack }) {
  const [issue, setIssue] = useState({
    department: '',
    description: '',
    impact: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIssue({
      ...issue,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Operational issue reported successfully! The relevant department has been notified.');
    goBack();
  };

  return (
    <div className="create-ticket-page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <span className="back-icon">←</span>
          Back to Dashboard
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

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={goBack}>
              Cancel
            </button>
            <button type="submit" className="primary-btn submit-btn">
              Report Operational Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OperationalIssuePage;
