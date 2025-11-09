import React, { useState, useEffect } from 'react';
import { userAPI, authAPI } from '../../src/services/api';

function MyProfilePage({ goBack }) {
  const [formData, setFormData] = useState({
    full_name: '',
    first_name: '',
    surname: '',
    homeLanguage: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    province: '',
    emp_job_title: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [userType, setUserType] = useState('community');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Only fetch profile if user is authenticated
      if (!authAPI.isLoggedIn()) {
        setErrors({ fetch: 'User not authenticated' });
        return;
      }

      const response = await userAPI.getProfile();
      if (response.success && response.data) {
        const user = response.data;
        const currentUser = userAPI.getCurrentUser();
        setUserType(currentUser?.user_type || 'community');

        if (currentUser?.user_type === 'employee') {
          setFormData(prev => ({
            ...prev,
            first_name: user.first_name || '',
            surname: user.surname || '',
            email: user.email || '',
            gender: user.gender || '',
            homeLanguage: user.home_language || '',
            province: user.province || '',
            emp_job_title: user.emp_job_title || ''
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            full_name: user.full_name || '',
            email: user.email || '',
            gender: user.gender || '',
            homeLanguage: user.home_language || ''
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setErrors({ fetch: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const updateData = {
          home_language: formData.homeLanguage,
          gender: formData.gender,
          password: formData.password || undefined
        };

        if (userType === 'employee') {
          updateData.first_name = formData.first_name;
          updateData.surname = formData.surname;
          updateData.email = formData.email;
          updateData.province = formData.province;
          updateData.emp_job_title = formData.emp_job_title;
        } else {
          updateData.full_name = formData.full_name;
          updateData.email = formData.email;
        }

        const response = await userAPI.updateProfile(updateData);
        if (response.success) {
          setSuccess(true);
          setTimeout(() => {
            goBack();
          }, 2000);
        }
      } catch (error) {
        console.error('Failed to update profile:', error);
        setErrors({ submit: 'Failed to update profile' });
      }
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] : '';
  };

  if (loading) {
    return (
      <div className="create-ticket-page">
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          Loading profile...
        </div>
      </div>
    );
  }

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
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      {success && (
        <div style={{ background: '#4caf50', color: 'white', padding: '15px', marginBottom: '20px', borderRadius: '5px', textAlign: 'center' }}>
          ✓ Profile updated successfully!
        </div>
      )}

      {errors.fetch && (
        <div style={{ background: '#f44336', color: 'white', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
          {errors.fetch}
        </div>
      )}

      {errors.submit && (
        <div style={{ background: '#f44336', color: 'white', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
          {errors.submit}
        </div>
      )}
      
      <div className="ticket-form-container">
        <form className="ticket-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            {userType === 'employee' ? (
              <>
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input 
                    type="text" 
                    id="first_name" 
                    value={formData.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="surname">Last Name</label>
                  <input 
                    type="text" 
                    id="surname" 
                    value={formData.surname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </>
            ) : (
              <div className="form-group">
                <label htmlFor="full_name">Full Name</label>
                <input 
                  type="text" 
                  id="full_name" 
                  value={formData.full_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select 
                id="gender" 
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="homeLanguage">Home Language</label>
              <select 
                id="homeLanguage" 
                value={formData.homeLanguage}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Afrikaans">Afrikaans</option>
                <option value="Zulu">Zulu</option>
                <option value="Xhosa">Xhosa</option>
                <option value="Sotho">Sotho</option>
                <option value="Tswana">Tswana</option>
              </select>
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
            {userType === 'employee' && (
              <>
                <div className="form-group">
                  <label htmlFor="province">Province</label>
                  <input 
                    type="text" 
                    id="province" 
                    value={formData.province}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your province"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emp_job_title">Job Title</label>
                  <input 
                    type="text" 
                    id="emp_job_title" 
                    value={formData.emp_job_title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your job title"
                  />
                </div>
              </>
            )}
          </div>

          <div className="form-section">
            <h3>Account Security</h3>
            <div className="form-group">
              <label htmlFor="password">New Password (optional)</label>
              <input 
                type="password" 
                id="password" 
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Leave blank to keep current password"
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
