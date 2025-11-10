import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import TermsModal from '../components/TermsModal';
import { authAPI } from '../../../src/services/api';

export default function SignupPage(props) {
  const { mode, onSignupComplete } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [gender, setGender] = useState('Other');
  const [language, setLanguage] = useState('English');

  function validatePassword(pw) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pw);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions.');
      return;
    }
    if (!gender) {
      setError('Please select your gender.');
      return;
    }
    if (!language) {
      setError('Please select your preferred language.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare registration data
      const signupData = {
        full_name: username, // Using username as full_name
        email: username.includes('@') ? username : `${username}@community.com`, // Auto-create email if not provided
        password: password,
        user_type: mode, // 'employee' or 'community' from props
        municipality_id: 1, // Default municipality
        province: 'Gauteng', // Default province
        gender: gender,
        home_language: language
      };

      // Add employee-specific field if needed
      if (mode === 'employee') {
        signupData.job_title = 'Employee'; // Default job title
        signupData.access_level = 'Employee'; // Default access level
      }

      const response = await authAPI.register(signupData);

      // Registration successful
      if (onSignupComplete) {
        onSignupComplete(response.data);
      }

    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center-area">
      <div className="card-glass">
        <form className="card-form" onSubmit={handleSubmit}>
          <div className="card-header">
            <h1 className="welcome">Create account</h1>
            <p className="sub">Please choose a username and password</p>
          </div>
          <div className="fields">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUser className="icon" />
              Username / Email
            </label>

            <div className="input-row">
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username or email"
              />
            </div>
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaLock className="icon" />
              Password
            </label>
            <div className="input-row">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaLock className="icon" />
              Confirm Password
            </label>
            <div className="input-row">
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
            </div>

            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUser className="icon" />
              Gender
            </label>
            <div className="input-row">
              <select value={gender} onChange={e => setGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUser className="icon" />
              Preferred Language
            </label>
            <div className="input-row">
              <select value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="Afrikaans">Afrikaans</option>
                <option value="English">English</option>
                <option value="isiNdebele">IsiNdebele</option>
                <option value="Sepedi">Sepedi (Northern Sotho)</option>
                <option value="Sesotho">Sesotho (Southern Sotho)</option>
                <option value="siSwati">SiSwati</option>
                <option value="Xitsonga">Xitsonga</option>
                <option value="Setswana">Setswana</option>
                <option value="Tshivenda">Tshivenda</option>
                <option value="isiXhosa">IsiXhosa</option>
                <option value="isiZulu">IsiZulu</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="terms-link" onClick={() => setShowTerms(true)}>
              Read Terms & Conditions
            </div>

            <div className="row-between" style={{ flexDirection: 'row', justifyContent: 'center', gap: '18px' }}>
              <Link to="/" className="secondary linkish">Back to Login</Link>
              <button
                type="submit"
                className="primary"
                disabled={!agreedToTerms || loading}
              >
                {loading ? 'Signing Up...' : 'Signup'}
              </button>
            </div>

            <TermsModal
              isOpen={showTerms}
              onClose={() => setShowTerms(false)}
              onAgree={() => {
                setAgreedToTerms(true);
                setShowTerms(false);
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}