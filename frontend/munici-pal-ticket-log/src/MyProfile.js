import React, { useState } from 'react';
import { ArrowLeft } from "lucide-react";

function MyProfilePage({ goBack }) {
  const [formData, setFormData] = useState({
    fullName: 'Thomas Frank',
    dateOfBirth: '16 April 1990',
    homeLanguage: 'English',
    email: '',
    password: '',
    confirmPassword: '',
    ward: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [id]: true
    }));
    
    validateField(id, value);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'email':
        if (value && !value.includes('@')) {
          error = 'Email must contain @ symbol';
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      case 'password':
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: 'Passwords do not match'
          }));
        }
        break;
      default:
        break;
    }
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Email must contain @ symbol';
    }
    
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Form is valid, proceed with saving changes
      console.log('Form data:', formData);
      alert('Profile updated successfully!');
      goBack();
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] : '';
  };

  return (
    <div className="create-ticket-page">
      <div className="page-header">
        <div className="flex items-center space-x-2"></div>
                <button onClick={goBack} className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span>Back</span>
                </button>
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>
      
      <div className="ticket-form-container">
        <form className="ticket-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input 
                type="text" 
                id="dateOfBirth" 
                value={formData.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="form-group">
              <label htmlFor="homeLanguage">Home Language</label>
              <input 
                type="text" 
                id="homeLanguage" 
                value={formData.homeLanguage}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email address"
              />
              {getFieldError('email') && (
                <div style={{ color: 'var(--danger-color)', fontSize: '0.85rem', marginTop: '5px' }}>
                  {getFieldError('email')}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm your new password"
              />
              {getFieldError('confirmPassword') && (
                <div style={{ color: 'var(--danger-color)', fontSize: '0.85rem', marginTop: '5px' }}>
                  {getFieldError('confirmPassword')}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Ward Information</h3>
            <div className="form-group">
              <label htmlFor="ward">Ward</label>
              <input 
                type="text" 
                id="ward" 
                value={formData.ward}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your ward number"
              />
            </div>
            <div className="form-group">
              <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                Not sure about your ward?{' '}
                <a 
                  href="https://maps.elections.org.za/vsfinder/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                >
                  Find your ward here
                </a>
              </p>
              <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '0.85rem' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#333' }}>Quick steps to find your ward:</p>
                <ol style={{ margin: '0', paddingLeft: '20px', color: '#666' }}>
                  <li>Click the "Find your ward here" link above</li>
                  <li>Enter your address in the search bar</li>
                  <li>Your ward number will be displayed on the map</li>
                  <li>Enter the ward number in the field above</li>
                  </ol>
                  </div>
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
        </form>
      </div>
    </div>
  );
}

export default MyProfilePage;
