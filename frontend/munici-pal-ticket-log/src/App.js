import React, { useState } from 'react';
import './App.css';
import DashboardPage from './DashboardPage';
import CreateTicketPage from './CreateTicket';
import ChatForumPage from './ChatForum';
import MyProfilePage from './MyProfile';
import MyTicketHistoryPage from './MyTicketHistory';
import FeedbackPage from './Feedback';
import TechnicalIssuePage from './TechnicalIssue';
import OperationalIssuePage from './OperationalIssue';
import SuggestionPage from './Suggestion';
import HelpPage from './Help';
import AboutPage from './AboutPage';
import logo from './municiPAL.svg';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notifications, setNotifications] = useState([
<<<<<<< HEAD
    { id: 1, text: 'Your ticket #TKT-001 has been resolved', read: false },
    { id: 2, text: 'New message in community chat', read: false },
    { id: 3, text: 'Water outage reported in your area', read: true }
  ]);
=======
    { id: 1, text: 'Your ticket #TKT-001 has been resolved', read: false, ticketId: 'TKT-001', type: 'update' },
    { id: 2, text: 'New message in community chat', read: false, ticketId: null },
    { id: 3, text: 'Water outage reported in your area', read: true, ticketId: null }
  ]);
  
  const [followedTickets, setFollowedTickets] = useState([]);
>>>>>>> Signup
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Sarah K', message: 'Has anyone reported the pothole on Main St?', time: '10:30 AM' },
    { id: 2, user: 'John M', message: 'Yes, I reported it yesterday. Status is "In Progress"', time: '10:45 AM' },
    { id: 3, user: 'Municipal Worker', message: 'We\'ve scheduled repairs for tomorrow morning', time: '11:00 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newChatMessage = {
        id: chatMessages.length + 1,
        user: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newChatMessage]);
      setNewMessage('');
    }
  };

  // Menu items data
  const menuItems = [
    { id: 1, name: 'My Profile', icon: '👤' },
    { id: 2, name: 'My Ticket History', icon: '📋' },
    { id: 3, name: 'Munici-PAL Feedback', icon: '💬' },
    { id: 4, name: 'Technical Issue', icon: '🔧' },
    { id: 5, name: 'Operational Issue', icon: '⚙️' },
    { id: 6, name: 'Suggestion', icon: '💡' },
    { id: 7, name: 'Help', icon: '❓' },
    { id: 8, name: 'About', icon: 'ℹ️' },
<<<<<<< HEAD
    { id: 8, name: 'Logout', icon: '🚪', isLogout: true }
  ];

=======
    { id: 9, name: 'Logout', icon: '🚪', isLogout: true }
  ];

  const handleFollowTicket = (ticketId) => {
    const isCurrentlyFollowing = followedTickets.includes(ticketId);
    
    // Remove any existing follow/unfollow notifications for this ticket
    setNotifications(prev => 
      prev.filter(n => !(
        n.ticketId === ticketId && 
        (n.type === 'follow' || n.type === 'unfollow') &&
        !n.read
      ))
    );

    // Create single new notification
    const newNotification = {
      id: Date.now(),
      text: isCurrentlyFollowing
        ? `You have unfollowed ticket #${ticketId}. You will no longer receive updates.`
        : `You are now following ticket #${ticketId}. You'll receive updates when its status changes.`,
      read: false,
      ticketId: ticketId,
      type: isCurrentlyFollowing ? 'unfollow' : 'follow',
      ts: Date.now()
    };

    // Update notifications and followedTickets
    setNotifications(prev => [newNotification, ...prev]);
    setFollowedTickets(prev => 
      isCurrentlyFollowing 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  // Create ticket and add a notification at the top
  const handleCreateTicket = (ticketData) => {
    const ticketId = `TKT-${String(Date.now()).slice(-6)}`;
    const newNotification = {
      id: Date.now(),
      text: `New ticket ${ticketId} created: ${ticketData.title || 'No title'}`,
      read: false,
      ticketId: ticketId,
      type: 'create',
      ts: Date.now()
    };
    setNotifications(prev => [newNotification, ...prev]);
    return ticketId;
  };

>>>>>>> Signup
  const handleMenuClick = (itemName) => {
    console.log(`Clicked: ${itemName}`);
    setIsMenuOpen(false);

    switch(itemName) {
      case 'My Profile':
        setCurrentPage('my-profile');
        break;
      case 'My Ticket History':
        setCurrentPage('ticket-history');
        break;
      case 'Munici-PAL Feedback':
        setCurrentPage('feedback');
        break;
      case 'Technical Issue':
        setCurrentPage('technical-issue');
        break;
      case 'Operational Issue':
        setCurrentPage('operational-issue');
        break;
      case 'Suggestion':
        setCurrentPage('suggestion');
        break;
      case 'Help':
        setCurrentPage('help');
        break;
      case 'About':
      setCurrentPage('about');
      break;
      case 'Logout':
        // This is where we would add logout logic
        console.log('Logging out');
        setCurrentPage('dashboard');
        break;
      default:
        break;
    }
  };

  // Rotating banner content
  const bannerContent = [
    "Report issues faster with Munich-PAL",
    "Track your ticket status in real-time",
    "Join your community chat forum"
  ];

  // Common issues data
  const commonIssues = [
    {
      id: 1,
      type: 'Road Issues',
      color: '#E50914',
      icon: '🛣️',
      description: 'Potholes, road damage, traffic signs',
      examples: 'Potholes, cracked pavement, missing signs'
    },
    {
      id: 2,
      type: 'Electrical',
      color: '#FFFF00',
      icon: '💡',
      description: 'Street lights, power outages, electrical hazards',
      examples: 'Street light outage, exposed wires, power failure'
    },
    {
      id: 3,
      type: 'Water',
      color: '#2BA1C5',
      icon: '💧',
      description: 'Water leaks, pipe bursts, water quality',
      examples: 'Leaking pipes, low water pressure, discolored water'
    },
    {
      id: 4,
      type: 'Refuse',
      color: '#9C5708',
      icon: '🗑️',
      description: 'Garbage collection, illegal dumping, recycling',
      examples: 'Missed collection, overflowing bins, illegal dumping'
    }
  ];

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch(currentPage) {
      case 'create-ticket':
<<<<<<< HEAD
        return <CreateTicketPage goBack={() => setCurrentPage('dashboard')} />;
=======
        return <CreateTicketPage goBack={() => setCurrentPage('dashboard')} onCreateTicket={handleCreateTicket} />;
>>>>>>> Signup
      case 'chat-forum':
        return <ChatForumPage 
          messages={chatMessages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          goBack={() => setCurrentPage('dashboard')}
        />;
        case 'my-profile':
        return <MyProfilePage goBack={() => setCurrentPage('dashboard')} />;
      case 'ticket-history':
<<<<<<< HEAD
        return <MyTicketHistoryPage goBack={() => setCurrentPage('dashboard')} />;
=======
        return <MyTicketHistoryPage 
          goBack={() => setCurrentPage('dashboard')}
          followedTickets={followedTickets}
          onFollowTicket={handleFollowTicket}
        />;
>>>>>>> Signup
      case 'feedback':
        return <FeedbackPage goBack={() => setCurrentPage('dashboard')} />;
      case 'technical-issue':
        return <TechnicalIssuePage goBack={() => setCurrentPage('dashboard')} />;
      case 'operational-issue':
        return <OperationalIssuePage goBack={() => setCurrentPage('dashboard')} />;
      case 'suggestion':
        return <SuggestionPage goBack={() => setCurrentPage('dashboard')} />;
      case 'help':
        return <HelpPage goBack={() => setCurrentPage('dashboard')} />;
      case 'about':
      return <AboutPage goBack={() => setCurrentPage('dashboard')} />;
      default:
        return <DashboardPage 
          setCurrentPage={setCurrentPage}
          bannerContent={bannerContent}
          commonIssues={commonIssues}
        />;
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          {/* Notifications */}
          <div className="notifications">
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            {/* Notification dropdown */}
            <div className="notification-dropdown">
              <h3>Notifications</h3>
              {notifications.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
<<<<<<< HEAD
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    {notification.text}
=======
                  >
                    <div onClick={() => markNotificationAsRead(notification.id)}>
                      {notification.text}
                    </div>
                    {notification.ticketId && notification.type !== 'unfollow' && (
                      <button
                        className={`notification-follow-btn ${followedTickets.includes(notification.ticketId) ? 'following' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowTicket(notification.ticketId);
                        }}
                      >
                        {followedTickets.includes(notification.ticketId) ? 'Following' : '+ Follow'}
                      </button>
                    )}
>>>>>>> Signup
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <img src={logo} alt="Munich-PAL Logo" className="logo" onClick={() => setCurrentPage('dashboard')} style={{ cursor: 'pointer' }}/>
        </div>
      </header>

      {/* Hamburger Menu */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={toggleMenu}>
          <div className="menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <h2>Menu</h2>
              <button className="close-menu" onClick={toggleMenu}>×</button>
            </div>
            <ul>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button 
                    className={item.isLogout ? 'logout-btn' : ''}
                    onClick={() => handleMenuClick(item.name)}
                  >
                    <span className="menu-item-icon">{item.icon}</span>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
