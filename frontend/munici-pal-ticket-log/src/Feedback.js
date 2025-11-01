import React, { useState } from 'react';
import { ArrowLeft } from "lucide-react";

function FeedbackPage({ goBack }) {
  const [feedback, setFeedback] = useState({
    rating: '',
    comments: '',
    category: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback({
      ...feedback,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.category && !feedback.comments.trim()) {
      alert('Please provide comments when selecting a feedback category.');
      return;
    }
    alert('Thank you for your feedback!');
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
        <h1>Munici-PAL Feedback</h1>
        <p>Help us improve our services by sharing your experience</p>
      </div>
      
      <div className="ticket-form-container">
        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-section">
            <h3>Share Your Feedback</h3>
            
            <div className="form-group">
              <label htmlFor="rating">Overall Rating</label>
              <select
                id="rating"
                name="rating"
                value={feedback.rating}
                onChange={handleInputChange}
                required
              >
                <option value="">Select rating</option>
                <option value="excellent">Excellent ⭐️⭐️⭐️⭐️⭐️</option>
                <option value="good">Good ⭐️⭐️⭐️⭐️</option>
                <option value="average">Average ⭐️⭐️⭐️</option>
                <option value="poor">Poor ⭐️⭐️</option>
                <option value="terrible">Terrible⭐️</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Feedback Category (Optional)</label>
              <select
                id="category"
                name="category"
                value={feedback.category}
                onChange={handleInputChange}
              >
                <option value="">Select category</option>
                <option value="usability">App Usability</option>
                <option value="response">Response Time</option>
                <option value="service">Service Quality</option>
                <option value="features">Features</option>
                <option value="other">Other</option>
              </select>
            </div>


            <div className="form-group">
              <label htmlFor="comments">
                Comments {feedback.category && ' *'}
              </label>
              <textarea
                id="comments"
                name="comments"
                value={feedback.comments}
                onChange={handleInputChange}
                placeholder="Please share your detailed feedback..."
                rows="6"
                required={!!feedback.category}
              ></textarea>
              {feedback.category && (
                <small style={{ color: '#666', fontStyle: 'italic' }}>
                  Comments are required when a category is selected
                </small>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={goBack}>
              Cancel
            </button>
            <button type="submit" className="primary-btn submit-btn">
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackPage;
