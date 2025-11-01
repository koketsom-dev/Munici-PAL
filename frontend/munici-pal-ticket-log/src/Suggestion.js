import React, { useState } from 'react';
import { ArrowLeft } from "lucide-react";

function SuggestionPage({ goBack }) {
  const [suggestion, setSuggestion] = useState({
    category: '',
    title: '',
    description: '',
    benefits: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuggestion({
      ...suggestion,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your suggestion! Our team will review it.');
    goBack();
  };

  return (
    <div className="create-ticket-page">
      <div className="page-header">
        <div className="flex items-center space-x-2"></div>
                <button onClick={goBack} className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span>Back</span>
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

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={goBack}>
              Cancel
            </button>
            <button type="submit" className="primary-btn submit-btn">
              Submit Suggestion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SuggestionPage;
