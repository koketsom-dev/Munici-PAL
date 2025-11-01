import React, { useState } from 'react';

function HelpPage({ goBack }) {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I create a ticket?",
      answer: "Click on 'Create a Ticket' from the dashboard, fill in the required details about the issue, and submit. You'll receive a confirmation and tracking number."
    },
    {
      id: 2,
      question: "How can I track my ticket status?",
      answer: "Go to 'My Ticket History' in the menu to view all your submitted tickets and their current status."
    },
    {
      id: 3,
      question: "What types of issues can I report?",
      answer: "You can report various municipal issues including road problems, electrical issues, water concerns, waste management, and more through the app."
    },
    {
      id: 4,
      question: "Is there a community forum?",
      answer: "Yes! The Community Chat allows you to discuss local issues with neighbors and municipal workers in your ward."
    },
    {
      id: 5,
      question: "How do I update my profile information?",
      answer: "Navigate to 'My Profile' from the menu where you can update your personal information and ward information."
    }
  ];

  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
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
        <h1>Help & Support</h1>
        <p>Get assistance with using Munici-PAL</p>
      </div>
      
      <div className="ticket-form-container">
        <div className="form-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-list">
            {faqs.map(faq => (
              <div key={faq.id} className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  {faq.question}
                  <span className="faq-icon">
                    {activeFAQ === faq.id ? '−' : '+'}
                  </span>
                </button>
                {activeFAQ === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Support</h3>
          <div className="contact-info">
            <p><strong>Email:</strong> support@munici-pal.gov</p>
            <p><strong>Phone:</strong> 011 567 7980</p>
            <p><strong>Operating Hours:</strong> Monday-Friday, 8:00 AM - 6:00 PM</p>
            <p><strong>Emergency:</strong> For urgent matters/emergencies, please call 112, Police-10111, Ambulance-10177</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
