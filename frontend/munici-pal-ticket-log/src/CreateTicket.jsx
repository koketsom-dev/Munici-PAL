import React, { useState, useRef, useEffect } from 'react';
import { ticketAPI, userAPI } from '../../src/services/api';

const SA_LOCATIONS = [
  'Johannesburg, Gauteng', 'Cape Town, Western Cape', 'Durban, KwaZulu-Natal',
  'Pretoria, Gauteng', 'Port Elizabeth, Eastern Cape', 'Bloemfontein, Free State',
  'Polokwane, Limpopo', 'Pietermaritzburg, KwaZulu-Natal', 'Nelspruit, Mpumalanga',
  'Kimberley, Northern Cape', 'Sandton, Gauteng', 'Soweto, Gauteng',
  'Centurion, Gauteng', 'Midrand, Gauteng', 'Alberton, Gauteng',
  'Roodepoort, Gauteng', 'Randburg, Gauteng', 'Sunninghill, Gauteng',
  'Fourways, Gauteng', 'Bryanston, Gauteng', 'Parktown, Gauteng',
  'Boulders, Western Cape', 'Sea Point, Western Cape', 'Camps Bay, Western Cape',
  'Constantia, Western Cape', 'Rondebosch, Western Cape', 'Claremont, Western Cape',
  'Newlands, Western Cape', 'Wynberg, Western Cape', 'Bergvlei, Western Cape',
  'Umhlanga, KwaZulu-Natal', 'Morningside, KwaZulu-Natal', 'Glenwood, KwaZulu-Natal',
  'Berea, KwaZulu-Natal', 'Westville, KwaZulu-Natal', 'Kloof, KwaZulu-Natal',
  'Hillcrest, KwaZulu-Natal', 'Pinetown, KwaZulu-Natal', 'Mvoti, Eastern Cape',
  'East London, Eastern Cape', 'Uitenhage, Eastern Cape', 'Despatch, Eastern Cape'
];

function CreateTicketPage({ goBack }) {
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationInputRef.current && !locationInputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
        goBack();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, goBack]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'location') {
      setTicketData({ ...ticketData, [name]: value });
      
      if (value.trim().length > 0) {
        const filtered = SA_LOCATIONS.filter(loc =>
          loc.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 8));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setTicketData({ ...ticketData, [name]: value });
    }
  };

  const handleSelectLocation = (location) => {
    setTicketData({ ...ticketData, location });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleImageUpload = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setTicketData({
        ...ticketData,
        images: files
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = userAPI.getCurrentUser();
      if (!user) {
        throw new Error('You must be logged in to create a ticket');
      }

      const issueType = ticketData.category || 'Roads';

      const locationParts = ticketData.location.split(',').map(s => s.trim());
      const locationData = {
        country: 'South Africa',
        suburb: locationParts[0] || ticketData.location,
        street_name: locationParts[1] || null,
        city_town: locationParts[2] || null
      };

      const ticketPayload = {
        subject: ticketData.title,
        description: ticketData.description,
        issue_type: issueType,
        location: locationData
      };

      const response = await ticketAPI.create(ticketPayload);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create ticket');
      }

      const ticketId = response.data?.ticket_id;

      if (ticketData.images.length > 0 && ticketId) {
        const uploadPromises = ticketData.images.map(imageFile =>
          ticketAPI.uploadImage(ticketId, imageFile).catch(err => {
            console.error('Image upload failed:', err);
            return null;
          })
        );
        
        await Promise.all(uploadPromises);
      }

      setSuccess('Ticket submitted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to submit ticket. Please try again.');
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
              <label htmlFor="description">Detailed Description *</label>
              <textarea
                id="description"
                name="description"
                value={ticketData.description}
                onChange={handleInputChange}
                placeholder="Provide more details about the issue..."
                rows="4"
                required
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
                <option value="">Select an issue type</option>
                <option value="Roads">Roads</option>
                <option value="Electricity">Electricity</option>
                <option value="Water">Water</option>
                <option value="Refuse">Refuse</option>
              </select>
            </div>
          </div>

          {/* LOCATION */}
          <div className="form-section">
            <h3>Location Details</h3>
            
            <div className="form-group" ref={locationInputRef} style={{ position: 'relative' }}>
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={ticketData.location}
                onChange={handleInputChange}
                onFocus={() => ticketData.location && setSuggestions(SA_LOCATIONS.filter(loc => loc.toLowerCase().includes(ticketData.location.toLowerCase())).slice(0, 8)) && setShowSuggestions(true)}
                placeholder="Enter address or landmark"
                required
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderTop: 'none',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  borderRadius: '0 0 4px 4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectLocation(suggestion)}
                      style={{
                        padding: '10px 15px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                        fontSize: '14px',
                        backgroundColor: '#fff',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                    >
                      📍 {suggestion}
                    </div>
                  ))}
                </div>
              )}
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
              {ticketData.images.length > 0 && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                  <strong>Selected images: {ticketData.images.length}</strong>
                  <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '14px' }}>
                    {Array.from(ticketData.images).map((file, idx) => (
                      <li key={idx}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {error && (
            <div className="error-message" style={{color: '#ff8a8a', marginTop: '10px', textAlign: 'center'}}>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message" style={{
              backgroundColor: '#4caf50',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: '4px',
              marginTop: '10px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              ✓ {success}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={goBack} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-btn submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicketPage;
