import React from 'react';

function MyProfilePage({ goBack }) {
  return (
    <div className="create-ticket-page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <span className="back-icon">←</span>
          Back to Dashboard
        </button>
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>
      
      <div className="ticket-form-container">
        <div className="ticket-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" defaultValue=" " />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" defaultValue=" " />
            </div>
          </div>

          <div className="form-section">
            <h3>Address Information</h3>
            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <input type="text" id="address" defaultValue=" " />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={goBack}>
              Cancel
            </button>
            <button type="submit" className="primary-btn submit-btn">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;
