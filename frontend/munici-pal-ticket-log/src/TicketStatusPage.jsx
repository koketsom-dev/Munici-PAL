import React, { useState, useEffect, useCallback } from 'react';

function TicketStatusPage({ goBack }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tickets, setTickets] = useState([]);

  // Sample ticket data - this would come from an API
  const sampleTickets = useCallback(() => [
    {
      id: 1,
      title: 'Large pothole on Main Street',
      category: 'Road Issues',
      status: 'Pending',
      date: '2024-01-15',
      description: 'Large pothole causing traffic issues',
      location: 'Main St & 1st Ave'
    },
    {
      id: 2,
      title: 'Broken traffic sign',
      category: 'Road Issues',
      status: 'In Progress',
      date: '2024-01-14',
      description: 'Stop sign bent and needs replacement',
      location: 'Oak St & Pine Ave'
    },
    {
      id: 3,
      title: 'Cracked pavement',
      category: 'Road Issues',
      status: 'Resolved',
      date: '2024-01-10',
      description: 'Sidewalk pavement cracked and uneven',
      location: 'Central Park area'
    },
    {
      id: 4,
      title: 'Street light outage',
      category: 'Electrical',
      status: 'Pending',
      date: '2024-01-16',
      description: 'Multiple street lights not working',
      location: 'Maple Drive'
    },
    {
      id: 5,
      title: 'Water pipe leak',
      category: 'Water',
      status: 'In Progress',
      date: '2024-01-13',
      description: 'Water leaking from underground pipe',
      location: 'River Road'
    },
    {
      id: 6,
      title: 'Garbage collection missed',
      category: 'Refuse',
      status: 'Resolved',
      date: '2024-01-09',
      description: 'Weekly garbage collection was missed',
      location: 'Green Valley area'
    },
    {
      id: 7,
      title: 'Overflowing bins',
      category: 'Refuse',
      status: 'Pending',
      date: '2024-01-17',
      description: 'Public bins overflowing in park area',
      location: 'City Park'
    },
    {
      id: 8,
      title: 'Water quality issue',
      category: 'Water',
      status: 'Resolved',
      date: '2024-01-08',
      description: 'Discolored water reported',
      location: 'Lakeview Apartments'
    },
  ], []);

  useEffect(() => {
    // Get the selected category from sessionStorage
    const category = sessionStorage.getItem('selectedCategory') || 'Road Issues';
    setSelectedCategory(category);
    
    // Filter tickets by category and sort by date (newest first)
    const filteredTickets = sampleTickets()
      .filter(ticket => ticket.category === category)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setTickets(filteredTickets);
  }, [sampleTickets]);

  const getTicketsByStatus = (status) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#F7AA0D'; // warning color
      case 'In Progress': return '#075593'; // primary color
      case 'Resolved': return '#28a745'; // success color
      default: return '#6c757d';
    }
  };

  return (
    <div className="ticket-status-page">
      <div className="page-header">
        <button 
          className="back-btn"
          onClick={goBack}
        >
          <span className="back-icon">←</span>
          Back to Dashboard
        </button>
        <h1>{selectedCategory} - Ticket Status</h1>
        <p>View all tickets for {selectedCategory} sorted by date</p>
      </div>

      <div className="ticket-status-container">
        {/* Pending Tickets */}
        <div className="status-section">
          <h2 style={{color: getStatusColor('Pending')}}>Pending</h2>
          <div className="ticket-list">
            {getTicketsByStatus('Pending').length > 0 ? (
              getTicketsByStatus('Pending').map(ticket => (
                <div key={ticket.id} className="ticket-item">
                  <div className="ticket-header">
                    <h4>{ticket.title}</h4>
                    <span 
                      className="ticket-status"
                      style={{color: getStatusColor(ticket.status)}}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <div className="ticket-details">
                    <p><strong>Date Reported:</strong> {formatDate(ticket.date)}</p>
                    <p><strong>Location:</strong> {ticket.location}</p>
                    <p><strong>Description:</strong> {ticket.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-tickets">No pending tickets</p>
            )}
          </div>
        </div>

        {/* In Progress Tickets */}
        <div className="status-section">
          <h2 style={{color: getStatusColor('In Progress')}}>In Progress</h2>
          <div className="ticket-list">
            {getTicketsByStatus('In Progress').length > 0 ? (
              getTicketsByStatus('In Progress').map(ticket => (
                <div key={ticket.id} className="ticket-item">
                  <div className="ticket-header">
                    <h4>{ticket.title}</h4>
                    <span 
                      className="ticket-status"
                      style={{color: getStatusColor(ticket.status)}}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <div className="ticket-details">
                    <p><strong>Date Reported:</strong> {formatDate(ticket.date)}</p>
                    <p><strong>Location:</strong> {ticket.location}</p>
                    <p><strong>Description:</strong> {ticket.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-tickets">No tickets in progress</p>
            )}
          </div>
        </div>

        {/* Resolved Tickets */}
        <div className="status-section">
          <h2 style={{color: getStatusColor('Resolved')}}>Resolved</h2>
          <div className="ticket-list">
            {getTicketsByStatus('Resolved').length > 0 ? (
              getTicketsByStatus('Resolved').map(ticket => (
                <div key={ticket.id} className="ticket-item">
                  <div className="ticket-header">
                    <h4>{ticket.title}</h4>
                    <span 
                      className="ticket-status"
                      style={{color: getStatusColor(ticket.status)}}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <div className="ticket-details">
                    <p><strong>Date Reported:</strong> {formatDate(ticket.date)}</p>
                    <p><strong>Location:</strong> {ticket.location}</p>
                    <p><strong>Description:</strong> {ticket.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-tickets">No resolved tickets</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketStatusPage;
