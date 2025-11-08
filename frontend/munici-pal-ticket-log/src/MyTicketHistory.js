import React from 'react';

<<<<<<< HEAD
function MyTicketHistoryPage({ goBack }) {
=======
function MyTicketHistoryPage({ goBack, followedTickets, onFollowTicket }) {
>>>>>>> Signup
  const tickets = [
    { id: 'TKT-001', title: 'Pothole on Main St', status: 'Resolved', date: '2024-01-15', category: 'Road Issues' },
    { id: 'TKT-002', title: 'Street Light Outage', status: 'In Progress', date: '2024-01-18', category: 'Electrical' },
    { id: 'TKT-003', title: 'Garbage Not Collected', status: 'Open', date: '2024-01-20', category: 'Refuse' },
    { id: 'TKT-004', title: 'Water Leak', status: 'Resolved', date: '2024-01-10', category: 'Water' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return '#28a745';
      case 'In Progress': return '#ffc107';
      case 'Open': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="create-ticket-page">
      <div className="page-header">
<<<<<<< HEAD
        <button className="back-btn" onClick={goBack}>
          <span className="back-icon">←</span>
          Back to Dashboard
        </button>
=======
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
>>>>>>> Signup
        <h1>My Ticket History</h1>
        <p>View and track all your submitted tickets</p>
      </div>
      
      <div className="ticket-form-container">
        <div className="form-section">
          <h3>Recent Tickets</h3>
          <div className="ticket-list">
            {tickets.map(ticket => (
              <div key={ticket.id} className="ticket-item" style={{borderLeft: `4px solid ${getStatusColor(ticket.status)}`}}>
                <div className="ticket-header">
                  <h4>{ticket.title}</h4>
                  <span className="ticket-status" style={{color: getStatusColor(ticket.status)}}>
                    {ticket.status}
                  </span>
                </div>
                <div className="ticket-details">
                  <p><strong>ID:</strong> {ticket.id}</p>
                  <p><strong>Category:</strong> {ticket.category}</p>
                  <p><strong>Date:</strong> {ticket.date}</p>
                </div>
<<<<<<< HEAD
                <button className="primary-btn" style={{padding: '8px 16px', fontSize: '0.9rem'}}>
                  View Details
                </button>
=======
                <div className="ticket-actions">
                  <button className="primary-btn" style={{padding: '8px 16px', fontSize: '0.9rem', marginRight: '8px'}}>
                    View Details
                  </button>
                  <button 
                    className={`follow-btn ${followedTickets.includes(ticket.id) ? 'following' : ''}`}
                    onClick={() => onFollowTicket(ticket.id)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.9rem',
                      backgroundColor: followedTickets.includes(ticket.id) ? '#28a745' : '#6c757d'
                    }}
                  >
                    {followedTickets.includes(ticket.id) ? '✓ Following' : 'Follow Ticket'}
                  </button>
                </div>
>>>>>>> Signup
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTicketHistoryPage;
