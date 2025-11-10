import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import TicketStatusPage from './TicketStatusPage';
import logo from './municiPAL.svg';
import { forumAPI, notificationAPI, authAPI, userAPI } from '../../src/services/api';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const fetchNotifications = async () => {
      // Only fetch notifications if user is authenticated
      if (!authAPI.isLoggedIn()) {
        return;
      }

      try {
        const response = await notificationAPI.list();
        if (response.success && Array.isArray(response.data) && active) {
          const formatted = response.data.map((notification) => ({
            id: notification.id,
            text: notification.message,
            ticketId: notification.ticket_id,
            subject: notification.ticket_subject,
            createdAt: notification.created_at
          }));
          setNotifications(formatted);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
        // Don't throw error, just log it to prevent app crash
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (currentPage === 'chat-forum') {
      fetchMessages();
    }
  }, [currentPage]);

  const fetchMessages = async () => {
    try {
      setChatLoading(true);
      const response = await forumAPI.getMessages(50, 0);
      if (response.success && response.data.messages) {
        const currentUser = userAPI.getCurrentUser();
        const formattedMessages = response.data.messages.map(msg => ({
          id: msg.message_id,
          user: msg.user_name || 'User',
          userId: msg.user_id,
          message: msg.message_description,
          time: new Date(msg.message_sent_timestamp).toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          isOwn: currentUser && msg.user_id === currentUser.id
        }));
        setChatMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setChatLoading(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const markNotificationAsRead = async (id) => {
    try {
      await notificationAPI.markRead([id]);
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      const response = await forumAPI.addMessage('General', messageText);
      if (response.success) {
        const msg = response.data;
        const currentUser = userAPI.getCurrentUser();
        const newChatMessage = {
          id: msg.message_id,
          user: msg.user_name || 'You',
          userId: msg.user_id,
          message: msg.message_description,
          time: new Date(msg.message_sent_timestamp).toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          isOwn: currentUser && msg.user_id === currentUser.id
        };
        setChatMessages([...chatMessages, newChatMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setNewMessage(messageText);
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
    { id: 9, name: 'Logout', icon: '🚪', isLogout: true }
  ];

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      setCurrentPage('dashboard');
      setIsMenuOpen(false);
      setChatMessages([]);
      setNotifications([]);
      setNewMessage('');
      setChatLoading(false);
      navigate('/', { replace: true });
    }
  };

  const handleMenuClick = async (itemName) => {
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
        await handleLogout();
        return;
      default:
        break;
    }
  };

  // Rotating banner content
  const bannerContent = [
    "Report issues faster with Munici-PAL",
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
        return <CreateTicketPage goBack={() => setCurrentPage('dashboard')} />;
      case 'chat-forum':
        return <ChatForumPage 
          messages={chatMessages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          goBack={() => setCurrentPage('dashboard')}
          loading={chatLoading}
        />;
        case 'my-profile':
        return <MyProfilePage goBack={() => setCurrentPage('dashboard')} />;
      case 'ticket-history':
        return <MyTicketHistoryPage goBack={() => setCurrentPage('dashboard')} />;
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
      case 'ticket-status':
        return <TicketStatusPage goBack={() => setCurrentPage('dashboard')} />;
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
              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
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
                    className="notification-item unread"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    {notification.text}
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
