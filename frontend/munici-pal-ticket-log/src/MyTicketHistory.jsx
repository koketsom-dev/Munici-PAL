import React, { useState, useEffect } from 'react';
import { ticketAPI, userAPI } from '../../src/services/api';

function MyTicketHistoryPage({ goBack }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const user = userAPI.getCurrentUser();
      if (!user) {
        throw new Error('You must be logged in to view tickets');
      }

      // Only fetch tickets if user is authenticated
      if (!authAPI.isLoggedIn()) {
        throw new Error('User not authenticated');
      }

      const response = await ticketAPI.list({});

      if (response.success && response.data) {
        const formattedTickets = response.data.map(ticket => {
          const ticketId = ticket.id || ticket.ticket_id;
          const location = ticket.location || '';
          const locationStr = typeof location === 'string' 
            ? location 
            : `${location.suburb || ''} ${location.street_name || ''}`.trim() || 'N/A';
          
          return {
            id: `TKT-${String(ticketId).padStart(3, '0')}`,
            ticket_id: ticketId,
            title: ticket.title || ticket.subject || 'Untitled Ticket',
            status: ticket.status || 'Open',
            date: ticket.createdAt || ticket.date_created || ticket.created_at 
              ? new Date(ticket.createdAt || ticket.date_created || ticket.created_at).toISOString().split('T')[0] 
              : new Date().toISOString().split('T')[0],
            category: ticket.issue_type || 'Other',
            description: ticket.description,
            location: locationStr
          };
        });
        setTickets(formattedTickets);
      } else {
        setTickets([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (ticketId) => {
    try {
      setDetailsLoading(true);
      const response = await ticketAPI.getById(ticketId);
      if (response.success && response.data) {
        setSelectedTicket(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch ticket details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedTicket(null);
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Roads': return '#E50914';
      case 'Electricity': return '#FFFF00';
      case 'Water': return '#2BA1C5';
      case 'Refuse': return '#9C5708';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return '#28a745';
      case 'In Progress': return '#ffc107';
      case 'Open': return '#dc3545';
      case 'Pending': return '#6c757d';
      default: return '#6c757d';
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
        <h1>My Ticket History</h1>
        <p>View and track all your submitted tickets</p>
      </div>

      {selectedTicket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            {detailsLoading ? (
              <div style={{textAlign: 'center', padding: '20px'}}>Loading ticket details...</div>
            ) : (
              <>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px'}}>
                  <h2 style={{margin: 0}}>{selectedTicket.title}</h2>
                  <button 
                    onClick={closeDetails}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: '#999'
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={{marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee'}}>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', borderLeft: `4px solid ${getCategoryColor(selectedTicket.issue_type)}`, paddingLeft: '15px'}}>
                    <div>
                      <p style={{margin: '0 0 5px 0', color: '#666', fontSize: '0.9rem'}}>Ticket ID</p>
                      <p style={{margin: '0', fontWeight: 'bold', fontSize: '1.1rem'}}>TKT-{String(selectedTicket.id).padStart(3, '0')}</p>
                    </div>
                    <div>
                      <p style={{margin: '0 0 5px 0', color: '#666', fontSize: '0.9rem'}}>Status</p>
                      <p style={{margin: '0', fontWeight: 'bold', fontSize: '1.1rem', color: getStatusColor(selectedTicket.status)}}>
                        {selectedTicket.status}
                      </p>
                    </div>
                    <div>
                      <p style={{margin: '0 0 5px 0', color: '#666', fontSize: '0.9rem'}}>Category</p>
                      <p style={{margin: '0', fontWeight: 'bold', color: getCategoryColor(selectedTicket.issue_type)}}>{selectedTicket.issue_type}</p>
                    </div>
                    <div>
                      <p style={{margin: '0 0 5px 0', color: '#666', fontSize: '0.9rem'}}>Created Date</p>
                      <p style={{margin: '0', fontWeight: 'bold'}}>
                        {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee'}}>
                  <h4 style={{margin: '0 0 10px 0', color: '#333'}}>Description</h4>
                  <p style={{margin: '0', lineHeight: '1.6', color: '#555'}}>
                    {selectedTicket.description || 'No description provided'}
                  </p>
                </div>

                {selectedTicket.location && (
                  <div style={{marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee'}}>
                    <h4 style={{margin: '0 0 10px 0', color: '#333'}}>Location</h4>
                    <div style={{color: '#555', lineHeight: '1.6'}}>
                      {selectedTicket.location.street_name && (
                        <p style={{margin: '5px 0'}}><strong>Street:</strong> {selectedTicket.location.street_name}</p>
                      )}
                      {selectedTicket.location.suburb && (
                        <p style={{margin: '5px 0'}}><strong>Suburb:</strong> {selectedTicket.location.suburb}</p>
                      )}
                      {selectedTicket.location.city_town && (
                        <p style={{margin: '5px 0'}}><strong>City/Town:</strong> {selectedTicket.location.city_town}</p>
                      )}
                      {selectedTicket.location.province && (
                        <p style={{margin: '5px 0'}}><strong>Province:</strong> {selectedTicket.location.province}</p>
                      )}
                      {selectedTicket.location.postal_code && (
                        <p style={{margin: '5px 0'}}><strong>Postal Code:</strong> {selectedTicket.location.postal_code}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedTicket.assignedTo && (
                  <div style={{marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee'}}>
                    <h4 style={{margin: '0 0 10px 0', color: '#333'}}>Assigned To</h4>
                    <p style={{margin: '0', color: '#555'}}>{selectedTicket.assignedTo}</p>
                  </div>
                )}

                {selectedTicket.completedAt && (
                  <div style={{marginBottom: '20px'}}>
                    <h4 style={{margin: '0 0 10px 0', color: '#333'}}>Completed Date</h4>
                    <p style={{margin: '0', color: '#555'}}>
                      {new Date(selectedTicket.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                  <button 
                    className="cancel-btn"
                    onClick={closeDetails}
                    style={{padding: '10px 20px'}}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="ticket-form-container">
        <div className="form-section">
          <h3>Recent Tickets</h3>
          {loading && <p style={{textAlign: 'center', padding: '20px'}}>Loading tickets...</p>}
          {error && <p style={{color: '#ff8a8a', textAlign: 'center', padding: '20px'}}>{error}</p>}
          {!loading && !error && tickets.length === 0 && (
            <p style={{textAlign: 'center', padding: '20px'}}>No tickets found. Create your first ticket!</p>
          )}
          <div className="ticket-list">
            {tickets.map(ticket => (
              <div key={ticket.id} className="ticket-item" style={{borderLeft: `4px solid ${getCategoryColor(ticket.category)}`}}>
                <div className="ticket-header">
                  <h4>{ticket.title}</h4>
                  <span className="ticket-status" style={{color: getStatusColor(ticket.status)}}>
                    {ticket.status}
                  </span>
                </div>
                <div className="ticket-details">
                  <p><strong>ID:</strong> {ticket.id}</p>
                  <p><strong>Category:</strong> <span style={{color: getCategoryColor(ticket.category), fontWeight: 'bold'}}>{ticket.category}</span></p>
                  <p><strong>Date:</strong> {ticket.date}</p>
                </div>
                <button 
                  className="primary-btn" 
                  style={{padding: '8px 16px', fontSize: '0.9rem'}}
                  onClick={() => handleViewDetails(ticket.ticket_id)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTicketHistoryPage;
