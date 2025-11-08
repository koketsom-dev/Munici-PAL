import React, { useState } from 'react';

function CreateTicketPage({ goBack }) {
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData({
      ...ticketData,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    if (e.target.files.length > 0) {
      alert(`${e.target.files.length} image(s) selected for upload`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Ticket submitted successfully!');
    goBack();
  };

  return (
    <div className="create-ticket-page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <span className="back-icon">←</span>
          Back to Dashboard
        </button>
        <h1>Create a New Ticket</h1>
        <p>Report Munici-PAL issues in your area</p>
      </div>
      
      <div className="ticket-form-container">
        <form onSubmit={handleSubmit} className="ticket-form">
          {/* ISSUE DETAILS */}
          <div className="form-section">
            <h3>Issue Details</h3>
            
            <div className="form-group">
              <label htmlFor="title">Issue Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={ticketData.title}
                onChange={handleInputChange}
                placeholder="Brief description of the issue"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Detailed Description</label>
              <textarea
                id="description"
                name="description"
                value={ticketData.description}
                onChange={handleInputChange}
                placeholder="Provide more details about the issue..."
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="category">Issue Category *</label>
              <select
                id="category"
                name="category"
                value={ticketData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Road Issues">Road Issues</option>
                <option value="Electrical">Electrical</option>
                <option value="Water">Water</option>
                <option value="Refuse">Refuse</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* LOCATION */}
          <div className="form-section">
            <h3>Location Details</h3>
            
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={ticketData.location}
                onChange={handleInputChange}
                placeholder="Enter address or landmark"
                required
              />
              <button type="button" className="location-btn">
                <span className="location-icon">📍</span>
                Use Current Location
              </button>
            </div>
          </div>

          {/* ADDITIONAL INFORMATION */}
          <div className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-group">
              <label htmlFor="images">Upload Images (Optional)</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="image-upload-input"
                />
                <div className="image-upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <p>Click to upload images</p>
                  <small>Maximum 5 images, 5MB each (JPG/PNG)</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={goBack}>
              Cancel
            </button>
            <button type="submit" className="primary-btn submit-btn">
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicketPage;
